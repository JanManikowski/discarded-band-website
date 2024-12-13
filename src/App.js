import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import SetPageTitle from "./components/SetPageTitle"; // Import the new component
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Centralized page titles
const PAGE_TITLES = {
  "/": "Home - Discarded",
  "/contact": "Contact Us - Discarded",
  "/about-us": "About Us - Discarded",
  "/faq": "FAQ - Discarded",
  "/support-us": "Support Us - Discarded",
  "/products": "Products - Discarded",
  "/basket": "Your Basket - Discarded",
  "/releases": "Latest Releases - Discarded",
};

const App = () => {
  return (
    <BasketProvider>
      <Router>
        <SetPageTitle pageTitles={PAGE_TITLES} /> {/* Add the title setter */}
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
