// export { AquaticScene } from "./Aquarium";

import React, { useRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  Center,
  CameraControls,
  MarchingCube,
  MarchingCubes,
  MarchingPlane,
} from "@react-three/drei";
import { Aquarium, AquariumGrid } from "./Aquarium";
// import { MarchingCubes } from "./Terrain";

import { Color, Group } from "three";
import { CustomMarchingCube } from "./Terrain";

export const AquaticScene = () => {
  const meshRef = useRef(null);
  const cameraControlsRef = useRef(null);
  const temp = useRef<Group>();

  const { camera } = useThree();

  return (
    <>
      <group position-y={-0.5}>
        <Center top>
          <Aquarium ref={meshRef} rotation={[0, 0, 0]} position={[0, 0, 0]} />
        </Center>
        <CameraControls ref={cameraControlsRef} minDistance={1} enabled />
        {/* <MarchingCubes size={[64, 16, 64]} /> */}
        <MarchingCubes
          resolution={30}
          maxPolyCount={40000}
          enableColors
          // enableUvs

          scale={2}
        >
          <CustomMarchingCube />
          <CustomMarchingCube position={[0.3, 0.7, 0]} />
          {/* <MarchingPlane planeType="x" translateX={(distance) => }/> */}
          {/* <MarchingPlane planeType="y" position={[100.5, 0.5, 0.5]} /> */}
          {/* <boxGeometry args={[1, 2, 2]} /> */}
          <meshPhongMaterial
            specular={0xffffff}
            shininess={2}
            vertexColors={true}
          />
        </MarchingCubes>
        <AquariumGrid />
      </group>
    </>
  );
};
