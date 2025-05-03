import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../pages/explorenow.css";
import panoramaImage from "../assets/images/aetahome.jpg";

const PanoramaViewer = () => {
  const panoramaRef = useRef(null);

  useEffect(() => {
    if (!panoramaRef.current) return;

    const mountNode = panoramaRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountNode.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(panoramaImage, (texture) => {
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    });

    camera.position.set(0, 0, 0);
    let isDragging = false,
      previousMouseX = 0,
      previousMouseY = 0;

    const onMouseDown = (event) => {
      isDragging = true;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    };

    const onMouseMove = (event) => {
      if (!isDragging) return;
      const deltaX = event.clientX - previousMouseX;
      const deltaY = event.clientY - previousMouseY;
      camera.rotation.y -= deltaX * 0.002;
      camera.rotation.x -= deltaY * 0.002;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountNode) mountNode.removeChild(renderer.domElement);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <section className="panorama-section">
      <div ref={panoramaRef} className="panorama-viewer"></div>
    </section>
  );
};

export default PanoramaViewer;
