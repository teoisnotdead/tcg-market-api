import { DB } from "../config/db.js";
import format from "pg-format";

export const salesModel = {
  create: async ({ seller_id, name, description, price, image_url, quantity }) => {
    try {
      const query = format(
        "INSERT INTO Sales (seller_id, name, description, price, image_url, quantity) VALUES (%L, %L, %L, %L, %L, %L) RETURNING *",
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
      console.error("Error al registrar la venta:", error);
      throw error;
    }
  },

  findAll: async (limit = 10, offset = 0) => {
    try {
      const query = format("SELECT * FROM Sales ORDER BY created_at DESC LIMIT %L OFFSET %L", limit, offset);
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener todas las ventas:", error);
      throw error;
    }
  },

  findById: async (sale_id) => {
    try {
      const query = format("SELECT * FROM Sales WHERE id = %L", sale_id);
      const { rows } = await DB.query(query);
      return rows[0] || null;
    } catch (error) {
      console.error("Error al obtener la venta por ID:", error);
      throw error;
    }
  },

  delete: async (sale_id, seller_id) => {
    try {
      const query = format("DELETE FROM Sales WHERE id = %L AND seller_id = %L RETURNING *", sale_id, seller_id);
      const { rows } = await DB.query(query);
      return rows[0] || null;
    } catch (error) {
      console.error("Error al eliminar la venta:", error);
      throw error;
    }
  },

  updateQuantity: async (sale_id, quantity, client = DB) => {
    try {
      const query = format(
        "UPDATE Sales SET quantity = %L WHERE id = %L RETURNING *",
        quantity,
        sale_id
      );
      const { rows } = await client.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al actualizar la cantidad de la venta:", error);
      throw error;
    }
  },

  updateStatus: async (sale_id, status, client = DB) => {
    try {
      const query = format(
        "UPDATE Sales SET status = %L WHERE id = %L RETURNING *",
        status,
        sale_id
      );
      const { rows } = await client.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al actualizar el estado de la venta:", error);
      throw error;
    }
  },

  getStatsByUser: async (user_id) => {
    try {
      const query = format(
        `SELECT 
            COUNT(*) FILTER (WHERE status = 'available') AS active_sales,
            COUNT(*) FILTER (WHERE status = 'sold') AS sold_sales,
            COALESCE(SUM(price * quantity) FILTER (WHERE status = 'sold'), 0) AS total_earned
        FROM Sales
        WHERE seller_id = %L`,
        user_id
      );

      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al obtener estadísticas de ventas:", error);
      throw error;
    }
  },


  findAllSalesBySeller: async (seller_id) => {
    try {
      const query = format("SELECT * FROM Sales WHERE seller_id = %L ORDER BY created_at DESC", seller_id);
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener ventas del usuario:", error);
      throw error;
    }
  },

  findActiveSalesByUser: async (seller_id) => {
    try {
      const query = format(
        "SELECT * FROM Sales WHERE seller_id = %L AND status = 'available' ORDER BY created_at DESC",
        seller_id
      );
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener ventas activas del usuario:", error);
      throw error;
    }
  },

};
