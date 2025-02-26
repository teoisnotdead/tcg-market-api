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

    const totalSales = await salesModel.countAll();

    const totalPages = Math.ceil(totalSales / limit);

    res.json({
      currentPage: Math.floor(offset / limit) + 1,
      totalPages,
      totalItems: totalSales,
      itemsPerPage: limit,
      data: sales,
    });
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

    res.json({...sale, seller_id: sale.seller_id});
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
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;


    const { sales, totalSales } = await salesModel.findActiveSalesByUser(userId, limit, offset);


    res.json({
      totalItems: totalSales,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalSales / limit),
      currentPage: Math.ceil(offset / limit) + 1,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

export const checkoutSale = async (req, res, next) => {
  try {
    const user_id = req.user.id;
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


    const remainingQuantity = sale.quantity - quantity;

    if (remainingQuantity > 0) {
      await salesModel.updateQuantity(sale_id, remainingQuantity);
    } else {
      await salesModel.updateQuantity(sale_id, 0);
      await salesModel.updateStatus(sale_id, "sold");
    }

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

export const updateSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    const { name, description, price, image_url, quantity } = req.body;

    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const updatedSale = await salesModel.update(id, seller_id, {
      name,
      description,
      price,
      image_url,
      quantity,
    });

    if (!updatedSale) {
      return res.status(403).json({ message: "No tienes permiso para modificar esta venta" });
    }

    res.json({ message: "Venta modificada exitosamente", sale: updatedSale });
  } catch (error) {
    next(error);
  }
};

