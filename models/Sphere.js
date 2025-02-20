import * as THREE from 'three';
import { translationMatrix } from '../utils/transform';

export function createSphere(x=0, y=0, z=0) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const phongMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        shininess: 100 
    });
    const sphere = new THREE.Mesh(geometry, phongMaterial);
    sphere.matrixAutoUpdate = false;
    sphere.matrix.copy(translationMatrix(x, y, z));
    return sphere;
}
