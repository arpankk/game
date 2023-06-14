document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
  
    // Game variables
    let birdX;
    let birdY;
    let birdImage;
    let backgroundImage;
    let pipeImage;
    let gravity;
    let pipeInterval;
    let isGameOver;
    let pipes;
    let score;
    let gameLoopId;
  
    // Load game assets
    birdImage = new Image();
    birdImage.src = "bird.png";
  
    backgroundImage = new Image();
    backgroundImage.src = "background.png";
  
    pipeImage = new Image();
    pipeImage.src = "pipe.png";
  
    // Initialize the game
    function init() {
      birdX = 50;
      birdY = canvas.height / 2;
      gravity = 1.5;
      pipeInterval = 180;
      isGameOver = false;
      pipes = [];
      score = 0;
  
      // Handle key press
      document.addEventListener("keydown", flap);
  
      // Start the game loop
      gameLoopId = setInterval(gameLoop, 20);
    }
  
    // Handle bird flap
    function flap(event) {
      if (event.keyCode === 32 && !isGameOver) { // Spacebar key
        birdY -= 30;
      }
    }
  
    // Update game state
    function update() {
      if (isGameOver) {
        return;
      }
  
      // Move the bird
      birdY += gravity;
  
      // Generate new pipes
      if (pipes.length === 0 || canvas.width - pipes[pipes.length - 1].x > pipeInterval) {
        const pipe = {
          x: canvas.width,
          y: Math.random() * (canvas.height - 200) + 100
        };
        pipes.push(pipe);
      }
  
      // Move and remove pipes
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.x -= 2;
  
        // Check collision with bird
        if (
          birdX + 30 > pipe.x &&
          birdX < pipe.x + 80 &&
          (birdY < pipe.y || birdY + 20 > pipe.y + 150)
        ) {
          isGameOver = true;
          break;
        }
  
        // Remove pipes when they go offscreen
        if (pipe.x + 80 < 0) {
          pipes.splice(i, 1);
          i--;
          score++;
        }
      }
  
      // Check collision with top/bottom walls
      if (birdY > canvas.height || birdY < 0) {
        isGameOver = true;
      }
    }
  
    // Render the game
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw background
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  
      // Draw bird
      ctx.drawImage(birdImage, birdX, birdY, 40, 30);
  
      // Draw pipes
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        ctx.drawImage(pipeImage, pipe.x, 0, 80, pipe.y);
        ctx.drawImage(pipeImage, pipe.x, pipe.y + 150, 80, canvas.height - pipe.y - 150);
      }
  
      // Draw score
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText("Score: " + score, 10, 30);
  
      // Game over
      if (isGameOver) {
        clearInterval(gameLoopId);
        document.getElementById("restartButton").style.display = "block";
        document.getElementById("gameOverText").style.display = "block";
      }
    }
  
    // Game loop
    function gameLoop() {
      update();
      draw();
    }
  
    // Start the game when the Start button is clicked
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", function() {
      startButton.style.display = "none";
      document.getElementById("restartButton").style.display = "none";
      document.getElementById("gameOverText").style.display = "none";
      init();
    });
  
    // Restart the game when the Restart button is clicked
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", function() {
      restartButton.style.display = "none";
      document.getElementById("gameOverText").style.display = "none";
      init();
    });
  });
  