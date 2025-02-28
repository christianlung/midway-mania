import * as THREE from 'three';

export function createSphere(scene, points=100) {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const phongMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        shininess: 100 
    });
    const sphere = new THREE.Mesh(geometry, phongMaterial);
    sphere.matrixAutoUpdate = false;
    sphere.userData.points = points;

    const label = createLabelSprite(points.toString());
    // Position the label at the front of the sphere (assuming front is along the positive z-axis)
    label.position.set(0, 0, 1.0); 
    sphere.add(label);

    scene.add(sphere);
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
    context.fillStyle = 'white';
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