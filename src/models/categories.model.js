import { DB } from "../config/db.js";
import format from "pg-format";

export const categoriesModel = {
    findAll: async () => {
        try {
            const query = "SELECT * FROM Categories ORDER BY name ASC";
            const { rows } = await DB.query(query);
            return rows;
        } catch (error) {
            console.error("Error al obtener todas las categorías:", error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const query = format("SELECT * FROM Categories WHERE id = %L", id);
            const { rows } = await DB.query(query);
            return rows[0] || null;
        } catch (error) {
            console.error("Error al obtener la categoría por ID:", error);
            throw error;
        }
    },

    findBySlug: async (slug) => {
        const query = 'SELECT * FROM Categories WHERE slug = $1';
        const result = await DB.query(query, [slug]);
        return result.rows[0];
    },

    create: async ({ name, description, display_order }) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        try {
            const query = `
                INSERT INTO Categories (name, slug, description, display_order)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const result = await DB.query(query, [name, slug, description, display_order]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al crear la categoría:", error);
            throw error;
        }
    },

    update: async (id, { name, description, display_order, is_active }) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        try {
            const query = `
                UPDATE Categories 
                SET name = $1,
                    slug = $2,
                    description = $3,
                    display_order = $4,
                    is_active = $5,
                    updated_at = now()
                WHERE id = $6
                RETURNING *
            `;
            const result = await DB.query(query, [
                name, slug, description, display_order, is_active, id
            ]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const query = format("DELETE FROM Categories WHERE id = %L RETURNING *", id);
            const result = await DB.query(query);
            return result.rows[0] || null;
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            throw error;
        }
    },
}; 