import { favoritesModel } from "../models/favorites.model.js";

export const addFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { sale_id } = req.params;

    const favorite = await favoritesModel.addFavorite(user_id, sale_id);
    res.status(201).json({ message: "Agregado a favoritos", favorite });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { sale_id } = req.params;

    const favorite = await favoritesModel.removeFavorite(user_id, sale_id);
    if (!favorite) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }
    res.json({ message: "Eliminado de favoritos" });
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const favorites = await favoritesModel.getUserFavorites(user_id);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

export const checkFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { sale_id } = req.params;

    const isFavorite = await favoritesModel.isFavorite(user_id, sale_id);
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
}; 