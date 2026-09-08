const db = require("./db");

const products = db
    .prepare("SELECT * FROM products")
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

console.log("\nPercentage discounts:");
console.log(percentageDiscounts);

console.log("\nBuy X Get Y discounts:");
console.log(buyXGetYDiscounts);

console.log("\nCoupons:");
console.log(coupons);