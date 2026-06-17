import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
  const meshRef = useRef(null);
  const { viewport } = useThree();
  
  // Smooth mouse tracking
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position from -1 to 1
      targetRotation.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetRotation.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Auto rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      
      // Mouse interaction (smoothly interpolate to target)
      meshRef.current.rotation.x += (targetRotation.current.y * 0.5 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotation.current.x * 0.5 - meshRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={viewport.width / 6}>
        <torusKnotGeometry args={[1, 0.35, 128, 32]} />
        <MeshTransmissionMaterial 
          backside
          backsideThickness={1}
          thickness={0.5}
          chromaticAberration={0.05}
          anisotropy={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={2}
          resolution={1024}
          color="#00f7ff"
        />
      </mesh>
    </Float>
  );
}

export default function WebGLBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.6,
      mixBlendMode: 'screen'
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#00f7ff" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#e1306c" />
        <Scene />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
