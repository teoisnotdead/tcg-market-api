import { userModel } from "../models/user.model.js"
import { salesModel } from "../models/sales.model.js"
import { purchasesModel } from "../models/purchases.model.js"
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

export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        res.json({
            name: user.name,
            email: user.email,
            id: user.id,
        })
    } catch (error) {
        console.error("Error en el endpoint GET /me:", error)
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id
        const updatedUser = await userModel.update(userId, req.body)

        res.json(updatedUser)
    } catch (error) {
        console.error("Error en el endpoint PUT /me:", error)
        next(error)
    }
}

export const getProfileStats = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        // Obtener estadísticas de ventas y compras
        const salesStats = await salesModel.getStatsByUser(user_id);
        const purchasesStats = await purchasesModel.getStatsByUser(user_id);

        // Construimos la respuesta final
        res.json({
            sales: {
                active: parseInt(salesStats.active_sales) || 0,
                sold: parseInt(salesStats.sold_sales) || 0,
                total_earned: parseFloat(salesStats.total_earned) || 0
            },
            purchases: {
                total_purchases: parseInt(purchasesStats.total_purchases) || 0,
                total_spent: parseFloat(purchasesStats.total_spent) || 0
            }
        });
    } catch (error) {
        next(error);
    }
};
