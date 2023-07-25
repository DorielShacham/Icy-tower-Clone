//---------------------------------------------------------------------
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = new Player();
var bomb = new Bomb(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 30, 0);
var coin = new Coin(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 30, 0);
var users = [];
var bombs = [];
var coins = [];
var floors = [];
var lastFloorId = 0;
var lastBombId = 0;
var lastCoinId = 0;
// Vertical offset for the canvas
var canvasOffsetY = 0;
var hasStartedMovingUp = false;
var hasStartedMovingDown = false;
// Function to move the canvas up
function moveCanvasUp() {
    if (!hasStartedMovingUp && player.y + player.height < canvas.height / 2) {
        // Start moving the canvas up only when the player's y position is less than half of the canvas height
        canvasOffsetY += 1;
    }
}
//---------------------floors functions--------------------------------------
//generate the floors
function generateFloor() {
    var minGap = 100;
    var maxGap = 200;
    var minWidth = 250;
    var maxWidth = 200;
    var lastFloor = floors[floors.length - 1];
    var y = lastFloor ? lastFloor.y - 100 : canvas.height - 20 - canvasOffsetY; // Apply the vertical offset to the first floor
    var gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
    var width = floors.length === 0 ? canvas.width : Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    var x = floors.length === 0 ? 0 : Math.floor(Math.random() * (canvas.width - width));
    floors.push(new Floor(x, y, width, lastFloorId));
    lastFloorId++;
}
function removeFloors() {
    floors = floors.filter(function (floor) { return floor.y + floor.height > -canvasOffsetY; }); // Remove floors above the canvas
}
//-----------------------bomb function----------------------------
//generate the bombs
// function generateBomb() {
//   const width = 30;
//   const lastBomb = bombs[bombs.length - 1]; //get the last "bomb" element from the bombs array.
//   const y = lastBomb ? lastBomb.y - 100 : canvas.height - 20 - canvasOffsetY; // determine the vertical position of the new "bomb" element
//   const x = bombs.length === 0 ? 0 : Math.floor(Math.random() * (canvas.width - width)); //determine the horizontal position of the new "bomb" element
//   console.log(`x=`, x)
//   if (bombs.length < 5) {
//     bombs.push(new Bomb(x, y, width, lastBombId));
//     lastBombId++;
//   }
// }
function generateBomb() {
    var width = 30;
    var x = Math.floor(Math.random() * (canvas.width - width)); //determine the horizontal position of the new "bomb" element
    var y = player.y - 100; // determine the vertical position of the new "bomb" element above the player's position  
    if (bombs.length < 5) {
        bombs.push(new Bomb(x, y, width, lastBombId));
        lastBombId++;
    }
}
function removeBombs() {
    bombs = bombs.filter(function (bomb) { return bomb.y + bomb.height > -canvasOffsetY; }); // Remove bombs above the canvas
}
//---------------coin function---------
//generate the coins
// function generateCoin() {
//   // const minGap = 50;
//   // const maxGap = 100;
//   const minWidth = 150;
//   const maxWidth = 100;
//   const lastCoin = coins[coins.length - 1];
//   const y = lastCoin ? lastCoin.y - 100 : canvas.height - 20 - canvasOffsetY; // Apply the vertical offset to the first bomb
//   // const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
//   const width = coins.length === 0 ? canvas.width : Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
//   const x = coins.length === 0 ? 0 : Math.floor(Math.random() * (canvas.width - width));
//   console.log(`x=`, x)
//   console.log(`width=`, width)
//   coins.push(new Coin(x, y, width, lastCoinId));
//   console.log(`coins array=`, coins)
//   lastBombId++;
// }
// function removeCoins() {
//   coins = coins.filter((coin) => coin.y + bomb.height > -canvasOffsetY); // Remove coins above the canvas
// }
//------- gameover popup----------------------------
var gameOver = false;
function showGameOverPopup() {
    var popup = document.getElementById("popup");
    var restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", function () {
        location.reload();
    });
    popup.innerHTML = "You touched the floor! Game Over!";
    popup.appendChild(restartButton);
    popup.style.display = "block";
}
//-----------------------------------------------
//movement left right
var isLeftKeyPressed = false;
var isRightKeyPressed = false;
function onKeyDown(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        isLeftKeyPressed = true;
    }
    else if (event.key === "ArrowRight" || event.key === "d") {
        isRightKeyPressed = true;
    }
}
function onKeyUp(event) {
    if (event.key === "ArrowLeft" || event.key === "a") {
        isLeftKeyPressed = false;
    }
    else if (event.key === "ArrowRight" || event.key === "d") {
        isRightKeyPressed = false;
    }
}
//--
//jump
function onKeyPress(event) {
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
var bombGenerationDelay = 1000; // Set the delay in milliseconds (1 second in this example)
var lastBombGenerationTime = 0; // Track the time of the last bomb generation
var updateInterval;
function update() {
    if (!gameOver) {
        moveCanvasUp();
        if (isLeftKeyPressed) {
            player.x -= 5;
        }
        else if (isRightKeyPressed) {
            player.x += 5;
        }
        player.update();
        var floorCollision = false;
        var targetFloorId = null; // Keep track of the ID of the target floor
        // Check collision with the first floor separately
        var firstFloor = floors[0];
        if (player.x < firstFloor.x + firstFloor.width &&
            player.x + player.width > firstFloor.x &&
            player.y + player.height > firstFloor.y) {
            floorCollision = true;
            targetFloorId = firstFloor.id; // Save the ID of the first floor
        }
        else {
            // Check collision with other floors
            for (var _i = 0, floors_1 = floors; _i < floors_1.length; _i++) {
                var floor = floors_1[_i];
                if (player.x < floor.x + floor.width &&
                    player.x + player.width > floor.x &&
                    player.y + player.height > floor.y) {
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
        else if (player.y + player.height < canvas.height / 2) {
            // If the player is moving up and reaches a certain point, generate new floors
            generateFloor();
        }
        var currentTime = Date.now();
        if (bombs.length === 0 || bombs[bombs.length - 1].y > 150) {
            if (currentTime - lastBombGenerationTime >= bombGenerationDelay) {
                generateBomb();
                lastBombGenerationTime = currentTime;
            }
        }
        else if (player.y + player.height < canvas.height / 2) {
            // If the player is moving up and reaches a certain point, generate new bombs
            if (currentTime - lastBombGenerationTime >= bombGenerationDelay) {
                generateBomb();
                lastBombGenerationTime = currentTime;
            }
        }
        removeBombs();
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
    ctx.translate(0, canvasOffsetY); // creating the effect of the player and other objects moving up in the game world
    // Draw player & floors & bomb & coins
    player.draw(ctx);
    bomb.drawBomb(ctx);
    coin.drawCoin(ctx);
    for (var _i = 0, floors_2 = floors; _i < floors_2.length; _i++) {
        var floor = floors_2[_i];
        floor.draw(ctx);
    }
    for (var _a = 0, bombs_1 = bombs; _a < bombs_1.length; _a++) {
        var bomb_1 = bombs_1[_a];
        bomb_1.drawBomb(ctx);
    }
    // for (const coin of coins) {
    //   coin.drawCoin(ctx);
    // }
    // Reset the canvas transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0); //resets the canvas transformation, undoing the previous vertical offset applied
    requestAnimationFrame(draw); //creates a loop that keeps redrawing the game elements
}
//--
generateFloor();
generateBomb();
//generateCoin();
updateInterval = setInterval(update, 800 / 60);
draw();
//------------render score---------
function renderScore() {
    var html = document.querySelector('#score');
    var users = localStorage.getItem('users');
    try {
        if (!html)
            throw new Error("no element");
        html.innerHTML = "<h2>" + user.userName + " your current score is: " + users.score + "</h2>";
    }
    catch (error) {
        console.error(error);
    }
}
function renderTableScore() {
    try {
        var scoreTable = document.querySelector('#scoreTable');
        if (!scoreTable)
            throw new Error("no element");
        var htmlScoreTable = "<h2> </h2>";
    }
    catch (error) {
        console.error(error);
    }
}
