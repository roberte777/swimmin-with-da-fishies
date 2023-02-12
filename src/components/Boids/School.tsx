import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";

export const School = () => {
  const ref = useRef<THREE.Group>(null);
  return (
    <group ref={ref}>
      {Array.from({ length: 10 }).map((_, i) => {
        let randomX = Math.random() * 10;
        let randomY = Math.random() * 10;
        let randomZ = Math.random() * 10;
        return <Boid key={i} position={[randomX, randomY, randomZ]} />;
      })}
    </group>
  );
};

const Boid = (props: ThreeElements["mesh"]) => {
  const ref = useRef<RapierRigidBody>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      let vel = ref.current.linvel();
      ref.current.setRotation([0, 0.5, 5]);
      //get the current velocity and rotate the boid towards it
      ref.current?.setLinvel({ x: 1, y: 0, z: 0 });
    }
  });
  return (
    <RigidBody ref={ref} {...props}>
      <mesh>
        <coneGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="royalblue" />
      </mesh>{" "}
    </RigidBody>
  );
};
