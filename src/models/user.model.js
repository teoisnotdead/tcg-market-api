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
    },

    update: async (id, data) => {
        try {
            let updates = []
            if (data.name) updates.push(format("name = %L", data.name))
            if (data.email) updates.push(format("email = %L", data.email))
            if (data.password) updates.push(format("password = %L", data.password))

            if (updates.length === 0) {
                throw new Error("No se proporcionaron datos para actualizar")
            }

            const query = format(
                `UPDATE Users SET %s WHERE id = %L RETURNING id, name, email`,
                updates.join(", "),
                id
            )

            const { rows } = await DB.query(query)
            return rows[0]
        } catch (error) {
            console.error("Error al actualizar usuario:", error)
            throw error
        }
    },

    updateRefreshToken: async (userId, refreshToken, expiresAt) => {
        try {
            const query = format(
                `UPDATE Users SET refresh_token = %L, refresh_token_expires_at = %L WHERE id = %L RETURNING id`,
                refreshToken,
                expiresAt,
                userId
            )
            const { rows } = await DB.query(query)
            return rows[0]
        } catch (error) {
            console.error("Error al actualizar refresh token:", error)
            throw error
        }
    },

    findByRefreshToken: async (refreshToken) => {
        try {
            const query = format(
                `SELECT * FROM Users WHERE refresh_token = %L AND refresh_token_expires_at > NOW()`,
                refreshToken
            )
            const { rows } = await DB.query(query)
            return rows[0]
        } catch (error) {
            console.error("Error al buscar usuario por refresh token:", error)
            throw error
        }
    },

    removeRefreshToken: async (userId) => {
        try {
            const query = format(
                `UPDATE Users SET refresh_token = NULL, refresh_token_expires_at = NULL WHERE id = %L RETURNING id`,
                userId
            )
            const { rows } = await DB.query(query)
            return rows[0]
        } catch (error) {
            console.error("Error al remover refresh token:", error)
            throw error
        }
    }
}
