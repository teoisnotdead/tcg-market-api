import { Router } from "express";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite
} from "../controllers/favorites.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /favorites/{sale_id}:
 *   post:
 *     summary: Añadir un producto a favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     description: Añade un producto a la lista de favoritos del usuario autenticado
 *     parameters:
 *       - in: path
 *         name: sale_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la venta a marcar como favorita
 *     responses:
 *       201:
 *         description: Producto añadido a favoritos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Datos inválidos o producto ya en favoritos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post("/:sale_id", verifyToken, addFavorite);

/**
 * @swagger
 * /favorites/{sale_id}:
 *   delete:
 *     summary: Eliminar un producto de favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     description: Elimina un producto de la lista de favoritos del usuario autenticado
 *     parameters:
 *       - in: path
 *         name: sale_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la venta a eliminar de favoritos
 *     responses:
 *       200:
 *         description: Producto eliminado de favoritos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado en favoritos
 *       500:
 *         description: Error del servidor
 */
router.delete("/:sale_id", verifyToken, removeFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Obtener favoritos del usuario
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna la lista de favoritos del usuario autenticado
 *     responses:
 *       200:
 *         description: Lista de productos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", verifyToken, getUserFavorites);

/**
 * @swagger
 * /favorites/check/{sale_id}:
 *   get:
 *     summary: Verificar si un producto está en favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     description: Verifica si un producto específico está marcado como favorito por el usuario autenticado
 *     parameters:
 *       - in: path
 *         name: sale_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la venta a verificar
 *     responses:
 *       200:
 *         description: Estado de favorito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/check/:sale_id", verifyToken, checkFavorite);

export default router; 