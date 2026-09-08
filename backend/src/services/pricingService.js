'This service calculates the subtotal for a given cart.'
'It retrieves the items in the cart, calculates the line total for each item, and sums them up to get the subtotal.'

const db = require("../database/db");

function calculateSubtotal(cartId) {
    'This retrieves the items in the cart.'
    const items = db
        .prepare(`
            SELECT
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

    'This calculates the line total for each item in the cart.'
    const pricedItems = items.map((item) => {
        const lineTotal = item.price_pence * item.quantity;

        return {
            productId: item.product_id,
            productName: item.product_name,
            unitPricePence: item.price_pence,
            quantity: item.quantity,
            lineTotalPence: lineTotal
        };
    });

    'This sums up the line totals to get the subtotal for the cart.'
    const subtotalPence = pricedItems.reduce(
        (total, item) => total + item.lineTotalPence,
        0
    );

    'This returns the priced items and the subtotal for the cart.'
    return {
        items: pricedItems,
        subtotalPence
    };
}

module.exports = {
    calculateSubtotal
};