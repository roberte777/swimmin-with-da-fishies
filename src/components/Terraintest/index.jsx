import React, { useMemo, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
// import './styles.css'
import { OrbitControls } from "@react-three/drei";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  EdgesGeometry,
} from "three";
import create from "zustand";

import MarchingCubesGeometry, {
  MarchingCubeGeometry,
} from "./MarchingCubesGeometry";
import { useControls } from "leva";

// import { Debug } from "./debug";
// import { Grid } from "./utils";

extend({ MarchingCubesGeometry, MarchingCubeGeometry });

export const useStore = create(() => ({
  // this will be used as a bitmask, so the nth bit represents the
  // "selected" state of the nth vertex
  cubeIndex: 8,
}));

// export function SingleCube({ debug, position, initialCubeIndex = 0 }) {
//   const [cubeIndex, setCubeIndex] = useState(initialCubeIndex);

//   return (
//     <mesh position={position}>
//       {debug && (
//         <Debug cubeIndex={cubeIndex} onCubeIndexChange={setCubeIndex} />
//       )}

//       <marchingCubeGeometry args={[cubeIndex]} />
//       <meshBasicMaterial color="#ff005b" side={DoubleSide} />
//     </mesh>
//   );
// }

function Box({ size = [3, 3, 3] }) {
  const edgesGeometry = useMemo(() => {
    const edgesGeometry = new EdgesGeometry(new BoxGeometry(...size));

    return edgesGeometry;
  }, [size]);

  return (
    <group>
      <lineSegments args={[edgesGeometry]}>
        <lineBasicMaterial />
      </lineSegments>
    </group>
  );
}

export function MarchingCubes({ size, position }) {
  const { surfaceLevel, smooth, scale, debug } = useControls({
    debug: true,
    surfaceLevel: {
      min: -1,
      max: 1,
      step: 0.001,
      value: -0.4,
    },
    smooth: true,
    scale: {
      min: 1,
      step: 1,
      max: 10,
      value: 2,
    },
  });

  return (
    <>
      {debug && <Box size={size} />}

      <mesh>
        <marchingCubesGeometry
          args={[size, smooth, surfaceLevel, scale * 0.01, position]}
        />
        <meshNormalMaterial color="white" side={DoubleSide} />
      </mesh>
    </>
  );
}

// export default Terrain;
