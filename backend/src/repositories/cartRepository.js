
'This file contains the functions for interacting with the carts table in the database.'
const db = require("../database/db");

function getCartById(cartId) {
    return db
        .prepare(`
            SELECT id, created_at
            FROM carts
            WHERE id = ?
        `)
        .get(cartId);
}

module.exports = {
    getCartById
};