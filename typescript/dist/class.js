var Player = /** @class */ (function () {
    function Player() {
        this.x = 200;
        this.y = 300;
        this.width = 50;
        this.height = 50;
        this.isJumping = false;
        this.jumpHeight = 150;
        this.jumpSpeed = 5;
    }
    Player.prototype.moveLeft = function () {
        this.x -= 10;
    };
    Player.prototype.moveRight = function () {
        this.x += 10;
    };
    Player.prototype.jump = function () {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpAnimation();
        }
    };
    Player.prototype.jumpAnimation = function () {
        var _this = this;
        if (this.y > this.jumpHeight) {
            this.y -= this.jumpSpeed;
            requestAnimationFrame(function () { return _this.jumpAnimation(); });
        }
        else {
            this.fallAnimation();
        }
    };
    Player.prototype.fallAnimation = function () {
        var _this = this;
        if (this.y < 300) {
            this.y += this.jumpSpeed;
            requestAnimationFrame(function () { return _this.fallAnimation(); });
        }
        else {
            this.isJumping = false;
        }
    };
    Player.prototype.draw = function (ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    return Player;
}());
var Floor = /** @class */ (function () {
    function Floor(y) {
        this.y = y;
        this.height = 20;
    }
    Floor.prototype.draw = function (ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, this.y, 500, this.height);
    };
    return Floor;
}());
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var player = new Player();
var floor = new Floor(350); // Floor positioned at y = 350
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    floor.draw(ctx);
    requestAnimationFrame(draw);
}
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        player.moveLeft();
    }
    else if (event.key === 'ArrowRight') {
        player.moveRight();
    }
    else if (event.key === ' ') {
        player.jump();
    }
});
draw();
