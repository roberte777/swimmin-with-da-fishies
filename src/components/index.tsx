import React, { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Center,
  CameraControls,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
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
        <GizmoHelper
          alignment="bottom-right" // widget alignment within scene
          margin={[80, 80]} // widget margins (X, Y)
          // onUpdate={/* called during camera animation  */}
          // onTarget={/* return current camera target (e.g. from orbit controls) to center animation */}
          // renderPriority={/* use renderPriority to prevent the helper from disappearing if there is another useFrame(..., 1)*/}
        >
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="black"
          />
          {/* alternative: <GizmoViewcube /> */}
        </GizmoHelper>
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
      {/* <group> */}
      {/* <Center top> */}
      <Aquarium ref={aquariumRef} position={[0, 0, 0]} />
      {/* </Center> */}
      <CameraControls ref={cameraControlsRef} minDistance={10} enabled />
      <AquariumGrid />
      {/* </group> */}
    </>
  );
};
