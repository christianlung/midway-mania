import * as THREE from 'three';

export function createGround(scene){
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50), // Large ground area
        new THREE.MeshPhongMaterial({ color: 0x228B22 }) // Grass green
    );
    ground.rotation.x = -Math.PI / 2; // Rotate to be flat
    ground.position.y = 0; // Adjust height
    scene.add(ground);
    return ground;
}