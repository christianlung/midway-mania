import * as THREE from 'three';

export function createDart(scene){
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const dart = new THREE.Mesh(geometry, material);
    scene.add(dart);
    return dartl
}