const transitionSeconds = 2;

function showCurtainAnimation(callback) {
    const createCurtain = (side, startPos, transformOrigin) => {
        const curtain = document.createElement('div');
        Object.assign(curtain.style, {
            position: 'fixed',
            top: '0',
            [side]: startPos, // Start fully off-screen
            width: '50%',
            height: '100%',
            backgroundColor: 'red',
            backgroundImage: 'linear-gradient(90deg, rgba(0, 0, 0, 0.1) 5%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.1) 95%)',
            backgroundSize: '20px 100%',
            transition: `left ${transitionSeconds}s ease, right ${transitionSeconds}s ease, transform 0.2s ease-in-out`,
            transformOrigin: transformOrigin, // Ensures only the center bounces
        });
        document.body.appendChild(curtain);
        return curtain;
    };

    const leftCurtain = createCurtain('left', '-50%', 'right'); 
    const rightCurtain = createCurtain('right', '-50%', 'left'); 

    requestAnimationFrame(() => {
        leftCurtain.style.left = '0';
        rightCurtain.style.right = '0';
    });

    setTimeout(() => {
        leftCurtain.style.transform = 'scaleX(1.02)'; // Slight stretch inward at the center
        rightCurtain.style.transform = 'scaleX(1.02)';

        setTimeout(() => {
            leftCurtain.style.transform = 'scaleX(1)'; // Snap back to normal
            rightCurtain.style.transform = 'scaleX(1)';
            callback();
        }, 200);
    }, transitionSeconds * 1000);
}

function showGameOverScreen(points) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: '0.8',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '30px',
    });
    overlay.innerHTML = `<div>Final Score: ${points}</div>`;

    const playAgainButton = document.createElement('button');
    Object.assign(playAgainButton.style, {
        marginTop: '20px',
        padding: '15px 30px',
        fontSize: '20px',
        cursor: 'pointer',
    });
    playAgainButton.textContent = 'Play Again';
    playAgainButton.addEventListener('click', () => window.location.reload());

    overlay.appendChild(playAgainButton);
    document.body.appendChild(overlay);
}

export default function startGameStopAnimation(points) {
    showCurtainAnimation(() => showGameOverScreen(points));
}
