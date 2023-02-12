import React, { useRef } from "react";
import type { ThreeElements } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { School } from "../Boids";

export const Aquarium = (props: ThreeElements["group"]) => {
  const ref = useRef<THREE.Group>(null);
  return (
    <group {...props} ref={ref}>
      <mesh>
        <boxGeometry args={[25, 25, 25]} />
        <meshStandardMaterial color="blue" transparent opacity={0.3} />
      </mesh>
      <School />
    </group>
  );
};

export const AquariumGrid = () => {
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
};
