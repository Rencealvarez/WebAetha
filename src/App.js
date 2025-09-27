import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BundlesOfRights from "./pages/BundlesOfRights";
import Login from "./pages/login";
import Register from "./pages/register";
import ExploreNow from "./pages/explorenow";
import AdminLogin from "./pages/adminLogin";

import LearnMore from "./pages/LearnMore";
import PanoramicPage from "./pages/PanoramicPage";
import LocalVoices from "./pages/LocalVoices";
import UserProfile from "./pages/UserProfile";
import UpdatePasswordPage from "./pages/ForgotPasswordPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage";
import AetaMuseumExhibition from "./pages/AetaMuseumExhibition";
import QRDownloadRedirect from "./pages/qr/QRDownloadRedirect";

import AdminLayout from "./pages/admin/AdminLayout";
import Admin from "./pages/admin/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFeedback from "./pages/admin/AdminFeedback";
import NewUsers from "./pages/admin/NewUsers";
import QuizStats from "./pages/admin/QuizStats";
import AdminPendingVoices from "./pages/admin/AdminPendingVoices";
import MuseumContentManagement from "./pages/admin/MuseumContentManagement";
import PrintReports from "./pages/admin/PrintReports";

import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/bundles-of-rights" element={<BundlesOfRights />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<ExploreNow />} />
          <Route path="/qr/download" element={<QRDownloadRedirect />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/panoramic" element={<PanoramicPage />} />
          <Route path="/local-voices" element={<LocalVoices />} />
          <Route path="/aeta-museum" element={<AetaMuseumExhibition />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route
            path="/update-password/:access_token"
            element={<UpdatePasswordPage />}
          />
          <Route
            path="/request-password-reset"
            element={<RequestPasswordResetPage />}
          />

          <Route path="/admin-page" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="new-users" element={<NewUsers />} />
            <Route path="quiz-stats" element={<QuizStats />} />
            <Route path="pending-voices" element={<AdminPendingVoices />} />
            <Route path="content" element={<Admin />} />
            <Route
              path="museum-content"
              element={<MuseumContentManagement />}
            />
            <Route path="print-reports" element={<PrintReports />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
