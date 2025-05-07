import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt'

export const validateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    console.log('Token recibido:', req.headers.authorization);

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        console.log('Payload decodificado:', decoded);
        req.user = decoded
        next()
    } catch (error) {
        console.error('Error al validar token:', error)
        return res.status(401).json({ error: 'Token inválido' })
    }
} 