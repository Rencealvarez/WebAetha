import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import "./App.css"; // Import the global styles

const App = () => {
  return (
    <Router>
      <>
        <Navbar /> {/* Global Navbar */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;
