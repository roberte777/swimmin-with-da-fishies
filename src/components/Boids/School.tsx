import type * as THREE from "three";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { Cone } from "@react-three/drei";
import { useEffect, useRef } from "react";
import {
  type RapierRigidBody,
  type RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import { Debug } from "@react-three/rapier";
import { RigidBody } from "@react-three/rapier";
import { Object3D, Vector3 } from "three";
import { WORLD_SIZE } from "../Aquarium";
import { warn } from "console";

const MAX_FORCE = 100;
const MAX_SPEED = 20;
const ALIGNMENT_CONSTANT = 1000;

export const School = () => {
  const ref = useRef<THREE.Group>(null);
  let boids = [];

  return (
    <group ref={ref}>
      {[...(Array(10) as number[])].map((_, i) => {
        const randomX = Math.random() * 10;
        const randomY = Math.random() * 10;
        const randomZ = Math.random() * 10;
        //generate random velocity with magnitude betweeen -.5 and .5
        const randomVelocityX = (Math.random() - 0.5) * 0.5;
        const randomVelocityY = (Math.random() - 0.5) * 0.5;
        const randomVelocityZ = (Math.random() - 0.5) * 0.5;
        boids.push({
          velocity: new Vector3(
            randomVelocityX,
            randomVelocityY,
            randomVelocityZ
          ),
          position: new Vector3(randomX, randomY, randomZ),
        });

        return (
          <Boid
            key={i}
            position={[randomX, randomY, randomZ]}
            group={ref}
            startingVelocity={[
              randomVelocityX,
              randomVelocityY,
              randomVelocityZ,
            ]}
          />
        );
      })}
    </group>
  );
};

const Boid = (
  props: ThreeElements["mesh"] & {
    startingVelocity: [number, number, number];
    group: React.RefObject<THREE.Group>;
  }
) => {
  const coneRef = useRef<THREE.Mesh>(null);
  const velocity = useRef<Vector3>(
    new Vector3(...props.startingVelocity).clampLength(0, MAX_SPEED)
  );

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
    if (coneRef.current && props.group.current) {
      let target = new Vector3();
      target = coneRef.current?.getWorldPosition(target);
      const dir = new Vector3();
      dir.add(target);
      dir.add(velocity.current);
      coneRef.current?.lookAt(dir);
      coneRef.current?.position.add(velocity.current);
      let np = outOfBounds(coneRef.current.position);
      coneRef.current?.position.set(np.x, np.y, np.z);
      const steering = new Vector3();
      steering.add(
        alignment(props.group.current.children, 50, coneRef.current)
      );
    }
  });
  return (
    <Cone ref={coneRef} args={[0.5, 1, 20]}>
      <meshPhysicalMaterial color="orange" />
    </Cone>
  );
};

const outOfBounds = (position: THREE.Vector3) => {
  if (position.x > WORLD_SIZE[0] / 2 || position.x < -WORLD_SIZE[0] / 2) {
    return new Vector3(-position.x, position.y, position.z);
  }
  if (position.y > WORLD_SIZE[1] / 2 || position.y < -WORLD_SIZE[1] / 2) {
    return new Vector3(position.x, -position.y, position.z);
  }
  if (position.z > WORLD_SIZE[2] / 2 || position.z < -WORLD_SIZE[2] / 2) {
    return new Vector3(position.x, position.y, -position.z);
  }
  return position;
};

function alignment(neighbours: Object3D[], range = 50, curr: THREE.Mesh) {
  let steerVector = new Vector3();
  const averageDirection = new Vector3();

  let neighboursInRangeCount = 0;

  neighbours.forEach((neighbour) => {
    console.log(neighbour);
    // skip same object
    if (neighbour.id === curr.id) return;

    const distance = neighbour.position.distanceTo(vec3(curr.position));
    if (distance <= range) {
      neighboursInRangeCount++;
      averageDirection.add(vec3(neighbour.linearVelocity));
    }
  });

  console.log("count", neighboursInRangeCount);

  if (neighboursInRangeCount > 0) {
    averageDirection.divideScalar(neighboursInRangeCount);
    averageDirection.normalize();
    averageDirection.multiplyScalar(MAX_SPEED);

    steerVector = averageDirection.sub(vec3(currBody.linvel()));
    steerVector.clampLength(0, MAX_FORCE);
  }

  return steerVector;
}
