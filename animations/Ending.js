const transitionSeconds = 2;

function showCurtainAnimation(callback) {
    // Create a fringe element
    const fringe = document.createElement('div');
    Object.assign(fringe.style, {
        position: 'fixed',
        top: '-100%', // Initially hidden above the screen
        left: '0',
        width: '100%',
        height: '100%', // Adjust based on your fringe image height
        backgroundImage: 'url("images/fringe.png")',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        zIndex: '1000',
        transform: 'scale(2)',
        transition: 'top 0.3s ease-in-out, transform 2s ease-in-out',
    });
    document.body.appendChild(fringe);

    // Create the curtains
    const createCurtain = (side, startPos, transformOrigin) => {
        const curtain = document.createElement('div');
        Object.assign(curtain.style, {
            position: 'fixed',
            top: '0',
            [side]: startPos,
            width: '50%',
            height: '100%',
            backgroundColor: 'rgba(222,30,39,1)', // Main curtain color
            backgroundImage: 'linear-gradient(90deg, rgba(95,1,2,1) 10%, rgba(222,30,39,1) 50%, rgba(95,1,2,1) 90%)', // Wider shadow spacing
            backgroundSize: '40px 100%',
            transition: `left ${transitionSeconds}s ease, right ${transitionSeconds}s ease, transform 0.2s ease-in-out`,
            transformOrigin: transformOrigin,
            zIndex: '999',
        });
        document.body.appendChild(curtain);
        return curtain;
    };

    const leftCurtain = createCurtain('left', '-50%', 'right');
    const rightCurtain = createCurtain('right', '-50%', 'left');

    // Animate the fringe first
    setTimeout(() => {
        fringe.style.top = '0';
        fringe.style.transform = 'scale(1)';
    }, 100);

    // Slide in the curtains after the fringe appears
    setTimeout(() => {
        requestAnimationFrame(() => {
            leftCurtain.style.left = '0';
            rightCurtain.style.right = '0';
        });

        setTimeout(() => {
            leftCurtain.style.transform = 'scaleX(1.02)';
            rightCurtain.style.transform = 'scaleX(1.02)';

            setTimeout(() => {
                leftCurtain.style.transform = 'scaleX(1)';
                rightCurtain.style.transform = 'scaleX(1)';
                callback();
            }, 200);
        }, transitionSeconds * 1000);
    }, 2000); // Delay so fringe appears first
}

function showGameOverScreen(points) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '30px',
        zIndex: '1001'
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
