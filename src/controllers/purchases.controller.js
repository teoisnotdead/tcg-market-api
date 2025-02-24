import { purchasesModel } from "../models/purchases.model.js";
import { salesModel } from "../models/sales.model.js";
import { DB } from "../config/db.js";

export const createPurchase = async (req, res, next) => {
  const client = await DB.connect();

  try {
    await client.query("BEGIN");

    const userId = req.user.id;
    const { sale_id, quantity } = req.body;

    const sale = await salesModel.findById(sale_id);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    if (sale.seller_id === userId) {
      return res.status(403).json({ message: "No puedes comprar tu propia venta" });
    }

    if (sale.quantity < quantity) {
      return res.status(400).json({ message: `Stock insuficiente para la venta de ${sale.name}` });
    }

    // Registrar la compra en la BD
    const purchase = await purchasesModel.create({ userId, sale_id, quantity }, client);

    // Reducir cantidad disponible
    const updatedQuantity = sale.quantity - quantity;
    await salesModel.updateQuantity(sale_id, updatedQuantity, client);

    // Si la cantidad llega a 0, marcar la venta como "sold"
    if (updatedQuantity <= 0) {
      await salesModel.updateStatus(sale_id, "sold", client);
    }

    await client.query("COMMIT");
    res.status(201).json(purchase);
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

export const getMyPurchases = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const purchases = await purchasesModel.findByUserId(userId);
    res.json(purchases);
  } catch (error) {
    next(error);
  }
};

export const getPurchasesHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await purchasesModel.findHistoryByUserId(userId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};
