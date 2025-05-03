import React from "react";
import "./explorenow.css";
import BundlesOfRightsNavbar from "../components/explorenavbar";
import exploreImage1 from "../assets/images/explore.jpg";
import vrImage from "../assets/images/vr.png";
import qrImage from "../assets/images/Qr.png";
import playerImage from "../assets/images/player.png";
import PanoramaViewer from "../components/PanoramaViewer";

const ExploreNow = () => {
  return (
    <div className="explore-container">
      <BundlesOfRightsNavbar />

      <section className="hero-section">
        <div className="hero hero-text">
          <h1>Explore the culture of Aeta in Camarines Norte</h1>
          <p className="text-white">Know more about Aeta and their culture</p>
        </div>
      </section>

      <section className="panorama-section">
        <PanoramaViewer />
        <div className="panorama-text text-center">
          <h2>360°</h2>
          <p className="text-white">Check Out with our 360 Panoramic images</p>
          <button className="btn btn-success">View More</button>
        </div>
      </section>

      <section className="livelihood-section text-center">
        <h2 className="fw-bold">The Livelihood of Aeta</h2>
        <p>In Camarines Norte</p>

        <div className="container livelihood-container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="livelihood-images">
                <img
                  src={exploreImage1}
                  alt="Livelihood 1"
                  className="img-fluid rounded"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="livelihood-text text-start">
                <h3 className="fw-bold">Explore the life of Aeta People</h3>
                <p>Learn more about them, click the button below</p>
                <button className="btn btn-success">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vr-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <img src={vrImage} alt="Aetha Logo" className="vr-logo me-3" />
              <div>
                <h3 className="fw-bold">Download our Aetha app</h3>
                <p>
                  For better experience with virtual reality features available
                  in Android
                </p>
                <img src={qrImage} alt="QR Code" className="qr-code" />
              </div>
            </div>

            <div className="col-md-6 text-end">
              <img
                src={playerImage}
                alt="VR Experience"
                className="vr-player img-fluid"
              />
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

export default ExploreNow;
