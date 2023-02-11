// export { AquaticScene } from "./Aquarium";

import React, { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Center, CameraControls } from "@react-three/drei";
import { Aquarium, AquariumGrid } from "./Aquarium";

export const AquaticScene = () => {
  const meshRef = useRef(null);
  const cameraControlsRef = useRef(null);

  const { camera } = useThree();

  return (
    <>
      <group position-y={-0.5}>
        <Center top>
          <Aquarium ref={meshRef} rotation={[0, 0, 0]} position={[0, 0, 0]} />
        </Center>
        <CameraControls ref={cameraControlsRef} minDistance={30} enabled />
        <AquariumGrid />
      </group>
    </>
  );
};
