import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const School = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    ref.current?.translateX(0.01);
  });
  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.5, 1]} />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  );
};

const Boid = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    ref.current?.translateX(0.01);
  });
  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.5, 1]} />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  );
};
