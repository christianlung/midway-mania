import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create Scene with sunlight, ambient light, and background
const scene = new THREE.Scene();
const sunLight = new THREE.DirectionalLight(0xffffff, 3);
sunLight.position.set(10, 10, 10);
scene.add(sunLight);
scene.background = new THREE.Color(0x87CEEB);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Position camera and center of interest
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 2, 10);
camera.lookAt(0, 0, 0); 

// Add ground to the scene
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50), // Large ground area
    new THREE.MeshPhongMaterial({ color: 0x228B22 }) // Grass green
);
ground.rotation.x = -Math.PI / 2; // Rotate to be flat
ground.position.y = 0; // Adjust height
scene.add(ground);

//Add shiny sphere to the scene
const geometry = new THREE.SphereGeometry(1, 32, 32);
const phong_material = new THREE.MeshPhongMaterial({
	color: 0x00ff00,
    shininess: 100 
});
const sphere = new THREE.Mesh(geometry, phong_material);
sphere.position.y = 3;
scene.add(sphere);

// Add axis lines
const createAxisLine = (color, start, end) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};

const xAxis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0)); // Red
const yAxis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0)); // Green
const zAxis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3)); // Blue
scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);

// Animation and clock
let animation_time = 0;
let delta_animation_time;
const clock = new THREE.Clock();

function animate() {
	renderer.render( scene, camera );

	delta_animation_time = clock.getDelta();
    animation_time += delta_animation_time; 

	const translationX = Math.sin(animation_time) * 2; 
    sphere.position.x = translationX;

}

renderer.setAnimationLoop( animate );
