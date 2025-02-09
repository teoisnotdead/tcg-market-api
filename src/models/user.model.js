import { DB } from "../config/db.js"
import format from "pg-format"

export const userModel = {
    create: async ({ name, email, password }) => {
        try {
            const query = format(
                "INSERT INTO Users (name, email, password) VALUES (%L, %L, %L) RETURNING *",
                name,
                email,
                password
            )

            const { rows } = await DB.query(query)
            return rows[0]
        } catch (error) {
            console.error("Error al crear usuario:", error)
            throw error
        }
    },

    findByEmail: async (email) => {
        try {
            const query = format("SELECT * FROM Users WHERE email = %L", email)
            const { rows } = await DB.query(query)
            return rows[0]
        } catch (error) {
            console.error("Error al buscar usuario por email:", error)
            throw error
        }
    },

    findById: async (id) => {
        try {
            const query = format("SELECT * FROM Users WHERE id = %L", id)
            const { rows } = await DB.query(query)
            return rows[0]
        } catch (error) {
            console.error("Error al buscar usuario por ID:", error)
            throw error
        }
    }
}
