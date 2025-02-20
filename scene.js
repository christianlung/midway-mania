import * as THREE from 'three';
import { XAxis, YAxis, ZAxis } from './models/Axis.js';
import { createGround } from './models/Ground.js';

export function createScene() {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15);
    camera.position.set(0, 2, 10);
    camera.lookAt(0, 5, 0);

    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(10, 10, 10);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Ground and axes
    createGround(scene);
    XAxis(scene);
    YAxis(scene);
    ZAxis(scene);

    return { scene, camera, renderer };
}