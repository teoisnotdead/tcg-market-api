import { orderModel } from "../models/order.model.js";
import { orderItemModel } from "../models/orderItem.model.js";
import { salesModel } from "../models/sales.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    const user_id = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "La orden debe contener al menos un ítem" });
    }

    let total_price = 0;
    for (const item of items) {
      const sale = await salesModel.findById(item.sale_id);
      if (!sale) {
        return res.status(404).json({ message: `Venta con ID ${item.sale_id} no encontrada` });
      }
      total_price += sale.price * item.quantity;
    }

    const order = await orderModel.create({ user_id, total_price });

    for (const item of items) {
      await orderItemModel.create({
        order_id: order.id,
        sale_id: item.sale_id,
        quantity: item.quantity,
        price: item.quantity * (await salesModel.findById(item.sale_id)).price
      });
    }

    res.status(201).json({ message: "Orden creada exitosamente", order });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const orders = await orderModel.findByUser(user_id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
