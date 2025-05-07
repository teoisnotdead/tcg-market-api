import { Router } from "express";
import { 
  createSale, 
  getAllSales, 
  getSaleById, 
  deleteSale,
  getMySales,
  getActiveSales,
  checkoutSale,
  updateSale,
  searchSales
} from "../controllers/sales.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Crear una nueva venta
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     description: Publica un nuevo producto para la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - quantity
 *               - category_id
 *               - language_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Precio del producto
 *               image_url:
 *                 type: string
 *                 description: URL de la imagen del producto
 *               quantity:
 *                 type: integer
 *                 description: Cantidad disponible
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la categoría
 *               language_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del idioma
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post("/", verifyToken, createSale);

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags: [Sales]
 *     description: Retorna una lista paginada de todas las ventas disponibles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de items por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset (alternativa a page)
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: IDs de categorías separados por comas
 *     responses:
 *       200:
 *         description: Lista paginada de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       500:
 *         description: Error del servidor
 */
router.get("/", getAllSales);

/**
 * @swagger
 * /sales/search:
 *   get:
 *     summary: Buscar ventas
 *     tags: [Sales]
 *     description: Busca ventas por nombre, descripción o vendedor
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de items por página
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: IDs de categorías separados por comas
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       400:
 *         description: Término de búsqueda requerido
 *       500:
 *         description: Error del servidor
 */
router.get("/search", searchSales);

/**
 * @swagger
 * /sales/active-sales:
 *   get:
 *     summary: Obtener ventas activas del usuario
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna las ventas activas del usuario autenticado
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de items por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset de paginación
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de categoría para filtrar
 *     responses:
 *       200:
 *         description: Lista paginada de ventas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 itemsPerPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/active-sales", verifyToken, getActiveSales);

/**
 * @swagger
 * /sales/all-sales:
 *   get:
 *     summary: Obtener todas las ventas del usuario
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna todas las ventas del usuario autenticado
 *     responses:
 *       200:
 *         description: Lista de ventas del usuario
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
router.get("/all-sales", verifyToken, getMySales);

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Eliminar una venta
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     description: Elimina una venta existente (solo el propietario puede hacerlo)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para eliminar esta venta
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", verifyToken, deleteSale);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags: [Sales]
 *     description: Retorna una venta basada en su ID, incrementa contador de vistas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Detalles de la venta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", getSaleById);

/**
 * @swagger
 * /sales/checkout:
 *   post:
 *     summary: Comprar un producto
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     description: Realiza la compra de un producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sale_id
 *               - quantity
 *             properties:
 *               sale_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la venta a comprar
 *               quantity:
 *                 type: integer
 *                 description: Cantidad a comprar
 *     responses:
 *       201:
 *         description: Compra realizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 purchase:
 *                   $ref: '#/components/schemas/Purchase'
 *       400:
 *         description: Datos inválidos o stock insuficiente
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/checkout", verifyToken, checkoutSale);

/**
 * @swagger
 * /sales/{id}:
 *   put:
 *     summary: Actualizar una venta
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     description: Actualiza una venta existente (solo el propietario puede hacerlo)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Precio del producto
 *               image_url:
 *                 type: string
 *                 description: URL de la imagen del producto
 *               quantity:
 *                 type: integer
 *                 description: Cantidad disponible
 *               category_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID de la categoría (obligatorio)
 *               language_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del idioma
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", verifyToken, updateSale);

export default router;
