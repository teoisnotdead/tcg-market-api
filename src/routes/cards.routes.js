import { Router } from "express"
import { getAllCards, getCardById, createCard, deleteCard } from "../controllers/cards.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/cards", getAllCards)
router.get("/cards/:id", getCardById)
router.post("/cards", verifyToken, createCard)
router.delete("/cards/:id", verifyToken, deleteCard)

export default router
