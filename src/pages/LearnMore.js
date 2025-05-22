import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/learnmore.css";
import AetaImage from "../assets/images/Aeta.png";

const LearnMore = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [readingProgress, setReadingProgress] = useState(0);

  // Track reading progress
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
      {/* Progress Bar */}
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Navigation */}
      <nav
        className="navbar navbar-expand-lg bg-dark fixed-top"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1 text-white">AETHA</span>
          <div className="d-flex align-items-center">
            <Link
              to="/explore"
              className="back-link text-white"
              aria-label="Back to explore page"
            >
              <i className="fas fa-arrow-left text-white"></i>
              Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Main Content */}
      <section className="content-section" role="main">
        <div className="container">
          {/* Table of Contents */}
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

          {/* Content Sections */}
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

          {/* Video Section */}
          <div id="video" className="video-section">
            <h2 className="section-title">
              <i className="fas fa-video"></i>
              Watch
            </h2>
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/EJ9oMVHjWVA"
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
