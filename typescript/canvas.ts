//---------------------------------------------------------------------
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const player = new Player();
let floors: Floor[] = [];

//generate the floors
function generateFloor() {
  const minGap = 100;
  const maxGap = 300;
  const minWidth = 50;
  const maxWidth = 200;

  const lastFloor = floors[floors.length - 1];
  const y = lastFloor ? lastFloor.y - 100 : canvas.height - 20; // Ensure the first floor starts at the bottom of the canvas

  const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
  const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  const x = Math.floor(Math.random() * (canvas.width - width)); // Ensure the floor is within the canvas width

  floors.push(new Floor(x, y, width));
}

function removeFloors() {
  floors = floors.filter((floor) => floor.y + floor.height > 0);
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


//update frames
function update() {
  if (!gameOver) {
    if (isLeftKeyPressed) {
      player.x -= 5;
    } else if (isRightKeyPressed) {
      player.x += 5;
    }
    player.update();

    let floorCollision = false;

    for (const floor of floors) {
      if (
        player.x < floor.x + floor.width &&
        player.x + player.width > floor.x &&
        player.y + player.height > floor.y
      ) {
        floorCollision = true;

        if (player.isJumping) {
          player.y = floor.y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
        } else {
          // Adjust player's y velocity to "bounce" off the floor
          player.velocityY = -10;
        }
        break;
      }
    }

    // If there was no floor collision, set isJumping to true
    if (!floorCollision) {
      player.isJumping = true;
    }

    removeFloors();

    if (floors.length === 0 || floors[floors.length - 1].y > 100) {
      generateFloor();
    }

    if (player.y >= canvas.height) {
      gameOver = true;
      showGameOverPopup();
    }
  }
}




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

//jump
function onKeyPress(event: KeyboardEvent) {
  if (event.key === " ") {
    player.jump();
  }
}
  
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("keypress", onKeyPress);
//---------------------------------------------------------------------
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  for (const floor of floors) {
    floor.draw(ctx);
  }
  requestAnimationFrame(draw);
}

generateFloor();
setInterval(update, 1000 / 60);
draw();
