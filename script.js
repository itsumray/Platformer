// Select the canvas and set up the context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const gravity = 0.5;

// Player object
const player = {
  x: 100,
  y: canvas.height - 150,
  width: 50,
  height: 50,
  color: "blue",
  dx: 0,
  dy: 0,
  speed: 5,
  jumpPower: -15,
  isJumping: false,
};

// Platforms array
const platforms = [
  { x: 50, y: canvas.height - 100, width: 200, height: 20 },
  { x: 300, y: canvas.height - 200, width: 200, height: 20 },
  { x: 600, y: canvas.height - 300, width: 200, height: 20 },
];

// Handle keyboard input
const keys = {};
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      player.dy = 0; // Stop falling
      player.isJumping = false; // Allow jumping again
      player.y = platform.y - player.height; // Snap to platform surface
    }
  });

  // Prevent falling through the floor
  if (player.y + player.height > canvas.height) {
    player.dy = 0;
    player.isJumping = false;
    player.y = canvas.height - player.height;
  }

  // Draw the player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw platforms
  platforms.forEach((platform) => {
    ctx.fillStyle = "green";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
