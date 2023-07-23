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
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = Math.floor(Math.random()*500); //random position on x
    this.y = Math.floor(Math.random()*500); //random position on y
    this.width = 30;
    this.height = 30;      
  }

  drawBomb(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 40, 0, 2*Math.PI);
      ctx.stroke();
      ctx.fillStyle = "black";
    }
}

class Coin {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor() {
    this.x = Math.floor(Math.random()*500);
    this.y = Math.floor(Math.random()*500);
    this.width = 30;
    this.height = 30;      
  }

  drawCoin(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 40, 0, 2*Math.PI);
      ctx.stroke();
      ctx.fillStyle = "gold";
    }
}



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