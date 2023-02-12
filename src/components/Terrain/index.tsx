import { MarchingCube } from "@react-three/drei";
import { useRef } from "react";
import { Color } from "three";
import type { Group } from "three";
import type { Vector3 } from "@react-three/fiber";

export const CustomMarchingCube = ({ position }: { position?: Vector3 }) => {
  const ref = useRef<Group>(null);
  return (
    <MarchingCube ref={ref} color={new Color("#ff0")} position={position} />
  );
};
