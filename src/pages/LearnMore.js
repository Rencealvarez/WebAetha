import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/learnmore.css";
import "../components/Navbar.css";
import AetaImage from "../assets/images/Aeta.png";
import aethaLogo from "../assets/images/aetha_logo.svg";

const LearnMore = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const sections = [
    {
      id: "about",
      title: "About the Aeta",
      icon: "info-circle",
      content: `The Aeta in Camarines Norte are part of the indigenous Negrito
        groups in the Philippines, known for their rich cultural heritage
        and deep connection to nature. Their presence in the region dates
        back thousands of years, making them one of the oldest inhabitants
        of the Philippines.`,
      image: AetaImage,

      readingTime: 1,
    },
    {
      id: "family",
      title: "Family Structure",
      icon: "users",
      content: `The Aeta's lives revolve around their families. Elders are highly
        respected and serve as leaders within both the family and the
        community. They pass down survival knowledge and cultural traditions
        to the younger generation, ensuring the continuity of their
        heritage.`,
      details: [
        "Extended family living arrangements",
        "Strong intergenerational bonds",
        "Oral tradition preservation",
        "Community-based decision making",
      ],
      readingTime: 2,
    },
    {
      id: "clothing",
      title: "Traditional Attire",
      icon: "tshirt",
      content: `Their traditional attire is crafted from salago fiber, which is
        flattened, dried under the sun, and then transformed into garments.
        Women wear tapis, while men wear bago or ginat. In modern times,
        while traditional clothing is still worn for special occasions,
        contemporary clothing has become more common in daily life.`,
      details: [
        "Salago fiber processing techniques",
        "Traditional weaving patterns",
        "Cultural significance of colors",
        "Modern adaptations",
      ],
      readingTime: 2,
    },
    {
      id: "governance",
      title: "Community Governance",
      icon: "landmark",
      content: `Leadership is rooted in respect for elders, who hold the highest
        decision-making authority. They are addressed with terms like
        "Kasakan" or "Mangomed," signifying respect and acknowledging the
        elders' wisdom, leadership, and their role as custodians of
        traditions and survival knowledge.`,
      details: [
        "Elder council system",
        "Consensus-based decision making",
        "Traditional conflict resolution",
        "Community participation",
      ],
      readingTime: 2,
    },
    {
      id: "livelihood",
      title: "Traditional Livelihood",
      icon: "seedling",
      content: `The Aeta maintain a sustainable relationship with their environment
        through various traditional practices. Their primary source of income
        comes from gathering honey from wild bees, supplemented by farming
        coconut trees and grain from "palayans." They also gather food from
        their environment such as Taro and Sweet Potatoes.`,
      details: [
        "Traditional honey gathering",
        "Sustainable farming methods",
        "Forest resource management",
        "Traditional food preservation",
      ],
      readingTime: 2,
    },
  ];

  return (
    <div className="learnmore-page">
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <nav className="nav" role="navigation" aria-label="Main navigation">
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
                <Link
                  to="/explore"
                  className="nav-link"
                  aria-label="Back to explore page"
                >
                  <i className="fas fa-arrow-left"></i>
                  Back
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="hero-section-learnmore" role="banner">
        <div className="hero-text">
          <h1>Discover the Aeta</h1>
          <p>
            Preserving the Rich Cultural Heritage of Camarines Norte's
            Indigenous People
          </p>
          <div className="hero-cta">
            <a href="#about" className="btn btn-primary">
              Learn
            </a>
            <a href="#video" className="btn btn-outline-light">
              Watch Video
            </a>
          </div>
        </div>
      </section>

      <section className="content-section" role="main">
        <div className="container">
          <div
            className="toc-container"
            role="navigation"
            aria-label="Table of contents"
          >
            <h2 className="toc-title">Quick Navigation</h2>
            <ul className="toc-list">
              {sections.map((section) => (
                <li key={section.id} className="toc-item">
                  <a href={`#${section.id}`} className="toc-link">
                    <i className={`fas fa-${section.icon}`}></i>
                    {section.title}
                    <span className="reading-time">
                      {section.readingTime} min read
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {sections.map((section) => (
            <div key={section.id} id={section.id} className="content-block">
              <h2 className="section-title">
                <i className={`fas fa-${section.icon}`}></i>
                {section.title}
              </h2>
              {section.image && (
                <div className="section-image">
                  <img src={section.image} alt={section.title} />
                </div>
              )}
              {section.stats && (
                <div className="stats-container">
                  {section.stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <div
                className="content-card"
                onClick={() => toggleSection(section.id)}
                role="button"
                tabIndex="0"
                aria-expanded={activeSection === section.id}
              >
                <p>{section.content}</p>
                {activeSection === section.id && section.details && (
                  <div className="section-details">
                    <h3>Key Aspects</h3>
                    <ul>
                      {section.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="reading-time-indicator">
                  <i className="far fa-clock"></i>
                  {section.readingTime} min read
                </div>
              </div>
            </div>
          ))}

          <div id="video" className="video-section">
            <h2 className="section-title">
              <i className="fas fa-video"></i>
              Watch
            </h2>
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/3F_n_cOIMSA"
                title="Aeta Cultural Heritage"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container text-center">
          <h2>Get in touch!</h2>
          <p className="text-white">Dasmariñas city, Cavite</p>
          <p className="text-white">09765607124</p>
          <p className="text-white">contact@tapdev.org</p>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
