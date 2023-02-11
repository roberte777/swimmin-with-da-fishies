import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import type { ThreeElements } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";

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
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
      </div>
    </>
  );
};

export default Home;

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
