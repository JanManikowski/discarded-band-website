import React, { useEffect, useState } from "react";
import fetchProducts from "../utils/fetchProducts";
import ProductCard from "../components/ProductCard";
import { commonTitleStyle } from "../styles/constants";
import "../styles/global.css";
import "../styles/responsive.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productData = await fetchProducts();
        console.log(productData);
        setProducts(productData);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div
      className="products-page"
      style={{
        backgroundColor: "#0A060D",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={commonTitleStyle}>PRODUCTS</h1>
      <p className="text-white text-center">Only shipping in the Netherlands right now. Working on more countries.</p>
      <div className="product-grid" style={{ display: 'flex', justifyContent: 'center' }}>
        {products.length > 0 ? (
          products.map(({ node: product }) => (
            <ProductCard
              key={product.id}
              product={product}
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
