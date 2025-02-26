import * as THREE from 'three';

export function createJaggedBackdrop(scene, startX, depth, scale) {
    const points = [
        [0, 0],
        [1, 3],
        [2, 3],
        [3, 6],
        [4, 6.25],
        [6, 11],
        [12, 11],
        [14, 7],
        [15, 7],
        [16, 3],
        [18, 3],
        [20, 0]
    ];
    const jaggedShape = new THREE.Shape();

    jaggedShape.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];
        jaggedShape.lineTo(x, y);
    }

    jaggedShape.lineTo(points[points.length - 1][0], -1);
    jaggedShape.lineTo(points[0][0], -1);
    jaggedShape.lineTo(points[0][0], points[0][1]);

    const extrudeSettings = {
        depth: 0.25,          // thickness of the extruded shape
        bevelEnabled: false
    };

    const geometry = new THREE.ExtrudeGeometry(jaggedShape, extrudeSettings);

    const material = new THREE.MeshStandardMaterial({
        color: 0xff8c00,    // example color (orange)
        flatShading: true,
        side: THREE.DoubleSide
    });

    const backdropMesh = new THREE.Mesh(geometry, material);
    backdropMesh.position.set(startX, 0, depth);
    backdropMesh.scale.set(scale, scale, scale)

    scene.add(backdropMesh);

}

export function addMountains(scene) {
    const mountainProperties = [
        { startX: -10, depth: -15, scale: 1.5 },
        { startX: 17, depth: -20, scale: 1 },
        { startX: -20, depth: -20, scale: 0.75 }
    ]

    mountainProperties.forEach(({ startX, depth, scale }) => {
        createJaggedBackdrop(scene, startX, depth, scale);
    });
}