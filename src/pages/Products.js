import React, { useEffect, useState } from "react";
import fetchProducts from "../utils/fetchProducts";
import ProductCard from "../components/ProductCard";
import backgroundLow from "../assets/background-low.png";
import "../styles/global.css";
import "../styles/responsive.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productData = await fetchProducts();
        setProducts(productData);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    loadProducts();
  }, []);

  const handleVariantChange = (productId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const handleAddToBasket = (product, variant) => {
    console.log(`${product.title} added to the basket!`);
  };

  return (
    <div
      className="products-page"
      style={{
        backgroundImage: `url(${backgroundLow})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 className="text-center my-4" style={{ color: "white" }}>Products</h1>
      <div className="product-grid" style={{ display: 'flex', justifyContent: 'center' }}>
        {products.length > 0 ? (
          products.map(({ node: product }) => (
            <ProductCard
              key={product.id}
              product={product}
              handleVariantChange={handleVariantChange}
              handleAddToBasket={handleAddToBasket}
              selectedVariant={selectedVariants[product.id]}
            />
          ))
        ) : (
          <p className="loading-text text-center" style={{ color: "white" }}>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default Products;
