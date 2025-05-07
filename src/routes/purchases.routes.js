import { Router } from "express";
import { getMyPurchases } from "../controllers/purchases.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /purchases:
 *   get:
 *     summary: Obtener mis compras
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna el historial de compras del usuario autenticado
 *     responses:
 *       200:
 *         description: Lista de compras del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Purchase'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/", verifyToken, getMyPurchases);

export default router;
