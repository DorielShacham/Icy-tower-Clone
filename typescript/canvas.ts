//---------------------------------------------------------------------
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const player = new Player();
let floors: Floor[] = [];
let lastFloorId = 0;

// Vertical offset for the canvas
let canvasOffsetY = 0;
let hasStartedMovingUp = false;
let hasStartedMovingDown = false;

// Function to move the canvas up
function moveCanvasUp() {
  if (!hasStartedMovingUp && player.y + player.height < canvas.height / 2) {
    // Start moving the canvas up only when the player's y position is less than half of the canvas height
    canvasOffsetY += 1;
  }
}

//generate the floors
function generateFloor() {
  const minGap = 100;
  const maxGap = 200;
  const minWidth = 250;
  const maxWidth = 200;

  const lastFloor = floors[floors.length - 1];
  const y = lastFloor ? lastFloor.y - 100 : canvas.height - 20 - canvasOffsetY; // Apply the vertical offset to the first floor

  const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
  const width = floors.length === 0 ? canvas.width : Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  const x = floors.length === 0 ? 0 : Math.floor(Math.random() * (canvas.width - width));

  floors.push(new Floor(x, y, width, lastFloorId));
  lastFloorId++;
}

function removeFloors() {
  floors = floors.filter((floor) => floor.y + floor.height > -canvasOffsetY); // Remove floors above the canvas
}
//--

//-- gameover popup
let gameOver = false;
function showGameOverPopup() {
  const popup = document.getElementById("popup")!;
  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart";
  restartButton.addEventListener("click", () => {
    location.reload(); // Reload the page to restart the game
  });
  popup.innerHTML = "You touched the floor! Game Over!";
  popup.appendChild(restartButton);
  popup.style.display = "block";
}
//--

//movement left right
let isLeftKeyPressed = false;
let isRightKeyPressed = false;
function onKeyDown(event: KeyboardEvent) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    isLeftKeyPressed = true;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    isRightKeyPressed = true;
  }
}
function onKeyUp(event: KeyboardEvent) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    isLeftKeyPressed = false;
  } else if (event.key === "ArrowRight" || event.key === "d") {
    isRightKeyPressed = false;
  }
}
//--
//jump
function onKeyPress(event: KeyboardEvent) {
  if (event.key === " ") {
    player.jump();
  }
}
//--
document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
document.addEventListener("keypress", onKeyPress);
//---------------------------------------------------------------------
//update frames
let updateInterval: number; 
function update() {
  if (!gameOver) {
    moveCanvasUp();
    if (isLeftKeyPressed) {
      player.x -= 5;
    } else if (isRightKeyPressed) {
      player.x += 5;
    }
    player.update();

    let floorCollision = false;
    let targetFloorId: number | null = null; // Keep track of the ID of the target floor

    // Check collision with the first floor separately
    const firstFloor = floors[0];
    if (
      player.x < firstFloor.x + firstFloor.width &&
      player.x + player.width > firstFloor.x &&
      player.y + player.height > firstFloor.y
    ) {
      floorCollision = true;
      targetFloorId = firstFloor.id; // Save the ID of the first floor
    } else {
      // Check collision with other floors
      for (const floor of floors) {
        if (
          player.x < floor.x + floor.width &&
          player.x + player.width > floor.x &&
          player.y + player.height > floor.y
        ) {
          floorCollision = true;
          targetFloorId = floor.id; // Save the ID of the target floor
          break;
        }
      }
    }

    // Apply automatic jump only if the player is not currently jumping or is falling
    if (targetFloorId !== null && (player.isJumping || player.velocityY >= 0)) {
      // Check if the player's y position is close to the target floor's y position
      if (Math.abs(player.y + player.height - floors[targetFloorId].y) <= 5) {
        player.y = floors[targetFloorId].y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
      }
    }

    // Reset isJumping to false if the player is on the floor or falling
    if (floorCollision || player.velocityY > 0) {
      player.isJumping = false;
    }

    removeFloors();

    if (floors.length === 0 || floors[floors.length - 1].y > 100) {
      generateFloor();
    }

    if (player.y >= canvas.height) {
      gameOver = true;
      showGameOverPopup();
      clearInterval(updateInterval); // Stop the update loop when the game is over
    }
  }
}
//--
//draw frames
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0, canvasOffsetY); // Apply the vertical offset to the canvas

  // Draw player and floors
  player.draw(ctx);
  for (const floor of floors) {
    floor.draw(ctx);
  }

  // Reset the canvas transformation
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  requestAnimationFrame(draw);
}
//--

generateFloor();
updateInterval = setInterval(update, 800 / 60);
draw()