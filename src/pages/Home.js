import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_centered.png";
import backgroundLow from "../assets/background-low.png";
import backgroundHigh from "../assets/background-high.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import "../styles/responsive.css";
import { BasketContext } from "../contexts/BasketContext";
import fetchProducts from "../utils/fetchProducts";
import ProductCard from "../components/ProductCard";
import ReleasesCard from "../components/ReleasesCard"; // Import the ReleasesCard
import ShowCard from "../components/ShowCard";
import { commonTitleStyle } from "../styles/constants";
import { trackEvent } from "../utils/analytics";
import useSiteContent from "../hooks/useSiteContent";
import useUpcomingShows from "../hooks/useUpcomingShows";
import { buildSpotifyEmbedUrl } from "../utils/spotify";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { addToBasket } = useContext(BasketContext);
  const [backgroundImage, setBackgroundImage] = useState(backgroundLow);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // The logo fade is driven by writing styles straight to the DOM node via
  // this ref. Using React state here meant every scroll event re-rendered
  // the whole Home page (including the Spotify card and show list), which
  // caused bad stutter on mobile during fast scrolling.
  const logoRef = useRef(null);

  // Fallback keeps today's release showing if Firestore is unreachable
  // or the admin hasn't saved anything yet.
  const { data: releaseContent } = useSiteContent("releases", {
    spotifyType: "album",
    spotifyId: "0ANUjzcDPHW7odAObHKKJy",
  });
  const embedUrl = buildSpotifyEmbedUrl({
    type: releaseContent.spotifyType,
    id: releaseContent.spotifyId,
  });

  // Next 3 upcoming shows for the Home page teaser.
  const { shows: upcomingShows, loading: showsLoading } = useUpcomingShows(3);

  useEffect(() => {
    let rafId = null;

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
      // Coalesce multiple scroll events into one write per animation frame.
      // Fast flick-scrolling on mobile can fire scroll far more often than
      // the screen actually repaints, so without this we do a pile of
      // redundant work and drop frames.
      if (rafId !== null) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = null;

        const viewportHeight = window.innerHeight || 1;
        const scrollTop = window.scrollY;
        const scrollFraction = Math.min(scrollTop / (viewportHeight / 2), 1);

        const node = logoRef.current;
        if (!node) return;

        // Write directly to the node instead of going through React state.
        node.style.opacity = String(1 - scrollFraction);
        node.style.transform = `scale(${1 - scrollFraction * 0.5}) translateZ(0)`;
      });
    };

    // passive: true tells the browser we'll never call preventDefault, so it
    // can keep scrolling smoothly instead of waiting on our handler.
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
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
        style={{
          backgroundImage: `url(${backgroundImage})`,
          // Solid dark fill behind the image. If the browser briefly drops
          // the decoded bitmap during a fast scroll, this shows through
          // instead of a black bar.
          backgroundColor: "#0A060D",
          // Promote to its own compositor layer so fast scrolling composites
          // the existing layer rather than repainting the large image.
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="home-header-content">
          <img
            ref={logoRef}
            src={logo}
            alt="Discarded Logo"
            className="logo"
            style={{
              opacity: 1,
              transform: "scale(1) translateZ(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              backfaceVisibility: "hidden",
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
    embedUrl={embedUrl}
    title="Latest Release"
    style={{
      width: "100%", // Stretch the card to the full width of its container
      minHeight: "100vh", // Full viewport height
      margin: "0",
      padding: "0",
    }}
  />
</div>

      {/* Upcoming Shows Teaser Section */}
      {!showsLoading && upcomingShows.length > 0 && (
        <div
          className="container-fluid text-white"
          style={{ backgroundColor: "#0A060D", padding: "60px 20px" }}
        >
          <div className="container text-center" style={{ maxWidth: "800px" }}>
            <h1 style={commonTitleStyle}>UPCOMING SHOWS</h1>
            <div className="d-flex flex-column gap-3 text-start mt-4">
              {upcomingShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
            <Link
              to="/shows"
              className="btn btn-outline-light mt-4"
              style={{ textTransform: "uppercase" }}
            >
              See All Shows
            </Link>
          </div>
        </div>
      )}


      {/* Featured Products Section */}
      {/* <div
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
      </div> */}
    </>
  );
};

export default Home;