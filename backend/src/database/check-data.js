'This file checks if the database is connected and if the tables exist.'
'If the database is not connected or the tables do not exist, this file will log an error.'
'If the database is connected and the tables exist, this file will log the data in the tables.'

const db = require("./db");

const products = db
    .prepare("SELECT * FROM products")
    .all();

const carts = db
    .prepare("SELECT * FROM carts")
    .all();

const cartItems = db
    .prepare("SELECT * FROM cart_items")
    .all();

const percentageDiscounts = db
    .prepare("SELECT * FROM percentage_discounts")
    .all();

const buyXGetYDiscounts = db
    .prepare("SELECT * FROM buy_x_get_y_discounts")
    .all();

const coupons = db
    .prepare("SELECT * FROM coupons")
    .all();

console.log("Products:");
console.log(products);

console.log("\nCarts:");
console.log(carts);

console.log("\nCart items:");
console.log(cartItems);

console.log("\nPercentage discounts:");
console.log(percentageDiscounts);

console.log("\nBuy X Get Y discounts:");
console.log(buyXGetYDiscounts);

console.log("\nCoupons:");
console.log(coupons);