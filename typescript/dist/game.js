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
