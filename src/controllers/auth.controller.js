import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { userModel } from '../models/user.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'tu_secreto_refresh_jwt'
const JWT_EXPIRY = '1h'
const REFRESH_TOKEN_EXPIRY = '7d'

export const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await userModel.findByEmail(email)
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' })
            }

            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas' })
            }

            const accessToken = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            )

            const refreshToken = jwt.sign(
                { userId: user.id },
                JWT_REFRESH_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            )

            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
            await userModel.updateRefreshToken(user.id, refreshToken, refreshTokenExpiresAt)

            res.json({
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
        } catch (error) {
            console.error('Error en login:', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    },

    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token no proporcionado' })
            }

            const user = await userModel.findByRefreshToken(refreshToken)
            if (!user) {
                return res.status(401).json({ error: 'Refresh token inválido o expirado' })
            }

            try {
                jwt.verify(refreshToken, JWT_REFRESH_SECRET)
            } catch (error) {
                await userModel.removeRefreshToken(user.id)
                return res.status(401).json({ error: 'Refresh token inválido' })
            }

            const newAccessToken = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            )

            const newRefreshToken = jwt.sign(
                { userId: user.id },
                JWT_REFRESH_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            )

            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            await userModel.updateRefreshToken(user.id, newRefreshToken, refreshTokenExpiresAt)

            res.json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            })
        } catch (error) {
            console.error('Error en refresh token:', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    },

    logout: async (req, res) => {
        try {
            const { userId } = req.user
            await userModel.removeRefreshToken(userId)
            res.json({ message: 'Logout exitoso' })
        } catch (error) {
            console.error('Error en logout:', error)
            res.status(500).json({ error: 'Error en el servidor' })
        }
    }
} 