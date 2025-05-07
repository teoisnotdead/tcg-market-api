import { Router } from "express";
import { getCommentsBySaleId, addComment } from "../controllers/comments.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /comments/{saleId}:
 *   get:
 *     summary: Obtener comentarios de una venta
 *     tags: [Comments]
 *     description: Obtiene todos los comentarios de una venta específica
 *     parameters:
 *       - in: path
 *         name: saleId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:saleId", getCommentsBySaleId);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Añadir un comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     description: Añade un comentario a una venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sale_id
 *               - content
 *             properties:
 *               sale_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la venta
 *               content:
 *                 type: string
 *                 description: Contenido del comentario
 *     responses:
 *       201:
 *         description: Comentario añadido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/", verifyToken, addComment);

export default router;
