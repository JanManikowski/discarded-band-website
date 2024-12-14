import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchProductById from "../utils/fetchProductById";
import { BasketContext } from "../contexts/BasketContext";
import { trackEvent } from "../utils/analytics"; // Adjust the path if needed


const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
            // Track the add-to-basket action
            trackEvent("add_to_basket", {
                category: "Product Interaction",
                action: "Added Product to Basket",
                label: `${product.title} - ${selectedVariant.title}`,
                value: parseFloat(selectedVariant.price.amount), // Optional: track the price as value
            });
    
            // Add product to the basket and navigate to basket page
            addToBasket(product, selectedVariant);
            navigate("/basket");
        }
    };
    

    const formatPrice = (amount, currencyCode) => {
        // Format the price using Intl.NumberFormat
        const formattedPrice = new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);
    
        // Remove the space between the symbol and the number
        return formattedPrice.replace(/\s/g, "");
    };

    const renderPrice = (variant) => {
        if (
            variant.compareAtPrice &&
            parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount)
        ) {
            return (
                <>
                    <span
                        style={{
                            textDecoration: "line-through",
                            marginRight: "10px",
                            opacity: 0.8,
                            fontSize: "1rem",
                            color:"#b61c1c"
                        }}
                    >
                        {formatPrice(
                            variant.compareAtPrice.amount,
                            variant.compareAtPrice.currencyCode
                        )}
                    </span>
                    <span style={{ color: "#b61c1c", fontWeight: "bold", fontSize: "1.8rem" }}>
                        {formatPrice(variant.price.amount, variant.price.currencyCode)}
                    </span>
                </>
            );
        } else {
            return (
                <span style={{ color: "#b61c1c", fontWeight: "bold", fontSize: "1.8rem" }}>
                    {formatPrice(variant.price.amount, variant.price.currencyCode)}
                </span>
            );
        }
    };

    const descriptionMapping = {
        Print: "Band logo",
        UNISEX: "UNISEX",
        Color: "Black",
        Material: "100% halfgekamd ringgesponnen katoen, 150 g/m²",
        Size: "Regular Fit",
        "Available sizes": "XS-4XL",
    };

    const formattedDescription = Object.entries(descriptionMapping)
        .filter(([key, value]) => value !== "") // Filter out empty values like UNISEX
        .map(([key, value], index) => (
            <li key={index}>
                <strong>{key}: </strong>
                {value}
            </li>
        ));

    if (loading) {
        return <div className="text-center text-white py-5">Loading product...</div>;
    }

    if (!product) {
        return <div className="text-center text-white py-5">Product not found.</div>;
    }

    const { title, images, variants } = product;
    const productImage = images?.edges[0]?.node?.src;

    const handleProductClick = () => {
        trackEvent("click", {
            category: "Product Interaction",
            action: "Clicked on Product",
            label: product.title + "added to basket", // Track product name
        });
    };

    return (
        <div
            className="container-fluid text-white"
            style={{
                backgroundColor: "#0A060D",
                minHeight: "100vh",
                paddingTop: "8rem",
            }}
        >
            <div className="container">
                <div className="row align-items-center py-5">
                    {/* Product Image */}
                    <div className="col-md-6 text-center">
                        <img
                            src={productImage}
                            alt={title}
                            className="img-fluid rounded shadow-lg"
                            style={{ maxHeight: "500px" }}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="col-md-6">
                        <h1
                            className="mb-3"
                            style={{
                                fontSize: "2.5rem",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            {title}
                        </h1>
                        <p className="mb-4">{selectedVariant && renderPrice(selectedVariant)}</p>

                        {/* Display formatted description */}
                        <ul style={{ fontSize: "1rem", color: "#e0e0e0", lineHeight: "1.6" }}>
                            {formattedDescription}
                        </ul>

                        {variants.edges.length > 0 && (
                            <div className="mb-3">
                                <label
                                    htmlFor="variant-select"
                                    className="form-label"
                                    style={{ fontWeight: "bold" }}
                                >
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
                                        borderRadius: 0,
                                    }}
                                >
                                    {variants.edges.map(({ node }) => (
                                        <option key={node.id} value={node.id}>
                                            {node.title} -{" "}
                                            {formatPrice(node.price.amount, node.price.currencyCode)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            className="w-100 mt-3"
                            onClick={handleAddToBasket}
                            disabled={!selectedVariant}
                            style={{
                                backgroundColor: "transparent",
                                border: "1px solid white",
                                fontWeight: "bold",
                                color: "#ff4d4d",
                                padding: "15px 20px",
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
