class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;

  constructor() {
    this.x = 200;
    this.y = 350;
    this.width = 30;
    this.height = 30;
    this.velocityY = 0;
    this.isJumping = false;
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -10;
      this.isJumping = true;
    }
  }

  update() {
    this.y += this.velocityY;
    this.velocityY += 0.5;

    if (this.y > 350) {
      this.y = 350;
      this.isJumping = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Floor {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 20;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}



