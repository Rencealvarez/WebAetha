import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";
import LogoutConfirmation from "./LogoutConfirmation";
import aethaLogo from "../assets/images/aetha_logo.svg";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".nav-container")) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav-container has-burger-menu">
        <div className="nav-logo">
          <img
            src={aethaLogo}
            alt="Aetha"
            width="50"
            height="50"
            className="nav-logo-img"
          />
        </div>

        {/* Burger Menu Button */}
        <button
          className={`nav-toggle ${isMenuOpen ? "nav-toggle-open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="nav-toggle-line"></span>
          <span className="nav-toggle-line"></span>
          <span className="nav-toggle-line"></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? "nav-menu-open" : ""}`}>
          <ul className="nav-list">
            {session && (
              <>
                <li className="nav-item">
                  <Link
                    to="/local-voices"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Local Voices
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/aeta-museum"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Aeta Museum
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link" onClick={closeMenu}>
                    Profile
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => {
                  setShowLogoutConfirm(true);
                  closeMenu();
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <LogoutConfirmation
        show={showLogoutConfirm}
        onHide={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
