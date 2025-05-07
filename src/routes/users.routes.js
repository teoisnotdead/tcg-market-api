import { Router } from "express"
import { getProfile, updateProfile, getProfileStats } from "../controllers/users.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Obtener perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Obtiene los datos del perfil del usuario autenticado
 *     responses:
 *       200:
 *         description: Datos del perfil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/me", verifyToken, getProfile)

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Actualiza los datos del perfil del usuario autenticado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put("/me", verifyToken, updateProfile)

/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Obtener estadísticas del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Obtiene estadísticas de ventas y compras del usuario autenticado
 *     responses:
 *       200:
 *         description: Estadísticas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 active_sales:
 *                   type: integer
 *                   description: Número de ventas activas
 *                 total_sales:
 *                   type: integer
 *                   description: Número total de ventas realizadas
 *                 total_earned:
 *                   type: number
 *                   format: float
 *                   description: Total ganado en ventas
 *                 total_purchases:
 *                   type: integer
 *                   description: Número total de compras
 *                 total_spent:
 *                   type: number
 *                   format: float
 *                   description: Total gastado en compras
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/stats", verifyToken, getProfileStats)


export default router
