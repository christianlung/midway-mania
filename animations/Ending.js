const transitionSeconds = 2;

function showCurtainAnimation() {
    const leftCurtain = document.createElement('div');
    leftCurtain.style.position = 'fixed';
    leftCurtain.style.top = '0';
    leftCurtain.style.left = '-50%'; // start hidden to the left
    leftCurtain.style.width = '50%';
    leftCurtain.style.height = '100%';
    leftCurtain.style.backgroundColor = 'red';
    leftCurtain.style.transition = 'left 2s ease';
    document.body.appendChild(leftCurtain);

    const rightCurtain = document.createElement('div');
    rightCurtain.style.position = 'fixed';
    rightCurtain.style.top = '0';
    rightCurtain.style.right = '-50%'; // start hidden to the right
    rightCurtain.style.width = '50%';
    rightCurtain.style.height = '100%';
    rightCurtain.style.backgroundColor = 'red';
    rightCurtain.style.transition = 'right ${transitionSeconds}s ease';
    document.body.appendChild(rightCurtain);

    // Trigger the animation
    requestAnimationFrame(() => {
        leftCurtain.style.left = '0';
        rightCurtain.style.right = '0';
    });
}

export default function startGameStopAnimation(points) {
    // 1. Stop the game loop if needed
  
    // 2. Start the curtain animation
    showCurtainAnimation();
  
    // 3. Wait ~2 seconds (the time it takes for curtains to close), then show scoreboard
    setTimeout(() => {
      // --- Your scoreboard code here ---
      // For instance:
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'black';
      overlay.style.opacity = '0.8';
      overlay.style.pointerEvents = 'auto';
      document.body.appendChild(overlay);
  
      const finalScore = document.createElement('div');
      finalScore.textContent = `Final Score: ${points}`;
      finalScore.style.position = 'absolute';
      finalScore.style.top = '50%';
      finalScore.style.left = '50%';
      finalScore.style.transform = 'translate(-50%, -50%)';
      finalScore.style.fontSize = '30px';
      finalScore.style.color = 'white';
      overlay.appendChild(finalScore);
  
      // "Play Again" button
      const playAgainButton = document.createElement('button');
      playAgainButton.textContent = 'Play Again';
      playAgainButton.style.position = 'absolute';
      playAgainButton.style.top = '60%';
      playAgainButton.style.left = '50%';
      playAgainButton.style.transform = 'translate(-50%, -50%)';
      playAgainButton.style.padding = '15px 30px';
      playAgainButton.style.fontSize = '20px';
      playAgainButton.style.cursor = 'pointer';
      overlay.appendChild(playAgainButton);
  
      // On click, reload the page
      playAgainButton.addEventListener('click', () => {
        window.location.reload();
      });
  
    }, transitionSeconds * 1000); // match the curtain transition time
  }
  