import * as THREE from 'three';

export function createSphere() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const phongMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        shininess: 100 
    });
    const sphere = new THREE.Mesh(geometry, phongMaterial);
    return sphere;
}
