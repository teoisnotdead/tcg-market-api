import { purchasesModel } from "../models/purchases.model.js";

export const getMyPurchases = async (req, res, next) => {
  try {
    const userId = req.user.id; // Usuario autenticado
    const purchases = await purchasesModel.findAllByUser(userId);

    res.json(purchases);
  } catch (error) {
    next(error);
  }
};
