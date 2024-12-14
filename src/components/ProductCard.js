import React from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../utils/analytics"; // Import your analytics tracking function

const ProductCard = ({ product, handleAddToBasket }) => {
    // Format the price
    const formatPrice = (amount, currencyCode) => {
        const formattedPrice = new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);

        // Remove the space between the symbol and the number
        return formattedPrice.replace(/\s/g, "");
    };

    // Determine if the price is the main price (not discounted)
    const isMainPrice = !(
        product.variants.edges[0].node.compareAtPrice &&
        parseFloat(product.variants.edges[0].node.compareAtPrice.amount) >
        parseFloat(product.variants.edges[0].node.price.amount)
    );

    // Function to handle product click
    const handleProductClick = () => {
        trackEvent("click", {
            category: "Product Interaction",
            action: "Clicked on Product",
            label: product.title, // Track product name
        });
    };

    return (
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center product-card">
            {/* Add onClick to track clicks */}
            <Link
                to={`/product/${encodeURIComponent(product.id)}`}
                className="text-decoration-none"
                onClick={handleProductClick} // Track clicks here
            >
                <div
                    className="card shadow-sm border-0 text-white h-100"
                    style={{ backgroundColor: "transparent" }}
                >
                    <img
                        src={product.variants.edges[0].node.image.src}
                        alt={product.title}
                        className="card-img-top product-image"
                    />
                    <div className="card-body d-flex flex-column align-items-center">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">
                            {product.variants.edges[0].node.compareAtPrice &&
                            parseFloat(product.variants.edges[0].node.compareAtPrice.amount) >
                            parseFloat(product.variants.edges[0].node.price.amount) ? (
                                <>
                                    <span
                                        style={{
                                            textDecoration: "line-through",
                                            marginRight: "10px",
                                            opacity: 0.8,
                                            fontSize: "0.9rem",
                                            color: "#b61c1c",
                                        }}
                                    >
                                        {formatPrice(
                                            product.variants.edges[0].node.compareAtPrice.amount,
                                            product.variants.edges[0].node.compareAtPrice.currencyCode
                                        )}
                                    </span>
                                    <span
                                        className="discounted-price"
                                        style={{ color: "#b61c1c", fontWeight: "bold" }}
                                    >
                                        {formatPrice(
                                            product.variants.edges[0].node.price.amount,
                                            product.variants.edges[0].node.price.currencyCode
                                        )}
                                    </span>
                                </>
                            ) : (
                                <span
                                    className="main-price"
                                    style={{
                                        color: "#b61c1c",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {formatPrice(
                                        product.variants.edges[0].node.price.amount,
                                        product.variants.edges[0].node.price.currencyCode
                                    )}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
