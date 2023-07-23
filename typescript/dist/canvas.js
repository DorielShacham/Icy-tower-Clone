//---------------------------------------------------------------------
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = new Player();
var floors = [];
//generate the floors
function generateFloor() {
    var minGap = 100;
    var maxGap = 300;
    var minWidth = 50;
    var maxWidth = 200;
    var lastFloor = floors[floors.length - 1];
    var y = lastFloor ? lastFloor.y - 100 : canvas.height - 20; // Ensure the first floor starts at the bottom of the canvas
    var gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
    var width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    var x = Math.floor(Math.random() * (canvas.width - width)); // Ensure the floor is within the canvas width
    floors.push(new Floor(x, y, width));
}
function removeFloors() {
    floors = floors.filter(function (floor) { return floor.y + floor.height > 0; });
}
//--
//-- gameover popup
var gameOver = false;
function showGameOverPopup() {
    var popup = document.getElementById("popup");
    var restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", function () {
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
        }
        else if (isRightKeyPressed) {
            player.x += 5;
        }
        player.update();
        var floorCollision = false;
        for (var _i = 0, floors_1 = floors; _i < floors_1.length; _i++) {
            var floor = floors_1[_i];
            if (player.x < floor.x + floor.width &&
                player.x + player.width > floor.x &&
                player.y + player.height > floor.y) {
                floorCollision = true;
                if (player.isJumping) {
                    player.y = floor.y - player.height;
                    player.velocityY = 0;
                    player.isJumping = false;
                }
                else {
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
//jump
function onKeyPress(event) {
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
    for (var _i = 0, floors_2 = floors; _i < floors_2.length; _i++) {
        var floor = floors_2[_i];
        floor.draw(ctx);
    }
    requestAnimationFrame(draw);
}
generateFloor();
setInterval(update, 1000 / 60);
draw();
