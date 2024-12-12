import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, handleAddToBasket }) => {
    // Format the price
    const formatPrice = (amount, currencyCode) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Determine if the price is the main price (not discounted)
    const isMainPrice = !(
        product.variants.edges[0].node.compareAtPrice &&
        parseFloat(product.variants.edges[0].node.compareAtPrice.amount) >
        parseFloat(product.variants.edges[0].node.price.amount)
    );

    return (
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center product-card">
            <Link to={`/product/${encodeURIComponent(product.id)}`} className="text-decoration-none">
                <div className="card shadow-sm border-0 text-white h-100" style={{ backgroundColor: "transparent" }}>
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
                                            textDecoration: 'line-through',
                                            marginRight: '10px',
                                            opacity: 0.8,
                                            fontSize: '0.9rem',
                                            color:"#b61c1c"
                                        }}
                                    >
                                        {formatPrice(
                                            product.variants.edges[0].node.compareAtPrice.amount,
                                            product.variants.edges[0].node.compareAtPrice.currencyCode
                                        )}
                                    </span>
                                    <span className="discounted-price" style={{ color: "#b61c1c", fontWeight: "bold" }}>
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
                                        color: "#b61c1c", // Bright red for the main price
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
