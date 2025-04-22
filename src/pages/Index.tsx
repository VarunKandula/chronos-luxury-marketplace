import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we need to pass any URL parameters to HomePage
    const searchParams = new URLSearchParams(location.search);
    
    // If we're already on the home page, don't do anything
    if (location.pathname === "/" && !searchParams.toString()) {
      return;
    }
    
    // Otherwise, navigate to HomePage with any search parameters
    navigate("/", { 
      replace: true,
      state: { from: location.pathname }
    });
  }, [location, navigate]);

  return <HomePage />;
};

export default Index;
