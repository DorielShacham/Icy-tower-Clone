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
        this.width = 50;
        this.height = 50;
        this.velocityY = -10;
        this.isJumping = false;
        this.rotation = 0; // Set the initial rotation angle to 0 degrees
        // Load the image for the player
        this.image = new Image();
        this.image.src = '../../images/player/player.png'; // Replace with the actual image path
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
        // Apply rotation only when the player is jumping or falling
        // Apply rotation only when the player is jumping
        if (this.isJumping) {
            // Increase the rotation angle while jumping
            this.rotation += 25; // Adjust the value as needed for the rotation speed
            if (this.rotation >= 360) {
                // Wrap the rotation angle around 360 degrees
                this.rotation = 0;
            }
        }
        else {
            // If the player is not jumping, set the rotation angle to 0
            this.rotation = 0;
        }
    };
    Player.prototype.draw = function (ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    };
    return Player;
}());
var Floor = /** @class */ (function () {
    function Floor(x, y, width, id, imageUrl) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 20;
        this.id = id; // Assign the ID to the floor
        // Load the image for the floor
        this.image = new Image();
        this.image.src = imageUrl;
    }
    Floor.prototype.draw = function (ctx) {
        // Draw the floor image instead of a rectangle
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return Floor;
}());
var Bomb = /** @class */ (function () {
    function Bomb(x, y, width, idB) {
        this.x = Math.floor(Math.random() * 1000); //random position on x
        this.y = Math.floor(Math.random() * 1000); //random position on y
        this.width = 40;
        this.height = 40;
        this.idB = idB; // Assign the ID to the bomb
        this.image = document.querySelector('#bomb');
        this.bSpeed = 5 + this.y;
    }
    Bomb.prototype.drawBomb = function (ctx) {
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
        // ctx.fillStyle = "black";
        // ctx.fill()
        // ctx.strokeStyle = "black";
        // ctx.stroke();
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return Bomb;
}());
var Coin = /** @class */ (function () {
    function Coin(x, y, width, idC) {
        this.x = Math.floor(Math.random() * 500);
        this.y = Math.floor(Math.random() * 500);
        this.width = 30;
        this.height = 30;
        this.idC = idC; // Assign the ID to the coin 
        this.image = document.querySelector('#coin');
        this.frameX = 0;
        this.speedFrame = 0;
        this.speed = 5;
    }
    Coin.prototype.drawCoin = function (ctx) {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.animation.bind(this)(ctx); // Bind the function to the current instance
    };
    Coin.prototype.animation = function (ctx) {
        var _this = this;
        var coinWidth = 170;
        var coinHeight = 170;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(this.image, this.frameX * coinWidth, 0 * coinHeight, coinWidth, coinHeight, this.x, this.y, this.width, this.height);
        if (this.speedFrame % this.speed === 0) {
            if (this.frameX < 6)
                this.frameX++;
            else
                this.frameX = 0;
        }
        this.speedFrame++;
        requestAnimationFrame(function () { return _this.animation(ctx); }); // Use an arrow function to preserve the this context
    };
    return Coin;
}());
