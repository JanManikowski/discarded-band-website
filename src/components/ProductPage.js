import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchProductById from "../utils/fetchProductById";
import { useContext } from "react";
import { BasketContext } from "../contexts/BasketContext";
import backgroundLow from "../assets/background-low.png"; // Import background

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const { addToBasket } = useContext(BasketContext);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const productData = await fetchProductById(decodeURIComponent(id));
                setProduct(productData);
                if (productData.variants.edges.length > 0) {
                    setSelectedVariant(productData.variants.edges[0].node);
                }
            } catch (error) {
                console.error("Failed to load product:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleVariantChange = (variantId) => {
        const variant = product.variants.edges.find(
            ({ node }) => node.id === variantId
        )?.node;
        setSelectedVariant(variant);
    };

    const handleAddToBasket = () => {
        if (selectedVariant) {
            addToBasket(product, selectedVariant);
            alert(`${product.title} (${selectedVariant.title}) has been added to your basket.`);
        }
    };

    if (loading) {
        return <div className="text-center">Loading product...</div>;
    }

    if (!product) {
        return <div className="text-center">Product not found.</div>;
    }

    const { title, description, images, variants } = product;
    const productImage = images?.edges[0]?.node?.src;

    return (
        <div
            className="container-fluid py-5"
            style={{
                backgroundImage: `url(${backgroundLow})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                paddingTop: "8rem", // Increased padding
            }}
        >
            <div className="container text-center pt-5">
                {/* Product Title */}
                <h1 className="mb-3" style={{ fontSize: "2.5rem", fontWeight: "bold", textTransform: "uppercase" }}>
                    {title}
                </h1>

                {/* Product Price */}
                <p className="mb-4" style={{ fontSize: "1.5rem", color: "#ff4d4d", textTransform: "uppercase" }}>
                    {selectedVariant ? `${selectedVariant.price.amount} ${selectedVariant.price.currencyCode}` : ""}
                </p>

                <div className="row justify-content-center align-items-center">
                    {/* Product Image */}
                    <div className="col-12 col-md-6 mb-4 mb-md-0">
                        <img
                            src={productImage}
                            alt={title}
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: "450px" }}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="col-12 col-md-6 text-start">
                        <p style={{ fontSize: "1rem", color: "#e0e0e0", lineHeight: "1.6" }}>
                            {description}
                        </p>

                        {/* Variant Selector */}
                        {variants.edges.length > 0 && (
                            <div className="mb-3">
                                <label htmlFor="variant-select" className="form-label" style={{ fontWeight: "bold" }}>
                                    Select Size:
                                </label>
                                <select
                                    id="variant-select"
                                    className="form-select"
                                    value={selectedVariant?.id || ""}
                                    onChange={(e) => handleVariantChange(e.target.value)}
                                    style={{
                                        backgroundColor: "#212529",
                                        color: "white",
                                        border: "1px solid #ced4da",
                                    }}
                                >
                                    {variants.edges.map(({ node }) => (
                                        <option key={node.id} value={node.id}>
                                            {node.title} - {node.price.amount} {node.price.currencyCode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Add to Basket Button */}
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={handleAddToBasket}
                            disabled={!selectedVariant}
                            style={{
                                fontSize: "1.2rem",
                                padding: "10px 20px",
                                backgroundColor: "#ff4d4d",
                                border: "none",
                                borderRadius: "5px",
                                textTransform: "uppercase",
                            }}
                        >
                            Add to Basket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
