import * as THREE from 'three';
import { createScene } from './scene.js';
import { checkCollision } from './utils/util.js';
import { shootDart } from './models/Dart.js';
import { setHud } from './hud.js';
import { HillPath, AerialPath} from './models/Path.js';

// testing purposes
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const editMode = false;

// Stores all objects in the scene
let targets = [];
let projectiles = [];
let points = 0;

const { scene, camera, renderer } = createScene();
const pointsCounter = setHud(renderer);

let controls;
if (editMode) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
}

const hill = new HillPath(scene, -30, -10, 1.0, targets);
const aerial = new AerialPath(scene, -30, -13, 1.0, targets);

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
    if (editMode) {
        controls.update();
    }

    delta_animation_time = clock.getDelta();
    animation_time += delta_animation_time;

    for (let dartIndex = projectiles.length - 1; dartIndex >= 0; dartIndex--) {
        let dart = projectiles[dartIndex];
        dart.position.add(dart.userData.velocity.clone().multiplyScalar(5 * delta_animation_time));

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


// TODO:
// reverse and offset to the paths
// dart minimizes too quickly
// change gun to a blaster
// find other models for targets
// implement gravity for projectiles
    // implement balls disappear after falling down?
    // implement balls bouncing off objects
// change transformation instead of steady stream