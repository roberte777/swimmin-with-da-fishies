// export { AquaticScene } from "./Aquarium";

import React, { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Center,
  CameraControls,
  MarchingCubes,
  MarchingPlane,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Aquarium, AquariumGrid } from "./Aquarium";
// import { MarchingCubes } from "./Terrain";

import { Color, DoubleSide, Group } from "three";
import { CustomMarchingCube } from "./Terrain";

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
      <group name={"march"}>
        <MarchingCubes
          resolution={50}
          maxPolyCount={40000}
          enableColors
          scale={20}
          name={"marchingCubes"}
        >
          {...Array.from({ length: 25 }).map((_, i) => {
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
          <MarchingPlane planeType="y" position={[0, 100, 0]} />
          {/* material to render stuff */}
          <meshStandardMaterial vertexColors={true} side={DoubleSide} />
        </MarchingCubes>
      </group>
      <Aquarium ref={aquariumRef} position={[0, 0, 0]} />
      {/* </Center> */}
      <CameraControls ref={cameraControlsRef} minDistance={10} enabled />
      <AquariumGrid />
      {/* </group> */}
    </>
  );
};
