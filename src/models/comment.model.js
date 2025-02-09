import { DB } from "../config/db.js"
import format from "pg-format"

export const commentModel = {
  create: async ({ card_id, user_id, content }) => {
    try {
      const query = format(
        `INSERT INTO Comments (card_id, user_id, content) 
         VALUES (%L, %L, %L) RETURNING *`,
        card_id,
        user_id,
        content
      )
      const { rows } = await DB.query(query)
      return rows[0]
    } catch (error) {
      console.error("Error al crear el comentario:", error)
      throw error
    }
  },

  findByCardId: async (card_id) => {
    try {
      const query = format(
        `SELECT c.id, c.content, c.created_at, u.id as user_id, u.name as user_name
         FROM Comments c
         JOIN Users u ON c.user_id = u.id
         WHERE c.card_id = %L
         ORDER BY c.created_at DESC`,
        card_id
      )
      const { rows } = await DB.query(query)
      return rows
    } catch (error) {
      console.error("Error al obtener comentarios de la carta:", error)
      throw error
    }
  }
}
