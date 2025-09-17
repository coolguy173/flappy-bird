const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = 400;
canvas.height = 600;

let gravity = 0.5;
let flapPower = -8;
let birdY = canvas.height / 2;
let birdX = 80;
let velocity = 0;

const birdRadius = 12;

interface Pipe {
  x: number;
  top: number;
  bottom: number;
}

let pipes: Pipe[] = [];
let pipeGap = 140;
let pipeWidth = 60;
let pipeSpeed = 2.5;

let frame = 0;
let score = 0;
let gameOver = false;

// Handle flap
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") flap();
});
canvas.addEventListener("click", flap);

function flap() {
  if (gameOver) {
    resetGame();
  } else {
    velocity = flapPower;
  }
}

function resetGame() {
  birdY = canvas.height / 2;
  velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
}

function drawBird() {
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(birdX, birdY, birdRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
  if (gameOver) return;

  // bird physics
  velocity += gravity;
  birdY += velocity;

  // pipes
  if (frame % 120 === 0) {
    let pipeTop = Math.random() * (canvas.height - pipeGap - 200) + 50;
    let pipeBottom = pipeTop + pipeGap;
    pipes.push({ x: canvas.width, top: pipeTop, bottom: pipeBottom });
  }

  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;

    // Collision check
    if (
      birdX + birdRadius > pipe.x &&
      birdX - birdRadius < pipe.x + pipeWidth &&
      (birdY - birdRadius < pipe.top || birdY + birdRadius > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Score check
    if (pipe.x + pipeWidth === Math.floor(birdX)) {
      score++;
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);

  // Ground / ceiling check
  if (birdY + birdRadius > canvas.height || birdY - birdRadius < 0) {
    gameOver = true;
  }

  frame++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 90, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Click or press SPACE to restart", canvas.width / 2 - 140, canvas.height / 2 + 40);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
