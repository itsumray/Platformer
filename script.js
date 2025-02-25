// Select elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOver");
const timeTakenText = document.getElementById("timeTaken");
const restartButton = document.getElementById("restartButton");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let startTime, animationFrameId;

// Player object
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 70,
    width: 40,
    height: 40,
    color: "blue",
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: -15,
    isJumping: false,
};

// Platforms array (longer stage with moving platforms)
const platforms = [
    { x: -10, y: canvas.height -20, width: canvas.width +20, height:20 }, // Ground
    { x: canvas.width /2 -100, y: canvas.height -100, width:200, height:20 },
    { x: canvas.width /2 +150, y: canvas.height -200, width:200, height:20 },
];

// Moving platform
const movingPlatform = {
    x: canvas.width /2 -50,
    y: canvas.height -150,
    width:100,
    height:10,
    directionX :1,
};

// Goal object at the top
const goal = { x: canvas.width /2 -15 , y : canvas.height -300 , width :30 , height :30 };

// Handle keyboard input
const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.code] = true;

    // Restart game with "R" key
    if (e.code === "KeyR") {
        restartGame();
    }
});
window.addEventListener("keyup", (e) => (keys[e.code] = false));

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Move player left/right using both Arrow keys and WASD keys
    if (keys["ArrowRight"] || keys["KeyD"]) player.dx = player.speed;
    else if (keys["ArrowLeft"] || keys["KeyA"]) player.dx = -player.speed;
    else player.dx = 0;

    // Jumping logic
    if ((keys["Space"] || keys["KeyW"]) && !player.isJumping) {
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

   // Moving platform logic 
   movingPlatform.x += movingPlatform.directionX *2; // Move at a speed of '2'
   if(movingPlatform.x <=0 || movingPlatform.x + movingPlatform.width >=canvas.width) movingPlatform.directionX *= -1; // Reverse direction when hitting edges

   // Draw the moving platform
   ctx.fillStyle = "orange";
   ctx.fillRect(movingPlatform.x, movingPlatform.y, movingPlatform.width, movingPlatform.height);

   // Check collision with the moving platform 
   if (
       player.x < movingPlatform.x + movingPlatform.width &&
       player.x + player.width > movingPlatform.x &&
       player.y + player.height <= movingPlatform.y &&
       player.y + player.height + player.dy >= movingPlatform.y
   ) {
       player.dy = gravity; // Stop falling on the moving platform
       player.isJumping = false; 
       player.y = movingPlatform.y - player.height; 
       player.x += movingPlatform.directionX *2; // Move with the platform 
   }

   // Prevent falling through the floor or below the screen 
   if (player.y + player.height > canvas.height) {
       resetPlayer();
   }

   // Draw the player as a square character 
   ctx.fillStyle = player.color;
   ctx.fillRect(player.x, player.y, player.width, player.height);

   // Draw platforms 
   platforms.forEach((platform) => {
       ctx.fillStyle = "green";
       ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
   });

   // Draw goal at the top 
   ctx.fillStyle = "red";
   ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

   // Check for win condition when reaching the goal 
   if (
       player.x < goal.x + goal.width &&
       player.x + player.width > goal.x &&
       player.y < goal.y + goal.height &&
       player.y + player.height > goal.y
     ) {
       endGame();
     }

     animationFrameId = requestAnimationFrame(gameLoop);
}

// Start game function to show start screen and initialize timer.
function startGame() {
   startScreen.classList.add("hidden");
   canvas.classList.remove("hidden");
   startTime = Date.now();
   gameLoop();
}

// End game function to show time taken and restart button.
function endGame() {
   const endTime = Date.now();
   const timeTaken = Math.floor((endTime - startTime) /1000);
   timeTakenText.innerText = `Time Taken : ${timeTaken} seconds`;
   gameOverScreen.classList.remove("hidden");
   cancelAnimationFrame(animationFrameId);
}

// Restart button functionality.
restartButton.addEventListener("click", () => {
   restartGame();
});

// Start button functionality.
startButton.addEventListener("click", () => {
   startGame();
});

// Function to restart the game.
function restartGame() {
   location.reload(); // Reload the page to restart the game.
}

// Reset player's position after falling off screen.
function resetPlayer() {
     player.x=canvas.width/2-20; 
     player.y=canvas.height-70; 
     alert('You fell! Try again!');
}
