import React, { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Center, CameraControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Aquarium, AquariumGrid } from "./Aquarium";

export const AquaticEnvironment = () => {
  return (
    <div className="h-screen w-screen">
      <Canvas
        camera={{ position: [0, 0, 35], fov: 60 }}
        dpr={[1, 2]}
        frameloop="always"
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense>
          <Physics gravity={[0, 0, 0]} interpolate={false} colliders={false}>
            <AquaticScene />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
};

const AquaticScene = () => {
  const aquariumRef = useRef(null);
  const cameraControlsRef = useRef(null);

  const { camera } = useThree();

  return (
    <>
      <group position-y={-0.5}>
        <Center top>
          <Aquarium ref={aquariumRef} position={[0, 0, 0]} />
        </Center>
        <CameraControls ref={cameraControlsRef} minDistance={30} enabled />
        <AquariumGrid />
      </group>
    </>
  );
};
