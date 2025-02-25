-- Active: 1730747908016@@127.0.0.1@5432@tcg_market

CREATE DATABASE tcg_market;

CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES Sales(id) ON DELETE CASCADE,
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE Order_Items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES Orders(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES Sales(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES Sales(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now()
);

DROP TABLE IF EXISTS "Users";
DROP TABLE IF EXISTS "Sales";
DROP TABLE IF EXISTS "Comments";
DROP TABLE IF EXISTS "Orders";
DROP TABLE IF EXISTS "Order_Items";
DROP TABLE IF EXISTS "Purchases";
