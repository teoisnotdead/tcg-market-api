import { Router } from "express";
import { 
  createPurchase, 
  getMyPurchases, 
  getPurchasesHistory 
} from "../controllers/purchases.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createPurchase);
router.get("/mine", verifyToken, getMyPurchases);
router.get("/mine/history", verifyToken, getPurchasesHistory);

export default router;
