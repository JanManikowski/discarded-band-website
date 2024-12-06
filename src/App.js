// App.js
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
import ProductPage from "./components/ProductPage"; // Import ProductPage
import { BasketProvider, BasketContext } from "./contexts/BasketContext";

const App = () => {
  return (
    <BasketProvider>
      <Router>
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
        </Routes>
        <Footer />
      </Router>
    </BasketProvider>
  );
};

export default App;
