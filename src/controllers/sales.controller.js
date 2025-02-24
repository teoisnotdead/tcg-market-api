import { salesModel } from "../models/sales.model.js";

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
    const userId = req.user.id
    const sales = await salesModel.findByUserId(userId)

    res.json(sales)
  } catch (error) {
    next(error)
  }
}

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
