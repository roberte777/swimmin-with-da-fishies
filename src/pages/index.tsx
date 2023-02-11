import { type NextPage } from "next";
import Head from "next/head";
import React, { memo, useRef, useState } from "react";
import type { ThreeElements } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Center, CameraControls } from "@react-three/drei";
import { AquaticScene } from "../components";
// import { AquaticScene } from "@/components";

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
          <AquaticScene />
        </Canvas>
      </div>
    </>
  );
};

export default Home;
