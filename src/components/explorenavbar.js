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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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

        <div className="nav-menu">
          <ul className="nav-list">
            {session && (
              <>
                <li className="nav-item">
                  <Link to="/local-voices" className="nav-link">
                    Local Voices
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/aeta-museum" className="nav-link">
                    Aeta Museum
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => setShowLogoutConfirm(true)}
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
