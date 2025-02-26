import * as THREE from 'three';
import { translationMatrix, rotationMatrixZ } from '../utils/transform';

export function createSphere(scene, points=100) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const phongMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        shininess: 100 
    });
    const sphere = new THREE.Mesh(geometry, phongMaterial);
    sphere.matrixAutoUpdate = false;
    sphere.userData.points = points;
    scene.add(sphere);
    return sphere;
}

export function animateSphere(sphere, hillPoints, speed = 0.05) {
    let positionIndex = 0;

    function move() {
        if (positionIndex < hillPoints.length - 1) {
            let x1 = hillPoints[Math.floor(positionIndex)].x;
            let y1 = hillPoints[Math.floor(positionIndex)].y;
            let x2 = hillPoints[Math.ceil(positionIndex)].x;
            let y2 = hillPoints[Math.ceil(positionIndex)].y;

            // Linear interpolation between two hill points for smooth movement
            let t = positionIndex % 1;
            let x = x1 * (1 - t) + x2 * t;
            let y = y1 * (1 - t) + y2 * t;

            // Set sphere position
            sphere.matrix.copy(translationMatrix(x, y + 1, -10)); // Adjust z-depth
            sphere.matrix.multiply(rotationMatrixZ(Math.atan2(y2 - y1, x2 - x1))); // Rotate sphere along slope

            positionIndex += speed; // Move forward slightly
        } else {
            positionIndex = 0; // Loop back
        }

        requestAnimationFrame(move);
    }

    move();
}