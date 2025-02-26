import * as THREE from 'three';

// IMPORTANT: Pass in matrices in matrix multiplication order
export function applyMatrices(obj, ...matrices) {
    const finalMatrix = matrices.reduce((acc, matrix) => acc.multiply(matrix), new THREE.Matrix4());
    obj.matrix.copy(finalMatrix);

    if (obj.matrixAutoUpdate === false){
        obj.position.setFromMatrixPosition(finalMatrix);
        obj.updateMatrixWorld(true);

        if(obj.geometry){
            obj.geometry.computeBoundingSphere();
            obj.geometry.computeBoundingBox();
        }
    }
}

export function checkCollision(dart, sphere){
    dart.geometry.computeBoundingSphere();
    sphere.geometry.computeBoundingSphere();

    const dartPos = dart.matrixAutoUpdate ? dart.position : new THREE.Vector3().setFromMatrixPosition(dart.matrixWorld);
    const spherePos = sphere.matrixAutoUpdate ? sphere.position : new THREE.Vector3().setFromMatrixPosition(sphere.matrixWorld);

    const distance = dartPos.distanceTo(spherePos);
    return distance < (dart.geometry.boundingSphere.radius + sphere.geometry.boundingSphere.radius);
}