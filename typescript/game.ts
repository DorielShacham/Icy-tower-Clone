// model (classes)

class User {
  constructor(public userName: string, public score: number = 0, public player: Player) {
    updateScore();
  }
}

class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
  image: HTMLImageElement;
  rotation: number;

  constructor() {
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

  jump() {
    if (!this.isJumping) {
      this.velocityY = -15;
      this.isJumping = true;
    }
  }

  update() {
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
} else {
  // If the player is not jumping, set the rotation angle to 0
  this.rotation = 0;
}

  }

  draw(ctx: CanvasRenderingContext2D) {
     // Draw the player image with rotation
     ctx.save(); // Save the current context state to restore it later
     ctx.translate(this.x + this.width / 2, this.y + this.height / 2); // Translate to the center of the player
     ctx.rotate((this.rotation * Math.PI) / 180); // Apply rotation
     ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height); // Draw the player
     ctx.restore(); // Restore the saved context state
  }
}

class Floor {
  id: number; // Add an ID property to the Floor class
  width: number;
  height: number;
  x: number;
  y: number;
  image: HTMLImageElement; // Add an image property to store the floor image

  constructor(x: number, y: number, width: number, id: number , imageUrl: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 20;
    this.id = id; // Assign the ID to the floor

    // Load the image for the floor
    this.image = new Image();
    this.image.src = imageUrl;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw the floor image instead of a rectangle
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Bomb {
  idB: number; // Add an ID property to the Bomb class
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x:number, y:number, width:number, idB: number) {
    this.x = Math.floor(Math.random()*1000); //random position on x
    this.y = Math.floor(Math.random()*1000); //random position on y
    this.width = 30;
    this.height = 30;
    this.idB = idB; // Assign the ID to the bomb
  }

  drawBomb(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "red";
      ctx.fillStyle = "black";
    }
}

class Coin {
  idC: number; // Add an ID property to the Coin class
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x:number, y:number, width:number, idC:number) {
    this.x = Math.floor(Math.random()*500);
    this.y = Math.floor(Math.random()*500);
    this.width = 30;
    this.height = 30;
    this.idC = idC;   // Assign the ID to the coin   
  }

  drawCoin(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
      ctx.stroke();
      ctx.strokeStyle = "gold";
    }
}

//-------------------------------------------------------
function updateScore() {
  try {
    if ((this.player.x === bomb.x) && (this.player.y === bomb.y)) {
      this.score -= 1;
    }

    if ((this.player.x === coin.x) && (this.player.y === coin.y)) {
      this.score += 1;
    }
  } catch (error) {
    console.error(error)
  }
}
