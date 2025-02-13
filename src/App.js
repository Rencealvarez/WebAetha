import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BundlesOfRights from "./pages/BundlesOfRights";
import Navbar from "./components/Navbar";
import "./App.css"; // Import the global styles

const App = () => {
  return (
    <Router>
      <>
        <Navbar /> {/* Global Navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/bundles-of-rights" element={<BundlesOfRights />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;
