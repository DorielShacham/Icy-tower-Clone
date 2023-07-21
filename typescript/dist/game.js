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
