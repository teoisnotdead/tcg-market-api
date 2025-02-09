import { Router } from "express"
import { createComment, getCommentsByCard } from "../controllers/comments.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/comments", verifyToken, createComment)
router.get("/comments/:card_id", getCommentsByCard)

export default router
