import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SceneContent() {
  const groupRef = useRef();
  const tubeRef = useRef();
  const innerRef = useRef();
  const centerRef = useRef();
  const shapesRef = useRef([]);
  const particleRef = useRef();

  const tubeGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, a = t * Math.PI * 6;
      pts.push(new THREE.Vector3(
        Math.sin(a) * (1.2 + Math.sin(t * Math.PI * 2) * 0.4),
        Math.cos(t * Math.PI * 2) * 1.8,
        Math.cos(a) * (1.2 + Math.sin(t * Math.PI * 2) * 0.4)
      ));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.25, 8, false);
  }, []);

  const innerGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30, a = t * Math.PI * 4, r = 0.8 + Math.sin(t * Math.PI * 3) * 0.3;
      pts.push(new THREE.Vector3(Math.sin(a) * r, Math.cos(t * Math.PI * 3) * 1.2, Math.cos(a) * r));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.15, 6, false);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 150 : 600;

  const particlePos = useMemo(() => {
    const pos = [];
    for (let i = 0; i < particleCount; i++) {
      const r = 6 * Math.pow(Math.random(), 1.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos.push(r * Math.sin(phi) * Math.cos(theta));
      pos.push(r * Math.cos(phi));
      pos.push(r * Math.sin(phi) * Math.sin(theta));
    }
    return new Float32Array(pos);
  }, [particleCount]);

  const shapesConfig = useMemo(() => {
    if (isMobile) return [];
    return [
      { pos: [2.8, 0, 0], color: '#3A86FF', geo: new THREE.BoxGeometry(0.3, 0.3, 0.3) },
      { pos: [0, 1.5, 2.8], color: '#00FF00', geo: new THREE.OctahedronGeometry(0.25) },
      { pos: [-2.4, 0, 1.5], color: '#FF6B00', geo: new THREE.TorusGeometry(0.2, 0.08, 8, 12) },
      { pos: [0, -1, 3.2], color: '#FF006E', geo: new THREE.TetrahedronGeometry(0.3) },
      { pos: [1.8, 0.8, -2], color: '#FFD700', geo: new THREE.BoxGeometry(0.2, 0.2, 0.4) },
    ];
  }, [isMobile]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
    if (tubeRef.current) tubeRef.current.rotation.x += delta * 0.5;
    if (innerRef.current) innerRef.current.rotation.z += delta * 0.7;
    if (centerRef.current) centerRef.current.rotation.y += delta * 0.3;
    if (particleRef.current) particleRef.current.rotation.y += delta * 0.02;
    shapesRef.current.forEach((ref, i) => {
      if (ref) { ref.rotation.x += delta * 0.5; ref.rotation.y += delta * 0.8; }
    });
  });

  return (
    <group ref={groupRef}>
      <mesh ref={tubeRef} geometry={tubeGeo} castShadow>
        <meshStandardMaterial color="#FF006E" roughness={0.3} metalness={0.1} emissive="#FF006E" emissiveIntensity={0.05} />
      </mesh>
      <mesh ref={innerRef} geometry={innerGeo} castShadow>
        <meshStandardMaterial color="#3A86FF" roughness={0.2} metalness={0.2} emissive="#3A86FF" emissiveIntensity={0.05} />
      </mesh>
      <mesh ref={centerRef} castShadow>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#FFD700" roughness={0.4} metalness={0.3} emissive="#FFD700" emissiveIntensity={0.1} />
      </mesh>
      {shapesConfig.map((cfg, i) => (
        <mesh key={i} ref={(el) => { shapesRef.current[i] = el; }} position={cfg.pos} geometry={cfg.geo} castShadow>
          <meshStandardMaterial color={cfg.color} roughness={0.3} metalness={0.2} emissive={cfg.color} emissiveIntensity={0.1} />
        </mesh>
      ))}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={600} array={particlePos} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#FFD700" transparent opacity={0.6} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}

export default function Hero3D() {
  return (
    <section className="hero" id="hero">
      <Canvas camera={{ position: [5, 3, 8], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#3A86FF" />
        <directionalLight position={[0, -3, 5]} intensity={0.3} color="#FF006E" />
        <SceneContent />
      </Canvas>
      <div className="hero-overlay">
        <h1>TUI<br />STORE</h1>
        <p>Fashion dengan gaya dan kualitas terbaik</p>
      </div>
      <div className="hero-scroll">SCROLL DOWN</div>
    </section>
  );
}
