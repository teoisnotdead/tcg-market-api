import format from "pg-format";
import { DB } from "../config/db.js"

export const orderItemModel = {
  create: async ({ order_id, card_id, quantity, price }) => {
    try {
      const query = format(
        `INSERT INTO Order_Items (order_id, card_id, quantity, price) 
         VALUES (%L, %L, %L, %L) RETURNING *`,
        order_id,
        card_id,
        quantity,
        price
      )
      const { rows } = await DB.query(query)
      return rows[0]
    } catch (error) {
      console.error("Error al agregar ítem a la orden:", error)
      throw error
    }
  }
}
