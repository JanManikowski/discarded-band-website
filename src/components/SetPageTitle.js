import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SetPageTitle = ({ pageTitles }) => {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitles[location.pathname] || "Default Title - Discarded";
    document.title = title;
  }, [location.pathname, pageTitles]);

  return null;
};

export default SetPageTitle;
