import * as THREE from 'three';
import { createSphere } from './Sphere';
import { translationMatrix, rotationMatrixZ } from '../utils/transform';

class PathObject {
    constructor(scene, startX, depth, targets, speed = 0.05, interval = 3000, points = 100, reverse = false, mirror = false) {
        this.scene = scene;
        this.startX = startX;
        this.depth = depth;
        this.targets = targets;
        this.speed = speed;
        this.interval = interval;
        this.points = points;
        this.direction = !reverse ? 1 : -1;
        this.mirror = mirror;
        this.freeze = false;
        this.pathPoints = this.createPath();
        this.streamObjects();
    }

    createPath() {
        throw new Error("createPath() must be implemented in subclass");
    }

    createObject() {
        return createSphere(this.scene, this.points);
    }

    animateObject(object) {
        let positionIndex = this.direction === 1 ? 0 : this.pathPoints.length - 1;

        const move = () => {
            if (!this.scene || !object.parent) return;

            if (this.freeze) {
                requestAnimationFrame(move);
                return;
            }

            const nextIndex = positionIndex + this.direction * this.speed;

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
            if (this.freeze) return;
            const object = this.createObject(); // Must be implemented in subclass
            this.targets.push(object);
            this.animateObject(object);
        }, this.interval);
    }
}

// TODO: make sure it stops at every cycle?
class HillPath extends PathObject {
    constructor(scene, startX, depth, targets, speed = 0.05, interval = 3000, points = 100, reverse = false, mirror = false) {
        super(scene, startX, depth, targets, speed, interval, points, reverse, mirror);
        
        this.pauseDuration = 5000; // Duration (in ms) to freeze movement every cycle.
        this.cycleDuration = 21000; // Cycle duration (in ms) between freezes.

        setInterval(() => {
            console.log("Pausing movement for 5 seconds");
            this.freeze = true;
            setTimeout(() => {
                this.freeze = false;
                console.log("Resuming movement");
            }, this.pauseDuration);
        }, this.cycleDuration);
    }

    createPath() {
        const width = 60;
        const heightFactor = 1.5;
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
        super(scene, startX, depth, targets, 0.05, 6000, 200, reverse);
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
    constructor(scene, startX, depth, targets, reverse, mirror) {
        super(scene, startX, depth, targets, 0.03, 5000, 100, reverse, mirror);
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

class FastPath extends PathObject {
    constructor(scene, startX, depth, targets, reverse, mirror) {
        super(scene, startX, depth, targets, 0.1, 10000, 1000, reverse, mirror);
    }

    createPath() {
        let points = []
        for (let i = 0; i < 60; i++) {
            points.push({ x: this.startX + i, y: 18, z: this.depth });
        }

        return points;
    }
}

export { HillPath, AerialPath, CurvedPath, FastPath };