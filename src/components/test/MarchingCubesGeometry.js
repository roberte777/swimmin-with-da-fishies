import { BufferAttribute, BufferGeometry, Matrix4, Vector3 } from "three";
import { createNoise3D } from "simplex-noise";
import { MathUtils } from "three";
import {
  mergeBufferGeometries,
  mergeVertices,
} from "three/examples/jsm/utils/BufferGeometryUtils";

import {
  cornerIndexAFromEdge,
  cornerIndexBFromEdge,
  cubeVertices,
  triangulationTable,
} from "./triangulation";
import memoize from "fast-memoize";
import { clamp } from "three/src/math/MathUtils";

export function lerpArrayVectors(a, b, t) {
  const [x, y, z] = a;
  const [x1, y1, z1] = b;

  const lx = MathUtils.lerp(x, x1, t);
  const ly = MathUtils.lerp(y, y1, t);
  const lz = MathUtils.lerp(z, z1, t);

  return [lx, ly, lz];
}

export class MarchingCubeGeometry extends BufferGeometry {
  constructor(cubeIndex, data, surfaceLevel, smooth) {
    super();
    this.data = data;
    this.surfaceLevel = surfaceLevel;
    this.smooth = smooth;

    this.build(cubeIndex);
  }

  // @TODO take this out to reuse it in the plural class instead of creating instances of this
  build = (cubeIndex) => {
    const triangulation = triangulationTable[cubeIndex];
    let tris = [];

    const midPoint = new Vector3();

    for (const edgeIndex of triangulation) {
      if (edgeIndex === -1) continue;

      const vertexA = cubeVertices[cornerIndexAFromEdge[edgeIndex]];
      const vertexB = cubeVertices[cornerIndexBFromEdge[edgeIndex]];

      const valueAtVertexA = this.data?.[cornerIndexAFromEdge[edgeIndex]] ?? 1;
      const valueAtVertexB = this.data?.[cornerIndexBFromEdge[edgeIndex]] ?? 1;

      const t = this.smooth
        ? MathUtils.inverseLerp(
            valueAtVertexA,
            valueAtVertexB,
            this.surfaceLevel
          )
        : 0.5;

      midPoint.lerpVectors(vertexA, vertexB, t);

      tris = [...tris, ...midPoint];
    }

    this.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(tris), 3)
    );
  };
}

const noise3D = createNoise3D();

const pointInSphere = (point) => {
  const radius = 2;
  const spherePosition = new Vector3(0, 0, 0);
  const diff = new Vector3().subVectors(spherePosition, point);
  const distance = diff.length();
  return distance < radius;
};

const getNoiseAtPoint = memoize((x, y, z) => {
  return noise3D(x, y, z) * (pointInSphere(new Vector3(x, y, z)) ? 0 : 1);
});

export default class MarchingCubesGeometry extends BufferGeometry {
  constructor(size, smooth, surfaceLevel, scale = 0.05, position = [0, 0, 0]) {
    super();
    this.size = size;

    this._surfaceLevel = surfaceLevel;
    this._smooth = smooth;
    this._scale = scale;
    this.position = new Vector3(...position);
    this.build();
  }

  build() {
    const geometries = [];

    const p = new Vector3(0, 0, 0);
    const m = new Matrix4();

    // step 1. for each grid space
    for (let x = 0; x < this.size[0]; x++) {
      for (let y = 0; y < this.size[1]; y++) {
        for (let z = 0; z < this.size[2]; z++) {
          p.set(x, y, z);
          p.add(this.position);

          const vertexWorldPosition = new Vector3();

          // for each grid member, get the noise value for each cube vertex
          // this should maybe done only once per vertex, instead, would be a bit faster
          const data = cubeVertices.map((vertex) => {
            vertexWorldPosition.copy(vertex).add(p);

            return getNoiseAtPoint(
              ...vertexWorldPosition.multiplyScalar(this._scale)
            );
          });

          let cubeIndex = 0;
          data.forEach((d, i) => {
            if (d > this._surfaceLevel) {
              cubeIndex |= 1 << i;
            }
          });

          const g = new MarchingCubeGeometry(
            cubeIndex,
            data,
            this._surfaceLevel,
            this._smooth
          );

          m.identity();
          m.setPosition(p);

          g.applyMatrix4(m);

          geometries.push(g);
        }
      }
    }

    let merged = mergeBufferGeometries(geometries, 1);
    merged = mergeVertices(merged);

    // center the geometry
    const _p = new Vector3(
      -this.size[0] / 2 + 0.5,
      -this.size[1] / 2 + 0.5,
      -this.size[2] / 2 + 0.5
    );
    const _m = new Matrix4();

    _m.setPosition(_p);
    merged.applyMatrix4(_m);

    Object.assign(this, merged);

    this.computeVertexNormals(true);
  }
}
