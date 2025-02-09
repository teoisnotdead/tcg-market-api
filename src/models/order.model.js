import { DB } from "../config/db.js"
import format from "pg-format"

export const orderModel = {
  create: async ({ user_id, total_price }) => {
    try {
      const query = format(
        `INSERT INTO Orders (user_id, total_price) 
         VALUES (%L, %L) RETURNING *`,
        user_id,
        total_price
      )
      const { rows } = await DB.query(query)
      return rows[0]
    } catch (error) {
      console.error("Error al crear la orden:", error)
      throw error
    }
  },

  findByUser: async (user_id) => {
    try {
      const query = format(
        `SELECT o.*, 
          json_agg(
            json_build_object(
              'card', json_build_object(
                'id', c.id, 
                'name', c.name, 
                'price', oi.price
              ),
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) AS items
        FROM Orders o
        JOIN Order_Items oi ON o.id = oi.order_id
        JOIN Cards c ON oi.card_id = c.id
        WHERE o.user_id = %L
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        user_id
      )

      const { rows } = await DB.query(query)
      return rows
    } catch (error) {
      console.error("Error al obtener órdenes del usuario:", error)
      throw error
    }
  }
}
