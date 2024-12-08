import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import fetchProductById from "../utils/fetchProductById";
import { BasketContext } from "../contexts/BasketContext";

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
            addToBasket(product, selectedVariant);
            navigate("/basket");
        }
    };

    const formatPrice = (amount, currencyCode) => {
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // Hardcoded parsing logic
    const descriptionMapping = {
        Print: "Band logo",
        UNISEX: "",
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
                        <p
                            className="text-danger mb-4"
                            style={{
                                fontSize: "1.8rem",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            {selectedVariant
                                ? formatPrice(
                                      selectedVariant.price.amount,
                                      selectedVariant.price.currencyCode
                                  )
                                : ""}
                        </p>

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
                            className="btn btn-danger w-100 mt-3"
                            onClick={handleAddToBasket}
                            disabled={!selectedVariant}
                            style={{
                                fontSize: "1.2rem",
                                padding: "10px 20px",
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
