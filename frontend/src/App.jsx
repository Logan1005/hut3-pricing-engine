import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [products, setProducts] = useState([]);
    'Tell Frontend which cart to use'
    const [cartId, setCartId] = useState(null);
    'Tell Frontend what is in the cart'
    const [cart, setCart] = useState(null);
    'Tell Frontend what the pricing is for the cart'
    const [pricing, setPricing] = useState(null);
    'Tell Frontend what the coupon code is for the cart (will be provided by the user)'
    const [couponCode, setCouponCode] = useState("");

    'This useEffect gets the list of products from the backend API when the page loads and updates the products state.'
    useEffect(() => {
        fetch("/products")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            });
    }, []);


    async function addToCart(productId) {
    let currentCartId = cartId;

    if (!currentCartId) {
        const cartResponse = await fetch("/carts", {
            method: "POST"
        });

        const cart = await cartResponse.json();

        currentCartId = cart.id;
        setCartId(currentCartId);
    }

    await fetch(`/carts/${currentCartId}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: productId,
            quantity: 1
        })
    });

    await loadCart(currentCartId);
    await loadPrice(currentCartId);
}

'Function to load the cart from the backend API and update the cart state.'
async function loadCart(id) {
    const response = await fetch(`/carts/${id}`);

    const data = await response.json();

    setCart(data);
}

'Function to load the pricing for the cart from the backend API and update the pricing state.'
async function loadPrice(id, couponCode = "") {
    const response = await fetch(`/carts/${id}/price`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            couponCode: couponCode
        })
    });

    const data = await response.json();

    setPricing(data);
}

'Function to apply a coupon code to the cart by calling the loadPrice function with the current cartId and couponCode.'
async function applyCoupon() {
    if (!cartId) {
        return;
    }

    await loadPrice(cartId, couponCode);
}

'Function to remove an item from the cart by sending a DELETE request to the backend API and then reloading the cart.'
async function removeFromCart(itemId) {
    await fetch(`/carts/${cartId}/items/${itemId}`, {
        method: "DELETE"
    });

    await loadCart(cartId);
    await loadPrice(cartId);
}

'Function to update the quantity of an item in the cart by sending a PATCH request to the backend API and then reloading the cart.'
async function updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
        return;
    }

    await fetch(`/carts/${cartId}/items/${itemId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quantity: quantity
        })
    });

    await loadCart(cartId);
    await loadPrice(cartId);
}


    return (
    <div className="app">

        <header className="header">
            <h1>Hut 3 Pricing Engine</h1>
            <p>Simple cart pricing and discount engine</p>
        </header>

        <section className="section">
            <h2>Products</h2>

            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <h3>{product.product_name}</h3>

                        <p className="product-price">
                            £{(product.price_pence / 100).toFixed(2)}
                        </p>

                        <button
                            className="primary-button"
                            onClick={() => addToCart(product.id)}
                        >
                            Add to cart
                        </button>
                    </div>
                ))}
            </div>

        </section>

        <section className="section">
            <h2>Your Cart</h2>

            {!cart || cart.items.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <div className="cart">
                    {cart.items.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <div className="cart-item-details">
                                <h3>{item.product_name}</h3>

                                <p>
                                    £{(item.price_pence / 100).toFixed(2)} each
                                </p>
                            </div>

                            <div className="cart-actions">
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-button"
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                        disabled={item.quantity === 1}
                                    >
                                        -
                                    </button>

                                    <span className="quantity">
                                        {item.quantity}
                                    </span>

                                    <button
                                        className="quantity-button"
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="remove-button"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>


        <section className="section">
            <h2>Coupon</h2>

            <div className="coupon">
                <div className="coupon-form">
                    <input
                        className="coupon-input"
                        type="text"
                        value={couponCode}
                        onChange={(event) => setCouponCode(event.target.value)}
                        placeholder="Enter coupon code"
                    />

                    <button
                        className="primary-button"
                        onClick={applyCoupon}
                    >
                        Apply Coupon
                    </button>
                </div>

                {pricing &&
                    pricing.coupon &&
                    !pricing.coupon.valid && (
                        <p className="coupon-error">
                            {pricing.coupon.message}
                        </p>
                    )}
            </div>
        </section>


        <section className="section">
            <h2>Price</h2>

            {pricing && (
                <div className="price-summary">
                    <div className="price-row">
                        <span>Subtotal</span>

                        <span>
                            £{(pricing.subtotalPence / 100).toFixed(2)}
                        </span>
                    </div>

                    {pricing.discounts.length === 0 ? (
                        <p>No discounts applied.</p>
                    ) : (
                        <div>
                            {pricing.discounts.map((discount, index) => (
                                <div
                                    className="price-row discount"
                                    key={index}
                                >
                                    <span>{discount.name}</span>

                                    <span>
                                        -£
                                        {(discount.amountPence / 100).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="total-row">
                        <span>Total</span>

                        <span>
                            £{(pricing.totalPence / 100).toFixed(2)}
                        </span>
                    </div>
                </div>
            )}
        </section>
        
    </div>
);
}

export default App;