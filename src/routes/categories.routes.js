import express from 'express';
import {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    addCategoryToSale,
    removeCategoryFromSale,
} from '../controllers/categories.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rutas protegidas (requieren autenticación)
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);
router.post('/sales', verifyToken, addCategoryToSale);
router.delete('/sales/:saleId/:categoryId', verifyToken, removeCategoryFromSale);

export default router; 