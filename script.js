        let gameStarted = false;

        function drawStartupPage() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#CC0000';
            ctx.font = 'bold 48px Arial';
            ctx.fillText('RCB Runner Game', canvas.width / 2 - 200, canvas.height / 2 - 60);

            ctx.font = '24px Arial';
            ctx.fillStyle = '#222';
            ctx.fillText('Press SPACE or TAP to Start', canvas.width / 2 - 150, canvas.height / 2);

            ctx.font = '20px Arial';
            ctx.fillStyle = '#444';
            ctx.fillText('Jump over the lollipops and score high!', canvas.width / 2 - 170, canvas.height / 2 + 40);
        }

        // Canvas setup
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        const scoreDiv = document.getElementById('score');

        // Game constants
        const GROUND_Y = 340;
        const PLAYER_X = 60;
        const PLAYER_WIDTH = 40;
        const PLAYER_HEIGHT = 60;
        const LOLLIPOP_WIDTH = 30;
        const LOLLIPOP_HEIGHT = 60;
        const GRAVITY = 1.2;
        const JUMP_VELOCITY = -18;

        // Game state
        let playerY = GROUND_Y - PLAYER_HEIGHT;
        let playerVY = 0;
        let isJumping = false;
        let gameOver = false;
        let lollipopX = 800;
        let score = 0;
        let highScore = Number(localStorage.getItem('rcbHighScore')) || 0;

        // Draw RCB Player
        function drawRCBPlayer(x, y) {
            // Body (red jersey)
            ctx.fillStyle = '#CC0000';
            ctx.fillRect(x + 10, y + 20, 30, 30);

            // Head (skin color)
            ctx.fillStyle = '#ffe0bd';
            ctx.beginPath();
            ctx.ellipse(x + 20, y + 12, 10, 12, 0, 0, Math.PI * 2);
            ctx.fill();

            // Sleeves (black)
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y + 25, 10, 15); // left
            ctx.fillRect(x + 40, y + 25, 10, 15); // right

            // Shorts (black)
            ctx.fillRect(x + 12, y + 50, 6, 15); // left leg
            ctx.fillRect(x + 32, y + 50, 6, 15); // right leg

            // Jersey text "RCB" (gold)
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 12px Arial';
            ctx.fillText('RCB', x + 13, y + 38);

            // Optional: simple face
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + 17, y + 13, 1.2, 0, Math.PI * 2); // left eye
            ctx.arc(x + 23, y + 13, 1.2, 0, Math.PI * 2); // right eye
            ctx.fill();
        }

        function drawLollipop(x, y) {
            // Stick (light brown)
            ctx.fillStyle = '#b5651d';
            ctx.fillRect(x + LOLLIPOP_WIDTH / 2 - 3, y + 32, 6, 28);

            // Candy (circle, vibrant pink)
            ctx.beginPath();
            ctx.arc(x + LOLLIPOP_WIDTH / 2, y + 32, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#FF36AA';
            ctx.fill();

            // Highlight
            ctx.beginPath();
            ctx.arc(x + LOLLIPOP_WIDTH / 2 + 7, y + 24, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#fff6fa';
            ctx.fill();
        }


        // Draw ground
        function drawGround() {
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, GROUND_Y);
            ctx.lineTo(canvas.width, GROUND_Y);
            ctx.stroke();
        }

        // Draw everything
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGround();
            drawRCBPlayer(PLAYER_X, playerY);
            drawLollipop(lollipopX, GROUND_Y - LOLLIPOP_HEIGHT);
        }

        // Game loop
        function update() {
            if (!gameStarted) return;
            if (!gameOver) {
                // Player physics
                if (isJumping) {
                    playerY += playerVY;
                    playerVY += GRAVITY;
                    if (playerY >= GROUND_Y - PLAYER_HEIGHT) {
                        playerY = GROUND_Y - PLAYER_HEIGHT;
                        playerVY = 0;
                        isJumping = false;
                    }
                }

                // Lollipop movement
                lollipopX -= 10;
                if (lollipopX + LOLLIPOP_WIDTH < 0) {
                    lollipopX = canvas.width + Math.random() * 200;
                    score++;
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('rcbHighScore', highScore);
                    }
                }

                // Collision detection
                let playerFront = PLAYER_X + 30;
                let playerBottom = playerY + 50;
                let lollyCenterX = lollipopX + LOLLIPOP_WIDTH / 2;
                if (
                    playerFront > lollipopX + 5 && playerFront < lollipopX + LOLLIPOP_WIDTH - 5 &&
                    playerBottom > GROUND_Y - 28
                ) {
                    gameOver = true;
                }
            }

            draw();
            // Score display
            scoreDiv.innerHTML = `Score: ${score} | High Score: ${highScore}`;

            if (gameOver) {
                ctx.fillStyle = '#e53935';
                ctx.font = 'bold 36px Arial';
                ctx.fillText('GAME OVER', canvas.width / 2 - 120, canvas.height / 2 - 20);
                ctx.font = '20px Arial';
                ctx.fillStyle = '#222';
                ctx.fillText('Press SPACE or TAP to Restart', canvas.width / 2 - 140, canvas.height / 2 + 20);
            } else {
                requestAnimationFrame(update);
            }
        }

        // Controls
        document.addEventListener('keydown', e => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent page scrolling
                if (!gameStarted) {
                    gameStarted = true;
                    update();
                } else if (gameOver) {
                    // Restart game logic...
                    playerY = GROUND_Y - PLAYER_HEIGHT;
                    playerVY = 0;
                    isJumping = false;
                    lollipopX = canvas.width;
                    score = 0;
                    gameOver = false;
                    update();
                } else if (!isJumping && playerY >= GROUND_Y - PLAYER_HEIGHT) {
                    isJumping = true;
                    playerVY = JUMP_VELOCITY;
                }
            }
        });

        canvas.addEventListener('touchstart', e => {
            e.preventDefault(); // Prevent default touch behavior
            if (!gameStarted) {
                gameStarted = true;
                update();
            } else if (gameOver) {
                playerY = GROUND_Y - PLAYER_HEIGHT;
                playerVY = 0;
                isJumping = false;
                lollipopX = canvas.width;
                score = 0;
                gameOver = false;
                update();
            } else if (!isJumping && playerY >= GROUND_Y - PLAYER_HEIGHT) {
                isJumping = true;
                playerVY = JUMP_VELOCITY;
            }
        });
        // Start game
        drawStartupPage();

