import React from "react";
import "./LandingPage.css"; // Import the CSS file

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <header id="aeta-hero-section" className="hero-section">
        <div>
          <h1 className="display-4">The Aeta of Indigenous Cultures</h1>
          <p className="lead">
            Join us in celebrating the rich traditions, art, and stories of
            indigenous peoples in province of Quezon.
          </p>
          <a href="#about" className="btn btn-success mt-3">
            Explore Now
          </a>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>Explore the life of Aeta People</h2>
        <p>
          Join us in preserving and celebrating the rich heritage of indigenous
          peoples. Your journey starts here, where tradition meets community.
        </p>
        <img
          src="https://placehold.co/1200x600"
          alt="Aeta People"
          className="img-fluid rounded shadow"
        />
      </section>

      {/* New Section */}
      <section className="new-section text-center">
        <h2>Empower Indigenous Voices</h2>
        <h3>Celebrating Indigenous Cultures</h3>
        <div className="row">
          {[
            {
              title: "Cultural Heritage",
              desc: "Explore the rich traditions and histories of Indigenous peoples.",
              link: "Discover More Heritage",
              icon: "⚡",
            },
            {
              title: "Art and Craft",
              desc: "Experience the vibrant artistry that reflects our identity.",
              link: "Explore Our Art",
              icon: "🎨",
            },
            {
              title: "Language Revitalization",
              desc: "Join us in preserving Indigenous languages for future generations.",
              link: "Learn About Languages",
              icon: "🔒",
            },
            {
              title: "Community Events",
              desc: "Participate in events that celebrate our culture and unity.",
              link: "Join Our Events",
              icon: "❤️",
            },
          ].map((item, index) => (
            <div key={index} className="col-md-3">
              <div className="card p-3">
                <div className="icon-circle">
                  <span>{item.icon}</span>
                </div>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
                <a href="#" className="text-success">
                  {item.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voices of Indigenous Pride Section */}
      <section className="voices-section text-center">
        <h2>Voices of Indigenous Pride</h2>
        <div className="row">
          {[
            "The cultural diversity and rich heritage of indigenous peoples inspire us all. Their traditions, stories, and art connect us to our roots and remind us of the profound beauty of our world. I feel fortunate to be part of this vibrant community.",
            "Witnessing the resilience and strength of indigenous cultures is a transformative experience. Their commitment to preserving their identity and sharing their wisdom with future generations is both empowering and necessary for our global society.",
          ].map((text, index) => (
            <div key={index} className="col-md-6">
              <div className="p-3">
                <div className="circle mb-3"></div>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Exchange Section */}
      <section
        id="engage-indigenous-culture"
        className="cultural-exchange-section"
      >
        <div className="row">
          <div className="col-md-6">
            <img
              src="https://placehold.co/600x400"
              alt="Cultural Exchange"
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-6">
            <h3>Engage with Indigenous Culture</h3>
            <h4>Join Cultural Exchange</h4>
            <p>
              Immerse yourself in the beauty of Indigenous cultures. Our
              platform offers a range of resources, experiences, and
              opportunities to connect with Indigenous communities.
            </p>
            <div className="row">
              {[
                {
                  title: "Support Local Artisans",
                  desc: "We believe in the strength of Indigenous communities.",
                  img: "https://placehold.co/150x100",
                },
                {
                  title: "Cultural Education Programs",
                  desc: "Language is a vital part of our cultural identity.",
                  img: "https://placehold.co/150x100",
                },
                {
                  title: "Cultural Festivals",
                  desc: "Join us in celebrating the diverse heritage of Indigenous peoples.",
                  img: "https://placehold.co/150x100",
                },
              ].map((item, index) => (
                <div key={index} className="col-md-4">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="img-fluid rounded"
                  />
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              ))}
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

      {/* Programs Section */}
      <section id="programs" className="container py-5 programs-section">
        <h2 className="programs&initiatives">Programs & Initiatives</h2>
        <div className="row text-center">
          {[
            {
              title: "Cultural Heritage",
              desc: "Explore rich traditions and histories.",
              icon: "📖",
            },
            {
              title: "Art & Craft",
              desc: "Discover vibrant indigenous artistry.",
              icon: "🎨",
            },
            {
              title: "Language Revitalization",
              desc: "Preserve indigenous languages.",
              icon: "🗣",
            },
            {
              title: "Community Events",
              desc: "Celebrate culture and unity.",
              icon: "🎉",
            },
          ].map((program, index) => (
            <div key={index} className="col-md-3">
              <div className="card p-3">
                <span className="display-4">{program.icon}</span>
                <h5 className="mt-3">{program.title}</h5>
                <p>{program.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
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
