// export { AquaticScene } from "./Aquarium";

import React, { useRef } from "react";
import { useThree, Vector3 } from "@react-three/fiber";
import {
  Center,
  CameraControls,
  MarchingCube,
  MarchingCubes,
  MarchingPlane,
  Torus,
} from "@react-three/drei";
import { Aquarium, AquariumGrid } from "./Aquarium";
// import { MarchingCubes } from "./Terrain";

import { Color, Group } from "three";
import { CustomMarchingCube } from "./Terrain";

export const AquaticScene = () => {
  const meshRef = useRef(null);
  const cameraControlsRef = useRef(null);

  const { camera } = useThree();

  return (
    <>
      <group position-y={-0.5}>
        <MarchingCubes
          resolution={30}
          maxPolyCount={40000}
          enableColors
          scale={20}
        >
          {...Array.from({ length: 20 }).map((_, i) => {
            const pos: [x: number, y: number, z: number] = [
              Math.random() / 10 - 0.05,
              Math.random() / 30 - 0.0125,
              Math.random() / 10 - 0.05,
            ];
            return Array.from({ length: 2 }).map((_, j) => {
              return (
                <CustomMarchingCube key={i * j} index={i + j} position={pos} />
              );
            });
          })}
          {/* floor of reef */}
          <MarchingPlane planeType="y" />
          {/* material to render stuff */}
          <meshPhongMaterial
            specular={0xffffff}
            shininess={2}
            vertexColors={true}
          />
        </MarchingCubes>
        <Aquarium ref={meshRef} rotation={[0, 0, 0]} position={[0, -5, 0]} />
        <CameraControls ref={cameraControlsRef} minDistance={1} enabled />
        {/* <MarchingCubes size={[64, 16, 64]} /> */}
        <AquariumGrid />
      </group>
    </>
  );
};
