import * as THREE from 'three';

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
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.center.set(0.5, 0.5);

    sprite.scale.set(3, 3, 1);

    return sprite;
}

let explosionTemplate = null;
const numExplosionParticles = 10;
const explosionGeometry = new THREE.SphereGeometry(0.05, 8, 8);
const explosionMaterial = new THREE.MeshBasicMaterial({ color: 0xFFDE00 });

export function explodeAndRemove(scene, sphere, duration = 750) {
  // Get the sphere's world position.
  const worldPos = new THREE.Vector3();
  sphere.getWorldPosition(worldPos);
  
  if (!explosionTemplate) {
    explosionTemplate = [];
    for (let i = 0; i < numExplosionParticles; i++) {
      explosionTemplate.push(new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ));
    }
  }
  
  const particles = new THREE.Group();
  for (let i = 0; i < numExplosionParticles; i++) {
    const particle = new THREE.Mesh(explosionGeometry, explosionMaterial);
    particle.position.copy(worldPos);
    particle.userData.velocity = explosionTemplate[i].clone();
    particles.add(particle);
  }
  
  scene.add(particles);
  scene.remove(sphere);
  
  const startTime = performance.now();
  function animate() {
    const elapsed = performance.now() - startTime;
    particles.children.forEach(particle => {
      particle.position.add(particle.userData.velocity.clone().multiplyScalar(0.02));
    });
    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      scene.remove(particles);
    }
  }
  animate();
}
