import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BundlesOfRights from "./pages/BundlesOfRights";
import Login from "./pages/login";
import Register from "./pages/register";
import ExploreNow from "./pages/explorenow";
import AdminLogin from "./pages/adminLogin";
import Admin from "./pages/admin";
import LearnMore from "./pages/LearnMore";
import PanoramicPage from "./pages/PanoramicPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bundles-of-rights" element={<BundlesOfRights />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<ExploreNow />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/panoramic" element={<PanoramicPage />} />
      </Routes>
    </Router>
  );
};

export default App;
