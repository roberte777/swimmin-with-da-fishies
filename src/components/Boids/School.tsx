import * as THREE from "three";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

export const School = () => {
  const ref = useRef<THREE.Group>(null);
  return (
    <group ref={ref}>
      {Array.from({ length: 10 }).map((_, i) => {
        const randomX = Math.random() * 10;
        const randomY = Math.random() * 10;
        const randomZ = Math.random() * 10;
        //generate random values between -1 and 1
        // const randomXVelocity = Math.random() * 2 - 1;
        // const randomYVelocity = Math.random() * 2 - 1;
        // const randomZVelocity = Math.random() * 2 - 1;

        return <Boid key={i} position={[randomX, randomY, randomZ]} />;
      })}
    </group>
  );
};

const Boid = (props: ThreeElements["mesh"]) => {
  const mesh = useRef<THREE.Mesh>(null);
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3(0.01, 0.01, 0));
  useEffect(() => {
    mesh.current?.geometry.rotateX(Math.PI / 2);
  }, []);

  useFrame(() => {
    if (mesh.current) {
      //make the boid rotate to face the current direction of travel
      let target = new Vector3();
      target = mesh.current.getWorldPosition(target);
      let dir = velocity.current.clone();
      dir.add(target);
      mesh.current.lookAt(dir);
      mesh.current.position.add(velocity.current);
    }
  });
  return (
    <mesh ref={mesh} {...props}>
      <coneGeometry args={[0.5, 1.5]} />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  );
};
