'This service calculates the subtotal for a given cart.'
'It retrieves the items in the cart, calculates the line total for each item, and sums them up to get the subtotal.'

const db = require("../database/db");

function calculateBuyXGetYDiscount(item) {
    'This finds if a buy x get y discount exists for the product in the cart.'
    const discount = db
        .prepare(`
            SELECT
                buy_quantity,
                free_quantity
            FROM buy_x_get_y_discounts
            WHERE product_id = ?
        `)
        .get(item.product_id);

    'If no discount exsists, return null.'
    if (!discount) {
        return null;
    }

    'Calcuates the group size'
    const groupSize = discount.buy_quantity + discount.free_quantity;

    'Calculates the number of free groups'
    const freeGroups = Math.floor(item.quantity / groupSize);

    'Calculates the total number of free items'
    const freeQuantity = freeGroups * discount.free_quantity;

    'This calculates the total discount amount based on the free quantity and the price of the item.'
    return {
        amountPence:freeQuantity * item.price_pence,
        buyQuantity: discount.buy_quantity,
        freeQuantity: discount.free_quantity
    };
}

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

    const discounts = [];

    'This calculates the total discount for each item in the cart based on any applicable buy x get y discounts.'
    for (const item of items) {
        const discount = calculateBuyXGetYDiscount(item);

        'If a discount exists and the amount is greater than 0, it adds the discount to the discounts array.'
        if (discount && discount.amountPence > 0) {
            discounts.push({
                name: `Buy ${discount.buyQuantity} Get ${discount.freeQuantity} Free - ${item.product_name}`,
                amountPence: discount.amountPence
            });
        }
    }

    'This calculates the total discount amount by summing up all the individual discounts.'
    const totalDiscountPence = discounts.reduce(
        (total, discount) => total + discount.amountPence,
        0
    );

    'This calculates the total amount to be paid after applying the discounts, ensuring that it does not go below zero.'
    const totalPence = Math.max(
        0,
        subtotalPence - totalDiscountPence
    );

    'This returns an object containing the priced items, subtotal, discounts, and total amount to be paid for the cart.'
    return {
        items: pricedItems,
        subtotalPence,
        discounts,
        totalPence
    };
}

module.exports = {
    calculateSubtotal
};