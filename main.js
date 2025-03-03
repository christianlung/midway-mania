import * as THREE from 'three';
import { createScene } from './scene.js';
import { checkCollision } from './utils/util.js';
import { shootDart } from './models/Dart.js';
import { setHud } from './hud.js';
import { HillPath, AerialPath, CurvedPath, FastPath } from './models/Path.js';
import { createBackdrop } from './models/Backdrop.js';
import { explodeAndRemove } from './models/Sphere.js';

// Scene Setup
const { scene, camera, renderer } = createScene();
const pointsCounter = setHud(renderer);

// Game Logic
let targets = [];
let projectiles = [];
let points = 0;
const Z_FURTHEST = -20;
const GAMETIMER = 60000; // milliseconds

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

// Utility functions
function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    shootDart(camera, scene, raycaster, 10, projectiles);
}

function startGameStopAnimation() {
    // 1. Stop the game loop if needed
  
    // 2. Start the curtain animation
    showCurtainAnimation();
  
    // 3. Wait ~2 seconds (the time it takes for curtains to close), then show scoreboard
    setTimeout(() => {
      // --- Your scoreboard code here ---
      // For instance:
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'black';
      overlay.style.opacity = '0.8';
      overlay.style.pointerEvents = 'auto';
      document.body.appendChild(overlay);
  
      const finalScore = document.createElement('div');
      finalScore.textContent = `Final Score: ${points}`;
      finalScore.style.position = 'absolute';
      finalScore.style.top = '50%';
      finalScore.style.left = '50%';
      finalScore.style.transform = 'translate(-50%, -50%)';
      finalScore.style.fontSize = '30px';
      finalScore.style.color = 'white';
      overlay.appendChild(finalScore);
  
      // "Play Again" button
      const playAgainButton = document.createElement('button');
      playAgainButton.textContent = 'Play Again';
      playAgainButton.style.position = 'absolute';
      playAgainButton.style.top = '60%';
      playAgainButton.style.left = '50%';
      playAgainButton.style.transform = 'translate(-50%, -50%)';
      playAgainButton.style.padding = '15px 30px';
      playAgainButton.style.fontSize = '20px';
      playAgainButton.style.cursor = 'pointer';
      overlay.appendChild(playAgainButton);
  
      // On click, reload the page
      playAgainButton.addEventListener('click', () => {
        window.location.reload();
      });
  
    }, 2000); // match the curtain transition time
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

export function addTimerElement() {
    const timerDiv = document.createElement('div');
    timerDiv.style.position = 'absolute';
    timerDiv.style.top = '10px';
    timerDiv.style.left = '10px';
    timerDiv.style.color = 'white';
    timerDiv.style.fontSize = '20px';
    timerDiv.style.fontFamily = 'Arial, sans-serif';
    timerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    timerDiv.style.padding = '5px';
    timerDiv.textContent = 'Time: 60'; // initial text, e.g. 60 seconds
    document.body.appendChild(timerDiv);
    return timerDiv;
}
const timerDiv = addTimerElement(); // create the timer
let remainingTime = 60; // In seconds (or however long your game is)

// Update the timer text once per second
const countdownInterval = setInterval(() => {
    remainingTime--;
    timerDiv.textContent = `Time: ${remainingTime}`;

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        // Handle game end logic here if you want,
        // or rely on your existing setTimeout logic.
    }
}, 1000);

function showCurtainAnimation() {
    const leftCurtain = document.createElement('div');
    leftCurtain.style.position = 'fixed';
    leftCurtain.style.top = '0';
    leftCurtain.style.left = '-50%'; // start hidden to the left
    leftCurtain.style.width = '50%';
    leftCurtain.style.height = '100%';
    leftCurtain.style.backgroundColor = 'red';
    leftCurtain.style.transition = 'left 2s ease';
    document.body.appendChild(leftCurtain);

    const rightCurtain = document.createElement('div');
    rightCurtain.style.position = 'fixed';
    rightCurtain.style.top = '0';
    rightCurtain.style.right = '-50%'; // start hidden to the right
    rightCurtain.style.width = '50%';
    rightCurtain.style.height = '100%';
    rightCurtain.style.backgroundColor = 'red';
    rightCurtain.style.transition = 'right 2s ease';
    document.body.appendChild(rightCurtain);

    // Trigger the animation
    requestAnimationFrame(() => {
        leftCurtain.style.left = '0';
        rightCurtain.style.right = '0';
    });
}



renderer.setAnimationLoop(animate);
window.addEventListener("click", onClick);

// Game Timeout
setTimeout(() => {
    startGameStopAnimation();
    running = false; // halt the animation loop
}, GAMETIMER);



// TODO:
//////////////
// Priority //
//////////////

/*
layout
during end screen, add some toy story characters waving next to play again button
background styling (mountains, add trees?)
game end: countdown timer somewhere, curtain close animation, replay screen
*/

///////////////
// Secondary //
///////////////
/*
implement gravity for projectiles, balls disappear after falling down?
dart minimizes too quickly
depth perception, add shaders or other elements in background
Add background props and material
change gun to a blaster, reticle preferred to be two concentric circles or red color
maybe have things pop up at random times
randomness aspect to the game
reload?
computer vision
*/

/////////////
// Feeback //
/////////////
/* 
targets more than one shot to destroy
target collision animation
other models for targets
make it into a midway mania theme?
accuracy tracker?
*/