import { DB } from "../config/db.js";
import format from "pg-format";

export const purchasesModel = {
  create: async ({ user_id, sale_id, seller_id, name, description, price, image_url, quantity, language_id, category_id }) => {
    try {
      const query = format(
        "INSERT INTO Purchases (id, user_id, sale_id, seller_id, name, description, price, image_url, quantity, language_id, category_id) VALUES (gen_random_uuid(), %L, %L, %L, %L, %L, %L, %L, %L, %L, %L) RETURNING *",
        user_id,
        sale_id,
        seller_id,
        name,
        description,
        price,
        image_url,
        quantity,
        language_id,
        category_id
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
      const query = format(`
        SELECT p.*, 
               l.name as language_name,
               c.name as category_name
        FROM Purchases p
        LEFT JOIN Languages l ON p.language_id = l.id
        LEFT JOIN Categories c ON p.category_id = c.id
        WHERE p.user_id = %L 
        ORDER BY p.created_at DESC
      `, user_id);
      
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener compras del usuario:", error);
      throw error;
    }
  },

  getSalesStatsByUser: async (user_id) => {
    try {
      const query = format(
        `SELECT 
            COUNT(*) AS total_sales,
            COALESCE(SUM(price * quantity), 0) AS total_earned
         FROM Purchases
         WHERE seller_id = %L`,
        user_id
      );

      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al obtener estadísticas de ventas realizadas:", error);
      throw error;
    }
  },

  getPurchasesStatsByUser: async (user_id) => {
    try {
      const query = format(
        `SELECT 
            COUNT(*) AS total_purchases,
            COALESCE(SUM(price * quantity), 0) AS total_spent
         FROM Purchases
         WHERE user_id = %L`,
        user_id
      );

      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al obtener estadísticas de compras realizadas:", error);
      throw error;
    }
  },

};


