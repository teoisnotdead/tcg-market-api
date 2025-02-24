import { Router } from "express"
import { createComment, getCommentsByCard } from "../controllers/comments.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", verifyToken, createComment)
router.get("/:card_id", getCommentsByCard)

export default router
