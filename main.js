import * as THREE from 'three';
import { XAxis, YAxis, ZAxis } from './models/Axis.js';
import { createSphere } from './models/Sphere.js';
import { createGround } from './models/Ground.js';
import { translationMatrix, rotationMatrixY } from './utils/transform.js';
import { applyMatrices } from './utils/util.js';

// Stores all objects in the scene
let objectList = []; 

// Create Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Scene with sunlight, ambient light, and background
const scene = new THREE.Scene();
const sunLight = new THREE.DirectionalLight(0xffffff, 3);
sunLight.position.set(10, 10, 10);
scene.add(sunLight);
scene.background = new THREE.Color(0x87CEEB);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Position camera and center of interest
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10);
camera.lookAt(0, 5, 0);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add ground to the scene
createGround(scene);

// Add axis lines
XAxis(scene);
YAxis(scene);
ZAxis(scene);

//Add green sphere to the scene
const sphere = createSphere(scene);
objectList.push(sphere);

// Animation and clock
let animation_time = 0;
let delta_animation_time;
const clock = new THREE.Clock();


function onClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objectList);
    
    if (intersects.length > 0) {
        const objectToRemove = intersects[0].object;
        scene.remove(objectToRemove);

        const index = objectList.indexOf(objectToRemove);
        if (index > -1) {
            objectList.splice(index, 1); 
        }
    }
}

function animate() {
    renderer.render(scene, camera);

    delta_animation_time = clock.getDelta();
    animation_time += delta_animation_time;

    // applyMatrices(sphere, rotationMatrixY(animation_time), translationMatrix(3, 1, 0)); => Rotate around y axis
    // applyMatrices(sphere, translationMatrix(animation_time, 1, 0)); => Move right along x-axis
    // applyMatrices(sphere, translationMatrix(0, animation_time, 0)); => Move up along y-axis
    // applyMatrices(sphere, translationMatrix((1 + Math.sin((2 * Math.PI / 2) * animation_time)), 0, 0)); => Move left and right x-axis
    // applyMatrices(sphere, translationMatrix(0, (1 + Math.sin((2 * Math.PI / 2) * animation_time)), 0)); => Move up and down y-axis
}

renderer.setAnimationLoop(animate);
window.addEventListener("click", onClick);
