'This file contains the routes for the products endpoints of the API'
'It currently handles the GET request to retrieve all products from the database.'
const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.get("/", (req, res) => {
    const products = db
        .prepare(`
            SELECT id, product_name, price_pence
            FROM products
            ORDER BY id
        `)
        .all();

    res.json(products);
});

module.exports = router;