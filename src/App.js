import React, { useState, useEffect } from "react";
import Auth from "./Auth";
import MainPage from "./MainPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{isLoggedIn ? <MainPage /> : <Auth />}</div>;
}

export default App;