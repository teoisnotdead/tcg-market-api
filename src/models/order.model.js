import { DB } from "../config/db.js";
import format from "pg-format";
import { salesModel } from "./sales.model.js";

export const orderModel = {
  create: async ({ user_id, items }) => {
    const client = await DB.connect();

    try {
      await client.query("BEGIN");

      let total_price = 0;
      const updatedSales = [];

      for (const item of items) {
        const sale = await salesModel.findById(item.sale_id);
        if (!sale) {
          throw new Error(`Venta con ID ${item.sale_id} no encontrada`);
        }
        if (sale.quantity < item.quantity) {
          throw new Error(`Stock insuficiente para la venta ${sale.name}`);
        }
        total_price += sale.price * item.quantity;

        // Guardamos la cantidad a actualizar en memoria para evitar más consultas
        updatedSales.push({
          sale_id: item.sale_id,
          newQuantity: sale.quantity - item.quantity,
          price: sale.price,
        });
      }

      // Insertamos la orden
      const query = format(
        `INSERT INTO Orders (user_id, total_price) 
         VALUES (%L, %L) RETURNING *`,
        user_id,
        total_price
      );
      const { rows: orderRows } = await client.query(query);
      const order = orderRows[0];

      // Insertamos los ítems en Order_Items
      for (const item of updatedSales) {
        await client.query(
          format(
            `INSERT INTO Order_Items (order_id, sale_id, quantity, price) 
             VALUES (%L, %L, %L, %L) RETURNING *`,
            order.id,
            item.sale_id,
            item.newQuantity,
            item.newQuantity * item.price
          )
        );

        await salesModel.updateQuantity(item.sale_id, item.newQuantity, client);

        if (item.newQuantity <= 0) {
          await salesModel.updateStatus(item.sale_id, "sold", client);
        }
      }

      await client.query("COMMIT");
      return order;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error al crear la orden:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  findByUser: async (user_id) => {
    try {
      const query = format(
        `SELECT o.*, 
          json_agg(
            json_build_object(
              'sale', json_build_object(
                'id', s.id, 
                'name', s.name, 
                'price', oi.price
              ),
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) AS items
        FROM Orders o
        JOIN Order_Items oi ON o.id = oi.order_id
        JOIN Sales s ON oi.sale_id = s.id
        WHERE o.user_id = %L
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
        user_id
      );

      const { rows } = await DB.query(query);
      return rows;
    } catch (error) {
      console.error("Error al obtener órdenes del usuario:", error);
      throw error;
    }
  }
};
