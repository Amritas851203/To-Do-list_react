import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, Sphere, Torus, Octahedron, Sparkles, Float as FloatDrei } from '@react-three/drei';
import * as THREE from 'three';

const AbstractShapes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle mouse follow effect
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (mouse.x * Math.PI) / 10, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -(mouse.y * Math.PI) / 10, 0.1);
      
      // Continuous slow rotation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Sparkles count={100} scale={15} size={2} speed={0.5} opacity={0.2} color="#ffffff" />
      
      {/* Floating Octahedrons */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[6, 2, -3]}>
        <Octahedron args={[1.5, 0]}>
          <MeshDistortMaterial color="#6366f1" envMapIntensity={1} clearcoat={1} metalness={0.9} roughness={0.1} distort={0.3} speed={2} />
        </Octahedron>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2.5} position={[-6, 4, -4]}>
        <Octahedron args={[1.2, 0]}>
          <MeshDistortMaterial color="#a855f7" envMapIntensity={1} clearcoat={1} metalness={0.8} roughness={0.2} distort={0.5} speed={3} />
        </Octahedron>
      </Float>

      {/* Floating Spheres */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={[-7, -3, -3]}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial color="#ec4899" envMapIntensity={1} clearcoat={1} metalness={0.9} roughness={0.1} distort={0.6} speed={4} />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[7, -4, -2]}>
        <Sphere args={[0.8, 64, 64]}>
          <MeshDistortMaterial color="#f59e0b" envMapIntensity={1} clearcoat={1} metalness={0.8} roughness={0.2} distort={0.4} speed={2} />
        </Sphere>
      </Float>

      {/* Large Background Torus Rings */}
      <Torus args={[10, 0.02, 16, 100]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#6366f1" metalness={1} roughness={0.1} transparent opacity={0.1} />
      </Torus>

      <Torus args={[12, 0.01, 16, 100]} rotation={[-Math.PI / 3, 0, 0]}>
        <meshStandardMaterial color="#a855f7" metalness={1} roughness={0.1} transparent opacity={0.05} />
      </Torus>
    </group>
  );
};

export const Floating3DElement: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-80">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
        <AbstractShapes />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};
