import { languagesModel } from "../models/languages.model.js";

// Obtener todos los idiomas
export const getLanguages = async (req, res) => {
    try {
        const languages = await languagesModel.findAll();
        res.json(languages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un idioma por ID
export const getLanguageById = async (req, res) => {
    try {
        const language = await languagesModel.findById(req.params.id);
        if (!language) {
            return res.status(404).json({ message: 'Idioma no encontrado' });
        }
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo idioma
export const createLanguage = async (req, res) => {
    try {
        const language = await languagesModel.create(req.body);
        res.status(201).json(language);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un idioma
export const updateLanguage = async (req, res) => {
    try {
        const language = await languagesModel.update(req.params.id, req.body);
        if (!language) {
            return res.status(404).json({ message: 'Idioma no encontrado' });
        }
        res.json(language);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un idioma
export const deleteLanguage = async (req, res) => {
    try {
        const language = await languagesModel.delete(req.params.id);
        if (!language) {
            return res.status(404).json({ message: 'Idioma no encontrado' });
        }
        res.json({ message: 'Idioma eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 