import express from 'express';
import {
    getLanguages,
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage,
} from '../controllers/languages.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getLanguages);
router.get('/:id', getLanguageById);

// Rutas protegidas (solo administradores)
router.post('/', verifyToken, createLanguage);
router.put('/:id', verifyToken, updateLanguage);
router.delete('/:id', verifyToken, deleteLanguage);

export default router; 