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
import Gallery from "./pages/Gallery";
import Shows from "./pages/Shows";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRelease from "./pages/AdminRelease";
import AdminAbout from "./pages/AdminAbout.js";
import AdminGallery from "./pages/AdminGallery";
import AdminShows from "./pages/AdminShows";
import ProtectedRoute from "./components/ProtectedRoute";
import { BasketProvider, BasketContext } from "./contexts/BasketContext";
import { AuthProvider } from "./contexts/AuthContext";
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
  "/gallery": "Gallery - DISCARDED",
  "/shows": "Upcoming Shows - DISCARDED",
  "/admin/login": "Admin Login - DISCARDED",
  "/admin": "Admin Dashboard - DISCARDED",
  "/admin/release": "Release - Admin",
  "/admin/about": "About Us - Admin",
  "/admin/gallery": "Gallery - Admin",
  "/admin/shows": "Shows - Admin",
};

// Helper component to track page views
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(); // This will now include hash in the path
  }, [location]);

  return null; // No UI output
};

// Redirect component: .nl to .com
const DomainRedirect = () => {
  useEffect(() => {
    const currentHost = window.location.hostname;
    if (currentHost.endsWith(".nl")) {
      const newHost = currentHost.replace(".nl", ".com");
      const newUrl = window.location.href.replace(currentHost, newHost);
      window.location.href = newUrl;
    }
  }, []);
  return null;
};

// Hides the public NavBar/Footer on admin pages so the dashboard feels separate.
const SiteChrome = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && (
        <BasketContext.Consumer>
          {({ basketCount }) => <NavBar basketCount={basketCount} />}
        </BasketContext.Consumer>
      )}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <AuthProvider>
      <BasketProvider>
        <Router>
          <DomainRedirect />
          <AnalyticsTracker />
          <SetPageTitle pageTitles={PAGE_TITLES} />
          <ScrollToTop />
          <SiteChrome>
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
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/shows" element={<Shows />} />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/release" element={<ProtectedRoute><AdminRelease /></ProtectedRoute>} />
              <Route path="/admin/about" element={<ProtectedRoute><AdminAbout /></ProtectedRoute>} />
              <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
              <Route path="/admin/shows" element={<ProtectedRoute><AdminShows /></ProtectedRoute>} />
            </Routes>
          </SiteChrome>
        </Router>
      </BasketProvider>
    </AuthProvider>
  );
};

export default App;