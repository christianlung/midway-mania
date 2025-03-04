const transitionSeconds = 2;

function showCurtainAnimation(callback) {
    const createCurtain = (side, startPos) => {
        const curtain = document.createElement('div');
        Object.assign(curtain.style, {
            position: 'fixed',
            top: '0',
            [side]: startPos,
            width: '50%',
            height: '100%',
            backgroundColor: 'red',
            transition: `all ${transitionSeconds}s ease`,
        });
        document.body.appendChild(curtain);
        return curtain;
    };

    const leftCurtain = createCurtain('left', '-50%');
    const rightCurtain = createCurtain('right', '-50%');

    requestAnimationFrame(() => {
        leftCurtain.style.left = '0';
        rightCurtain.style.right = '0';
    });

    setTimeout(callback, transitionSeconds * 1000);
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
