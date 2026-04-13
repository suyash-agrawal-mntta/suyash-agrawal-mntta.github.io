"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BrainNetwork() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [color, setColor] = useState("#00ffcc");

  useEffect(() => {
    const updateColor = () => {
      // Small timeout to allow DOM to recalculate CSS variables
      setTimeout(() => {
        const styles = getComputedStyle(document.documentElement);
        let newColor = styles.getPropertyValue("--accent-primary").trim();
        if (!newColor) newColor = "#00ffcc";
        setColor(newColor);
      }, 50);
    };

    updateColor();
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Continuous slow rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      // Interactive mouse follow
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      
      meshRef.current.rotation.y += 0.05 * (targetX - meshRef.current.rotation.y);
      meshRef.current.rotation.x += 0.05 * (targetY - meshRef.current.rotation.x);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshStandardMaterial 
          color={color} 
          wireframe={true} 
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </>
  );
}
