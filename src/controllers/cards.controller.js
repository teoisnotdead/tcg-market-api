import { cardModel } from "../models/card.model.js"

export const getAllCards = async (req, res, next) => {
  try {
    const cards = await cardModel.findAll()
    res.json(cards)
  } catch (error) {
    next(error)
  }
}

export const getCardById = async (req, res, next) => {
  try {
    const { id } = req.params
    const card = await cardModel.findById(id)

    if (!card) {
      return res.status(404).json({ message: "Carta no encontrada" })
    }

    res.json(card)
  } catch (error) {
    next(error)
  }
}

export const createCard = async (req, res, next) => {
  try {
    const { name, description, price, image_url } = req.body
    const owner_id = req.user.id

    const card = await cardModel.create({
      name,
      description,
      price,
      image_url,
      owner_id,
    })

    res.status(201).json(card)
  } catch (error) {
    next(error)
  }
}

export const deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params
    const owner_id = req.user.id

    const deletedCard = await cardModel.delete(id, owner_id)

    if (!deletedCard) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta carta" })
    }

    res.json({ message: "Carta eliminada exitosamente" })
  } catch (error) {
    next(error)
  }
}
