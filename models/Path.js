import * as THREE from 'three';
import { createSphere } from './Sphere';
import { translationMatrix, rotationMatrixZ } from '../utils/transform';

class Hill {
    constructor(scene, startX, depth, scale, targets) {
        this.scene = scene;
        this.startX = startX;
        this.depth = depth;
        this.scale = scale;
        this.targets = targets;
        this.hillPoints = this.createPath();
        this.createBackdrop();
        this.streamSpheres();
    }

    createPath(){
        const width = 60; // Smoother curve
        const heightFactor = 1.5; // Gentle slopes
        let hillPoints = [];

        for (let x = 0; x <= width; x += 1) {
            let y = heightFactor * (Math.sin(x * 0.2) * 1.2 + Math.cos(x * 0.08) * 1.5 + Math.sin(x * 0.04) * 1) + 4;
            y *= 0.5 + (0.5 * (Math.cos((x / width) * Math.PI) ** 2)); // Smoothing

            hillPoints.push({ x: x + this.startX, y });
        }

        return hillPoints;
    }

    createBackdrop() {
        const hillShape = new THREE.Shape();
        hillShape.moveTo(this.hillPoints[0].x, 0);

        this.hillPoints.forEach(({ x, y }) => {
            hillShape.lineTo(x, y);
        });

        hillShape.lineTo(this.hillPoints[this.hillPoints.length - 1].x, 0);
        hillShape.lineTo(this.hillPoints[0].x, 0);

        const extrudeSettings = { depth: 0.5, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(hillShape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, flatShading: true });

        const backdropMesh = new THREE.Mesh(geometry, material);
        backdropMesh.position.set(0, 0, this.depth);
        backdropMesh.scale.set(this.scale, this.scale, this.scale);

        this.scene.add(backdropMesh);
    }

    animateSphere(sphere, speed = 0.05) {
        let positionIndex = 0;

        const move = () => {
            if (!this.scene || !sphere.parent) return;

            if (positionIndex < this.hillPoints.length - 1) {
                let x1 = this.hillPoints[Math.floor(positionIndex)].x;
                let y1 = this.hillPoints[Math.floor(positionIndex)].y;
                let x2 = this.hillPoints[Math.ceil(positionIndex)].x;
                let y2 = this.hillPoints[Math.ceil(positionIndex)].y;

                // Linear interpolation between two hill points for smooth movement
                let t = positionIndex % 1;
                let x = x1 * (1 - t) + x2 * t;
                let y = y1 * (1 - t) + y2 * t;

                // Set sphere position
                sphere.matrix.copy(translationMatrix(x, y + 1, this.depth)); // Adjust z-depth
                sphere.matrix.multiply(rotationMatrixZ(Math.atan2(y2 - y1, x2 - x1))); // Rotate sphere along slope

                positionIndex += speed; // Move forward slightly
                requestAnimationFrame(move);
            } else {
                if (sphere.parent) { // Ensure it's still in the scene
                    this.scene.remove(sphere);
                    const index = this.targets.indexOf(sphere);
                    if (index !== -1) this.targets.splice(index, 1);
                }
            }


        }
        move();
    }

    streamSpheres() {
        setInterval(() => {
            const sphere = createSphere(this.scene);
            this.targets.push(sphere);
            this.animateSphere(sphere);
        }, 2000);
    }
}

export default Hill;