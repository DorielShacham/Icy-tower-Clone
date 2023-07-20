var Player = /** @class */ (function () {
    function Player() {
        this.x = 200;
        this.y = 350;
        this.width = 30;
        this.height = 30;
        this.velocityY = 0;
        this.isJumping = false;
    }
    Player.prototype.jump = function () {
        if (!this.isJumping) {
            this.velocityY = -10;
            this.isJumping = true;
        }
    };
    Player.prototype.update = function () {
        this.y += this.velocityY;
        this.velocityY += 0.5;
        if (this.y > 350) {
            this.y = 350;
            this.isJumping = false;
        }
    };
    Player.prototype.draw = function (ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Player;
}());
var Floor = /** @class */ (function () {
    function Floor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
    }
    Floor.prototype.draw = function (ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Floor;
}());
//---------------------------------------------------------------------
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = new Player();
var floors = [];
function generateFloor() {
    var minGap = 100;
    var maxGap = 300;
    var minWidth = 50;
    var maxWidth = 200;
    var lastFloor = floors[floors.length - 1];
    var y = lastFloor ? lastFloor.y - 100 : 350;
    var gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
    var width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    var x = Math.floor(Math.random() * (500 - width));
    floors.push(new Floor(x, y, width));
}
function removeFloors() {
    floors = floors.filter(function (floor) { return floor.y + floor.height > 0; });
}
function update() {
    player.update();
    for (var _i = 0, floors_1 = floors; _i < floors_1.length; _i++) {
        var floor = floors_1[_i];
        if (player.x < floor.x + floor.width &&
            player.x + player.width > floor.x &&
            player.y + player.height > floor.y) {
            player.y = floor.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            break;
        }
    }
    removeFloors();
    if (floors.length === 0 || floors[floors.length - 1].y > 100) {
        generateFloor();
    }
}
function onKeyDown(event) {
    if (event.key === "ArrowLeft") {
        player.x -= 5;
    }
    else if (event.key === "ArrowRight") {
        player.x += 5;
    }
}
function onKeyUp(event) {
    // Add any additional handling if needed
}
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
canvas.addEventListener("click", function () {
    player.jump();
});
generateFloor();
setInterval(update, 1000 / 60);
draw();
