import React, { useEffect } from "react";
import aethaLogo from "../assets/images/aetha_logo.svg";
import "./Navbar.css";

const Navbar = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !hash.includes("access_token")) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

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
        <button
          className="nav-toggle"
          type="button"
          onClick={() => {
            const navMenu = document.getElementById("navMenu");
            navMenu.classList.toggle("active");
          }}
        >
          <span className="nav-toggle-icon"></span>
        </button>
        <div className="nav-menu" id="navMenu">
          <ul className="nav-list">
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
