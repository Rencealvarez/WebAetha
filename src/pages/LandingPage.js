import React, { useEffect } from "react";
import "../styles/LandingPage.css";
import meImage from "../assets/images/Vilma.jpg";
import me2Image from "../assets/images/Marion.jpg";
import me3Image from "../assets/images/Jerry.jpg";
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
            Sign In
          </a>
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
                  Vilma Aguita <br />
                  <span className="text-muted">
                    <i>
                      "Vilma Aguita is the Head Elder of the Aeta Village. She
                      is one of the Founding members of the Aeta Community."
                    </i>
                  </span>
                </p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="d-flex justify-content-center align-items-center">
              <div className="testimonial">
                <div className="circle">
                  <img src={me2Image} alt="Placeholder" />
                </div>
                <p>
                  Marion Portugal <br />
                  <span className="text-muted">
                    <i>
                      "Marion Portugal is one of the Males in The Aeta Community
                      he is a Strong Worker. He is also Family Oriented and is
                      not afraid of to tackle on Hard Jobs for his family."
                    </i>
                  </span>
                </p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="d-flex justify-content-center align-items-center">
              <div className="testimonial">
                <div className="circle">
                  <img src={me3Image} alt="Placeholder" />
                </div>
                <p>
                  Jerry Pomlaran <br />
                  <span className="text-muted">
                    <i>
                      "Jerry Pomlaran is also one of the Males in the Aeta
                      Community and a Hardworker as well. A kind helper and a
                      cheerful man."
                    </i>
                  </span>
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
            <h4>Discover Aeta Culture</h4>
            <h3>Experience Indigenous Heritage</h3>
            <p>
              Immerse yourself in the rich traditions of the Aeta people. Our
              platform provides authentic insights into Aeta culture,
              traditional practices, and opportunities to connect with the
              community.
            </p>
          </div>
          <div className="col-md-6">
            <div className="program d-flex align-items-center">
              <div className="text-content">
                <h5>Supporting Aeta Communities</h5>
                <h4>Traditional Crafts & Skills</h4>
                <p>
                  Discover the unique craftsmanship and traditional skills of
                  the Aeta people.
                </p>
              </div>
            </div>
            <div className="program">
              <div className="text-content">
                <h5>Preserving Aeta Heritage</h5>
                <h4>Cultural Education</h4>
                <p>
                  Learn about Aeta traditions, language, and sustainable living
                  practices.
                </p>
              </div>
            </div>
            <div className="program d-flex align-items-center">
              <div className="text-content">
                <h5>Honoring Aeta Traditions</h5>
                <p>
                  Join us in celebrating the rich cultural heritage and
                  resilience of the Aeta people.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="accordion-section">
        <h2 className="text-center">Understanding Aeta Culture</h2>
        <h3 className="text-center mb-4">Frequently Asked Questions</h3>

        <div className="accordion" id="accordionExample">
          {[
            {
              question:
                "What are the traditional practices of the Aeta people?",
              answer:
                "The Aeta people maintain traditional practices including sustainable hunting and gathering, herbal medicine, and unique cultural ceremonies that have been passed down through generations.",
            },
            {
              question: "How can I support the Aeta community?",
              answer:
                "You can support by participating in cultural events, purchasing traditional crafts, volunteering in community programs, or contributing to educational initiatives that preserve Aeta heritage.",
            },
            {
              question: "What cultural resources are available?",
              answer:
                "We provide resources about Aeta history, traditional knowledge, sustainable practices, and cultural heritage through educational materials, workshops, and community events.",
            },
            {
              question:
                "Are there opportunities to experience Aeta culture firsthand?",
              answer:
                "Yes! We organize cultural immersion programs, traditional craft workshops, storytelling sessions, and community gatherings where you can experience Aeta culture directly.",
            },
            {
              question: "How do you preserve Aeta traditions?",
              answer:
                "We work closely with Aeta elders and community leaders to document and preserve traditional knowledge, crafts, and practices through various cultural preservation programs.",
            },
            {
              question: "What is the mission of this platform?",
              answer:
                "Our mission is to preserve and promote Aeta culture, support their communities, and create meaningful connections between the Aeta people and those interested in learning about their rich heritage.",
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
