import React, { useState, Suspense, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/panoramicpage.css";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

// card
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

// Fullscreen
const FullscreenPanorama = ({ image, onClose }) => {
  const controlsRef = useRef();
  const cameraRef = useRef();
  const [vrMode, setVrMode] = useState(false);

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

  // Gyroscope
  useEffect(() => {
    if (vrMode) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    } else {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    }
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, [vrMode]);

  const handleOrientation = (event) => {
    if (cameraRef.current) {
      const { alpha, beta, gamma } = event;
      const alphaRad = THREE.MathUtils.degToRad(alpha || 0);
      const betaRad = THREE.MathUtils.degToRad(beta || 0);
      const gammaRad = THREE.MathUtils.degToRad(gamma || 0);
      cameraRef.current.rotation.set(betaRad, alphaRad, -gammaRad);
    }
  };

  return (
    <div className="fullscreen-modal">
      <button className="close-btn" onClick={onClose}>
        ✕
      </button>

      {!vrMode && (
        <div className="zoom-controls">
          <button onClick={zoomIn}>+</button>
          <button onClick={zoomOut}>-</button>
        </div>
      )}

      <div className="vr-toggle">
        <button onClick={() => setVrMode(!vrMode)}>
          {vrMode ? "Exit VR Mode" : "Enter VR Mode"}
        </button>
      </div>

      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        {vrMode ? (
          <div className="vr-split">
            <Canvas
              style={{ height: "100vh", width: "50vw" }}
              camera={{ fov: 75 }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <FullscreenSphere image={image} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
              <Environment preset="sunset" />
              <CameraUpdater ref={cameraRef} />
            </Canvas>

            <Canvas
              style={{ height: "100vh", width: "50vw" }}
              camera={{ fov: 75 }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <FullscreenSphere image={image} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
              <Environment preset="sunset" />
              <CameraUpdater ref={cameraRef} />
            </Canvas>
          </div>
        ) : (
          <Canvas
            style={{ height: "100vh", width: "100vw" }}
            camera={{ fov: 75 }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FullscreenSphere image={image} />
            <OrbitControls
              ref={controlsRef}
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              autoRotate
              autoRotateSpeed={0.5}
            />
            <Environment preset="sunset" />
            <CameraUpdater ref={cameraRef} />
          </Canvas>
        )}
      </Suspense>
    </div>
  );
};

// Helper
const FullscreenSphere = ({ image }) => {
  const texture = useLoader(THREE.TextureLoader, image);

  return (
    <mesh>
      <sphereGeometry args={[10, 64, 64]} />
      <meshStandardMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const CameraUpdater = React.forwardRef((props, ref) => {
  useFrame(({ camera }) => {
    if (ref) {
      ref.current = camera;
    }
  });
  return null;
});

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

  const openFullscreen = (image) => {
    setSelectedImage(image);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const headerSection = document.querySelector(".panorama-header");
    if (headerSection) {
      setTimeout(() => {
        headerSection.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

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

export default PanoramicPage;
