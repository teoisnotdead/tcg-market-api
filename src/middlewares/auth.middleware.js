import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó un token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error("Error en el middleware de autenticación:", error)
        res.status(401).json({ message: "Token inválido o expirado" })
    }
}
