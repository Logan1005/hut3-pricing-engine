
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    price_pence INTEGER NOT NULL CHECK (price_pence >= 0)
);

CREATE TABLE IF NOT EXISTS carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),

    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    discount_pence INTEGER NOT NULL CHECK (discount_pence >= 0)
);

CREATE TABLE IF NOT EXISTS percentage_discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    threshold_pence INTEGER NOT NULL CHECK (threshold_pence >= 0),
    percentage INTEGER NOT NULL CHECK (percentage > 0 AND percentage <= 100)
);

CREATE TABLE IF NOT EXISTS buy_x_get_y_discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    buy_quantity INTEGER NOT NULL CHECK (buy_quantity > 0),
    free_quantity INTEGER NOT NULL CHECK (free_quantity > 0),

    FOREIGN KEY (product_id) REFERENCES products(id)
);