import { DB } from "../config/db.js";
import format from "pg-format";

export const languagesModel = {
    findAll: async () => {
        try {
            const query = "SELECT * FROM Languages ORDER BY display_order ASC, name ASC";
            const { rows } = await DB.query(query);
            return rows;
        } catch (error) {
            console.error("Error al obtener todos los idiomas:", error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const query = format("SELECT * FROM Languages WHERE id = %L", id);
            const { rows } = await DB.query(query);
            return rows[0] || null;
        } catch (error) {
            console.error("Error al obtener el idioma por ID:", error);
            throw error;
        }
    },

    findBySlug: async (slug) => {
        const query = 'SELECT * FROM Languages WHERE slug = $1';
        const result = await DB.query(query, [slug]);
        return result.rows[0];
    },

    create: async ({ name, display_order }) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        try {
            const query = `
                INSERT INTO Languages (name, slug, display_order)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await DB.query(query, [name, slug, display_order]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear el idioma:", error);
            throw error;
        }
    },

    update: async (id, { name, display_order, is_active }) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        try {
            const query = `
                UPDATE Languages 
                SET name = $1,
                    slug = $2,
                    display_order = $3,
                    is_active = $4,
                    updated_at = now()
                WHERE id = $5
                RETURNING *
            `;
            const result = await DB.query(query, [
                name, slug, display_order, is_active, id
            ]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al actualizar el idioma:", error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const query = format("DELETE FROM Languages WHERE id = %L RETURNING *", id);
            const result = await DB.query(query);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Error al eliminar el idioma:", error);
            throw error;
        }
    },
}; 