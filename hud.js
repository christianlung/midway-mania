import * as THREE from 'three';

export function setHud(renderer) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.domElement.style.cursor = 'none';
    
    addReticle();
    addGun();
    return addPointsCounter();
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

    return pointsCounter;
}

function addReticle() {
    const reticle = document.createElement('div');
    reticle.style.position = 'absolute';
    reticle.style.width = '20px';
    reticle.style.height = '20px';
    reticle.style.pointerEvents = 'none';
    // Add a circular border to create a circle around the reticle
    reticle.style.border = '3px solid red';
    reticle.style.borderRadius = '50%';
    document.body.appendChild(reticle);

    // Horizontal line
    const horizontalLine = document.createElement('div');
    horizontalLine.style.position = 'absolute';
    horizontalLine.style.backgroundColor = 'red';
    horizontalLine.style.width = '100%';
    horizontalLine.style.height = '2px';
    horizontalLine.style.top = '50%';
    horizontalLine.style.left = '0';
    reticle.appendChild(horizontalLine);

    // Vertical line
    const verticalLine = document.createElement('div');
    verticalLine.style.position = 'absolute';
    verticalLine.style.backgroundColor = 'red';
    verticalLine.style.width = '2px';
    verticalLine.style.height = '100%';
    verticalLine.style.left = '50%';
    verticalLine.style.top = '0';
    reticle.appendChild(verticalLine);
    reticle.appendChild(verticalLine);

    document.addEventListener('mousemove', (event) => {
        reticle.style.left = (event.clientX - 10) + 'px';
        reticle.style.top = (event.clientY - 10) + 'px';
      });
}

function addGun() {
    const gun = document.createElement('img');
    gun.src = 'images/pxArt-l.png'; 
    gun.style.position = 'absolute';
    gun.style.bottom = '0px';
    gun.style.width = '200px';
    gun.style.pointerEvents = 'none';
    document.body.appendChild(gun);
    document.addEventListener('mousemove', (event) => {
        const gunOffsetX = event.clientX - (gun.offsetWidth / 2);
        gun.style.left = `${gunOffsetX}px`;
      });
}

export function addTimerElement(seconds) {
    const timerDiv = document.createElement('div');
    Object.assign(timerDiv.style, {
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
    });
    timerDiv.textContent = `Time: ${seconds}`;
    document.body.appendChild(timerDiv);
    return timerDiv;
}


