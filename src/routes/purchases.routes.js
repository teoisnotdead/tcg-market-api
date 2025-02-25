import { Router } from "express";
import { getMyPurchases } from "../controllers/purchases.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getMyPurchases);

export default router;
