import * as THREE from 'three';
import { createSphere, animateSphere } from './Sphere';

export function createHillBackdrop(scene, startX, depth, scale) {
    const hillShape = new THREE.Shape();
    const width = 60;  // Increase width for smoother curves
    const heightFactor = 1.5; // Reduce height factor for gentle slopes

    let hillPoints = [];

    hillShape.moveTo(0, 0);

    for (let x = 0; x <= width; x += 1) {
        // Generate a smoother hill shape by modifying frequency & amplitude
        let y = heightFactor * (Math.sin(x * 0.2) * 1.2 + Math.cos(x * 0.08) * 1.5 + Math.sin(x * 0.04) * 1) + 4;

        // Apply a polynomial adjustment to smooth out steep sections
        y *= 0.5 + (0.5 * (Math.cos((x / width) * Math.PI) ** 2));

        hillShape.lineTo(x, y);
        hillPoints.push({ x: x + startX, y });  // Adjust X by startX
    }

    hillShape.lineTo(width, 0);
    hillShape.lineTo(0, 0);

    const extrudeSettings = { depth: 0.5, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(hillShape, extrudeSettings);
    
    const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, flatShading: true });
    
    const backdropMesh = new THREE.Mesh(geometry, material);
    backdropMesh.position.set(startX, 0, depth);
    backdropMesh.scale.set(scale, scale, scale);

    scene.add(backdropMesh);

    return hillPoints;
}