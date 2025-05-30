-- Active: 1730747908016@@127.0.0.1@5432@tcg_market

DROP TABLE IF EXISTS "Favorites";
DROP TABLE IF EXISTS "Purchases";
DROP TABLE IF EXISTS "Comments";
DROP TABLE IF EXISTS "Sales";
DROP TABLE IF EXISTS "Categories";
DROP TABLE IF EXISTS "Languages";
DROP TABLE IF EXISTS "Users";

CREATE DATABASE tcg_market;

CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    refresh_token TEXT,
    refresh_token_expires_at TIMESTAMP
);

CREATE TABLE Categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    status VARCHAR(20) DEFAULT 'available',
    views INTEGER DEFAULT 0,
    category_id UUID REFERENCES Categories(id) NOT NULL,
    language_id UUID REFERENCES Languages(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES Sales(id) ON DELETE CASCADE,
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES Sales(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    language_id UUID REFERENCES Languages(id) NOT NULL,
    category_id UUID REFERENCES Categories(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES Sales(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, sale_id)
);

CREATE INDEX idx_categories_slug ON Categories(slug);
CREATE INDEX idx_categories_display_order ON Categories(display_order);
CREATE INDEX idx_languages_slug ON Languages(slug);
CREATE INDEX idx_languages_display_order ON Languages(display_order);

-- Datos iniciales
INSERT INTO Categories (name, slug, description, display_order) VALUES
    ('Digimon', 'digimon', 'Cartas coleccionables del juego Digimon Card Game', 1),
    ('Dragon Ball Fusion', 'dragon-ball-fusion', 'Cartas del juego Dragon Ball Fusion World', 2),
    ('Dragon Ball Masters', 'dragon-ball-masters', 'Cartas del juego Dragon Ball Super Card Game', 3),
    ('Gundam Card Game', 'gundam-card-game', 'Cartas del juego Gundam Card Game', 4),
    ('Magic the gathering', 'magic-the-gathering', 'Cartas del juego Magic: The Gathering', 5),
    ('Mitos y leyendas', 'mitos-y-leyendas', 'Cartas del juego Mitos y Leyendas', 6),
    ('One Piece', 'one-piece', 'Cartas del juego One Piece Card Game', 7),
    ('Otro', 'otro', 'Otras cartas y productos coleccionables', 8),
    ('Pokémon', 'pokemon', 'Cartas del juego Pokémon Trading Card Game', 9),
    ('Union Arena', 'union-arena', 'Cartas del juego Union Arena', 10),
    ('Yu-Gi-Oh', 'yu-gi-oh', 'Cartas del juego Yu-Gi-Oh! Trading Card Game', 11)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    updated_at = now();

-- Datos iniciales de idiomas
INSERT INTO Languages (name, slug, display_order) VALUES
    ('Inglés', 'ingles', 1),
    ('Español', 'espanol', 2),
    ('Japonés', 'japones', 3),
    ('Coreano', 'coreano', 4),
    ('Francés', 'frances', 5),
    ('Alemán', 'aleman', 6),
    ('Italiano', 'italiano', 7),
    ('Portugués', 'portugues', 8),
    ('Chino', 'chino', 9),
    ('Otro', 'otro', 10)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name,
    display_order = EXCLUDED.display_order,
    updated_at = now();
