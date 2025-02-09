import { commentModel } from "../models/comment.model.js"

export const createComment = async (req, res, next) => {
  try {
    const { card_id, content } = req.body
    const user_id = req.user.id

    if (!card_id || !content) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" })
    }

    const comment = await commentModel.create({
      card_id,
      user_id,
      content,
    })

    res.status(201).json(comment)
  } catch (error) {
    next(error)
  }
}

export const getCommentsByCard = async (req, res, next) => {
  try {
    const { card_id } = req.params
    const comments = await commentModel.findByCardId(card_id)

    res.json(comments)
  } catch (error) {
    next(error)
  }
}
