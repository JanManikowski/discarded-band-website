import React, { useEffect, useState, useContext } from "react";
import logo from "../assets/discarded-yellow-low.png";
import backgroundLow from "../assets/background-low.png";
import backgroundHigh from "../assets/background-high.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import "../styles/responsive.css";
import { BasketContext } from "../contexts/BasketContext";
import fetchProducts from "../utils/fetchProducts";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { addToBasket } = useContext(BasketContext);
  const [backgroundImage, setBackgroundImage] = useState(backgroundLow);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [logoStyle, setLogoStyle] = useState({
    opacity: 1,
    transform: "scale(1)",
  });

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

    const highImage = new Image();
    highImage.src = backgroundHigh;
    highImage.onload = () => setBackgroundImage(backgroundHigh);

    const handleScroll = () => {
      const headerHeight = document.querySelector(".home-header")?.offsetHeight || 1;
      const scrollTop = window.scrollY;
      const scrollFraction = Math.min(scrollTop / (headerHeight / 2), 1);

      setLogoStyle({
        opacity: 1 - scrollFraction,
        transform: `scale(${1 - scrollFraction * 0.5})`,
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleVariantChange = (productId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const handleAddToBasket = (product, variant) => {
    addToBasket(product, variant);
    setToastMessage(`${product.title} added to the basket!`);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <>
      {/* Toast Notification */}
      <div className={`toast-notification ${toastVisible ? "visible" : ""}`}>
        {toastMessage}
      </div>

      <div
        className="home-header"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img
          src={logo}
          alt="Discarded Logo"
          className="logo"
          style={{
            ...logoStyle,
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        />
        <button
          className="btn btn-outline-light mt-4"
          onClick={() => {
            const featuredSection = document.getElementById("featured-section");
            if (featuredSection) {
              featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          See Merch
        </button>
      </div>

      <div
        id="featured-section"
        className="container-fluid featured-section"
        style={{
          backgroundColor: "#0A060D", // Set the background color
          padding: "20px", // Optional: Add padding for better spacing
        }}
      >
        <h2 className="featured-title pt-5"
        style={{
          backgroundColor: "#0A060D",
        }}>Featured</h2>
        <div
          className="product-grid"
          style={{ display: "flex", justifyContent: "center" }}
        >
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
            <p className="loading-text text-white">Loading products...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
