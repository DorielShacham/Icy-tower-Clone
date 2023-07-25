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
        this.width = 110;
        this.height = 110;
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
            this.rotation += 5; // Adjust the value as needed for the rotation speed
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
        // Draw the player image with rotation
        ctx.save(); // Save the current context state to restore it later
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Translate to the center of the player
        ctx.rotate((this.rotation * Math.PI) / 180); // Apply rotation
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height); // Draw the player
        ctx.restore(); // Restore the saved context state
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
        this.width = 30;
        this.height = 30;
        this.idB = idB; // Assign the ID to the bomb
    }
    Bomb.prototype.drawBomb = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = "red";
        ctx.fillStyle = "black";
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
    }
    Coin.prototype.drawCoin = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = "gold";
    };
    return Coin;
}());
//-------------------------------------------------------
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
