import { DB } from "../config/db.js";
import format from "pg-format";

export const purchasesModel = {
  create: async ({ userId, sale_id, quantity }, client = DB) => {
    try {
      const query = format(
        "INSERT INTO Purchases (user_id, sale_id, quantity) VALUES (%L, %L, %L) RETURNING *",
        userId,
        sale_id,
        quantity
      );

      const { rows } = await client.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      throw error;
    }
  },

  findByUserId: async (userId) => {
    try {
      const query = format(
        `SELECT p.*, 
                s.name AS product_name, 
                s.price, 
                s.image_url,
                p.quantity,
                p.created_at
         FROM Purchases p
         JOIN Sales s ON p.sale_id = s.id
         WHERE p.user_id = %L`,
        userId
      );

      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener las compras del usuario:", error);
      throw error;
    }
  },

  findHistoryByUserId: async (userId) => {
    try {
      const query = format(
        `SELECT p.*, 
                s.name AS product_name, 
                s.price, 
                s.image_url, 
                p.quantity,
                p.created_at 
         FROM Purchases p
         JOIN Sales s ON p.sale_id = s.id
         WHERE p.user_id = %L
         ORDER BY p.created_at DESC`,
        userId
      );

      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener el historial de compras:", error);
      throw error;
    }
  },

  getStatsByUser: async (userId) => {
    try {
      const query = format(
        `SELECT 
            COUNT(p.id) AS total_purchases, 
            COALESCE(SUM(s.price), 0) AS total_spent
         FROM Purchases p
         JOIN Sales s ON p.sale_id = s.id
         WHERE p.user_id = %L`,
        userId
      );

      const { rows } = await DB.query(query);
      return rows[0] || { total_purchases: 0, total_spent: 0 };
    } catch (error) {
      console.error("Error al obtener estadísticas de compras:", error);
      throw error;
    }
  }
};
