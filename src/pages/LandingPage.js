import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Import the CSS file
import tryImage from "../assets/images/try.jpg";
import { Carousel } from "react-bootstrap"; // Import Carousel from Bootstrap

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <header id="aeta-hero-section" className="hero-section">
        <div className="text-center text-white">
          <h1 className="display-4">The Aeta of Indigenous Cultures</h1>
          <p className="lead">
            Join us in celebrating the rich traditions, art, and stories of
            Indigenous peoples from around the world.
          </p>
          <a href="#about" className="btn btn-success mt-3">
            Explore Now
          </a>
        </div>
      </header>

      {/* Rights Section */}
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

      {/* Building Blocks Section */}
      <section className="building-blocks-section">
        <div className="row align-items-center">
          <div className="col-md-6 text-center">
            <h3>11 Building Blocks</h3>
            <p>
              of Resilient, Responsive, and Relevant ICCs/IPs in their Ancestral
              Domains
            </p>
            <a href="#learn-more" className="btn btn-success mt-3">
              Learn more
            </a>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-6">
                <img
                  src="https://placehold.co/300x300"
                  alt="Building Block 1"
                  className="img-fluid rounded mb-3"
                />
                <img
                  src="https://placehold.co/300x300"
                  alt="Building Block 2"
                  className="img-fluid rounded mb-3"
                />
              </div>
              <div className="col-6">
                <img
                  src="https://placehold.co/300x300"
                  alt="Building Block 3"
                  className="img-fluid rounded mb-3"
                />
                <img
                  src="https://placehold.co/300x300"
                  alt="Building Block 4"
                  className="img-fluid rounded mb-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voices of Indigenous Pride Section */}
      <section className="voices-section text-center">
        <h2>Voices of Indigenous Pride</h2>
        <Carousel>
          <Carousel.Item>
            <div className="d-flex justify-content-center align-items-center">
              <div className="testimonial">
                <div className="circle">
                  <img src="https://placehold.co/80x80" alt="Placeholder" />
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
                  <img src="https://placehold.co/80x80" alt="Placeholder" />
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

      {/* Cultural Exchange Section */}
      <section className="cultural-exchange-section">
        <div className="row">
          <div className="col-md-6">
            <img
              src="https://placehold.co/500x500"
              alt="Cultural Exchange"
              className="img-fluid"
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
              <img
                src="https://placehold.co/100x100"
                alt="Support Local Artisans"
                className="img-fluid"
              />
              <div className="text-content">
                <h5>Empowering Indigenous Communities</h5>
                <h4>Support Local Artisans</h4>
                <p>We believe in the strength of Indigenous communities.</p>
              </div>
            </div>
            <div className="program d-flex align-items-center">
              <img
                src="https://placehold.co/100x100"
                alt="Cultural Education Programs"
                className="img-fluid"
              />
              <div className="text-content">
                <h5>Preserving Our Languages</h5>
                <h4>Cultural Education Programs</h4>
                <p>Language is a vital part of our cultural identity.</p>
              </div>
            </div>
            <div className="program d-flex align-items-center">
              <img
                src="https://placehold.co/100x100"
                alt="Cultural Festivals"
                className="img-fluid"
              />
              <div className="text-content">
                <h5>Celebrate Our Heritage</h5>
                <h4>Cultural Festivals</h4>
                <p>
                  Join us in celebrating the diverse heritage of Indigenous
                  peoples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="accordion-section">
        <h2 className="text-center">Empowering Indigenous Voices</h2>
        <h3 className="text-center">Celebrating Cultural Heritage</h3>
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
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="true"
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

      {/* Learn More Section */}
      <section className="learn-more-section">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h4>Want to learn more about us?</h4>
            <p>Click the button below to explore and find out more.</p>
            <a href="#learn-more" className="btn btn-success mt-3">
              Learn more
            </a>
          </div>
          <div className="col-md-6">
            <img
              src="https://placehold.co/500x500"
              alt="Learn More"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container text-center">
          <h2>Connect with Us</h2>
          <p>123 Cultural Way, Heritage City, Country</p>
          <p>1-800-INDIGENOUS</p>
          <p>contact@indigenousheritage.org</p>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
