// src/utils/analytics.js
import ReactGA from "react-ga4";

export const initAnalytics = () => {
    ReactGA.initialize("G-MK083GE8GP"); // Replace with your Measurement ID
};

export const trackPageView = (pagePath) => {
    ReactGA.send({ hitType: "pageview", page: pagePath });
};

export const trackEvent = (eventName, params) => {
    ReactGA.event(eventName, params);
};
