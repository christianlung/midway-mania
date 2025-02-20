import * as THREE from 'three';

// IMPORTANT: Pass in matrices in matrix multiplication order
export function applyMatrices(obj, ...matrices) {
    const finalMatrix = matrices.reduce((acc, matrix) => acc.multiply(matrix), new THREE.Matrix4());
    obj.matrix.copy(finalMatrix);
}