import React, { useContext } from "react";
import { BasketContext } from "../contexts/BasketContext";
import handleOrder from "../utils/handleOrder";

const Basket = () => {
    const { basketItems, calculateTotal, updateQuantity, removeItem } = useContext(BasketContext);

    const handleQuantityChange = (productId, variantId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent invalid quantities
        updateQuantity(productId, variantId, newQuantity);
    };

    const handleRemoveItem = (productId, variantId) => {
        removeItem(productId, variantId);
    };

    const placeOrder = async () => {
        try {
            const checkoutUrl = await handleOrder(basketItems);
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error) {
            alert(`Error placing order: ${error.message}`);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#0A060D",
                minHeight: "100vh",
                paddingTop: "120px",
                paddingBottom: "50px",
            }}
        >
            <div
                className="container p-4"
                style={{
                    backgroundColor: "#0A060D",
                    color: "white",
                    maxWidth: "900px",
                    margin: "0 auto",
                }}
            >
                <h1 className="text-center mb-4" style={{ fontWeight: "bold", color: "#ff4d4d" }}>
                    SUBTOTAL
                </h1>
                <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#ff4d4d" }}>
                    €{calculateTotal().toFixed(2)}
                </h2>
                {basketItems.length > 0 ? (
                    <div>
                        {basketItems.map((item) => (
                            <div
                                key={`${item.id}-${item.variant.id}`}
                                className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4"
                                style={{
                                    borderBottom: "1px solid white",
                                    paddingBottom: "20px",
                                }}
                            >
                                {/* Product Image */}
                                <div className="mb-3 mb-md-0">
                                    <img
                                        src={item.variant.image.src}
                                        alt={item.variant.image.altText || item.title}
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </div>

                                {/* Product Details */}
                                <div
                                    className="text-center text-md-start flex-grow-1"
                                    style={{ marginLeft: "15px" }}
                                >
                                    <h5
                                        className="mb-2"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {item.title}
                                    </h5>
                                    <p
                                        className="mb-1"
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "#cccccc",
                                        }}
                                    >
                                        {item.variant.title}
                                    </p>
                                </div>

                                {/* Quantity and Price */}
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    {/* Quantity Input */}
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(
                                                item.id,
                                                item.variant.id,
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                        style={{
                                            width: "50px",
                                            height: "40px",
                                            border: "1px solid white",
                                            backgroundColor: "transparent",
                                            color: "white",
                                            textAlign: "center",
                                            fontSize: "1rem",
                                            borderRadius: "5px",
                                        }}
                                    />

                                    {/* Price */}
                                    <p
                                        className="mx-3"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            color: "#ff4d4d",
                                        }}
                                    >
                                        €{(item.variant.price.amount * item.quantity).toFixed(2)}
                                    </p>

                                    {/* Remove Button */}
                                    <button
                                        className="btn btn-link text-white"
                                        onClick={() => handleRemoveItem(item.id, item.variant.id)}
                                        style={{
                                            fontSize: "1.5rem",
                                            border: "none",
                                            backgroundColor: "transparent",
                                            cursor: "pointer",
                                        }}
                                        aria-label="Remove item"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Checkout Button */}
                        <button
                            className="btn w-100 mt-3"
                            onClick={placeOrder}
                            style={{
                                backgroundColor: "transparent",
                                border: "1px solid white",
                                fontWeight: "bold",
                                color: "#ff4d4d",
                                padding: "15px 20px",
                                textTransform: "uppercase",
                            }}
                        >
                            Checkout
                        </button>
                    </div>
                ) : (
                    <p className="text-center">Your basket is empty!</p>
                )}
            </div>
        </div>
    );
};

export default Basket;
