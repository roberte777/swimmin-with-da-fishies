import type * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Cone } from "@react-three/drei";
import { useEffect, useRef } from "react";
import {
  type RapierRigidBody,
  type RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import { Debug } from "@react-three/rapier";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
// import { useControls } from "leva";

export const School = () => {
  const ref = useRef<THREE.Group>(null);

  return (
    <group ref={ref}>
      {[...(Array(10) as number[])].map((_, i) => {
        const randomX = Math.random() * 10;
        const randomY = Math.random() * 10;
        const randomZ = Math.random() * 10;
        return <Boid key={i} position={[randomX, randomY, randomZ]} />;
      })}
    </group>
  );
};

const Boid = (props: RigidBodyProps) => {
  const ref = useRef<RapierRigidBody>(null);
  const coneRef = useRef<THREE.Mesh>(null);

  // const {x, y, z, lookX, lookY, lookZ, velocity} = useControls({
  //   x: { value: 0, min: 0, max: 50, step: Math.PI / 6 },
  //   y: { value: 0, min: 0, max: 50, step: Math.PI / 6 },
  //   z: { value: 0, min: 0, max: 50, step: Math.PI / 6 },
  //   lookX: { value: 0, min: 0, max: 50, step: Math.PI / 6 },
  //   lookY: { value: 0, min: 0, max: 50, step: Math.PI / 6 },
  //   lookZ: { value: 0, min: 0, max: 50, step: Math.PI / 6 },
  //   // velocity: { x: 0.2, y: 0.1, z: 0.1 },
  // });

  useEffect(() => {
    coneRef.current?.geometry.rotateX(Math.PI / 2);
  }, []);

  useFrame(() => {
    if (ref.current && coneRef.current) {
      let target = new Vector3();
      target = coneRef.current?.getWorldPosition(target);

      const dir = vec3(ref.current.linvel()).clone();
      dir.add(target);
      coneRef.current?.lookAt(dir);
      coneRef.current?.position.add(vec3(ref.current.linvel()));
    }
  });
  return (
    <>
      <RigidBody ref={ref} {...props} linearVelocity={[0.1, 0.1, 0.1]}>
        <Cone ref={coneRef} args={[0.5, 1, 20]}>
          <meshPhysicalMaterial color="orange" />
        </Cone>
      </RigidBody>
      <Debug />
    </>
  );
};
