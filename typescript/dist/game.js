// model (classes)
var Game = /** @class */ (function () {
    function Game(playerName, score, date) {
        this.playerName = playerName;
        this.score = score;
        this.date = date;
        this.gameId = ++Game.counterId;
    }
    //for score page save only relevant data
    Game.counterId = 0;
    return Game;
}());
var Player = /** @class */ (function () {
    function Player(userName) {
        this.userName = userName;
        this.date = new Date();
        this.score = 0;
        this.x = canvas.width - 70; //set the initial x position alweys in the canvas
        this.y = canvas.height - 50; // Set the initial y position above the first floor
        this.width = 90;
        this.height = 90;
        this.velocityY = -10;
        this.velocityX = 0; // Add velocityX for horizontal movement
        this.isJumping = false;
        this.jumpPower = -15; // The initial jump power (negative value to move upward)
        this.userName = userName;
        this.rotation = 0; // Set the initial rotation angle to 0 degrees
        // Load the image for the player
        this.image = new Image();
        this.image.src = '../../images/player/player.png'; // Replace with the actual image path
    }
    Player.prototype.jump = function () {
        if (!this.isJumping) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    };
    Player.prototype.update = function () {
        this.y += this.velocityY;
        this.velocityY += 0.5;
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
        ctx.save(); // Save the current canvas state
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Translate to the center of the player
        ctx.rotate((this.rotation * Math.PI) / 180); // Apply the rotation transformation
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height); // Draw the image at the center
        ctx.restore(); // Restore the canvas state to avoid affecting other elements
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
        this.speedY = 0;
        this.newPos = function () {
            this.y += this.speedY;
        };
    }
    Floor.prototype.draw = function (ctx) {
        // Draw the floor image instead of a rectangle
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return Floor;
}());
var Bomb = /** @class */ (function () {
    function Bomb(x, y, width, idB) {
        this.x = Math.floor(Math.random() * canvas.width - 10); //random position on x
        this.y = Math.floor(Math.random() * canvas.width - 100); //random position on y
        this.width = 30;
        this.height = 40;
        this.idB = idB; // Assign the ID to the bomb
        this.image = document.querySelector('#bomb');
        this.speedY = 0;
        this.newPos = function () {
            this.y += this.speedY;
        };
    }
    Bomb.prototype.drawBomb = function (ctx) {
        //ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    return Bomb;
}());
var Coin = /** @class */ (function () {
    function Coin(x, y, width, idC) {
        this.x = Math.floor(Math.random() * canvas.width - 10);
        this.y = Math.floor(Math.random() * canvas.width - 100);
        this.width = 30;
        this.height = 30;
        this.idC = idC; // Assign the ID to the coin 
        this.image = document.querySelector('#coin');
        this.frameX = 0;
        this.speedFrame = 0;
        this.speed = 5;
        this.speedY = 0;
        this.newPos = function () {
            this.y += this.speedY;
        };
    }
    Coin.prototype.animation = function (ctx) {
        //ctx.strokeRect(this.x, this.y, this.width, this.height);
        var coinWidth = 170;
        var coinHeight = 170;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(this.image, this.frameX * coinWidth, 0 * coinHeight, coinWidth, coinHeight, this.x, this.y, this.width, this.height);
        if (this.speedFrame % this.speed === 0) {
            if (this.frameX < 9)
                this.frameX++;
            else
                this.frameX = 0;
        }
        this.speedFrame++;
    };
    return Coin;
}());
