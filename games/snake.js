function startSnakeGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan awal
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div style="text-align:center;">
            <canvas id="snakeCanvas" width="300" height="300" style="border:5px solid #334155; background:#1e293b; border-radius:10px; width:100%; max-width:300px;"></canvas>
            
            <div style="margin-top:15px; display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; width:180px; margin-left:auto; margin-right:auto;">
                <div style="grid-column: 2"><button onclick="moveSnake(0,-1)" style="padding:15px; border-radius:10px; border:none; background:#94a3b8; font-size:1.5rem;">⬆️</button></div>
                <div style="grid-column: 1"><button onclick="moveSnake(-1,0)" style="padding:15px; border-radius:10px; border:none; background:#94a3b8; font-size:1.5rem;">⬅️</button></div>
                <div style="grid-column: 2"><button onclick="moveSnake(0,1)" style="padding:15px; border-radius:10px; border:none; background:#94a3b8; font-size:1.5rem;">⬇️</button></div>
                <div style="grid-column: 3; grid-row: 2"><button onclick="moveSnake(1,0)" style="padding:15px; border-radius:10px; border:none; background:#94a3b8; font-size:1.5rem;">➡️</button></div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const box = 15; // Ukuran kotak grid (20x20 grid)
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 5, y: 5};
    let dx = 0, dy = 0;
    let score = 0;
    let isGameOver = false;

    // Fungsi penggerak (bisa dipanggil dari tombol atau keyboard)
    window.moveSnake = (x, y) => {
        if(isGameOver) return;
        // Mencegah balik arah langsung (misal: lagi ke kanan, gak boleh langsung ke kiri)
        if (x !== 0 && dx === 0) { dx = x; dy = 0; }
        if (y !== 0 && dy === 0) { dy = y; dx = 0; }
    };

    // Keyboard support
    document.onkeydown = e => {
        if(e.key === 'ArrowUp') moveSnake(0, -1);
        if(e.key === 'ArrowDown') moveSnake(0, 1);
        if(e.key === 'ArrowLeft') moveSnake(-1, 0);
        if(e.key === 'ArrowRight') moveSnake(1, 0);
    };

    function gameLoop() {
        if(isGameOver) return;

        let head = {x: snake[0].x + dx, y: snake[0].y + dy};

        // Tabrak Tembok atau Tubuh Sendiri
        const hitWall = head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20;
        const hitSelf = snake.some((s, index) => index !== 0 && s.x === head.x && s.y === head.y);

        if(hitWall || hitSelf) {
            isGameOver = true;
            alert(`Aww! Nabrak! Skor Akhir: ${score}`);
            goHome();
            return;
        }

        // Makan Food
        if(head.x === food.x && head.y === food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 20),
                y: Math.floor(Math.random() * 20)
            };
        } else {
            // Jika tidak makan, ekor dipotong (Snake bergerak)
            if(dx !== 0 || dy !== 0) snake.pop();
        }

        // Masukkan kepala baru
        if(dx !== 0 || dy !== 0) snake.unshift(head);

        // Render Canvas
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, 300, 300);

        // Gambar Snake
        ctx.fillStyle = "#22c55e"; // Hijau cerah
        snake.forEach((s, index) => {
            ctx.fillRect(s.x * box, s.y * box, box - 2, box - 2);
            if(index === 0) { // Mata di kepala
                ctx.fillStyle = "white";
                ctx.fillRect(s.x * box + 4, s.y * box + 4, 3, 3);
            }
        });

        // Gambar Food
        ctx.fillStyle = "#ef4444"; // Merah apel
        ctx.fillRect(food.x * box, food.y * box, box - 2, box - 2);

        // Update Stats dengan Timer Global
        stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;

        setTimeout(gameLoop, 150);
    }

    gameLoop();
}