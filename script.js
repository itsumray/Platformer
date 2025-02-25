// Select the canvas and set up the context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const gravity = 0.5;
let startTime;

// Player object
const player = {
  x: 100,
  y: canvas.height - 150,
  width: 40,
  height: 40,
  color: "blue",
  dx: 0,
  dy: 0,
  speed: 5,
  jumpPower: -15,
  isJumping: false,
};

// Platforms array (multiple stages)
const platforms = [
    { x: -10, y: canvas.height - 20, width: canvas.width + 20, height: 20 }, // Ground
    { x: 50, y: canvas.height - 100, width: 200, height: 20 },
    { x: 300, y: canvas.height - 200, width: 200, height: 20 },
    { x: canvas.width - 250, y: canvas.height - 300, width: 200, height: 20 },
];

// Finish line
const finishLine = { x: canvas.width - 100, y: canvas.height - 120, width: 10, height: platform[1].height };

// Handle keyboard input
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Move player left/right
    if (keys["ArrowRight"]) player.dx = player.speed;
    else if (keys["ArrowLeft"]) player.dx = -player.speed;
    else player.dx = 0;

    // Jumping logic
    if (keys["Space"] && !player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }

    // Apply gravity
    player.dy += gravity;

    // Update player position
    player.x += player.dx;
    player.y += player.dy;

    // Collision detection with platforms
    platforms.forEach((platform) => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height <= platform.y &&
            player.y + player.height + player.dy >= platform.y
        ) {
            player.dy = gravity; // Stop falling
            player.isJumping = false; // Allow jumping again
            player.y = platform.y - player.height; // Snap to platform surface
        }
    });

    // Prevent falling through the floor
    if (player.y + player.height > canvas.height) {
        player.dy = gravity; 
        player.isJumping = false; 
        player.y = canvas.height - player.height; 
    }

    // Draw the player as a square character
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    platforms.forEach((platform) => {
        ctx.fillStyle = "green";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw finish line
    ctx.fillStyle = "red";
    ctx.fillRect(finishLine.x, finishLine.y, finishLine.width, finishLine.height);

    // Check for win condition
    if (
        player.x < finishLine.x + finishLine.width &&
        player.x + player.width > finishLine.x &&
        player.y < finishLine.y + finishLine.height &&
        player.y + player.height > finishLine.y
      ) {
        endGame();
      }

      requestAnimationFrame(gameLoop);
}

// Start the game loop and timer function
function startGame() {
   startTime = Date.now();
   gameLoop();
}

// End game function to show time taken and restart button
function endGame() {
   const endTime = Date.now();
   const timeTaken = Math.floor((endTime - startTime) / 1000);
   document.getElementById("timeTaken").innerText = `Time Taken: ${timeTaken} seconds`;
   document.getElementById("gameOver").classList.remove("hidden");
   cancelAnimationFrame(requestAnimationFrame(gameLoop));
}

// Restart button functionality
document.getElementById("restartButton").addEventListener("click", () => {
   location.reload(); // Reload the page to restart the game.
});

// Start the game when the page loads.
startGame();
