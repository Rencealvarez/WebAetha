import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";
import LogoutConfirmation from "./LogoutConfirmation";

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a className="navbar-brand" href="#aeta-hero-section">
          AETHA
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {session && (
              <>
                <li className="nav-item">
                  <Link to="/local-voices" className="nav-link text-white ">
                    🧑‍🤝‍🧑 Local Voices
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-white">
                    Profile
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
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
