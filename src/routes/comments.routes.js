import { Router } from "express";
import { getCommentsBySaleId, addComment } from "../controllers/comments.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:saleId", getCommentsBySaleId);
router.post("/", verifyToken, addComment);

export default router;
