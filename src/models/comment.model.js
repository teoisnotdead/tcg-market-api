import { DB } from "../config/db.js";
import format from "pg-format";

export const commentsModel = {
  findBySaleId: async (sale_id) => {
    try {
      const query = format(
        `SELECT c.id, c.user_id, u.name AS user_name, c.content, c.created_at 
         FROM Comments c
         JOIN Users u ON c.user_id = u.id
         WHERE c.sale_id = %L
         ORDER BY c.created_at DESC`,
        sale_id
      );

      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      throw error;
    }
  },

  create: async ({ user_id, sale_id, content }) => {
    try {
      const query = format(
        "INSERT INTO Comments (user_id, sale_id, content) VALUES (%L, %L, %L) RETURNING *",
        user_id,
        sale_id,
        content
      );

      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      throw error;
    }
  },
};
