import { salesModel } from "../models/sales.model.js";
import { purchasesModel } from "../models/purchases.model.js";

export const createSale = async (req, res, next) => {
  try {
    const { name, description, price, image_url, quantity } = req.body;
    const seller_id = req.user.id;

    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const sale = await salesModel.create({
      seller_id,
      name,
      description,
      price,
      image_url: image_url || "https://placehold.co/200x300",
      quantity
    });

    res.status(201).json(sale);
  } catch (error) {
    next(error);
  }
};

export const deleteSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    const deletedSale = await salesModel.delete(id, seller_id);

    if (!deletedSale) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta venta" });
    }

    res.json({ message: "Venta eliminada exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const getAllSales = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    const sales = await salesModel.findAll(limit, offset);
    res.json(sales);
  } catch (error) {
    next(error);
  }
};

export const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await salesModel.findById(id);

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    res.json(sale);
  } catch (error) {
    next(error);
  }
};

export const getMySales = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sales = await salesModel.findAllSalesBySeller(userId);

    res.json(sales);
  } catch (error) {
    next(error);
  }
};

export const getActiveSales = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sales = await salesModel.findActiveSalesByUser(userId);

    res.json(sales);
  } catch (error) {
    next(error);
  }
};

export const checkoutSale = async (req, res, next) => {
  try {
    const user_id = req.user.id; // Comprador
    const { sale_id, quantity } = req.body;

    if (!sale_id || !quantity) {
      return res.status(400).json({ message: "Faltan datos para completar la compra" });
    }

    // Buscar la venta
    const sale = await salesModel.findById(sale_id);

    if (!sale) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (sale.quantity < quantity) {
      return res.status(400).json({ message: "Stock insuficiente" });
    }

    // Reducir stock
    const remainingQuantity = sale.quantity - quantity;

    if (remainingQuantity > 0) {
      await salesModel.updateQuantity(sale_id, remainingQuantity);
    } else {
      // ✅ Si no queda stock, actualizar status a 'sold' y poner quantity en 0
      await salesModel.updateQuantity(sale_id, 0);
      await salesModel.updateStatus(sale_id, "sold");
    }

    // Registrar la compra en Purchases
    const purchase = await purchasesModel.create({
      user_id,
      sale_id,
      seller_id: sale.seller_id,
      name: sale.name,
      description: sale.description,
      price: sale.price,
      image_url: sale.image_url,
      quantity
    });

    res.status(201).json({ message: "Compra realizada con éxito", purchase });
  } catch (error) {
    next(error);
  }
};


