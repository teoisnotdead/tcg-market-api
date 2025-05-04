import { DB } from "../config/db.js";
import format from "pg-format";

export const favoritesModel = {
  addFavorite: async (user_id, sale_id) => {
    try {
      const query = format(
        "INSERT INTO Favorites (user_id, sale_id) VALUES (%L, %L) RETURNING *",
        user_id,
        sale_id
      );
      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      throw error;
    }
  },

  removeFavorite: async (user_id, sale_id) => {
    try {
      const query = format(
        "DELETE FROM Favorites WHERE user_id = %L AND sale_id = %L RETURNING *",
        user_id,
        sale_id
      );
      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      throw error;
    }
  },

  getUserFavorites: async (user_id) => {
    try {
      const query = format(
        `SELECT s.*, u.name AS seller_name 
         FROM Favorites f
         JOIN Sales s ON f.sale_id = s.id
         JOIN Users u ON s.seller_id = u.id
         WHERE f.user_id = %L
         ORDER BY f.created_at DESC`,
        user_id
      );
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      throw error;
    }
  },

  isFavorite: async (user_id, sale_id) => {
    try {
      const query = format(
        "SELECT * FROM Favorites WHERE user_id = %L AND sale_id = %L",
        user_id,
        sale_id
      );
      const { rows } = await DB.query(query);
      return rows.length > 0;
    } catch (error) {
      console.error("Error al verificar favorito:", error);
      throw error;
    }
  }
}; 