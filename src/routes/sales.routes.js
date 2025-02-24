import { Router } from "express";
import { 
  createSale, 
  getMySales, 
  getAllSales, 
  getSaleById, 
  deleteSale 
} from "../controllers/sales.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createSale);
router.get("/", getAllSales);
router.get("/:id", getSaleById);
router.get("/mine", verifyToken, getMySales);
router.delete("/:id", verifyToken, deleteSale);

export default router;
