"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stage } from "@react-three/drei"
import { Suspense, useMemo, useRef, useState } from "react"
import * as THREE from "three"

// Minimal placeholder therapist head shape that breathes/blinks and has simple jaw movement.
// Swap with a GLTF model later if desired.
function TherapistHead({ speaking = false }: { speaking?: boolean }) {
  const head = useRef<THREE.Mesh>(null!)
  const eyelidLeft = useRef<THREE.Mesh>(null!)
  const eyelidRight = useRef<THREE.Mesh>(null!)
  const jaw = useRef<THREE.Mesh>(null!)
  const antenna = useRef<THREE.Mesh>(null!)

  const [blinkTimer] = useState(() => ({ t: 0, closing: false }))
  const clockStart = useMemo(() => performance.now(), [])

  useFrame(() => {
    const t = (performance.now() - clockStart) / 1000

  // Gentle breathing (subtle position shift)
  const breath = 0.01 * Math.sin(t * 1.0)
  if (head.current) head.current.position.y = breath

    // Blink every ~3–7s
    blinkTimer.t += 0.016
    const blinkInterval = 3 + (Math.sin(t * 0.3) + 1) * 2 // 3..7 seconds
    if (blinkTimer.t > blinkInterval) {
      blinkTimer.t = 0
      blinkTimer.closing = true
    }
    const blinkSpeed = 0.15
    const eyelidTarget = blinkTimer.closing ? 0.02 : 0.001
    ;[eyelidLeft, eyelidRight].forEach((ref) => {
      if (!ref.current) return
      const curr = (ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, eyelidTarget, blinkSpeed))
      if (Math.abs(curr - eyelidTarget) < 0.002 && blinkTimer.closing) blinkTimer.closing = false
    })

    // Simple jaw movement when speaking
    if (jaw.current) {
      const jawOpen = speaking ? (0.06 + 0.02 * Math.sin(t * 11)) : 0.01
      jaw.current.position.y = -0.26 - jawOpen
      jaw.current.rotation.x = -0.08 - jawOpen * 0.6
    }

    // Antenna pulse
    if (antenna.current) {
      antenna.current.position.y = 0.72 + 0.02 * Math.sin(t * 2.5)
    }
  })

  return (
    <group>
      {/* Robotic head - beveled cube with panel lines */}
      <mesh ref={head} position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.0, 1.0]} />
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Faceplate */}
      <mesh position={[0, 0, 0.51]}>
        <boxGeometry args={[0.9, 0.75, 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.28} emissive="#1e293b" emissiveIntensity={0.18} />
      </mesh>

      {/* Eyes - glowing bars */}
      <mesh position={[-0.22, 0.12, 0.55]}>
        <boxGeometry args={[0.18, 0.08, 0.04]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.22, 0.12, 0.55]}>
        <boxGeometry args={[0.18, 0.08, 0.04]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.7} />
      </mesh>

      {/* Eyelids (scale-y animates to blink) */}
      <mesh ref={eyelidLeft} position={[-0.22, 0.14, 0.56]} scale={[1, 0.001, 1]}>
        <boxGeometry args={[0.2, 0.02, 0.06]} />
        <meshStandardMaterial color="#0b0f1a" />
      </mesh>
      <mesh ref={eyelidRight} position={[0.22, 0.14, 0.56]} scale={[1, 0.001, 1]}>
        <boxGeometry args={[0.2, 0.02, 0.06]} />
        <meshStandardMaterial color="#0b0f1a" />
      </mesh>

      {/* Jaw - mechanical panel */}
      <mesh ref={jaw} position={[0, -0.26, 0.45]}>
        <boxGeometry args={[0.48, 0.18, 0.24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Antenna */}
      <mesh ref={antenna} position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 16]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
      </mesh>

      {/* Neck and shoulders */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.22, 0.32, 0.3, 24]} />
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <boxGeometry args={[1.6, 0.25, 0.6]} />
        <meshStandardMaterial color="#0b1220" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Subtle halo */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.65, 0]}>
        <ringGeometry args={[0.55, 0.75, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export function TherapistAvatar({ speaking, listening = false }: { speaking: boolean; listening?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0.6, 2.2], fov: 40 }} className="h-full w-full">
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 5]} intensity={1.0} color="#93c5fd" />
      <directionalLight position={[-3, -2, -4]} intensity={0.5} color="#c084fc" />

      <Suspense fallback={null}>
        <Stage adjustCamera={false} intensity={0.25} environment="city">
          <TherapistHead speaking={speaking} />
        </Stage>
      </Suspense>

      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />

      {/* Listening pulse indicator as a subtle outer ring */}
      {listening && (
        <group>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.62, 0]}>
            <ringGeometry args={[1.1, 1.25, 64]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
          </mesh>
        </group>
      )}
    </Canvas>
  )
}
