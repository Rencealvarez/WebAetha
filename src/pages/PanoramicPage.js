import React, { useState, Suspense, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/panoramicpage.css";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { quizData } from "../data/quizData";
import * as THREE from "three";

// Card viewer
const PanoramaViewer = ({ image }) => {
  const texture = useLoader(THREE.TextureLoader, image);
  return (
    <Canvas style={{ height: "300px" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <OrbitControls enableZoom={false} autoRotate />
      <Environment preset="sunset" />
    </Canvas>
  );
};

// Fullscreen 360° view
const FullscreenPanorama = ({ image, onClose }) => {
  const controlsRef = useRef();

  const zoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.object.fov -= 5;
      controlsRef.current.object.updateProjectionMatrix();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.object.fov += 5;
      controlsRef.current.object.updateProjectionMatrix();
    }
  };

  return (
    <div className="fullscreen-modal">
      <button className="close-btn" onClick={onClose}>
        ✕
      </button>
      <div className="zoom-controls">
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <Canvas
          style={{ height: "100vh", width: "100vw" }}
          camera={{ fov: 75 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <mesh>
            <sphereGeometry args={[10, 64, 64]} />
            <meshStandardMaterial
              map={useLoader(THREE.TextureLoader, image)}
              side={THREE.BackSide}
            />
          </mesh>
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
          />
          <Environment preset="sunset" />
        </Canvas>
      </Suspense>
    </div>
  );
};

const PanoramicPage = () => {
  const images = [
    { src: "/3601.jpg", label: "1" },
    { src: "/3602.jpg", label: "2" },
    { src: "/3603.jpg", label: "3" },
    { src: "/3604.jpg", label: "4" },
    { src: "/3605.jpg", label: "5" },
    { src: "/3606.jpg", label: "6" },
    { src: "/3607.jpg", label: "7" },
    { src: "/3608.jpg", label: "8" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTarget, setQuizTarget] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const openFullscreen = (image) => {
    setSelectedImage(image);
    setShowQuiz(false);
    setQuizAnswered(false);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
    setQuizTarget(selectedImage);
    setShowQuiz(true);
  };

  const handleAnswer = (selectedOption) => {
    const correct = selectedOption === quizData[quizTarget].answer;
    alert(
      correct
        ? "✅ Correct!"
        : `❌ Incorrect. Correct is ${quizData[quizTarget].answer}`
    );
    setQuizAnswered(true);
    setShowQuiz(false);
  };

  useEffect(() => {
    const header = document.querySelector(".panorama-header");
    if (header) {
      setTimeout(() => {
        header.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  return (
    <div className="panoramic-page">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1">AETHA</span>
          <Link
            to={quizAnswered ? "/explore" : "#"}
            className={`btn btn-link text-white text-decoration-none ${
              !quizAnswered ? "disabled" : ""
            }`}
          >
            Back
          </Link>
        </div>
      </nav>

      <section className="panorama-header">
        <h1>360°</h1>
        <p>With our Panoramic Images</p>
      </section>

      <section className="panorama-gallery container">
        <div className="row">
          {images.map((item, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div
                className="panorama-card"
                onClick={() => openFullscreen(item.src)}
                style={{ cursor: "pointer" }}
              >
                <PanoramaViewer image={item.src} />
                <p className="text-center mt-2 fw-bold">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <FullscreenPanorama image={selectedImage} onClose={closeFullscreen} />
      )}

      {showQuiz && quizTarget && quizData[quizTarget] && (
        <div className="quiz-popup text-center">
          <h5>{quizData[quizTarget].question}</h5>
          {quizData[quizTarget].options.map((opt, i) => (
            <button
              key={i}
              className="btn btn-outline-primary m-2"
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <footer className="footer-section">
        <div className="text-center">
          <h3>Connect with Us</h3>
          <p className="text-white">123, Dasmariñas City, Cavite</p>
          <p className="text-white">0929222145</p>
          <p className="text-white">contact@TAPDEV.org</p>
        </div>
      </footer>
    </div>
  );
};

export default PanoramicPage;
