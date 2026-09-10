
# Hut 3 Pricing & Discount Engine

A small shopping cart pricing engine built as a take-home exercise for Hut 3.

The application allows users to add products to a cart, adjust quantities, remove items, apply discount rules and coupon codes, and see the final price.

## Tech Stack

- Node.js + Express
- React + Vite
- SQLite
- JavaScript

## Running the Application

Prerequisites
 - Node.js
 - npm

Backend:

From the backend directory:

npm install
node src/database/seed.js
node src/server.js

The API runs on:
http://localhost:3000

Frontend

Open a second terminal and from the frontend directory:

npm install
npm run dev

The frontend will normally be available at:
http://localhost:5173


## Design Decisions
Database schema

I used SQLite because it provides a lightweight relational database with no additional database server required, which keeps the project simple to run locally.

The main tables are:

products — stores product names and prices.
carts — stores created carts.
cart_items — links products to carts and stores quantities.
coupons — stores flat-value coupon codes and their discounts.
percentage_discounts — stores percentage discounts and their cart thresholds.
buy_x_get_y_discounts — stores Buy X Get Y rules linked to a specific product.

The relationships are primarily represented through foreign keys. For example, cart_items references both a cart and a product rather than duplicating product information.

This keeps product information in one place and allows a cart to contain multiple products.

## Pricing logic

Pricing is handled separately from the Express routes in a pricing service. This keeps the API layer responsible for handling HTTP requests while the pricing service is responsible for calculating the cart total.

Money is stored and calculated as integer pence rather than floating-point pounds. For example, £3.00 is stored as 300. This avoids floating-point precision problems when performing monetary calculations.

## Discount rules

The application supports:

- Buy X Get Y Free on a specific product.
- A percentage discount when the cart subtotal reaches a threshold.
- A flat-value coupon code.

Multiple discounts can be applied to the same cart.

The percentage discount is calculated against the original cart subtotal rather than the price after the Buy X Get Y discount. Discount amounts are rounded down to the nearest penny.

The final total cost cannot produce a negative price.

I chose a fixed discount order to make discount interactions predictable and consistent, while calculating percentage discounts from the original subtotal so that one discount does not unexpectedly reduce the value of another.

I chose the following order:

- Buy X Get Y Free
- Percentage discount
- Flat coupon

## AI Tool Notes

AI tools were used throughout development as a coding and problem-solving aid. I used AI to generate parts of the implementation, including code for the backend API, database interactions, pricing and discount logic, and frontend components and styling.

Generated code was not treated as automatically correct. I reviewed and adapted the suggestions to fit the requirements of the exercise and my chosen design. I manually tested the application throughout development to verify that the generated code behaved as expected, including testing cart operations, quantity changes, duplicate products, discount combinations, coupon handling, invalid inputs, and final price calculations.

The final implementation therefore uses AI-generated code, but the code was integrated, tested, and adjusted as part of the development process rather than being submitted without verification.

## What I Would Do Differently With More Time
- Add automated tests for the pricing logic, API endpoints, and combinations of discounts, particularly around edge cases and rounding.
- Improve the repository layer by adding more reusable functions to cartRepository, helping reduce duplicated database access code and keeping the application structure cleaner.
- Make the discount system more extensible, so new discount types could be added with less modification to the core pricing logic.
- Improve frontend error and loading states, providing clearer feedback when API requests fail or the application is loading data.