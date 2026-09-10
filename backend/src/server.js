'This file checks if the database is connected and if the tables exist.'
const express = require("express");

const app = express();
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const PORT = 3000;

app.use(express.json());

'These are the routes for the endpoints of the API.'
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

app.get("/", (req, res) => {
  res.send("Pricing engine API is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
