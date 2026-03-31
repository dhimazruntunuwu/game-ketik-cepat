/**
 * Pong Game - Fixed Version
 */

// Konfigurasi Game
const PONG_WIDTH = 400;
const PONG_HEIGHT = 600;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 10;
const PLAYER_Y = PONG_HEIGHT - 30;
const AI_Y = 20;

// Variabel Game (Canvas & Context)
let pong_canvas, pong_ctx;
let pong_animationId;
let pong_score = 0;
let pong_isGameOver = false; // Flag untuk mencegah alert ganda

// Posisi & Kecepatan Objek
let pong_player = { x: PONG_WIDTH / 2 - PADDLE_WIDTH / 2 };
let pong_ai = { x: PONG_WIDTH / 2 - PADDLE_WIDTH / 2 };
let pong_ball = { x: PONG_WIDTH / 2, y: PONG_HEIGHT / 2, dx: 4, dy: 4 };

function startPongGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // Reset State Game
    pong_score = 0;
    pong_isGameOver = false;
    pong_ball = { x: PONG_WIDTH / 2, y: PONG_HEIGHT / 2, dx: 4, dy: 4 };
    pong_player.x = PONG_WIDTH / 2 - PADDLE_WIDTH / 2;
    pong_ai.x = PONG_WIDTH / 2 - PADDLE_WIDTH / 2;

    // UI Game (Canvas)
    wrapper.innerHTML = `<canvas id="pong-canvas" width="${PONG_WIDTH}" height="${PONG_HEIGHT}"></canvas>`;
    pong_canvas = document.getElementById('pong-canvas');
    pong_ctx = pong_canvas.getContext('2d');

    // Event Listener
    pong_canvas.addEventListener('mousemove', pong_onMove);
    pong_canvas.addEventListener('touchmove', pong_onMove, { passive: false });

    // Mulai Loop Game
    if (pong_animationId) cancelAnimationFrame(pong_animationId);
    pong_gameLoop();
}

function pong_gameLoop() {
    if (pong_isGameOver) return; // Berhenti jika game over

    pong_update();
    pong_draw();
    pong_animationId = requestAnimationFrame(pong_gameLoop);
}

function pong_onMove(e) {
    let clientX;
    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        e.preventDefault();
    } else {
        clientX = e.clientX;
    }

    const rect = pong_canvas.getBoundingClientRect();
    let rootX = clientX - rect.left;

    pong_player.x = rootX - PADDLE_WIDTH / 2;

    // Batasi paddle player
    if (pong_player.x < 0) pong_player.x = 0;
    if (pong_player.x > PONG_WIDTH - PADDLE_WIDTH) pong_player.x = PONG_WIDTH - PADDLE_WIDTH;
}

function pong_update() {
    // 1. Gerakkan Bola
    pong_ball.x += pong_ball.dx;
    pong_ball.y += pong_ball.dy;

    // 2. Pantulan Dinding (Kiri-Kanan)
    if (pong_ball.x < 0 || pong_ball.x > PONG_WIDTH - BALL_SIZE) {
        pong_ball.dx *= -1;
    }

    // 3. AI Sederhana
    let aiSpeed = 3.8;
    let targetX = pong_ball.x - PADDLE_WIDTH / 2;
    if (pong_ai.x < targetX) {
        pong_ai.x += aiSpeed;
    } else if (pong_ai.x > targetX) {
        pong_ai.x -= aiSpeed;
    }
    
    if (pong_ai.x < 0) pong_ai.x = 0;
    if (pong_ai.x > PONG_WIDTH - PADDLE_WIDTH) pong_ai.x = PONG_WIDTH - PADDLE_WIDTH;

    // 4. Pantulan Paddle Player (Bawah)
    if (pong_ball.dy > 0 &&
        pong_ball.y + BALL_SIZE > PLAYER_Y &&
        pong_ball.x > pong_player.x &&
        pong_ball.x < pong_player.x + PADDLE_WIDTH) {
        
        pong_ball.dy *= -1.05; // Percepat sedikit
        pong_score++;
        
        const stats = document.getElementById('game-stats');
        if (stats) stats.innerText = `Skor: ${pong_score} | Melawan AI`;
    }

    // Pantulan Paddle AI (Atas)
    if (pong_ball.dy < 0 &&
        pong_ball.y < AI_Y + PADDLE_HEIGHT &&
        pong_ball.x > pong_ai.x &&
        pong_ball.x < pong_ai.x + PADDLE_WIDTH) {
        pong_ball.dy *= -1;
    }

    // 5. Game Over Logic
    if (pong_ball.y < 0 || pong_ball.y > PONG_HEIGHT) {
        pong_isGameOver = true; 
        cancelAnimationFrame(pong_animationId);
        
        // Simpan data
        saveToSpreadsheet('pong', pong_score);
        
        // Timeout kecil agar render terakhir selesai sebelum alert muncul
        setTimeout(() => {
            alert(`Game Over! Skor kamu: ${pong_score}`);
            document.getElementById('game-canvas-wrapper').innerHTML = '';
            
            // Panggil leaderboard eksternal
            if (typeof showLeaderboard === 'function') {
                showLeaderboard('pong');
            }
        }, 50);
    }
}

function pong_draw() {
    // Background
    pong_ctx.fillStyle = "#2c3e50";
    pong_ctx.fillRect(0, 0, PONG_WIDTH, PONG_HEIGHT);

    // Garis Tengah
    pong_ctx.setLineDash([5, 5]);
    pong_ctx.beginPath();
    pong_ctx.moveTo(0, PONG_HEIGHT / 2);
    pong_ctx.lineTo(PONG_WIDTH, PONG_HEIGHT / 2);
    pong_ctx.strokeStyle = "rgba(255,255,255,0.2)";
    pong_ctx.stroke();

    // Gambar Objek
    pong_ctx.fillStyle = "#ecf0f1";

    // Player & AI
    pong_ctx.fillRect(pong_player.x, PLAYER_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    pong_ctx.fillRect(pong_ai.x, AI_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Bola
    pong_ctx.beginPath();
    pong_ctx.arc(pong_ball.x + BALL_SIZE / 2, pong_ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    pong_ctx.fill();
}