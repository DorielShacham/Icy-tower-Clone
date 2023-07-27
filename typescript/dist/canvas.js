//---------------------------------------------------------------------
function loadGamesCanvas() {
    try {
        var games_1 = [];
        // get the games from local storage
        var gamesString = localStorage.getItem('games');
        // Handle the case where there are no games in localStorage
        if (!gamesString) {
            console.error("No games found in localStorage.");
            return [];
        }
        var gamesJson = JSON.parse(gamesString);
        gamesJson.forEach(function (gameJson) {
            var game = new Game(gameJson.userName, gameJson.score, new Date(gameJson.date));
            games_1.push(game);
        });
        return games_1;
    }
    catch (error) {
        console.error("Error loading games:", error);
        return [];
    }
}
var games = loadGamesCanvas();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var userName = localStorage.getItem('username');
var player = new Player(userName);
var bomb = new Bomb(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 30, 0);
var coin = new Coin(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 30, 0);
//const users: User[] = [];
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
//---------------------floors functions--------------------------------------
var floorImageUrl = "../../images/stick.png";
//generate the floors
function generateFloor() {
    var minGap = 100;
    var maxGap = 200;
    var minWidth = 250;
    var maxWidth = 200;
    var lastFloor = floors[floors.length - 1];
    var y = lastFloor ? lastFloor.y - 100 : canvas.height - 20 - canvasOffsetY; // Apply the vertical offset to the first floor
    var gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
    var width = floors.length === 0
        ? canvas.width
        : Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    var x = floors.length === 0
        ? 0
        : Math.floor(Math.random() * (canvas.width - width));
    floors.push(new Floor(x, y, width, lastFloorId, floorImageUrl));
    lastFloorId++;
}
function removeFloors() {
    floors = floors.filter(function (floor) { return floor.y + floor.height > -canvasOffsetY; }); // Remove floors above the canvas
}
//-----------------------bomb function----------------------------
//generate the bombs
function generateBomb() {
    var width = 30;
    var x = Math.floor(Math.random() * (canvas.width - width)); //determine the horizontal position of the new "bomb" element
    var y = canvas.height - 20; // determine the vertical position of the new "bomb" element above the player's position  
    if (bombs.length < 5) {
        bombs.push(new Bomb(x, y, width, lastBombId));
        console.log(bombs);
        lastBombId++;
    }
}
function removeBombs() {
    bombs = bombs.filter(function (bomb) { return (bomb.y + bomb.height < 690); }); // Remove bombs beneath the canvas
}
//---------------coin function---------
//generate the coins
function generateCoin() {
    var width = 30;
    var x = Math.floor(Math.random() * (canvas.width - width)); //determine the horizontal position of the new "coin" element
    var y = player.y - 20; // determine the vertical position of the new "coin" element above the player's position  
    if (coins.length < 5) {
        coins.push(new Coin(x, y, width, lastCoinId));
        console.log(coins);
        lastCoinId++;
    }
}
function removeCoins() {
    coins = coins.filter(function (coin) { return coin.y + coin.height < 690; }); // Remove coins beneath the canvas
}
//------- gameover popup----------------------------
var gameOver = false;
function showGameOverPopup() {
    var popup = document.getElementById("popup");
    var restartButton = document.createElement("button");
    restartButton.classList.add("restart-button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", function () {
        location.reload();
    });
    var backButton = document.createElement("button");
    backButton.classList.add("back-button");
    backButton.textContent = "Back";
    backButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
    // popup.innerHTML = "You touched the floor! Game Over!";
    popup.appendChild(restartButton);
    popup.appendChild(backButton);
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
var updateInterval;
function update() {
    //This function is responsible for updating the game state, handling collisions, and generating new floors and bombs.
    if (!gameOver) {
        if (isLeftKeyPressed) {
            player.x -= 2;
        }
        else if (isRightKeyPressed) {
            player.x += 2;
        }
        player.update();
        var floorCollision = false;
        var targetFloorId_1 = null; // Keep track of the ID of the target floor
        if (floors.length > 0) {
            var firstFloor = floors[0];
            if (player.x < firstFloor.x + firstFloor.width &&
                player.x + player.width > firstFloor.x &&
                player.y + player.height > firstFloor.y) {
                if (player.y + player.height <= firstFloor.y + 30) {
                    player.y = firstFloor.y - player.height;
                    player.velocityY = 0;
                    player.isJumping = false;
                }
                else {
                    floorCollision = true;
                    targetFloorId_1 = firstFloor.id;
                }
            }
            else {
                // Check collision with other floors
                for (var _i = 0, floors_1 = floors; _i < floors_1.length; _i++) {
                    var floor = floors_1[_i];
                    if (player.y + player.height > floor.y && // Check if the player's bottom edge is below the floor's top edge
                        player.y < floor.y + floor.height && // Check if the player's top edge is above the floor's bottom edge
                        player.x < floor.x + floor.width && // Check if the player's right edge is to the left of the floor's right edge
                        player.x + player.width > floor.x // Check if the player's left edge is to the right of the floor's left edge
                    ) {
                        floorCollision = true;
                        targetFloorId_1 = floor.id; // Save the ID of the target floor
                        break;
                    }
                }
            }
        }
        // Apply automatic jump only if the player is not currently jumping or is falling
        if (targetFloorId_1 !== null && (player.isJumping || player.velocityY >= 0)) {
            // Check if the player's y position is close to the target floor's y position
            if (floors[targetFloorId_1].y !== undefined &&
                Math.abs(player.y + player.height - floors[targetFloorId_1].y) <= 5) {
                player.y = floors[targetFloorId_1].y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
                player.rotation = 0; // Reset rotation when landing on a floor
            }
            else {
                // Gradually adjust player's y position to simulate smooth climbing
                player.y += player.velocityY;
            }
        }
        // Adjust player position if falling off the floor due to rotation
        if (floorCollision && player.rotation !== 0) {
            var targetFloor = floors.find(function (floor) { return floor.id === targetFloorId_1; });
            if (targetFloor) {
                // Check if the player's x position is within the bounds of the target floor
                if (player.x + player.width >= targetFloor.x &&
                    player.x <= targetFloor.x + targetFloor.width) {
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
        }
        else if (player.y + player.height < canvas.height / 2) {
            // If the player is moving up and reaches a certain point, generate new floors
            generateFloor();
        }
        if (player.y + player.height < canvas.height / 2) {
            bomb.speedY = 1;
            coin.speedY = 1;
        }
        generateBomb();
        removeBombs();
        var isBomb = checkCollisionBomb();
        if (isBomb) {
            player.score--;
        }
        generateCoin();
        removeCoins();
        var isCoin = checkCollisionCoin();
        if (isCoin) {
            player.score++;
        }
        if (player.y >= canvas.height) {
            gameOver = true;
            games.push(new Game(player.userName, player.score, new Date(player.date)));
            // save to local
            var arrayJSON = JSON.stringify(games);
            localStorage.setItem('games', arrayJSON);
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
    for (var _i = 0, floors_2 = floors; _i < floors_2.length; _i++) {
        var floor = floors_2[_i];
        floor.draw(ctx);
    }
    for (var _a = 0, bombs_1 = bombs; _a < bombs_1.length; _a++) {
        var bomb_1 = bombs_1[_a];
        bomb_1.drawBomb(ctx);
        bomb_1.newPos();
    }
    for (var _b = 0, coins_1 = coins; _b < coins_1.length; _b++) {
        var coin_1 = coins_1[_b];
        coin_1.animation(ctx);
        coin_1.newPos();
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
        var scoreTable = document.querySelector("#scoreTable");
        if (!scoreTable)
            throw new Error("no element");
        var htmlScoreTable = "<h2> </h2>";
    }
    catch (error) {
        console.error(error);
    }
}
//------------------check collision-----------------------------
function checkCollisionBomb() {
    var bombCollision = false;
    var targetBombId = null; // Keep track of the ID of the target floor
    for (var _i = 0, bombs_2 = bombs; _i < bombs_2.length; _i++) {
        var bomb_2 = bombs_2[_i];
        if (bomb_2.x < player.x + player.width &&
            bomb_2.x + bomb_2.width > player.x &&
            bomb_2.y + bomb_2.height > player.y) {
            bombCollision = true;
            console.log("collosion bomb");
            targetBombId = bomb_2.idB; // Save the ID of the target bomb
            console.log("targetBombId:", targetBombId);
            bombs = bombs.filter(function (bomb) { return (bomb.idB !== targetBombId); }); // Remove the bomb that hit 
            return bombCollision;
        }
    }
}
function checkCollisionCoin() {
    var coinCollision = false;
    var targetCoinId = null; // Keep track of the ID of the target floor
    for (var _i = 0, coins_2 = coins; _i < coins_2.length; _i++) {
        var coin_2 = coins_2[_i];
        if (coin_2.x < player.x + player.width &&
            coin_2.x + coin_2.width > player.x &&
            coin_2.y + coin_2.height > player.y) {
            coinCollision = true;
            console.log("collosion coin");
            targetCoinId = coin_2.idC; // Save the ID of the target coin
            console.log("targetCoinId:", targetCoinId);
            coins = coins.filter(function (coin) { return (coin.idC !== targetCoinId); }); // Remove the bomb that hit 
            return coinCollision;
        }
    }
}
