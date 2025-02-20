import * as THREE from 'three';
import { createScene } from './scene.js';
import { createSphere } from './models/Sphere.js';
import { translationMatrix, rotationMatrixY } from './utils/transform.js';
import { applyMatrices, checkCollision } from './utils/util.js';
import { shootDart } from './models/Dart.js';

// Stores all objects in the scene
let targets = []; 
let projectiles = [];

const { scene, camera, renderer } = createScene();

//Add green sphere to the scene
const sphere = createSphere(scene);
targets.push(sphere);

// Animation and clock
let animation_time = 0;
let delta_animation_time;
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


function onClick(event) {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    shootDart(camera, scene, raycaster, 10, projectiles);
}

function animate() {
    renderer.render(scene, camera);

    delta_animation_time = clock.getDelta();
    animation_time += delta_animation_time;

    projectiles.forEach((dart, dartIndex) => {
        // Transform the projectiles
        dart.position.add(dart.userData.velocity.clone().multiplyScalar(delta_animation_time));

        // Collision detection
        targets.forEach((sphere, sphereIndex) => {
            if (checkCollision(dart, sphere)){
                scene.remove(sphere);
                targets.splice(sphereIndex, 1);

                scene.remove(dart);
                projectiles.splice(dartIndex, 1);
            }
        });
    });

    // applyMatrices(sphere, rotationMatrixY(animation_time), translationMatrix(3, 1, 0)); // => Rotate around y axis
    // applyMatrices(sphere, translationMatrix(animation_time, 1, 0)); // => Move right along x-axis
    // applyMatrices(sphere, translationMatrix(0, animation_time, 0)); // => Move up along y-axis
    // applyMatrices(sphere, translationMatrix((1 + Math.sin((2 * Math.PI / 2) * animation_time)), 0, 0)); // => Move left and right x-axis
    // applyMatrices(sphere, translationMatrix(0, (1 + Math.sin((2 * Math.PI / 2) * animation_time)), 0)); // => Move up and down y-axis
}

renderer.setAnimationLoop(animate);
window.addEventListener("click", onClick);