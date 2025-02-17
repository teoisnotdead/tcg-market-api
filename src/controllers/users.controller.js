import { userModel } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const hashedPassword = bcrypt.hashSync(password, 10)
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        })

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

        res.status(201).json({ message: "Usuario registrado exitosamente", user, token })
    } catch (error) {
        console.error("Error en el registro del usuario:", error)
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findByEmail(email)

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales inválidas" })
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        console.error("Error en el inicio de sesión:", error)
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await userModel.findByEmail(req.user.email)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        console.error("Error en el endpoint GET /auth/user:", error)
        next(error)
    }
}
