import * as THREE from 'three';

export function translationMatrix(tx, ty, tz) {
    return new THREE.Matrix4().set(
        1, 0, 0, tx,
        0, 1, 0, ty,
        0, 0, 1, tz,
        0, 0, 0, 1
    );
}

export function rotationMatrixX(theta) {
    return new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, Math.cos(theta), -Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

export function rotationMatrixY(theta) {
    return new THREE.Matrix4().set(
        Math.cos(time + theta), 0, Math.sin(time + theta), 0,
        0, 1, 0, 0,
        -Math.sin(time + theta), 0, Math.cos(time + theta), 0,
        0, 0, 0, 1
    );
}

export function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
    Math.cos(theta), -Math.sin(theta), 0, 0,
    Math.sin(theta), Math.cos(theta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0 ,1
	);
}

export function scalingMatrix(sx, sy, sz) {
    return new THREE.Matrix4().set(
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1
    );
}

// Create sinusoidal x motion and sinusoidal y motion

// Create sinusoidal x and y, left to right, up and down

// Create circular motion with pivot

// Create closer and further

// Create bigger and smaller