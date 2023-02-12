import type * as THREE from "three";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { Cone } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { vec3 } from "@react-three/rapier";
import { Vector3 } from "three";
import { WORLD_SIZE } from "../Aquarium";

const MAX_FORCE = 0.007;
const MAX_SPEED = 0.1;
const ALIGNMENT_CONSTANT = 0.3;
const SEPARATION_CONSTANT = 0.2;
const WANDER_CONSTANT = 0.1;
const COHESION_CONSTANT = 0.07;
const PERCEPTION = 100;

export const School = () => {
  const ref = useRef<THREE.Group>(null);
  let boids: { velocity: Vector3; position: Vector3 }[] = [];

  return (
    <group ref={ref}>
      {[...(Array(30) as number[])].map((_, i) => {
        //value between negative half of world side and positive for each index
        const randomX = Math.random() * WORLD_SIZE[0] - WORLD_SIZE[0] / 2;
        const randomY = Math.random() * WORLD_SIZE[1] - WORLD_SIZE[1] / 2;
        const randomZ = Math.random() * WORLD_SIZE[2] - WORLD_SIZE[2] / 2;
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
            boids={boids}
            position={[randomX, randomY, randomZ]}
            group={ref}
            index={i}
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
    boids: { velocity: Vector3; position: Vector3 }[];
    index: number;
  }
) => {
  const coneRef = useRef<THREE.Mesh>(null);
  const velocity = useRef<Vector3>(
    new Vector3(...props.startingVelocity).clampLength(0, MAX_SPEED)
  );
  //wander target is random vector within the aquarium.
  const wanderTarget = useRef<Vector3>(
    new Vector3(
      Math.random() * WORLD_SIZE[0] - WORLD_SIZE[0] / 2,
      Math.random() * WORLD_SIZE[1] - WORLD_SIZE[1] / 2,
      Math.random() * WORLD_SIZE[2] - WORLD_SIZE[2] / 2
    )
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
      const steering = new Vector3();
      steering.add(
        alignment(
          props.boids,
          PERCEPTION,
          coneRef.current,
          props.index
        ).multiplyScalar(ALIGNMENT_CONSTANT)
      );
      steering.add(
        separation(
          props.boids,
          PERCEPTION,
          coneRef.current,
          props.index
        ).multiplyScalar(SEPARATION_CONSTANT)
      );
      steering.add(
        cohesion(
          props.boids,
          PERCEPTION,
          coneRef.current,
          props.index
        ).multiplyScalar(COHESION_CONSTANT)
      );
      steering.add(
        wander(
          wanderTarget.current,
          coneRef.current,
          velocity.current
        ).multiplyScalar(WANDER_CONSTANT)
      );
      velocity.current.add(steering);
      coneRef.current.position.add(velocity.current);
      props.boids[props.index].velocity = velocity.current;
      const np = outOfBounds(coneRef.current.position);
      coneRef.current?.position.set(np.x, np.y, np.z);
      props.boids[props.index].position = coneRef.current.position;

      //update wander target
      const distance = coneRef.current.position.distanceTo(
        wanderTarget.current
      );
      if (distance < 5) {
        // when we reach the target, set a new random target
        wanderTarget.current = new Vector3(rndCoord(), rndCoord(), rndCoord());
      }
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

function alignment(
  boids: { velocity: Vector3; position: Vector3 }[],
  range: number,
  curr: THREE.Mesh,
  currKey: number
) {
  let steerVector = new Vector3();
  const averageDirection = new Vector3();

  let neighboursInRangeCount = 0;

  boids.forEach((neighbour, i) => {
    // skip same object
    if (i === currKey) return;

    const distance = neighbour.position.distanceTo(vec3(curr.position));
    if (distance <= range) {
      neighboursInRangeCount++;
      averageDirection.add(vec3(neighbour.velocity));
    }
  });

  if (neighboursInRangeCount > 0) {
    averageDirection.divideScalar(neighboursInRangeCount);
    averageDirection.normalize();
    averageDirection.multiplyScalar(MAX_SPEED);

    steerVector = averageDirection.sub(vec3(boids[currKey].velocity));
    steerVector.clampLength(0, MAX_FORCE);
  }

  return steerVector;
}
function separation(
  boids: { velocity: Vector3; position: Vector3 }[],
  range: number,
  curr: THREE.Mesh,
  currKey: number
) {
  const steerVector = new Vector3();

  let neighbourInRangeCount = 0;

  boids.forEach((neighbour, i) => {
    // skip same object
    if (i === currKey) return;

    const distance = neighbour.position.distanceTo(curr.position);
    if (distance <= range) {
      const diff = curr.position.clone().sub(neighbour.position);
      diff.divideScalar(distance); // weight by distance
      steerVector.add(diff);
      neighbourInRangeCount++;
    }
  });

  if (neighbourInRangeCount !== 0) {
    steerVector.divideScalar(neighbourInRangeCount);
    steerVector.normalize();
    steerVector.multiplyScalar(MAX_SPEED);
    steerVector.clampLength(0, MAX_FORCE);
  }

  return steerVector;
}
function cohesion(
  boids: { velocity: Vector3; position: Vector3 }[],
  range: number,
  curr: THREE.Mesh,
  currKey: number
) {
  const centreOfMass = new Vector3();

  let neighboursInRangeCount = 0;

  boids.forEach((neighbour, i) => {
    // skip same object
    if (i === currKey) return;

    const distance = neighbour.position.distanceTo(curr.position);
    if (distance <= range) {
      neighboursInRangeCount++;
      centreOfMass.add(neighbour.position);
    }
  });

  if (neighboursInRangeCount > 0) {
    centreOfMass.divideScalar(neighboursInRangeCount);

    // "seek" the centre of mass
    return seek(centreOfMass, curr, boids[currKey].velocity);
  } else {
    return new Vector3();
  }
}
function seek(target: Vector3, curr: THREE.Mesh, currVelocity: Vector3) {
  const steerVector = target.clone().sub(curr.position);
  steerVector.normalize();
  steerVector.multiplyScalar(MAX_SPEED);
  steerVector.sub(currVelocity);

  steerVector.clampLength(0, MAX_FORCE);
  return steerVector;
}
function wander(
  wanderTarget: Vector3,
  curr: THREE.Mesh,
  currVelocity: Vector3
) {
  return seek(wanderTarget, curr, currVelocity);
}
function rndCoord() {
  return Math.random() * WORLD_SIZE[0] - WORLD_SIZE[0] / 2;
}
