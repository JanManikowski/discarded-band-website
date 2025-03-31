import React, { useEffect, useState, useContext } from "react";
import logo from "../assets/Discarded-Clean-NoCircle-Transparent.png";
import backgroundLow from "../assets/background-low.png";
import backgroundHigh from "../assets/background-high.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import "../styles/responsive.css";
import { BasketContext } from "../contexts/BasketContext";
import fetchProducts from "../utils/fetchProducts";
import ProductCard from "../components/ProductCard";
import ReleasesCard from "../components/ReleasesCard"; // Import the ReleasesCard
import { commonTitleStyle } from "../styles/constants";
import { trackEvent } from "../utils/analytics";


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
    const featuredSection = document.getElementById("latest");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    console.log("See Latest Release button clicked!");
    trackEvent("click", {
      category: "User Interaction",
      action: "Clicked See Latest Release",
      label: "Home Page",
    });
  }}
>
  See Latest Release
</button>


      </div>

      {/* Releases Card Section */}
      <div
  id="releases-section"
  className="container-fluid d-flex justify-content-center align-items-center"
  style={{
    minHeight: "100vh",
    width: "100vw", // Ensure it spans the entire viewport width
    backgroundColor: "#0A060D",
    margin: "0", // Remove unwanted margins
    padding: "0", // Remove unwanted paddings
    overflow: "hidden", // Prevent scrollbars if there's slight overflow
    position: "relative",
    zIndex: 1,
  }}
>
  <ReleasesCard
    albumId="0acx688pBFccyiDVk4axg6"
    title="Latest Release"
    style={{
      width: "100%", // Stretch the card to the full width of its container
      minHeight: "100vh", // Full viewport height
      margin: "0",
      padding: "0",
    }}
  />
</div>


      {/* Featured Products Section */}
      <div
        id="featured-section"
        className="container-fluid featured-section"
        style={{
          backgroundColor: "#0A060D",
          padding: "20px",
          width: "100%", // Stretch the card to the full width of its container
      minHeight: "100vh", // Full viewport height
        }}
      >
        <h1 style={commonTitleStyle}>FEATURED</h1>
        <p className="text-white text-center">Only shipping in the Netherlands right now. Working on more countries.</p>
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
