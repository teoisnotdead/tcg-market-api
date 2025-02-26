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
      const query = format(
        "SELECT * FROM Sales WHERE status = 'available' ORDER BY created_at DESC LIMIT %L OFFSET %L",
        limit,
        offset
      );
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener todas las ventas:", error);
      throw error;
    }
  },

  countAll: async () => {
    try {
      const query = "SELECT COUNT(*) FROM Sales WHERE status = 'available'";
      const { rows } = await DB.query(query);
      return parseInt(rows[0].count, 10);
    } catch (error) {
      console.error("Error al obtener el total de ventas:", error);
      throw error;
    }
  },

  findById: async (sale_id) => {
    try {
      const query = format(
        `SELECT 
          s.*, 
          u.name AS seller_name 
         FROM Sales s
         JOIN Users u ON s.seller_id = u.id
         WHERE s.id = %L`,
        sale_id
      );

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

  findAllSalesBySeller: async (seller_id) => {
    try {
      const query = format(`
        SELECT s.*, p.sale_id 
        FROM Sales s
        LEFT JOIN Purchases p ON s.id = p.sale_id AND p.seller_id = %L
        WHERE s.seller_id = %L 
        ORDER BY s.created_at DESC
      `, seller_id, seller_id);

      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener ventas del usuario:", error);
      throw error;
    }
  },


  findActiveSalesByUser: async (seller_id, limit = 10, offset = 0) => {
    try {
      const query = format(
        `SELECT * FROM Sales 
        WHERE seller_id = %L AND status = 'available' 
        ORDER BY created_at DESC
        LIMIT %L OFFSET %L`,
        seller_id,
        limit,
        offset
      );

      const { rows } = await DB.query(query);

      const countQuery = format(
        `SELECT COUNT(*) FROM Sales WHERE seller_id = %L AND status = 'available'`,
        seller_id
      );

      const countResult = await DB.query(countQuery);
      const totalSales = parseInt(countResult.rows[0].count, 10); // Total de ventas activas

      return { sales: rows, totalSales }; // Retorna ventas y total de ventas
    } catch (error) {
      console.error("Error al obtener ventas activas del usuario:", error);
      throw error;
    }
  },

  getActiveSalesCountByUser: async (seller_id) => {
    try {
      const query = format(
        `SELECT COUNT(*) AS active_sales
         FROM Sales
         WHERE seller_id = %L AND status = 'available' AND quantity > 0`,
        seller_id
      );

      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al obtener ventas activas:", error);
      throw error;
    }
  },


  update: async (sale_id, seller_id, { name, description, price, image_url, quantity }) => {
    try {
      // Verificamos si la venta existe y si el vendedor es el propietario
      const query = format(
        "UPDATE Sales SET name = %L, description = %L, price = %L, image_url = %L, quantity = %L WHERE id = %L AND seller_id = %L RETURNING *",
        name,
        description,
        price,
        image_url,
        quantity,
        sale_id,
        seller_id
      );
      const { rows } = await DB.query(query);

      // Si no se encontró una venta que coincida con el seller_id, retornamos null
      return rows[0] || null;
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
      throw error;
    }
  },

};
