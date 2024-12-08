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
                            {formatPrice(
                                product.variants.edges[0].node.price.amount,
                                product.variants.edges[0].node.price.currencyCode
                            )}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
