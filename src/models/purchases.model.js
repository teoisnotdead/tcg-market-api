import { DB } from "../config/db.js";
import format from "pg-format";

export const purchasesModel = {
  create: async ({ user_id, sale_id, seller_id, name, description, price, image_url, quantity }) => {
    try {
      const query = format(
        "INSERT INTO Purchases (id, user_id, sale_id, seller_id, name, description, price, image_url, quantity) VALUES (gen_random_uuid(), %L, %L, %L, %L, %L, %L, %L, %L) RETURNING *",
        user_id,
        sale_id,
        seller_id,
        name,
        description,
        price,
        image_url,
        quantity
      );

      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      throw error;
    }
  },

  findAllByUser: async (user_id) => {
    try {
      const query = format("SELECT * FROM Purchases WHERE user_id = %L ORDER BY created_at DESC", user_id);
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener compras del usuario:", error);
      throw error;
    }
  },

  getStatsByUser: async (userId) => {
    try {
      const query = format(
        `SELECT 
              COUNT(p.id) AS total_purchases, 
              COALESCE(SUM(p.price * p.quantity), 0) AS total_spent
           FROM Purchases p
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


