import * as THREE from 'three';
import { createScene } from './scene.js';
import { checkCollision } from './utils/util.js';
import { shootDart } from './models/Dart.js';
import { setHud, addTimerElement } from './hud.js';
import { HillPath, AerialPath, CurvedPath, FastPath } from './models/Path.js';
import { createBackdrop } from './models/Backdrop.js';
import { explodeAndRemove } from './models/Sphere.js';
import { addBulletCounter } from './hud.js';
import { addGun } from './hud.js'
import startGameStopAnimation from './animations/Ending.js';

// Scene Setup
const { scene, camera, renderer } = createScene();
const pointsCounter = setHud(renderer);
const bulletCounter = addBulletCounter();
const gun = addGun();

// Game Logic
let targets = [];
let projectiles = [];
let points = 0;
let bullets = 12;
let hits = 0;
let shots = 0;
const maxAmmo = 12;
const Z_FURTHEST = -20;
let GAMETIMER = 60000; // milliseconds

// Sphere Paths
const hillPath = new HillPath(scene, -30, -10, targets);
const aerialPath = new AerialPath(scene, -30, -13, targets, true);
const left_curvedPath = new CurvedPath(scene, -30, -5, targets);
const right_curvedPath = new CurvedPath(scene, -30, -5, targets, false, true);
const fastPath = new FastPath(scene, -30, -13, targets);

// Static Objects
createBackdrop(scene, hillPath.pathPoints, hillPath.depth);

// Runtime variables
let animation_time = 0;
let delta_animation_time;
let running = true;
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Game State Functions
function startGameTimer(durationMs) {
    let timeLeft = durationMs / 1000;
    const timerDiv = addTimerElement(timeLeft);

    const countdownInterval = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);

    setTimeout(() => {
        clearInterval(countdownInterval);
        endGame();
    }, durationMs);
}

function endGame() {
    running = false; // Stop animation loop
    let Accuracy = 0
    if (shots != 0) {
        Accuracy = 100 * hits / shots;
        Accuracy = parseFloat(Accuracy.toFixed(2));
    }
    startGameStopAnimation(points, Accuracy);
}

// Utility functions
function onClick(event) {
    if (running == false) {
        return;
    }
    if (bullets <= 0) {
        showReloadMessage();
        return;

    }
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    shootDart(camera, scene, raycaster, 10, projectiles);
    bullets -= 1;
    shots += 1;
    bulletCounter.textContent = `Bullets: ${bullets}`;
}

function showReloadMessage() {
    // Create the message element
    const message = document.createElement('div');
    message.textContent = "Press 'R' to reload!";
    message.style.position = 'absolute';
    message.style.bottom = '20px'; 
    message.style.left = '50%'; 
    message.style.transform = 'translateX(-50%)'; 
    message.style.backgroundColor = 'rgba(0, 0, 0, 1)'; 
    message.style.color = 'white';
    message.style.fontSize = '18px';
    message.style.fontFamily = 'Arial, sans-serif';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '1000'; 
    document.body.appendChild(message);

    // Remove the message after 1.5 seconds
    setTimeout(() => {
        message.style.transition = 'opacity 0.5s ease-out'; 
        message.style.opacity = '0'; 
        setTimeout(() => message.remove(), 500); 
    }, 1500); 
}

function reload() {
    gun.style.transition = 'opacity 0.5s ease-in-out'; 
    gun.style.opacity = '0';
    

    setTimeout(() => {
        bullets = maxAmmo; 
        bulletCounter.textContent = `Bullets: ${bullets}`; 
        gun.style.transition = 'opacity 0.5s ease-in-out'; 
        gun.style.opacity = '1'; 
    }, 1500);
    
   
}

function animate() {
    if (!running) return;

    renderer.render(scene, camera);

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
                hits += 1;
                // Remove sphere and dart
                explodeAndRemove(scene, sphere);
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
window.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        reload(); // Reload the bullets when "R" is pressed
    }
});


// Start the game timer
startGameTimer(GAMETIMER);



// TODO:
//////////////
// Priority //
//////////////

/*
during end screen, add some toy story characters waving next to play again button
background styling (mountains, add trees?)
raycaster instant deletion of the spheres?
top 5 high score features
maybe have a sphere hide behind a box and go up and down
performance efficiency
random movement
blaster cart model POV
*/

///////////////
// Secondary //
///////////////
/*
dart minimizes too quickly
Add background props and material
change gun to a blaster
*/

/////////////
// Feeback //
/////////////
/* 
targets more than one shot to destroy
target collision animation
other models for targets
*/