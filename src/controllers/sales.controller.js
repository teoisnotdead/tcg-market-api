import { salesModel } from "../models/sales.model.js";
import { purchasesModel } from "../models/purchases.model.js";
import { categoriesModel } from "../models/categories.model.js";

export const createSale = async (req, res, next) => {
  try {
    const { name, description, price, image_url, quantity } = req.body;
    const seller_id = req.user.id;

    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (description.length > 100) {
      return res.status(400).json({ message: "La descripción no puede tener más de 100 caracteres" });
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

export const getAllSales = async (req, res) => {
  try {
    const { page = 1, limit = 10, categories } = req.query;
    const offset = (page - 1) * limit;
    
    // Convertir el parámetro categories a un array si existe
    const categoryIds = categories ? categories.split(',') : null;

    const [sales, total] = await Promise.all([
      salesModel.findAll(limit, offset, categoryIds),
      salesModel.countAll(categoryIds)
    ]);

    res.json({
      sales,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await salesModel.findById(id);

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Incrementar el contador de vistas
    await salesModel.incrementViews(id);

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
    const categoryId = req.query.category;

    const { sales, totalSales } = await salesModel.findActiveSalesByUser(userId, limit, offset, categoryId);

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

export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, quantity, categories } = req.body;
    const seller_id = req.user.id;

    // Validar que la venta exista y pertenezca al usuario
    const sale = await salesModel.findById(id);
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    if (sale.seller_id !== seller_id) {
      return res.status(403).json({ message: "No tienes permiso para actualizar esta venta" });
    }

    // Validar categorías si se proporcionan
    if (categories && Array.isArray(categories)) {
      for (const categoryId of categories) {
        const category = await categoriesModel.findById(categoryId);
        if (!category) {
          return res.status(400).json({ message: `Categoría con ID ${categoryId} no encontrada` });
        }
      }
    }

    const updatedSale = await salesModel.update(id, seller_id, {
      name,
      description,
      price,
      image_url,
      quantity,
      categories
    });

    if (!updatedSale) {
      return res.status(404).json({ message: "No se pudo actualizar la venta" });
    }

    res.json(updatedSale);
  } catch (error) {
    console.error("Error al actualizar la venta:", error);
    res.status(500).json({ message: "Error al actualizar la venta" });
  }
};

export const searchSales = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, categories } = req.query;
    const offset = (page - 1) * limit;

    if (!search) {
      return res.status(400).json({ message: "El término de búsqueda es requerido" });
    }

    // Convertir el parámetro categories a un array si existe
    const categoryIds = categories ? categories.split(',') : null;

    const { sales, total } = await salesModel.searchSales(search, limit, offset, categoryIds);

    res.json({
      sales,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

