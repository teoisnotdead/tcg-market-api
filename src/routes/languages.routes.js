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

/**
 * @swagger
 * /languages:
 *   get:
 *     summary: Obtener todos los idiomas
 *     tags: [Languages]
 *     description: Retorna una lista de todos los idiomas disponibles
 *     responses:
 *       200:
 *         description: Lista de idiomas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Language'
 *       500:
 *         description: Error del servidor
 */
router.get('/', getLanguages);

/**
 * @swagger
 * /languages/{id}:
 *   get:
 *     summary: Obtener un idioma por ID
 *     tags: [Languages]
 *     description: Retorna un idioma basado en su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del idioma
 *     responses:
 *       200:
 *         description: Detalles del idioma
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       404:
 *         description: Idioma no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getLanguageById);

/**
 * @swagger
 * /languages:
 *   post:
 *     summary: Crear un nuevo idioma
 *     tags: [Languages]
 *     security:
 *       - bearerAuth: []
 *     description: Crea un nuevo idioma en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del idioma
 *               display_order:
 *                 type: integer
 *                 description: Orden de visualización
 *     responses:
 *       201:
 *         description: Idioma creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', verifyToken, createLanguage);

/**
 * @swagger
 * /languages/{id}:
 *   put:
 *     summary: Actualizar un idioma
 *     tags: [Languages]
 *     security:
 *       - bearerAuth: []
 *     description: Actualiza un idioma existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del idioma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del idioma
 *               display_order:
 *                 type: integer
 *                 description: Orden de visualización
 *               is_active:
 *                 type: boolean
 *                 description: Estado activo/inactivo
 *     responses:
 *       200:
 *         description: Idioma actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Idioma no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', verifyToken, updateLanguage);

/**
 * @swagger
 * /languages/{id}:
 *   delete:
 *     summary: Eliminar un idioma
 *     tags: [Languages]
 *     security:
 *       - bearerAuth: []
 *     description: Elimina un idioma existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID del idioma
 *     responses:
 *       200:
 *         description: Idioma eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Idioma no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', verifyToken, deleteLanguage);

export default router; 