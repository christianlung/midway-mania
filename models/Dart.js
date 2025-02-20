import * as THREE from 'three';

export function shootDart(camera, scene, raycaster, speed=20, projectiles){
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const dart = new THREE.Mesh(geometry, material);
    // Dart is positioned at the camera
    dart.position.copy(camera.position);
    scene.add(dart);

    const direction = raycaster.ray.direction.clone(); // clone to avoid modifying the raycaster's vector
    dart.userData.velocity = direction.multiplyScalar(speed);

    projectiles.push(dart);

    return dart;
}