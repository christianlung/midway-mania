import * as THREE from 'three';

export function addAndTrackObject(obj, scene, objectList){
    scene.add(obj);
    objectList.push(obj);
}

// IMPORTANT: Pass in matrices in matrix multiplication order
export function applyMatrices(obj, ...matrices) {
    const finalMatrix = matrices.reduce((acc, matrix) => acc.multiply(matrix), new THREE.Matrix4());
    obj.matrix.copy(finalMatrix);
}