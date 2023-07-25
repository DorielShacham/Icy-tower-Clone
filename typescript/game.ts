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

  constructor() {
    this.x = 600;
    this.y = canvas.height - 50; // Set the initial y position above the first floor
    this.width = 30;
    this.height = 30;
    this.velocityY = 0;
    this.isJumping = false;
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
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height)
  }
}

class Floor {
  id: number; // Add an ID property to the Floor class
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(x: number, y: number, width: number, id: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 20;
    this.id = id; // Assign the ID to the floor
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "gray";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Bomb {
  idB: number; // Add an ID property to the Bomb class
  x: number;
  y: number;
  width: number;
  height: number;
  image: any;

  constructor(x: number, y: number, width: number, idB: number) {
    this.x = Math.floor(Math.random() * 1000); //random position on x
    this.y = Math.floor(Math.random() * 1000); //random position on y
    this.width = 40;
    this.height = 40;
    this.idB = idB; // Assign the ID to the bomb
    this.image = document.querySelector('#bomb')
  }

  drawBomb(ctx: CanvasRenderingContext2D) {
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
    // ctx.fillStyle = "black";
    // ctx.fill()
    // ctx.strokeStyle = "black";
    // ctx.stroke();
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }

}

class Coin {
  idC: number; // Add an ID property to the Coin class
  x: number;
  y: number;
  width: number;
  height: number;
  image: any;

  constructor(x: number, y: number, width: number, idC: number) {
    this.x = Math.floor(Math.random() * 500);
    this.y = Math.floor(Math.random() * 500);
    this.width = 30;
    this.height = 30;
    this.idC = idC;   // Assign the ID to the coin 
    this.image = document.querySelector('#coin');
  }

  drawCoin(ctx: CanvasRenderingContext2D) {
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
    // ctx.fillStyle = "gold";
    // ctx.fill()
    // ctx.strokeStyle = "gold";
    // ctx.stroke();
    ctx.drawImage(this.image, 0, 0, 220, 220, this.x, this.y, this.width, this.height)
    ctx.strokeRect(this.x, this.y, this.width, this.height)
  }

  //https://www.youtube.com/watch?v=CY0HE277IBM&ab_channel=Frankslaboratory
  animation() {

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
