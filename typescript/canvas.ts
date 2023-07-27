//---------------------------------------------------------------------
function loadGamesCanvas(): Game[] {
  try {
      const games: Game[] = [];
      // get the games from local storage
      const gamesString = localStorage.getItem('games');

      // Handle the case where there are no games in localStorage
      if (!gamesString) {
          console.error("No games found in localStorage.");
          return [];
      }
      const gamesJson = JSON.parse(gamesString);
      gamesJson.forEach((gameJson: any) => {
          const game = new Game(gameJson.userName, gameJson.score, new Date(gameJson.date));
          games.push(game);
      });
   
      return games;
  } catch (error) {
      console.error("Error loading games:", error);
      return [];
  }
}
const games:Game[]=loadGamesCanvas();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const userName = localStorage.getItem('username');
const player = new Player(userName!);
const bomb = new Bomb(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 30, 0);
const coin = new Coin(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 30, 0);

//const users: User[] = [];
let bombs: Bomb[] = [];
let coins: Coin[] = [];
let floors: Floor[] = [];

let lastFloorId = 0;
let lastBombId = 0;
let lastCoinId = 0;

// Vertical offset for the canvas
let canvasOffsetY = 0;
let hasStartedMovingUp = false;
let hasStartedMovingDown = false;

//---------------------floors functions--------------------------------------

const floorImageUrl = "../../images/stick.png";

//generate the floors
function generateFloor() {
  const minGap = 100;
  const maxGap = 200;
  const minWidth = 250;
  const maxWidth = 200;

  const lastFloor = floors[floors.length - 1];
  const y = lastFloor ? lastFloor.y - 100 : canvas.height - 20 - canvasOffsetY; // Apply the vertical offset to the first floor

  const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
  const width =
    floors.length === 0
      ? canvas.width
      : Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  const x =
    floors.length === 0
      ? 0
      : Math.floor(Math.random() * (canvas.width - width));

  floors.push(new Floor(x, y, width, lastFloorId, floorImageUrl));
  lastFloorId++;
}

function removeFloors() {
  floors = floors.filter((floor) => floor.y + floor.height > -canvasOffsetY); // Remove floors above the canvas
}
//-----------------------bomb function----------------------------

//generate the bombs

function generateBomb() {
  const width = 30;

  const x = Math.floor(Math.random() * (canvas.width - width)); //determine the horizontal position of the new "bomb" element
  const y = canvas.height - 20; // determine the vertical position of the new "bomb" element above the player's position  

  if (bombs.length < 5) {
    bombs.push(new Bomb(x, y, width, lastBombId));
    console.log(bombs)
    lastBombId++;
  }
}

function removeBombs() {
  bombs = bombs.filter((bomb) => (bomb.y + bomb.height < 690)); // Remove bombs beneath the canvas
}

//---------------coin function---------

//generate the coins
function generateCoin() {

  const width = 30;

  const x = Math.floor(Math.random() * (canvas.width - width)); //determine the horizontal position of the new "coin" element
  const y = player.y - 20; // determine the vertical position of the new "coin" element above the player's position  

  if (coins.length < 5) {
    coins.push(new Coin(x, y, width, lastCoinId));
    console.log(coins)
    lastCoinId++;
  }
}

function removeCoins() {
  coins = coins.filter((coin) => coin.y + coin.height < 690); // Remove coins beneath the canvas
}

//------- gameover popup----------------------------
let gameOver = false;
function showGameOverPopup() {
  const popup = document.getElementById("popup")!;
  const restartButton = document.createElement("button");
  restartButton.classList.add("restart-button");
  restartButton.textContent = "Restart";
  restartButton.addEventListener("click", () => {
    location.reload();
  });
  const backButton = document.createElement("button");
  backButton.classList.add("back-button");
  backButton.textContent = "Back";
  backButton.addEventListener("click", () => {

    window.location.href = "index.html";
  });
  // popup.innerHTML = "You touched the floor! Game Over!";
  popup.appendChild(restartButton);
  popup.appendChild(backButton);
  popup.style.display = "block";
}
//-----------------------------------------------

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
  //This function is responsible for updating the game state, handling collisions, and generating new floors and bombs.
  if (!gameOver) {

    if (isLeftKeyPressed) {
      player.x -= 2;
    } else if (isRightKeyPressed) {
      player.x += 2;
    }
    player.update();

    let floorCollision = false;
    let targetFloorId: number | null = null; // Keep track of the ID of the target floor

    if (floors.length > 0) {
      const firstFloor = floors[0];
      if (
        player.x < firstFloor.x + firstFloor.width &&
        player.x + player.width > firstFloor.x &&
        player.y + player.height > firstFloor.y
      ) {
        if (player.y + player.height <= firstFloor.y + 30) {
          player.y = firstFloor.y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
        } else {
          floorCollision = true;
          targetFloorId = firstFloor.id;
        }
      } else {
        // Check collision with other floors
        for (const floor of floors) {
          if (
            player.y + player.height > floor.y && // Check if the player's bottom edge is below the floor's top edge
            player.y < floor.y + floor.height && // Check if the player's top edge is above the floor's bottom edge
            player.x < floor.x + floor.width && // Check if the player's right edge is to the left of the floor's right edge
            player.x + player.width > floor.x // Check if the player's left edge is to the right of the floor's left edge
          ) {
            floorCollision = true;
            targetFloorId = floor.id; // Save the ID of the target floor
            break;
          }
        }
      }
    }

    // Apply automatic jump only if the player is not currently jumping or is falling
    if (targetFloorId !== null && (player.isJumping || player.velocityY >= 0)) {
      // Check if the player's y position is close to the target floor's y position
      if (
        floors[targetFloorId].y !== undefined &&
        Math.abs(player.y + player.height - floors[targetFloorId].y) <= 5
      ) {
        player.y = floors[targetFloorId].y - player.height;
        player.velocityY = 0;
        player.isJumping = false;
        player.rotation = 0; // Reset rotation when landing on a floor
      } else {
        // Gradually adjust player's y position to simulate smooth climbing
        player.y += player.velocityY;
      }
    }

    // Adjust player position if falling off the floor due to rotation
    if (floorCollision && player.rotation !== 0) {
      const targetFloor = floors.find((floor) => floor.id === targetFloorId);
      if (targetFloor) {
        // Check if the player's x position is within the bounds of the target floor
        if (
          player.x + player.width >= targetFloor.x &&
          player.x <= targetFloor.x + targetFloor.width
        ) {
          player.y = targetFloor.y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
          player.rotation = 0; // Reset rotation when colliding with a floor
        }
      }
    }
    // Reset isJumping to false if the player is on the floor or falling
    if (floorCollision || player.velocityY > 0) {
      player.isJumping = false;
      player.rotation = 0; // Reset rotation when on the floor or falling
    }

    removeFloors();

    if (floors.length === 0 || floors[floors.length - 1].y > 100) {
      generateFloor();
    } else if (player.y + player.height < canvas.height / 2) {
      // If the player is moving up and reaches a certain point, generate new floors
      generateFloor();
    }

    if (player.y + player.height < canvas.height / 2) {
      bomb.speedY = 1
      coin.speedY = 1
    }
    generateBomb();
    removeBombs();
    const isBomb=checkCollisionBomb();
    if (isBomb){
      player.score--;
    }

    generateCoin();
    removeCoins();
    const isCoin=checkCollisionCoin();
    if (isCoin){
      player.score++;
    }
  

    if (player.y >= canvas.height) {
      gameOver = true;
      games.push(new Game(player.userName,player.score,new Date(player.date)))
      // save to local
      const arrayJSON = JSON.stringify(games);
      localStorage.setItem('games',arrayJSON);
      showGameOverPopup();
      clearInterval(updateInterval); // Stop the update loop when the game is over
    }
  }
}
generateFloor();
//--
//draw frames
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(0, canvasOffsetY); // creating the effect of the player and other objects moving up in the game world


  // Draw player & floors & bomb & coins
  player.draw(ctx);

  for (const floor of floors) {
    floor.draw(ctx);
  }

  for (const bomb of bombs) {
    bomb.drawBomb(ctx);
    bomb.newPos();
  }

  for (const coin of coins) {
    coin.animation(ctx);
    coin.newPos()
  }

  // Reset the canvas transformation
  ctx.setTransform(1, 0, 0, 1, 0, 0); //resets the canvas transformation, undoing the previous vertical offset applied

  requestAnimationFrame(draw); //creates a loop that keeps redrawing the game elements
}
//--

generateFloor();
generateBomb();
generateCoin();
draw();
updateInterval = setInterval(update, 800 / 60);

//------------render score---------
//need to be FIX!!!!
// function renderScore() {
//   const html = document.querySelector("#score");
//   const users = localStorage.getItem("users");
//   try {
//     if (!html) throw new Error("no element");
//     html.innerHTML = `<h2>${user.userName} your current score is: ${users.score}</h2>`;
//   } catch (error) {
//     console.error(error);
//   }
// }

function renderTableScore() {
  try {
    const scoreTable = document.querySelector("#scoreTable");
    if (!scoreTable) throw new Error("no element");

    const htmlScoreTable = `<h2> </h2>`;
  } catch (error) {
    console.error(error);
  }

}

//------------------check collision-----------------------------
function checkCollisionBomb() {
  let bombCollision = false;
  let targetBombId: number | null = null; // Keep track of the ID of the target floor

  for (const bomb of bombs) {
    if (
      bomb.x < player.x + player.width &&
      bomb.x + bomb.width > player.x &&
      bomb.y + bomb.height > player.y
    ) {
      bombCollision = true;
      console.log(`collosion bomb`)
      targetBombId = bomb.idB; // Save the ID of the target bomb
      console.log(`targetBombId:`, targetBombId)
      bombs = bombs.filter((bomb) => (bomb.idB !== targetBombId)); // Remove the bomb that hit 

      return bombCollision;
    }
  }
}

function checkCollisionCoin() {
  let coinCollision = false;
  let targetCoinId: number | null = null; // Keep track of the ID of the target floor

  for (const coin of coins) {
    if (
      coin.x < player.x + player.width &&
      coin.x + coin.width > player.x &&
      coin.y + coin.height > player.y
    ) {
      coinCollision = true;
      console.log(`collosion coin`)
      targetCoinId = coin.idC; // Save the ID of the target coin
      console.log(`targetCoinId:`, targetCoinId)
      coins = coins.filter((coin) => (coin.idC !== targetCoinId)); // Remove the bomb that hit 

      return coinCollision;
    }
  }
}