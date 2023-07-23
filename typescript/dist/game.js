// model (classes)
var User = /** @class */ (function () {
    function User(userName, score, player) {
        if (score === void 0) { score = 0; }
        this.userName = userName;
        this.score = score;
        this.player = player;
        updateScore();
    }
    return User;
}());
var Player = /** @class */ (function () {
    function Player() {
        this.x = 600;
        this.y = canvas.height - 50; // Set the initial y position above the first floor
        this.width = 30;
        this.height = 30;
        this.velocityY = 0;
        this.isJumping = false;
    }
    Player.prototype.jump = function () {
        if (!this.isJumping) {
            this.velocityY = -15;
            this.isJumping = true;
        }
    };
    Player.prototype.update = function () {
        this.y += this.velocityY;
        this.velocityY += 0.5;
    };
    Player.prototype.draw = function (ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Player;
}());
var Floor = /** @class */ (function () {
    function Floor(x, y, width, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
        this.id = id; // Assign the ID to the floor
    }
    Floor.prototype.draw = function (ctx) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Floor;
}());
var Bomb = /** @class */ (function () {
    function Bomb() {
        this.x = Math.floor(Math.random() * 500); //random position on x
        this.y = Math.floor(Math.random() * 500); //random position on y
        this.width = 30;
        this.height = 30;
    }
    Bomb.prototype.drawBomb = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 40, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "black";
    };
    return Bomb;
}());
var Coin = /** @class */ (function () {
    function Coin() {
        this.x = Math.floor(Math.random() * 500);
        this.y = Math.floor(Math.random() * 500);
        this.width = 30;
        this.height = 30;
    }
    Coin.prototype.drawCoin = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 40, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "gold";
    };
    return Coin;
}());
function updateScore() {
    try {
        if ((this.player.x === bomb.x) && (this.player.y === bomb.y)) {
            this.score -= 1;
        }
        if ((this.player.x === coin.x) && (this.player.y === coin.y)) {
            this.score += 1;
        }
    }
    catch (error) {
        console.error(error);
    }
}
