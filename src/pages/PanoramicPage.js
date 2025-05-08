import React, { useState, useEffect, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { quizData } from "../data/quizData";
import { supabase } from "../supabase";
import "../styles/panoramicpage.css";

const logQuizResult = async (imagePath, selectedOption, isCorrect) => {
  await supabase.from("quiz_logs").insert([
    {
      image_path: imagePath,
      selected_option: selectedOption,
      is_correct: isCorrect,
    },
  ]);
};

const logFeedback = async (imagePath, emoji) => {
  const normalizedPath = imagePath.replace(/^\//, "");
  const { error } = await supabase
    .from("feedback_logs")
    .insert([{ image_path: normalizedPath, emoji: String(emoji) }]);

  if (error) {
    console.error("❌ Failed to log feedback:", error.message);
  } else {
    console.log(`✅ Feedback logged: ${emoji} for ${normalizedPath}`);
  }
};

const PanoramaViewer = ({ image }) => {
  const texture = useLoader(THREE.TextureLoader, image);
  return (
    <Canvas style={{ width: "100%", height: "300px" }}>
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
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [feedbackCounts, setFeedbackCounts] = useState({});

  const openFullscreen = (image) => {
    setSelectedImage(image);
    setShowQuiz(false);
    setUserAnswer("");
    setShowResult(false);
  };

  const closeFullscreen = () => {
    setShowQuiz(true);
    setQuizTarget(selectedImage);
    setSelectedImage(null);
  };

  const handleAnswer = async (option) => {
    const isCorrect = option === quizData[quizTarget].answer;
    setUserAnswer(option);
    setShowResult(true);

    if (isCorrect) {
      const badges = JSON.parse(localStorage.getItem("badges") || "{}");
      badges[quizTarget] = true;
      localStorage.setItem("badges", JSON.stringify(badges));
    }

    await logQuizResult(quizTarget, option, isCorrect);

    setTimeout(() => {
      setShowQuiz(false);
      setUserAnswer("");
      setShowResult(false);
    }, 2000);
  };

  const hasBadge = (image) => {
    const badges = JSON.parse(localStorage.getItem("badges") || "{}");
    return badges[image];
  };

  const fetchFeedbackCounts = async () => {
    const { data, error } = await supabase.from("feedback_logs").select("*");

    if (error) {
      console.error("❌ Error fetching feedback logs:", error.message);
      return;
    }

    console.log("✅ Raw feedback logs:", data);

    const counts = {};
    data.forEach(({ image_path, emoji }) => {
      const normalized = image_path.trim().replace(/^\//, "");
      if (!counts[normalized]) counts[normalized] = {};
      if (!counts[normalized][emoji]) counts[normalized][emoji] = 0;
      counts[normalized][emoji]++;
    });

    console.log("✅ Grouped feedbackCounts:", counts);
    setFeedbackCounts(counts);
  };

  useEffect(() => {
    fetchFeedbackCounts();
  }, []);

  useEffect(() => {
    const header = document.querySelector(".panorama-header");
    if (header) {
      setTimeout(() => header.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, []);

  const DidYouKnowCard = () => {
    const [index, setIndex] = useState(0);
    const { facts } = require("../data/didYouKnowData");

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % facts.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [facts.length]);

    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#fff",
          borderLeft: "4px solid #4CAF50",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          maxWidth: "250px",
          fontSize: "14px",
          zIndex: 999,
        }}
      >
        <h6 style={{ margin: "0 0 5px", fontWeight: "bold" }}>Did You Know?</h6>
        <p style={{ margin: 0 }}>{facts[index]}</p>
      </div>
    );
  };

  return (
    <div className="panoramic-page">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand mb-0 h1">AETHA</span>
          <Link
            to="/explore"
            className="btn btn-link text-white text-decoration-none"
          >
            Back
          </Link>
        </div>
      </nav>

      <section className="panorama-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg
            width="110"
            height="70"
            viewBox="0 0 110 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="10"
              y="35"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
              fontSize="38"
              fill="#000"
            >
              360°
            </text>
            <path
              d="M20 50 Q55 80 90 50"
              stroke="#000"
              strokeWidth="4"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="4"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#000" />
              </marker>
            </defs>
          </svg>
          <div
            style={{ fontWeight: "bold", fontSize: "18px", marginTop: "8px" }}
          >
            With our Panoramic images
          </div>
        </div>
      </section>

      <section className="panorama-gallery container">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {images.map((item, index) => {
            const imgKey = item.src.replace(/^\//, "");
            const feedback = feedbackCounts[imgKey] || {};

            return (
              <div className="col" key={index}>
                <div
                  className="panorama-card"
                  onClick={() => openFullscreen(item.src)}
                >
                  <div className="canvas-wrapper">
                    <PanoramaViewer image={item.src} />
                  </div>
                  <p className="text-center mt-2 fw-bold">
                    {item.label}{" "}
                    {hasBadge(item.src) && <span className="ms-2">🏅</span>}
                  </p>
                  <div
                    className="feedback-buttons text-center mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {["👍", "😐", "👎"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await logFeedback(item.src, emoji);
                          await fetchFeedbackCounts();
                        }}
                        className="btn btn-sm mx-1 btn-outline-secondary"
                      >
                        {emoji} {feedback[emoji] || 0}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedImage && (
        <FullscreenPanorama image={selectedImage} onClose={closeFullscreen} />
      )}

      {showQuiz && quizData[quizTarget] && (
        <div className="quiz-popup text-center mt-4">
          <h5>{quizData[quizTarget].question}</h5>
          {quizData[quizTarget].options.map((opt, i) => (
            <button
              key={i}
              className={`btn m-2 ${
                userAnswer ? "btn-outline-secondary" : "btn-outline-success"
              }`}
              onClick={() => handleAnswer(opt)}
              disabled={!!userAnswer}
            >
              {opt}
            </button>
          ))}
          {showResult && (
            <p className="fw-bold mt-2">
              {userAnswer === quizData[quizTarget].answer
                ? "✅ Correct! Badge unlocked!"
                : "❌ Incorrect!"}
            </p>
          )}
        </div>
      )}

      <DidYouKnowCard />

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
