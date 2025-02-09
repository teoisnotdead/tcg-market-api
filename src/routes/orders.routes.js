import { Router } from "express"
import { createOrder, getUserOrders } from "../controllers/orders.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/orders", verifyToken, createOrder)
router.get("/orders", verifyToken, getUserOrders)

export default router
