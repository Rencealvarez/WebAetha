import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import tryImage from "../assets/images/11.png";
import meImage from "../assets/images/me.jpg";
import engageImage from "../assets/images/engage.png";
import aetaImage from "../assets/images/Aeta.png";
import { Carousel } from "react-bootstrap";
import Navbar from "../components/Navbar";
import DidYouKnowCard from "../components/DidYouKnowCard";

const LandingPage = () => {
  useEffect(() => {
    setTimeout(() => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        window.scrollTo({
          top: heroSection.offsetTop - 70,
          behavior: "smooth",
        });
      }
    }, 100);
  }, []);

  return (
    <div>
      <Navbar />

      <section id="hero" className="hero-section">
        <div className="text-center text-white">
          <h1 className="display-4">The Aeta of Indigenous Cultures</h1>
          <p className="lead lead-white">
            Join us in celebrating the rich traditions, art, and stories of
            Indigenous peoples from around the world.
          </p>
          <a href="/login" className="btn btn-success mt-3">
            Explore Now
          </a>
        </div>
      </section>

      <section id="rights" className="rights-section text-center">
        <div className="rights-background">36</div>
        <h2>
          36 Specific Rights under Four Bundles of Rights for the Indigenous
          Cultural Communities/Indigenous People (ICCs/IPs) of the Philippines
        </h2>
        <p>
          Learn more about the rights of Indigenous Cultural Communities
          Indigenous People of the Philippines
        </p>
        <Link to="/bundles-of-rights" className="btn btn-success mt-3">
          Learn More
        </Link>
      </section>

      <section className="building-blocks-section">
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <h3>11 Building Blocks</h3>
            <p>
              of Resilient, Responsive, and Relevant ICCs/IPs in their Ancestral
              Domains
            </p>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-6">
                <img
                  src={tryImage}
                  alt="Building Block 1"
                  className="img-fluid rounded mb-3"
                  style={{ maxWidth: "500px", maxHeight: "500px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="voices-section text-center">
        <h2>Voices of Indigenous Pride</h2>
        <Carousel>
          <Carousel.Item>
            <div className="d-flex justify-content-center align-items-center">
              <div className="testimonial">
                <div className="circle">
                  <img src={meImage} alt="Placeholder" />
                </div>
                <p>
                  The cultural diversity and rich heritage of indigenous peoples
                  inspire us all. Their traditions, stories, and art connect us
                  to our roots and remind us of the profound beauty of our
                  world. I feel fortunate to be part of this vibrant community.
                </p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="d-flex justify-content-center align-items-center">
              <div className="testimonial">
                <div className="circle">
                  <img src={meImage} alt="Placeholder" />
                </div>
                <p>
                  Witnessing the resilience and strength of indigenous cultures
                  is a transformative experience. Their commitment to preserving
                  their identity and sharing their wisdom with future
                  generations is both empowering and necessary for our global
                  society.
                </p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      <section className="cultural-exchange-section">
        <div className="row">
          <div className="col-md-6">
            <img
              src={engageImage}
              alt="Cultural Exchange"
              className="img-fluid"
              style={{ width: "500px", height: "300px" }}
            />
            <h4>Engage with Indigenous Culture</h4>
            <h3>Join Cultural Exchange</h3>
            <p>
              Immerse yourself in the beauty of Indigenous cultures. Our
              platform offers a range of resources, events, and opportunities to
              connect.
            </p>
          </div>
          <div className="col-md-6">
            <div className="program d-flex align-items-center">
              <div className="text-content">
                <h5>Empowering Indigenous Communities</h5>
                <h4>Support Local Artisans</h4>
                <p>We believe in the strength of Indigenous communities.</p>
              </div>
            </div>
            <div className="program">
              <div className="text-content">
                <h5>Preserving Our Languages</h5>
                <h4>Cultural Education Programs</h4>
                <p>Language is a vital part of our cultural identity.</p>
              </div>
            </div>
            <div className="program d-flex align-items-center">
              <div className="text-content">
                <h5>Celebrate Our Heritage</h5>
                <p>
                  Join us in celebrating the diverse heritage of Indigenous
                  peoples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="accordion-section">
        <h2 className="text-center">Empowering Indigenous Voices</h2>
        <h3 className="text-center mb-4">Celebrating Cultural Heritage</h3>

        <div className="accordion" id="accordionExample">
          {[
            {
              question: "What initiatives support Indigenous cultures?",
              answer:
                "We offer various cultural initiatives to support Indigenous communities.",
            },
            {
              question: "How can I get involved?",
              answer:
                "You can get involved by participating in our events, volunteering your time, or making a donation to support our initiatives.",
            },
            {
              question: "What resources are available for education?",
              answer:
                "We offer a range of resources including online courses, workshops, and reading materials on Indigenous culture, history, and rights.",
            },
            {
              question: "Are there cultural events I can attend?",
              answer:
                "Yes! We host various cultural events throughout the year, including festivals, art exhibitions, and storytelling nights.",
            },
            {
              question: "How do you promote Indigenous artists?",
              answer:
                "We promote Indigenous artists through exhibitions, online showcases, and partnerships with galleries.",
            },
            {
              question: "What is your mission?",
              answer:
                "Our mission is to empower Indigenous communities by preserving their culture, promoting their voices, and fostering connections between Indigenous and non-Indigenous peoples.",
            },
          ].map((item, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                >
                  {item.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="learn-more-section">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h4>Who are the Aeta?</h4>
            <p style={{ textAlign: "justify" }}>
              The Aeta in Camarines Norte are an indigenous group known for
              their resilience and cultural heritage. Traditionally
              hunter-gatherers, many have adapted to modern life while
              preserving their customs. They have deep knowledge of nature,
              practicing sustainable living. Despite challenges like land
              disputes and economic struggles, they continue to uphold their
              traditions, passing them down through generations. Efforts to
              support their community include education programs and cultural
              preservation initiatives. Their rich oral history, dances, and
              artistry reflect their identity and strength. The Aeta remain an
              integral part of Philippine indigenous culture, embodying
              perseverance and wisdom.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src={aetaImage}
              alt="Learn More"
              className="img-fluid rounded"
              style={{ maxWidth: "500px", maxHeight: "500px" }}
            />
          </div>
        </div>
      </section>
      <DidYouKnowCard />
      <section id="contact" className="contact-section">
        <div className="container text-center">
          <h2>Connect with Us</h2>
          <p className="text-white">123, Dasmariñas city, Cavite</p>
          <p className="text-white">0929222145</p>
          <p className="text-white">contact@TAPDEV.org</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
