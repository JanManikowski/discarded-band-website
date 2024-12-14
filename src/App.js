import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import SupportUs from "./pages/SupportUs";
import Products from "./pages/Products";
import Basket from "./pages/Basket";
import ProductPage from "./components/ProductPage";
import Releases from "./pages/Releases";
import { BasketProvider, BasketContext } from "./contexts/BasketContext";
import ScrollToTop from "./components/ScrollToTop";
import SetPageTitle from "./components/SetPageTitle";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { initAnalytics, trackPageView } from "./utils/analytics";

// Centralized page titles
const PAGE_TITLES = {
  "/": "Home - DISCARDED",
  "/contact": "Contact Us - DISCARDED",
  "/about-us": "About Us - DISCARDED",
  "/faq": "FAQ - DISCARDED",
  "/support-us": "Support Us - DISCARDED",
  "/products": "Products - DISCARDED",
  "/basket": "Your Basket - DISCARDED",
  "/releases": "Latest Releases - DISCARDED",
};

// Helper component to track page views
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
      trackPageView(); // This will now include hash in the path
  }, [location]);

  return null; // No UI output
};


const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <BasketProvider>
      <Router>
        <AnalyticsTracker />
        <SetPageTitle pageTitles={PAGE_TITLES} />
        <ScrollToTop />
        <BasketContext.Consumer>
          {({ basketCount }) => <NavBar basketCount={basketCount} />}
        </BasketContext.Consumer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support-us" element={<SupportUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/releases" element={<Releases />} />
        </Routes>
        <Footer />
      </Router>
    </BasketProvider>
  );
};

export default App;
