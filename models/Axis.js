import * as THREE from 'three';

export function createAxisLine(color, start, end){
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color: color });
    return new THREE.Line(geometry, material);
};

export function XAxis(scene){
    const axis = createAxisLine(0xff0000, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0));
    scene.add(axis);
    return axis;
}

export function YAxis(scene){
    const axis = createAxisLine(0x00ff00, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 3, 0));
    scene.add(axis);
    return axis;
}

export function ZAxis(scene){
    const axis = createAxisLine(0x0000ff, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 3));
    scene.add(axis);
    return axis;
}