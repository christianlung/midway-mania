import * as THREE from 'three';
import { context } from 'three/tsl';

const geometry = new THREE.SphereGeometry(1, 32, 32);

const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFDE00,
    shininess: 100
});

function createStarShape(innerRadius, outerRadius, numPoints) {
    const shape = new THREE.Shape();
    const angleStep = Math.PI / numPoints;

    for (let i = 0; i < 2 * numPoints; i++) {
      const radius = (i % 2 === 0) ? outerRadius : innerRadius;
      const angle = i * angleStep + Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();
    return shape;
}

export function createSphere(scene, points = 100) {
    const sphere = new THREE.Mesh(geometry, phongMaterial);
    sphere.matrixAutoUpdate = false;
    sphere.userData.points = points;

    const label = createLabelSprite(points.toString());
    // Position the label at the front of the sphere (assuming front is along the positive z-axis)
    label.position.set(0, 0, 1.0);
    sphere.add(label);
    scene.add(sphere);

    const starShape = createStarShape(0.2, 0.5, 5);
    const starGeometry = new THREE.ShapeGeometry(starShape);
    starGeometry.center();
    const starMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.position.set(0, 0, 1);
    sphere.add(starMesh);

    return sphere;
}

function createLabelSprite(text) {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;


    const context = canvas.getContext('2d');
    context.clearRect(0, 0, size, size);
    context.font = 'Bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'black';
    context.fillText(text, size / 2, size / 2);
    context.lineWidth = 4;
    context.strokeText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.center.set(0.5, 0.5);

    sprite.scale.set(3.5, 3.5, 1);

    return sprite;
}

export function explodeAndRemove(scene, sphere, flickerColor = 0xffffff, duration = 500) {
    // Clone the material to prevent affecting all spheres
    const originalMaterial = sphere.material;
    sphere.material = originalMaterial.clone(); 
  
    const originalColor = sphere.material.color.getHex(); 
    let elapsed = 0;
    const interval = 100; // Time per flicker in milliseconds
    let flickerState = false; 
  
    function animateFlicker() {
      if (elapsed < duration) {
        // Toggle between the original and flicker color
        sphere.material.color.setHex(flickerState ? originalColor : flickerColor);
        flickerState = !flickerState;
  
        elapsed += interval;
        setTimeout(animateFlicker, interval);
      } else {
        // Remove sphere and dispose of the cloned material
        scene.remove(sphere);
        sphere.material.dispose();
      }
    }
  
    animateFlicker();
  }
  
  