import React from "react";
import { useNavigate } from "react-router-dom";
import aethaLogo from "../assets/images/aetha_logo.svg";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo">
          <img
            src={aethaLogo}
            alt="Aetha"
            width="50"
            height="50"
            className="nav-logo-img"
          />
        </div>

        <div className="nav-menu" id="navMenu">
          <ul className="nav-list">
            <li className="nav-item">
              <button
                className="nav-link back-button"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
