import { commentsModel } from "../models/comment.model.js";

export const getCommentsBySaleId = async (req, res, next) => {
  try {
    const { saleId } = req.params;
    const comments = await commentsModel.findBySaleId(saleId);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { sale_id, content } = req.body;
    const user_id = req.user.userId;

    if (!sale_id || !content) {
      return res.status(400).json({ message: "Se requiere sale_id y comentario" });
    }

    const newComment = await commentsModel.create({ user_id, sale_id, content });

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};
