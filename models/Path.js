import * as THREE from 'three';
import { createSphere } from './Sphere';
import { translationMatrix, rotationMatrixZ } from '../utils/transform';

class PathObject {
    constructor(scene, startX, depth, targets, reverse = false, mirror = false) {
        this.scene = scene;
        this.startX = startX;
        this.depth = depth;
        this.targets = targets;
        this.direction = !reverse ? 1 : -1;
        this.mirror = mirror;
        this.pathPoints = this.createPath();
        this.streamObjects();
    }

    createPath() {
        throw new Error("createPath() must be implemented in subclass");
    }

    createObject() {
        return createSphere(this.scene);
    }

    animateObject(object, speed = 0.05) {
        let positionIndex = this.direction === 1 ? 0 : this.pathPoints.length - 1;

        const move = () => {
            if (!this.scene || !object.parent) return;

            const nextIndex = positionIndex + this.direction * speed;

            if (nextIndex >= 0 && nextIndex < this.pathPoints.length - 1) {
                let p1 = this.pathPoints[Math.floor(positionIndex)];
                let p2 = this.pathPoints[Math.ceil(positionIndex)];

                let t = positionIndex % 1;
                let x = p1.x * (1 - t) + p2.x * t;
                let y = p1.y * (1 - t) + p2.y * t;
                let z = p1.z * (1 - t) + p2.z * t;

                object.matrix.copy(translationMatrix(x, y + 1, z));

                positionIndex = nextIndex;
                requestAnimationFrame(move);
            } else {
                if (object.parent) { // Ensure it's still in the scene
                    console.log("Sphere removed");
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
        }, 3000);
    }
}

class HillPath extends PathObject {
    createPath() {
        const width = 60; // Smoother curve
        const heightFactor = 1.5; // Gentle slopes
        let hillPoints = [];

        for (let x = 0; x <= width; x += 1) {
            let y = heightFactor * (Math.sin(x * 0.2) * 1.2 + Math.cos(x * 0.08) * 1.5 + Math.sin(x * 0.04) * 1) + 4;
            y *= 0.5 + (0.5 * (Math.cos((x / width) * Math.PI) ** 2)); // Smoothing
            let z = this.depth;

            hillPoints.push({ x: x + this.startX, y, z });
        }

        return hillPoints;
    }
}

class AerialPath extends PathObject {
    constructor(scene, startX, depth, targets, reverse) {
        super(scene, startX, depth, targets, false, reverse);
    }

    createPath() {
        let points = [];
        for (let i = 0; i <= 50; i += 1) {
            points.push({ x: this.startX + i, y: 10 + Math.sin(i * 0.2) * 3, z: this.depth });
        }
        return points;
    }
}

class CurvedPath extends PathObject {
    constructor(scene, startX, depth, targets, reverse, mirror = false) {
        super(scene, startX, depth, targets, false, reverse, mirror);
    }
    createPath() {
        let points = [];
        const straightXLength = 25; 
        const straightZLength = 10; 
        const mirrorMultiplier = this.mirror ? -1 : 1;
        const startXCoord = mirrorMultiplier * this.startX;

        // Move straight along +X
        for (let i = 0; i < straightXLength; i++) {
            points.push({ x: startXCoord + i * mirrorMultiplier, y: 0, z: this.depth });
        }

        const finalX = startXCoord + straightXLength * mirrorMultiplier;

        for (let i = 0; i < straightZLength; i++) {
            points.push({ x: finalX, y: 0, z: this.depth + i });
        }

        return points;
    }
}

export { HillPath, AerialPath, CurvedPath };