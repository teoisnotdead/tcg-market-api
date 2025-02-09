import { orderModel } from "../models/order.model.js"
import { orderItemModel } from "../models/orderItem.model.js"
import { cardModel } from "../models/card.model.js"

export const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body
    const user_id = req.user.id

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "La orden debe contener al menos un ítem" })
    }

    // Calculamos el precio total de la orden
    let total_price = 0
    for (const item of items) {
      const card = await cardModel.findById(item.card_id)
      if (!card) {
        return res.status(404).json({ message: `Carta con ID ${item.card_id} no encontrada` })
      }
      total_price += card.price * item.quantity
    }

    // Creamos la orden
    const order = await orderModel.create({ user_id, total_price })

    // Guardamos cada ítem de la orden
    for (const item of items) {
      await orderItemModel.create({
        order_id: order.id,
        card_id: item.card_id,
        quantity: item.quantity,
        price: item.quantity * (await cardModel.findById(item.card_id)).price
      })
    }

    res.status(201).json({ message: "Orden creada exitosamente", order })
  } catch (error) {
    next(error)
  }
}

export const getUserOrders = async (req, res, next) => {
  try {
    const user_id = req.user.id
    const orders = await orderModel.findByUser(user_id)
    res.json(orders)
  } catch (error) {
    next(error)
  }
}
