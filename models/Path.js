import * as THREE from 'three';
import { createSphere } from './Sphere';
import { translationMatrix, rotationMatrixZ } from '../utils/transform';

class PathObject {
    constructor(scene, startX, depth, scale, targets, drawBackdrop = true) {
        this.scene = scene;
        this.startX = startX;
        this.depth = depth;
        this.scale = scale;
        this.targets = targets;
        this.pathPoints = this.createPath();
        if (drawBackdrop) this.createBackdrop();
        this.streamObjects();
    }

    createPath() {
        throw new Error("createPath() must be implemented in subclass");
    }

    createBackdrop() {
        const shape = new THREE.Shape();
        shape.moveTo(this.pathPoints[0].x, 0);

        this.pathPoints.forEach(({ x, y }) => {
            shape.lineTo(x, y);
        });

        shape.lineTo(this.pathPoints[this.pathPoints.length - 1].x, 0);
        shape.lineTo(this.pathPoints[0].x, 0);

        const extrudeSettings = { depth: 0.5, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, flatShading: true });

        const backdropMesh = new THREE.Mesh(geometry, material);
        backdropMesh.position.set(0, 0, this.depth);
        backdropMesh.scale.set(this.scale, this.scale, this.scale);

        this.scene.add(backdropMesh);
    }

    createObject(){
        return createSphere(this.scene);
    }

    animateObject(object, speed = 0.05) {
        let positionIndex = 0;

        const move = () => {
            if (!this.scene || !object.parent) return;

            if (positionIndex < this.pathPoints.length - 1) {
                let x1 = this.pathPoints[Math.floor(positionIndex)].x;
                let y1 = this.pathPoints[Math.floor(positionIndex)].y;
                let x2 = this.pathPoints[Math.ceil(positionIndex)].x;
                let y2 = this.pathPoints[Math.ceil(positionIndex)].y;

                // Linear interpolation between two hill points for smooth movement
                let t = positionIndex % 1;
                let x = x1 * (1 - t) + x2 * t;
                let y = y1 * (1 - t) + y2 * t;

                object.matrix.copy(translationMatrix(x, y + 1, this.depth)); // Adjust z-depth
                object.matrix.multiply(rotationMatrixZ(Math.atan2(y2 - y1, x2 - x1))); // Rotate sphere along slope

                positionIndex += speed; // Move forward slightly
                requestAnimationFrame(move);
            } else {
                if (object.parent) { // Ensure it's still in the scene
                    this.scene.remove(object);
                    const index = this.targets.indexOf(object);
                    if (index !== -1) this.targets.splice(index, 1);
                }
            }


        }
        move();
    }

    streamObjects() {
        setInterval(() => {
            const object = this.createObject(); // Must be implemented in subclass
            this.targets.push(object);
            this.animateObject(object);
        }, 2000);
    }
}

class HillPath extends PathObject{
    createPath() {
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
}

class AerialPath extends PathObject {
    constructor(scene, startX, depth, scale, targets) {
        super(scene, startX, depth, scale, targets, false);
    }

    createPath() {
        let points = [];
        for (let i = 0; i <= 50; i += 1) {
            points.push({ x: this.startX + i, y: 10 + Math.sin(i * 0.2) * 3 });
        }
        return points;
    }
}

export { HillPath, AerialPath };
