import React, { useEffect } from "react";
import "../styles/LandingPage.css";
import "../styles/eleven-blocks.css";
import meImage from "../assets/images/Vilma.jpg";
import me2Image from "../assets/images/Marion.jpg";
import me3Image from "../assets/images/Jerry.jpg";
import engageImage from "../assets/images/engage.png";
import VRGIRL from "../assets/images/VR GIRL.svg";
import MN from "../assets/images/Man assembling user interface from blocks.svg";
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

      <section className="eleven-blocks-section">
        <div className="row2">
          <div className="col-md-6">
            <img src={MN} alt="Cultural Exchange" className="img-fluid" />
            <div className="content">
              <h2>11 Building Blocks</h2>
              <p>
                Resilient, Responsive, and Relevant ICCs/IPs in their Ancestral
                Domains
              </p>
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
            <h4>What is Aetha?</h4>
            <p style={{ textAlign: "justify" }}>
              This project employs virtual reality technology combined with
              high-resolution panoramic imagery to provide an immersive
              representation of the daily lives, traditions, and cultural
              heritage of the Aeta people. By leveraging the capabilities of
              emerging digital technologies, the initiative seeks to promote a
              deeper understanding and appreciation of indigenous communities,
              while preserving and showcasing the beauty and richness of their
              way of life in a modern, accessible format.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src={VRGIRL}
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
          <h2>Get in touch!</h2>
          <p className="text-white">Dasmariñas city, Cavite</p>
          <p className="text-white">09765607124</p>
          <p className="text-white">contact@tapdev.org</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
