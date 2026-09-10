'This file contains the routes for the carts endpoints of the API.'
'It currently handles the POST request to create a new cart in the database.'
const express = require("express");
const db = require("../database/db");
const pricingService = require("../services/pricingService");
const cartRepository = require("../repositories/cartRepository");

const router = express.Router();

'This endpoint creates a new cart in the database and returns the ID of the newly created cart.'
router.post("/", (req, res) => {
    const result = db
        .prepare(`
            INSERT INTO carts DEFAULT VALUES
        `)
        .run();

    res.status(201).json({
        id: result.lastInsertRowid
    });
});

'This endpoint adds an item to a cart in the database.'
router.post("/:cartId/items", (req, res) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    // Check that quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
            error: "Quantity must be a positive integer"
        });
    }

    // Check that the cart exists
    const cart = cartRepository.getCartById(cartId);

    if (!cart) {
        return res.status(404).json({
            error: "Cart not found"
        });
    }

    // Check that the product exists
    const product = db
        .prepare(`
            SELECT id
            FROM products
            WHERE id = ?
        `)
        .get(productId);

    if (!product) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    // Add the item to the cart
    const result = db
        .prepare(`
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES (?, ?, ?)
        `)
        .run(cartId, productId, quantity);

    'This returns the ID of the newly created cart item, along with the cart ID, product ID, and quantity.'
    res.status(201).json({
        id: result.lastInsertRowid,
        cartId: Number(cartId),
        productId,
        quantity
    });
});

'This endpoint retrieves a cart and its items from the database.'
router.get("/:cartId", (req, res) => {
    const { cartId } = req.params;

    // Check that the cart exists
    const cart = cartRepository.getCartById(cartId);

    if (!cart) {
        return res.status(404).json({
            error: "Cart not found"
        });
    }

    // Get the items in the cart
    const items = db
        .prepare(`
            SELECT
                cart_items.id,
                cart_items.product_id,
                products.product_name,
                products.price_pence,
                cart_items.quantity
            FROM cart_items
            JOIN products
                ON cart_items.product_id = products.id
            WHERE cart_items.cart_id = ?
            ORDER BY cart_items.id
        `)
        .all(cartId);

    res.json({
        id: cart.id,
        createdAt: cart.created_at,
        items
    });
});

'This endpoint calculates the subtotal for a given cart.'
router.post("/:cartId/price", (req, res) => {
    const { cartId } = req.params;
    const { couponCode } = req.body;

    const cart = cartRepository.getCartById(cartId);

    if (!cart) {
        return res.status(404).json({
            error: "Cart not found"
        });
    }

    if (couponCode !== undefined && typeof couponCode !== "string") {
        return res.status(400).json({
            error: "Coupon code must be a string"
        });
    }

    const pricing = pricingService.calculateSubtotal(
        cartId,
        couponCode
    );

    res.json(pricing);
});

module.exports = router;