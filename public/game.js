const paddle = document.getElementById("paddle");
const board = document.getElementById("board");
const ball = document.getElementById("ball");
const startBtn = document.getElementById("startBtn");
const livesText = document.getElementById("lives");
const scoreText = document.getElementById("score");

let boardW, boardH, paddleW, paddleH, ballSize;
let startX = 0;
let ballX = 0.5, ballY = 0.7; //% of board
let ballVX = 0.001, ballVY = -0.005; // velocity
// and ballPx/y for pixel-pos
let gameStarted = false;
let lives = 3;
let score = 0;
const bottomBounce = new Audio('/music.mp3');

function updateSizes() {
    boardW = board.offsetWidth;
    boardH = board.offsetHeight;
    paddleW = paddle.offsetWidth;
    paddleH = paddle.offsetHeight;
    ballSize = ball.offsetWidth;
}

function createBricks(rows = 7, cols = 12) {
    document.querySelectorAll('.brick').forEach(b => b.remove());
    const gapX = 6, gapY = 8;
    const brickW = Math.min(50, (boardW - (cols - 1) * gapX) / cols);
    const brickH = 35;
    const gridW = cols * brickW + (cols - 1) * gapX;
    const offsetX = (boardW - gridW) / 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const brick = document.createElement('div');
            brick.className = 'brick';
            brick.style.position = 'absolute';
            brick.style.width = brickW + 'px';
            brick.style.height = brickH + 'px';
            brick.style.left = (offsetX + c * (brickW + gapX)) + 'px';
            brick.style.top = (r * (brickH + gapY) + 10) + 'px';
            board.appendChild(brick);
        }
    }
}

function resetAll() {
    updateSizes();
    const paddleLeft = (boardW - paddleW) / 2;
    paddle.style.left = paddleLeft + "px";

    ballY = (boardH - 20 - paddleH - ballSize / 2) / boardH;
    ball.style.left = (ballX * boardW - ballSize / 2) + "px";
    ball.style.top = (ballY * boardH - ballSize / 2) + "px";
    score = 0;
    lives = 3;
    scoreText.textContent = `Score: ${score}`;
    createBricks();
}
window.addEventListener('load', resetAll);

// Paddle Drag 
paddle.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
    startX = e.clientX;
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
}

function mouseMove(e) {
    let newX = startX - e.clientX;
    startX = e.clientX;
    let newLeft = paddle.offsetLeft - newX;
    newLeft = Math.max(0, Math.min(boardW - paddleW, newLeft));
    paddle.style.left = newLeft + "px";
}

function mouseUp() {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
}

function moveBall() {
    ballX += ballVX;
    ballY += ballVY;

    // left/right/top wall collision
    if (ballX <= ballSize / 2 / boardW) {
        ballX = ballSize / 2 / boardW;
        ballVX *= -1;
    }
    if (ballX >= 1 - ballSize / 2 / boardW) {
        ballX = 1 - ballSize / 2 / boardW;
        ballVX *= -1;
    }
    if (ballY <= ballSize / 2 / boardH) {
        ballY = ballSize / 2 / boardH;
        ballVY *= -1;
    }

    // Paddle
    const paddleLeft = parseFloat(paddle.style.left) || 0;
    const paddleTop = boardH - 20 - paddleH;
    const ballPx = ballX * boardW;
    const ballPy = ballY * boardH;
    const ballBottom = ballPy + ballSize / 2;
    const ballLeft = ballPx - ballSize / 2;
    const ballRight = ballPx + ballSize / 2;

    if (
        ballBottom >= paddleTop &&
        ballLeft <= paddleLeft + paddleW &&
        ballRight >= paddleLeft &&
        ballVY > 0
    ) {
        ballY = (paddleTop - ballSize / 2) / boardH;
        ballVY *= -1;

        // Paddle quarter bounce angle
        const hitX = (ballPx - paddleLeft) / paddleW;
        let bounceFactor = 0;
        if (hitX < 0.25) bounceFactor = -0.006;
        else if (hitX > 0.75) bounceFactor = 0.006;
        ballVX += bounceFactor;

        const maxVel = 0.015;
        ballVX = Math.max(-maxVel, Math.min(maxVel, ballVX));
        ballVY = Math.max(-maxVel, Math.min(maxVel, ballVY));
    }

    // Brick
    const bricks = Array.from(document.querySelectorAll('.brick'));
    for (const brick of bricks) {
        const bx = brick.offsetLeft, by = brick.offsetTop;
        const bw = brick.offsetWidth, bh = brick.offsetHeight;
        const ballCx = ballX * boardW, ballCy = ballY * boardH;

        if (
            ballCx + ballSize / 2 > bx &&
            ballCx - ballSize / 2 < bx + bw &&
            ballCy + ballSize / 2 > by &&
            ballCy - ballSize / 2 < by + bh
        ) {
            brick.remove();
            score += 100;
            scoreText.textContent = `Score: ${score}`;

            // Reverse ball direction depending on previous pos
            const prevBallCx = ballCx - ballVX * boardW;
            const prevBallCy = ballCy - ballVY * boardH;
            let bounced = false;
            if (prevBallCx + ballSize / 2 <= bx || prevBallCx - ballSize / 2 >= bx + bw) {
                ballVX *= -1;
                bounced = true;
            }
            if (prevBallCy + ballSize / 2 <= by || prevBallCy - ballSize / 2 >= by + bh) {
                ballVY *= -1;
                bounced = true;
            }
            if (!bounced) ballVY *= -1;

            if (ballVY < 0) ballY = (by - ballSize / 2) / boardH;
            else if (ballVY > 0) ballY = (by + bh + ballSize / 2) / boardH;

            if (document.querySelectorAll('.brick').length === 0) {
                livesText.textContent = `Level Complete with a score of ${score}`;
                gameStarted = false;
                startBtn.style.display = "block";
                resetAll();
                return;
            }
            break;
        }
    }

    // Bottom collision
    if (ballY >= 1 - ballSize / 2 / boardH) {
        ballY = 1 - ballSize / 2 / boardH;
        ballVY *= -1;
        bottomBounce.play();
        lives--;
        livesText.textContent = `Lives: ${lives}`;
        if (lives < 0) {
            gameOver();
            return;
        }
    }

    ball.style.left = (ballX * boardW - ballSize / 2) + "px";
    ball.style.top = (ballY * boardH - ballSize / 2) + "px";

    requestAnimationFrame(moveBall);
}

function gameOver() {
    gameStarted = false;
    startBtn.style.display = "block";
    livesText.textContent = `Game Over with a score of ${score}`;
    score = 0;
    scoreText.textContent = "Score: 0";
    resetAll();
}

startBtn.addEventListener("click", () => {
    resetAll();
    livesText.textContent = `Lives: ${lives}`;
    if (!gameStarted) {
        gameStarted = true;
        moveBall();
        startBtn.style.display = "none";
    }
});