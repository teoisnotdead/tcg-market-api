import { DB } from "../config/db.js"
import format from "pg-format"

export const cardModel = {
  findAll: async () => {
    try {
      const query = `
        SELECT c.*, u.id as owner_id, u.name as owner_name
        FROM Cards c
        JOIN Users u ON c.owner_id = u.id
      `
      const { rows } = await DB.query(query)
      return rows
    } catch (error) {
      console.error("Error al obtener las cartas:", error)
      throw error
    }
  },

  findById: async (id) => {
    try {
      const query = format(
        `SELECT c.*, u.id as owner_id, u.name as owner_name
         FROM Cards c 
         JOIN Users u ON c.owner_id = u.id
         WHERE c.id = %L`,
        id
      )
      const { rows } = await DB.query(query)
      return rows[0]
    } catch (error) {
      console.error("Error al obtener la carta:", error)
      throw error
    }
  },

  create: async ({ name, description, price, image_url, owner_id }) => {
    try {
      const query = format(
        `INSERT INTO Cards (name, description, price, image_url, owner_id)
         VALUES (%L, %L, %L, %L, %L) RETURNING *`,
        name,
        description,
        price,
        image_url,
        owner_id
      )
      const { rows } = await DB.query(query)
      return rows[0]
    } catch (error) {
      console.error("Error al crear la carta:", error)
      throw error
    }
  },

  delete: async (id, owner_id) => {
    try {
      const query = format(
        `DELETE FROM Cards WHERE id = %L AND owner_id = %L RETURNING *`,
        id,
        owner_id
      )
      const { rows } = await DB.query(query)
      return rows[0]
    } catch (error) {
      console.error("Error al eliminar la carta:", error)
      throw error
    }
  },
}
