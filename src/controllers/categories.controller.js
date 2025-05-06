import { categoriesModel } from "../models/categories.model.js";

// Obtener todas las categorías
export const getCategories = async (req, res) => {
    try {
        const categories = await categoriesModel.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await categoriesModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva categoría
export const createCategory = async (req, res) => {
    try {
        const category = await categoriesModel.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
    try {
        const category = await categoriesModel.update(req.params.id, req.body);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
    try {
        const category = await categoriesModel.delete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agregar categoría a una venta
export const addCategoryToSale = async (req, res) => {
    try {
        const { saleId, categoryId } = req.body;
        const result = await categoriesModel.addCategoryToSale(saleId, categoryId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remover categoría de una venta
export const removeCategoryFromSale = async (req, res) => {
    try {
        const { saleId, categoryId } = req.params;
        const result = await categoriesModel.removeCategoryFromSale(saleId, categoryId);
        if (!result) {
            return res.status(404).json({ message: 'Relación no encontrada' });
        }
        res.json({ message: 'Categoría removida exitosamente de la venta' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 