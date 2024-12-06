import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, handleAddToBasket }) => {
    return (
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center product-card">
            <Link to={`/product/${encodeURIComponent(product.id)}`} className="text-decoration-none">
                <div className="card shadow-sm bg-dark text-white h-100">
                    <img
                        src={product.variants.edges[0].node.image.src}
                        alt={product.title}
                        className="card-img-top product-image"
                    />
                    <div className="card-body d-flex flex-column align-items-center">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text text-warning">
                            {product.variants.edges[0].node.price.amount}{" "}
                            {product.variants.edges[0].node.price.currencyCode}
                        </p>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={(e) => {
                                e.preventDefault(); // Prevent link navigation
                                handleAddToBasket(product, product.variants.edges[0].node);
                            }}
                        >
                            Add to Basket
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
