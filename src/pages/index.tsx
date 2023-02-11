import { type NextPage } from "next";
import Head from "next/head";
import React, { memo, useRef, useState } from "react";
import type { ThreeElements } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Center, CameraControls } from "@react-three/drei";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Swimming with da fishies</title>
        <meta
          name="description"
          content="Procedurally generated aquatic environment with schools of fish and other marine life."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen">
        <Canvas
          camera={{ position: [0, 0, 35], fov: 60 }}
          dpr={[1, 2]}
          frameloop="always"
        >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Scene />
        </Canvas>
      </div>
    </>
  );
};

export default Home;

function Scene() {
  const meshRef = useRef(null);
  const cameraControlsRef = useRef(null);

  const { camera } = useThree();

  return (
    <>
      <group position-y={-0.5}>
        <Center top>
          <AquariumBox
            ref={meshRef}
            rotation={[0, 0, 0]}
            position={[0, 0, 0]}
          />
        </Center>
        <CameraControls ref={cameraControlsRef} minDistance={30} enabled />
        <Ground />
      </group>
    </>
  );
}

function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: "#6f6f6f",
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: "#9d4b4b",
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />;
}

function AquariumBox(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[25, 25, 25]} />
      <meshStandardMaterial color="blue" transparent opacity={0.3} />
      <Boid />
    </mesh>
  );
}
const Boid = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    ref.current?.translateX(0.01);
  });
  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.5, 1]} />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  );
};
