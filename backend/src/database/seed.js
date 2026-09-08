
const db = require("./db");

const seed = db.transaction(() => {
    // Products
    const insertProduct = db.prepare(`
        INSERT INTO products (product_name, price_pence)
        VALUES (?, ?)
    `);

    const coffee = insertProduct.run("Coffee", 300);
    const tea = insertProduct.run("Tea", 250);
    const cake = insertProduct.run("Cake", 450);
    const sandwich = insertProduct.run("Sandwich", 600);

    // Percentage discount
    const insertPercentageDiscount = db.prepare(`
        INSERT INTO percentage_discounts
            (name, threshold_pence, percentage)
        VALUES (?, ?, ?)
    `);

    insertPercentageDiscount.run(
        "Spend £20 - 10% off",
        2000,
        10
    );

    // Buy X Get Y discount
    const insertBuyXGetY = db.prepare(`
        INSERT INTO buy_x_get_y_discounts
            (product_id, buy_quantity, free_quantity)
        VALUES (?, ?, ?)
    `);

    insertBuyXGetY.run(
        coffee.lastInsertRowid,
        3,
        1
    );

    // Coupon
    const insertCoupon = db.prepare(`
        INSERT INTO coupons
            (code, discount_pence)
        VALUES (?, ?)
    `);

    insertCoupon.run("WELCOME5", 500);
});

seed();

console.log("Database seeded successfully.");