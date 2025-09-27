import React, { useState, useEffect, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "../supabase";
import "../styles/panoramicpage.css";
import "../components/Navbar.css";
import DidYouKnowCard from "../components/DidYouKnowCard";
import aethaLogo from "../assets/images/aetha_logo.svg";
import Loader from "../components/Loader";

const logQuizResult = async (imagePath, selectedOption, isCorrect, userId) => {
  const quizPayload = {
    image_path: imagePath,
    selected_option: selectedOption,
    is_correct: isCorrect,
    user_id: userId,
  };
  // Debug log
  console.log("[DEBUG] userId:", userId, "quizPayload:", quizPayload);
  const { data, error } = await supabase
    .from("quiz_logs")
    .insert([quizPayload])
    .select();

  if (error) {
    console.error("❌ Failed to log quiz result:", error.message);
  } else {
    console.log("✅ Quiz result logged:", data);
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
      {/** Keep thumbnails static: no rotation, no zoom/pan */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
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
      <Suspense fallback={<Loader label="Loading panorama" size="lg" />}>
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
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTarget, setQuizTarget] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [feedbackCounts, setFeedbackCounts] = useState({});
  const [userBadges, setUserBadges] = useState({});
  const [userId, setUserId] = useState(null);
  const [quizzes, setQuizzes] = useState({});
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from("panoramic_images")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedImages = data.map((img, index) => ({
            src: img.url,
            label: (index + 1).toString(),
            id: img.id,
          }));
          setImages(formattedImages);
        }
      } catch (error) {
        console.error("Error fetching panoramic images:", error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const { data, error } = await supabase.from("quizzes").select("*");

        if (error) throw error;

        if (data) {
          const quizMap = {};
          data.forEach((quiz) => {
            quizMap[quiz.image_id] = {
              question: quiz.question,
              options: quiz.options,
              answer: quiz.answer,
            };
          });
          setQuizzes(quizMap);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchImages();
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // Fetch user's badges
        const { data: badges } = await supabase
          .from("user_badges")
          .select("*")
          .eq("user_id", user.id);

        if (badges) {
          const badgeMap = {};
          badges.forEach((badge) => {
            badgeMap[badge.image_path] = true;
          });
          setUserBadges(badgeMap);
        }

        // Fetch user's reactions
        const { data: reactions } = await supabase
          .from("feedback_logs")
          .select("image_path, emoji, user_id")
          .eq("user_id", user.id);

        if (reactions) {
          const reactionMap = {};
          reactions.forEach((reaction) => {
            reactionMap[reaction.image_path] = reaction.emoji;
          });
          setUserReactions(reactionMap);
        }
      }
    };
    getCurrentUser();
  }, []);

  const openFullscreen = (image) => {
    setSelectedImage(image);
    setShowQuiz(false);
    setUserAnswer("");
    setShowResult(false);
  };

  const closeFullscreen = () => {
    if (selectedImage) {
      setShowQuiz(true);
      setQuizTarget(selectedImage.id);
      setSelectedImage(null);
    }
  };

  const handleAnswer = async (option) => {
    // Ensure user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to answer quizzes.");
      return;
    }

    const imageSrc = images.find((img) => img.id === quizTarget)?.src;
    if (!imageSrc) {
      console.error("No image source found for badge!");
      return;
    }

    const isCorrect = option === quizzes[quizTarget]?.answer;
    setUserAnswer(option);
    setShowResult(true);

    if (isCorrect) {
      // Add badge to database only if correct and not already awarded
      if (!userBadges[imageSrc]) {
        const badgePayload = {
          user_id: user.id,
          image_path: imageSrc,
          earned_at: new Date().toISOString(),
        };
        const { error: badgeError } = await supabase
          .from("user_badges")
          .insert([badgePayload]);
        if (!badgeError) {
          setUserBadges((prev) => ({
            ...prev,
            [imageSrc]: true,
          }));
        } else {
          console.error("❌ Failed to insert badge:", badgeError.message);
        }
      }
    }

    // Always log the quiz result
    const quizPayload = {
      image_path: imageSrc,
      selected_option: option,
      is_correct: isCorrect,
      user_id: user.id,
    };
    await logQuizResult(imageSrc, option, isCorrect, user.id);

    setTimeout(() => {
      setShowQuiz(false);
      setUserAnswer("");
      setShowResult(false);
    }, 2000);
  };

  const hasBadge = (image) => {
    return userBadges[image] || false;
  };

  const fetchFeedbackCounts = async () => {
    const { data, error } = await supabase
      .from("feedback_logs")
      .select("image_path, emoji, user_id");

    if (error) {
      console.error("❌ Error fetching reaction counts:", error.message);
      return;
    }

    const counts = {};
    data.forEach(({ image_path, emoji }) => {
      const normalized = image_path.trim().replace(/^\//, "");
      if (!counts[normalized]) counts[normalized] = {};
      if (!counts[normalized][emoji]) counts[normalized][emoji] = 0;
      counts[normalized][emoji]++;
    });

    setFeedbackCounts(counts);
  };

  const handleReaction = async (imagePath, emoji) => {
    // Ensure user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to react to images.");
      return;
    }

    const normalizedPath = imagePath.replace(/^\//, "");

    // Check if user already has a reaction
    const existingReaction = userReactions[normalizedPath];

    try {
      // Start a transaction: Remove previous reaction for this user and image
      const { error: deleteError } = await supabase
        .from("feedback_logs")
        .delete()
        .eq("user_id", user.id)
        .eq("image_path", normalizedPath);

      if (deleteError) throw deleteError;

      // If clicking the same reaction, just remove it
      if (existingReaction === emoji) {
        setUserReactions((prev) => {
          const newReactions = { ...prev };
          delete newReactions[normalizedPath];
          return newReactions;
        });
        await fetchFeedbackCounts();
        return;
      }

      // Insert new reaction
      const { error: insertError } = await supabase
        .from("feedback_logs")
        .insert([
          {
            user_id: user.id,
            image_path: normalizedPath,
            emoji: emoji,
            submitted_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      // Update local state
      setUserReactions((prev) => ({
        ...prev,
        [normalizedPath]: emoji,
      }));

      await fetchFeedbackCounts();
    } catch (error) {
      console.error("Error handling reaction:", error.message);
      alert("Failed to update reaction. Please try again.");
    }
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

  return (
    <div className="panoramic-page">
      <nav className="nav">
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
                <Link to="/explore" className="nav-link">
                  Back
                </Link>
              </li>
            </ul>
          </div>
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
                  onClick={() => openFullscreen(item)}
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
                    {["👍", "😐", "👎"].map((emoji) => {
                      const isActive = userReactions[imgKey] === emoji;
                      return (
                        <button
                          key={emoji}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReaction(item.src, emoji);
                          }}
                          className={`btn btn-sm mx-1 ${
                            isActive ? "btn-primary" : "btn-outline-secondary"
                          }`}
                          title={
                            isActive
                              ? "Click to remove reaction"
                              : "Click to react"
                          }
                        >
                          {emoji} {feedback[emoji] || 0}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedImage && (
        <FullscreenPanorama
          image={selectedImage.src}
          onClose={closeFullscreen}
        />
      )}

      {showQuiz && quizzes[quizTarget] && (
        <div className="quiz-popup text-center mt-4">
          <h5>{quizzes[quizTarget].question}</h5>
          {quizzes[quizTarget].options.map((opt, i) => (
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
              {userAnswer === quizzes[quizTarget].answer
                ? "✅ Correct! Badge unlocked!"
                : "❌ Incorrect!"}
            </p>
          )}
        </div>
      )}
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

export default PanoramicPage;
