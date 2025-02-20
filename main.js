import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.domElement.style.cursor = 'none';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Light sky blue

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, -30);
camera.lookAt(0, 0, 0);

// OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 4, 3);
scene.add( directionalLight );

// Materials
const phong_material_cube = new THREE.MeshPhongMaterial({
	color: 0xD3D3D3,
    shininess: 50 
});
const phong_material = new THREE.MeshPhongMaterial({
	color: 0x00ff00,
    shininess: 100 
});

// Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);
const sphere = new THREE.Mesh( geometry, phong_material );
scene.add( sphere );

// Axes
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line( geometry, material );
};

scene.add(
  createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)), // X
  createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)), // Y
  createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3))  // Z
);

// ------------------------------------------------------------------
// Create a hollow box with an open roof, now TWICE the width in X
// ------------------------------------------------------------------
function createHollowBoxWithOpenRoof() {
    // We’ll use w=20 for half the width (making total width 40)
    // and l=10 for half the height/depth (making total height/depth 20).
    const w = 20;  // half-width
    const l = 10;  // half-height and half-depth

    const positions = new Float32Array([
        // Front face (z = +l)
        -w, -l,  l, // 0
         w, -l,  l, // 1
         w,  l,  l, // 2
        -w,  l,  l, // 3
    
        // Left face (x = -w)
        -w, -l, -l, // 4
        -w, -l,  l, // 5
        -w,  l,  l, // 6 
        -w,  l, -l, // 7
       
        // Top face (unused, open roof — but we still define it)
        -w,  l, -l, // 8
         w,  l, -l, // 9
         w,  l,  l, // 10
        -w,  l,  l, // 11
       
        // Bottom face (y = –l)
        -w, -l, -l, // 12
         w, -l, -l, // 13
         w, -l,  l, // 14
        -w, -l,  l, // 15
       
        // Right face (x = +w)
         w, -l, -l, // 16
         w, -l,  l, // 17
         w,  l,  l, // 18
         w,  l, -l, // 19
       
        // Back face (unused, open — but we still define it)
        -w, -l, -l, // 20
         w, -l, -l, // 21
         w,  l, -l, // 22
        -w,  l, -l  // 23
    ]);

    // Only rendering front, left, bottom, and right faces
    // (top and back are "open" for the hollow effect).
    const indices = [
        // Front face
         0, 2, 1,
         0, 3, 2,
      
        // Left face
         4, 6, 5,
         4, 7, 6,
      
        // Bottom face
        12, 14, 13,
        12, 15, 14,
      
        // Right face
        16, 17, 18,
        16, 18, 19,
    ];

    // Normals for the faces we’re actually rendering
    const normals = new Float32Array([
        // Front face (0-3) -> (0, 0, 1)
         0,  0,  1,
         0,  0,  1,
         0,  0,  1,
         0,  0,  1,
      
        // Left face (4-7) -> (-1, 0, 0)
        -1,  0,  0,
        -1,  0,  0,
        -1,  0,  0,
        -1,  0,  0,
      
        // Top face (8-11) -> (0, 1, 0) [unused, but defined]
         0,  1,  0,
         0,  1,  0,
         0,  1,  0,
         0,  1,  0,
      
        // Bottom face (12-15) -> (0, -1, 0)
         0, -1,  0,
         0, -1,  0,
         0, -1,  0,
         0, -1,  0,
      
        // Right face (16-19) -> (1, 0, 0)
         1,  0,  0,
         1,  0,  0,
         1,  0,  0,
         1,  0,  0,
      
        // Back face (20-23) -> (0, 0, -1) [unused, but defined]
         0,  0, -1,
         0,  0, -1,
         0,  0, -1,
         0,  0, -1,
    ]);
      
    const custom_cube_geometry = new THREE.BufferGeometry();
    custom_cube_geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    custom_cube_geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    custom_cube_geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

    const cube_solid = new THREE.Mesh(custom_cube_geometry, phong_material_cube);
    cube_solid.matrixAutoUpdate = false;  // We won't move it later
    scene.add(cube_solid);
}

function addPointsCounter() {
    const pointsCounter = document.createElement('div');
    pointsCounter.style.position = 'absolute';
    pointsCounter.style.top = '10px';
    pointsCounter.style.right = '10px';
    pointsCounter.style.color = 'white';
    pointsCounter.style.fontSize = '20px';
    pointsCounter.style.fontFamily = 'Arial, sans-serif';
    pointsCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    pointsCounter.style.padding = '5px';
    pointsCounter.textContent = 'Points: 0';
    document.body.appendChild(pointsCounter);
}

function addReticle() {
    const reticle = document.createElement('div');
    reticle.style.position = 'absolute';
    reticle.style.width = '20px';
    reticle.style.height = '20px';
    reticle.style.pointerEvents = 'none';
    // Add a circular border to create a circle around the reticle
    reticle.style.border = '2px solid white';
    reticle.style.borderRadius = '50%';
    document.body.appendChild(reticle);

    // Horizontal line
    const horizontalLine = document.createElement('div');
    horizontalLine.style.position = 'absolute';
    horizontalLine.style.backgroundColor = 'white';
    horizontalLine.style.width = '100%';
    horizontalLine.style.height = '1px';
    horizontalLine.style.top = '50%';
    horizontalLine.style.left = '0';
    reticle.appendChild(horizontalLine);

    // Vertical line
    const verticalLine = document.createElement('div');
    verticalLine.style.position = 'absolute';
    verticalLine.style.backgroundColor = 'white';
    verticalLine.style.width = '1px';
    verticalLine.style.height = '100%';
    verticalLine.style.left = '50%';
    verticalLine.style.top = '0';
    reticle.appendChild(verticalLine);

    document.addEventListener('mousemove', (event) => {
        reticle.style.left = (event.clientX - 10) + 'px';
        reticle.style.top = (event.clientY - 10) + 'px';
      });
}

createHollowBoxWithOpenRoof();

// ---------------------------
// HUD: Reticle (Crosshair) + Points Counter
// ---------------------------



addReticle();
// Reticle follows mouse

addPointsCounter();

// Points counter in top-right


// ---------------------------
// HUD: Gun that Slides to Follow Cursor
// ---------------------------
const gun = document.createElement('img');
gun.src = 'pxArt-l.png';  // Replace with your actual PNG path
gun.style.position = 'absolute';
gun.style.bottom = '0px';
gun.style.width = '200px';
gun.style.pointerEvents = 'none';
document.body.appendChild(gun);

// Move the gun left/right with the mouse
document.addEventListener('mousemove', (event) => {
  const gunOffsetX = event.clientX - (gun.offsetWidth / 2);
  gun.style.left = `${gunOffsetX}px`;
});

// ---------------------------
// Animation Loop
// ---------------------------
let animation_time = 0;
const clock = new THREE.Clock();

function animate() {
  const delta_animation_time = clock.getDelta();
  animation_time += delta_animation_time; 

  // Animate sphere along x-axis
  sphere.position.x = Math.sin(animation_time) * 2;

  // Update OrbitControls
  controls.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
