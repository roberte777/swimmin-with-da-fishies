import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const School = () => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        ref.current?.translateX(0.01);
    });
    return (
        <group ref={ref}>
            {Array.from({ length: 100 }).map((_, i) => (
                <Boid key={i} position={[i, 0, 0]} />
            ))}
        </group>
    );
};

const Boid = (props: ThreeElements["mesh"]) => {
    const ref = useRef<THREE.Mesh>(null);
    return (
        <mesh ref={ref} {...props}>
            <coneGeometry args={[0.5, 1]} />
            <meshBasicMaterial color="royalblue" />
        </mesh>
    );
};
