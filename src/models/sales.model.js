import { DB } from "../config/db.js";
import format from "pg-format";

export const salesModel = {
  create: async ({ seller_id, name, description, price, image_url, quantity, category_id }) => {
    try {
      const client = await DB.getClient();
      try {
        await client.query('BEGIN');
        const query = format(
          "INSERT INTO Sales (seller_id, name, description, price, image_url, quantity, category_id) VALUES (%L, %L, %L, %L, %L, %L, %L) RETURNING *",
          seller_id,
          name,
          description,
          price,
          image_url,
          quantity,
          category_id
        );
        const { rows } = await client.query(query);
        await client.query('COMMIT');
        return rows[0];
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      throw error;
    }
  },

  findAll: async (limit = 10, offset = 0, categoryId = null) => {
    try {
      let query;
      if (categoryId) {
        query = format(
          "SELECT * FROM Sales WHERE status = 'available' AND category_id = %L ORDER BY created_at DESC LIMIT %L OFFSET %L",
          categoryId,
          limit,
          offset
        );
      } else {
        query = format(
          "SELECT * FROM Sales WHERE status = 'available' ORDER BY created_at DESC LIMIT %L OFFSET %L",
          limit,
          offset
        );
      }
      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener todas las ventas:", error);
      throw error;
    }
  },

  countAll: async (categoryId = null) => {
    try {
      let query;
      if (categoryId) {
        query = format(
          "SELECT COUNT(*) FROM Sales WHERE status = 'available' AND category_id = %L",
          categoryId
        );
      } else {
        query = "SELECT COUNT(*) FROM Sales WHERE status = 'available'";
      }
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
          u.name AS seller_name,
          c.id as category_id,
          c.name as category_name,
          c.slug as category_slug
         FROM Sales s
         JOIN Users u ON s.seller_id = u.id
         LEFT JOIN Categories c ON s.category_id = c.id
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
        SELECT 
          s.*, 
          p.sale_id,
          c.id as category_id,
          c.name as category_name,
          c.slug as category_slug
        FROM Sales s
        LEFT JOIN Purchases p ON s.id = p.sale_id AND p.seller_id = %L
        LEFT JOIN Categories c ON s.category_id = c.id
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

  findActiveSalesByUser: async (seller_id, limit = 10, offset = 0, categoryId = null) => {
    try {
      let query;
      let countQuery;

      if (categoryId) {
        query = format(
          `SELECT 
            s.*,
            c.id as category_id,
            c.name as category_name,
            c.slug as category_slug
          FROM Sales s
          LEFT JOIN Categories c ON s.category_id = c.id
          WHERE s.seller_id = %L 
          AND s.status = 'available'
          AND s.category_id = %L
          ORDER BY s.created_at DESC
          LIMIT %L OFFSET %L`,
          seller_id,
          categoryId,
          limit,
          offset
        );

        countQuery = format(
          `SELECT COUNT(*) 
           FROM Sales 
           WHERE seller_id = %L 
           AND status = 'available'
           AND category_id = %L`,
          seller_id,
          categoryId
        );
      } else {
        query = format(
          `SELECT 
            s.*,
            c.id as category_id,
            c.name as category_name,
            c.slug as category_slug
          FROM Sales s
          LEFT JOIN Categories c ON s.category_id = c.id
          WHERE s.seller_id = %L 
          AND s.status = 'available'
          ORDER BY s.created_at DESC
          LIMIT %L OFFSET %L`,
          seller_id,
          limit,
          offset
        );

        countQuery = format(
          `SELECT COUNT(*) 
           FROM Sales 
           WHERE seller_id = %L 
           AND status = 'available'`,
          seller_id
        );
      }

      const { rows } = await DB.query(query);
      const countResult = await DB.query(countQuery);
      const totalSales = parseInt(countResult.rows[0].count, 10);

      return { sales: rows, totalSales };
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

  update: async (sale_id, seller_id, { name, description, price, image_url, quantity, category_id }) => {
    try {
      const client = await DB.getClient();
      try {
        await client.query('BEGIN');
        const query = format(
          "UPDATE Sales SET name = %L, description = %L, price = %L, image_url = %L, quantity = %L, category_id = %L WHERE id = %L AND seller_id = %L RETURNING *",
          name,
          description,
          price,
          image_url,
          quantity,
          category_id,
          sale_id,
          seller_id
        );
        const { rows } = await client.query(query);
        await client.query('COMMIT');
        return rows[0];
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error al actualizar la venta:", error);
      throw error;
    }
  },

  incrementViews: async (sale_id) => {
    try {
      const query = format(
        "UPDATE Sales SET views = views + 1 WHERE id = %L RETURNING views",
        sale_id
      );
      const { rows } = await DB.query(query);
      return rows[0];
    } catch (error) {
      console.error("Error al incrementar vistas:", error);
      throw error;
    }
  },

  searchSales: async (searchTerm, limit = 10, offset = 0, categoryId = null) => {
    try {
      let query;
      let countQuery;

      if (categoryId) {
        query = format(
          `SELECT s.*, u.name AS seller_name, c.id as category_id, c.name as category_name, c.slug as category_slug
           FROM Sales s
           JOIN Users u ON s.seller_id = u.id
           LEFT JOIN Categories c ON s.category_id = c.id
           WHERE s.status = 'available' 
           AND s.category_id = %L
           AND (
             s.name ILIKE %L OR 
             s.description ILIKE %L OR 
             u.name ILIKE %L
           )
           ORDER BY s.created_at DESC
           LIMIT %L OFFSET %L`,
          categoryId,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          limit,
          offset
        );

        countQuery = format(
          `SELECT COUNT(*) 
           FROM Sales s
           JOIN Users u ON s.seller_id = u.id
           WHERE s.status = 'available' 
           AND s.category_id = %L
           AND (
             s.name ILIKE %L OR 
             s.description ILIKE %L OR 
             u.name ILIKE %L
           )`,
          categoryId,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`
        );
      } else {
        query = format(
          `SELECT s.*, u.name AS seller_name, c.id as category_id, c.name as category_name, c.slug as category_slug
           FROM Sales s
           JOIN Users u ON s.seller_id = u.id
           LEFT JOIN Categories c ON s.category_id = c.id
           WHERE s.status = 'available' 
           AND (
             s.name ILIKE %L OR 
             s.description ILIKE %L OR 
             u.name ILIKE %L
           )
           ORDER BY s.created_at DESC
           LIMIT %L OFFSET %L`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          limit,
          offset
        );

        countQuery = format(
          `SELECT COUNT(*) 
           FROM Sales s
           JOIN Users u ON s.seller_id = u.id
           WHERE s.status = 'available' 
           AND (
             s.name ILIKE %L OR 
             s.description ILIKE %L OR 
             u.name ILIKE %L
           )`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`
        );
      }

      const { rows } = await DB.query(query);
      const countResult = await DB.query(countQuery);
      const total = parseInt(countResult.rows[0].count, 10);

      return { sales: rows, total };
    } catch (error) {
      console.error("Error al buscar ventas:", error);
      throw error;
    }
  },
};
