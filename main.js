import * as THREE from 'three';
import { createScene } from './scene.js';
import { checkCollision } from './utils/util.js';
import { shootDart } from './models/Dart.js';
import { setHud } from './hud.js';
import { HillPath, AerialPath, CurvedPath } from './models/Path.js';
import { createBackdrop } from './models/Backdrop.js';

// testing purposes
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const editMode = false;

// Stores all objects in the scene
let targets = [];
let projectiles = [];
let points = 0;
const Z_FURTHEST = -20;
const GAMETIMER = 30000; // milliseconds

const { scene, camera, renderer } = createScene();
const pointsCounter = setHud(renderer);

let controls;
if (editMode) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
}

const hillPath = new HillPath(scene, -30, -10, targets);
createBackdrop(scene, hillPath.pathPoints, hillPath.depth);
const aerialPath = new AerialPath(scene, -30, -13, targets, true);
const left_curvedPath = new CurvedPath(scene, -30, -5, targets);
const right_curvedPath = new CurvedPath(scene, -30, -5, targets, false, true);

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

let running = true;

function animate() {
    if (!running) return;

    renderer.render(scene, camera);
    if (editMode) {
        controls.update();
    }

    delta_animation_time = clock.getDelta();
    animation_time += delta_animation_time;

    for (let dartIndex = projectiles.length - 1; dartIndex >= 0; dartIndex--) {
        let dart = projectiles[dartIndex];
        dart.position.add(dart.userData.velocity.clone().multiplyScalar(5 * delta_animation_time));

        if (dart.position.z < Z_FURTHEST) {
            scene.remove(dart);
            projectiles.splice(dartIndex, 1);
            console.log("Dart removed for passing the static z threshold");
            continue;
        }

        // Iterate backwards over targets
        for (let sphereIndex = targets.length - 1; sphereIndex >= 0; sphereIndex--) {
            let sphere = targets[sphereIndex];

            if (checkCollision(dart, sphere)) {
                points += sphere.userData.points;
                pointsCounter.textContent = `Points: ${points}`;

                // Remove sphere and dart
                scene.remove(sphere);
                targets.splice(sphereIndex, 1);

                scene.remove(dart);
                projectiles.splice(dartIndex, 1);
                break; // Exit early since dart is removed
            }
        }
    }
}

renderer.setAnimationLoop(animate);
window.addEventListener("click", onClick);

setTimeout(() => {
    startGameStopAnimation();
    running = false; // halt the animation loop
}, GAMETIMER);

function startGameStopAnimation() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 3s ease';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
}



// TODO:
// fix point system positioning on sphere
// terminating condition: curtain close for game end, add countdown, replay screen or termination screen
// Add background props and material
// depth perception, add shaders or other elements in background
// dart minimizes too quickly
// change gun to a blaster, reticle preferred to be two concentric circles or red color
// implement gravity for projectiles, balls disappear after falling down?
// implement balls bouncing off objects
// fast moving ball/bird in the air
// maybe have things pop up at random times
// randomness aspect to the game
// computer vision
// reload?


// Feedback:
// targets more than one shot to destroy
// target collision animation
// other models for targets
// make it into a midway mania theme?
// accuracy tracker?