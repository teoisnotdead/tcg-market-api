import { salesModel } from "../models/sales.model.js";
import { purchasesModel } from "../models/purchases.model.js";
import { categoriesModel } from "../models/categories.model.js";
import { languagesModel } from "../models/languages.model.js";

export const createSale = async (req, res, next) => {
  try {
    const { name, description, price, image_url, quantity, category_id, language_id } = req.body;
    const seller_id = req.user.id;

    if (!name || !description || !price || !quantity || !category_id || !language_id) {
      return res.status(400).json({ message: "Todos los campos son obligatorios, incluidas la categoría y el idioma" });
    }

    // Validar que la categoría exista
    const category = await categoriesModel.findById(category_id);
    if (!category) {
      return res.status(400).json({ message: "La categoría no existe" });
    }

    // Validar que el idioma exista
    const language = await languagesModel.findById(language_id);
    if (!language) {
      return res.status(400).json({ message: "El idioma no existe" });
    }

    const sale = await salesModel.create({
      seller_id,
      name,
      description,
      price,
      image_url: image_url || "https://placehold.co/200x300",
      quantity,
      category_id,
      language_id
    });

    res.status(201).json(sale);
  } catch (error) {
    next(error);
  }
};

export const deleteSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.userId;

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
    const { page = 1, limit = 10, offset: offsetParam, categories } = req.query;
    
    // Si se proporciona offset directamente, usarlo; sino, calcularlo desde page
    const offset = offsetParam !== undefined ? parseInt(offsetParam, 10) : (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitInt = parseInt(limit, 10);

    const [sales, total] = await Promise.all([
      salesModel.findAll(limitInt, offset, categories),
      salesModel.countAll(categories)
    ]);

    res.json({
      sales,
      totalPages: Math.ceil(total / limitInt),
      currentPage: offsetParam !== undefined ? Math.floor(offset / limitInt) + 1 : parseInt(page, 10),
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
    const userId = req.user.userId;
    const sales = await salesModel.findAllSalesBySeller(userId);

    res.json(sales);
  } catch (error) {
    next(error);
  }
};

export const getActiveSales = async (req, res, next) => {
  try {
    const userId = req.user.userId;
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
    const user_id = req.user.userId;
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
      quantity,
      language_id: sale.language_id,
      category_id: sale.category_id
    });

    res.status(201).json({ message: "Compra realizada con éxito", purchase });
  } catch (error) {
    next(error);
  }
};

export const updateSale = async (req, res) => {
  console.log('updateSale', req.body);
  try {
    const { id } = req.params;
    const { name, description, price, image_url, quantity, category_id, language_id } = req.body;
    const seller_id = req.user.id;

    if (!category_id) {
      return res.status(400).json({ message: "La categoría es obligatoria" });
    }

    // Validar que la categoría exista
    const category = await categoriesModel.findById(category_id);
    if (!category) {
      return res.status(400).json({ message: "La categoría no existe" });
    }

    const updatedSale = await salesModel.update(id, seller_id, {
      name,
      description,
      price,
      image_url,
      quantity,
      category_id,
      language_id
    });

    if (!updatedSale) {
      return res.status(404).json({ message: "No se pudo actualizar la venta" });
    }

    res.json(updatedSale);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: "Error al actualizar la venta" });
  }
};

export const searchSales = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, offset: offsetParam, categories } = req.query;
    
    // Si se proporciona offset directamente, usarlo; sino, calcularlo desde page
    const offset = offsetParam !== undefined ? parseInt(offsetParam, 10) : (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitInt = parseInt(limit, 10);

    if (!search) {
      return res.status(400).json({ message: "El término de búsqueda es requerido" });
    }

    const { sales, total } = await salesModel.searchSales(search, limitInt, offset, categories);

    res.json({
      sales,
      totalPages: Math.ceil(total / limitInt),
      currentPage: offsetParam !== undefined ? Math.floor(offset / limitInt) + 1 : parseInt(page, 10),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

