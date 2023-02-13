import { MarchingCube } from "@react-three/drei";
import { useRef } from "react";
import { Color } from "three";
import type { Group } from "three";
import type { Vector3 } from "@react-three/fiber";

export const CustomMarchingCube = ({
  position,
  index,
}: {
  position?: Vector3;
  index: number;
}) => {
  const ref = useRef<Group>(null);
  return (
    <mesh name={`mesh${index}`} layers={1}>
      <MarchingCube
        name={`marchingCube${index}`}
        ref={ref}
        color={new Color("grey")}
        subtract={10}
        position={position}
        scale={0.01}
      ></MarchingCube>
    </mesh>
  );
};
