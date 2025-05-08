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
import LocalVoices from "./pages/LocalVoices";
import UserProfile from "./pages/UserProfile";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFeedback from "./pages/admin/AdminFeedback";
import NewUsers from "./pages/admin/NewUsers";
import QuizStats from "./pages/admin/QuizStats";
import AdminPendingVoices from "./pages/admin/AdminPendingVoices";

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
        <Route path="/local-voices" element={<LocalVoices />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* ✅ Nested Admin Routes */}
        <Route path="/admin-page" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="new-users" element={<NewUsers />} />
          <Route path="quiz-stats" element={<QuizStats />} />
          <Route path="pending-voices" element={<AdminPendingVoices />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
