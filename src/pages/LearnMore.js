import React from "react";
import { Link } from "react-router-dom";
import "../styles/learnmore.css";
import AetaImage from "../assets/images/Aeta.png";

const LearnMore = () => {
  return (
    <div className="learnmore-page">
      <nav className="navbar navbar-expand-lg bg-dark fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1 text-white">AETHA</span>
          <Link
            to="/explore"
            className="btn btn-link text-white text-decoration-none"
          >
            Back
          </Link>
        </div>
      </nav>

      <section className="hero-section-learnmore">
        <div className="hero-text">
          <h1> AETA</h1>
          <p>THE INDIGENOUS PEOPLE OF CAMARINES NORTE</p>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">THE AETA</h2>
        <img src={AetaImage} alt="Dumagat People" className="content-image" />
        <div className="content-card">
          <p>
            The Aeta in Camarines Norte are part of the indigenous Negrito
            groups in the Philippines, known for their rich cultural heritage
            and deep connection to nature.
          </p>
        </div>

        <h2 className="section-title">FAMILY</h2>
        <div className="content-card">
          <p>
            The Aeta's lives revolve around their families. Elders are highly
            respected and serve as leaders within both the family and the
            community. They pass down survival knowledge and cultural traditions
            to the younger generation, ensuring the continuity of their
            heritage.
          </p>
        </div>

        <h2 className="section-title">THE CLOTHE</h2>
        <div className="content-card">
          <p>
            Their traditional attire is crafted from salago fiber, which is
            flattened, dried under the sun, and then transformed into garments.
            Women wear tapis, while men wear bago or ginat. but in these modern
            generation the attire of the Aeta has changed. they now wear modern
            clothes.
          </p>
        </div>

        <h2 className="section-title">THE GOVERNANCE</h2>
        <div className="content-card">
          <p>
            Leadership is rooted in respect for elders, who hold the highest
            decision-making authority. They are addressed with terms like
            "Kasakan" or "Mangomed," these signify respect and acknowledge the
            elders' wisdom, leadership, and their role as custodians of
            traditions and survival knowledge
          </p>
        </div>

        <h2 className="section-title">THE LIVELIHOOD</h2>
        <div className="content-card">
          <p>
            Gathering honey from Honey bees is their primary source of income
            selling them by the road side, supplemented by farming coconut trees
            and farming grain from "palayans". They also gather food from their
            environment such as Taro and Sweet Potatoes.
          </p>
        </div>
      </section>

      <footer className="footer-section">
        <div className="text-center">
          <h3>Connect with Us</h3>
          <p className="text-white">123, Dasmariñas city, Cavite</p>
          <p className="text-white">0929222145</p>
          <p className="text-white">contact@TAPDEV.org</p>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;
