window.startBricksGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <canvas id="brickCanvas" width="320" height="420" style="background:#0f172a; border:4px solid #334155; border-radius:12px; display:block; margin:auto; touch-action:none;"></canvas>
            <p style="margin-top:10px; color:#64748b; font-size:0.9rem;">Geser Paddle untuk Pantulkan Bola!</p>
        </div>
    `;

    const cvs = document.getElementById('brickCanvas');
    const ctx = cvs.getContext('2d');

    // 1. Variabel Bola & Paddle
    let ballRadius = 8;
    let x = cvs.width / 2;
    let y = cvs.height - 50;
    let dx = 2.5;
    let dy = -2.5;
    
    let paddleHeight = 12;
    let paddleWidth = 80;
    let paddleX = (cvs.width - paddleWidth) / 2;

    // 2. Variabel Balok
    const rowCount = 4;
    const colCount = 5;
    const brickWidth = 54;
    const brickHeight = 18;
    const brickPadding = 7;
    const offsetTop = 40;
    const offsetLeft = 10;

    let bricks = [];
    for (let c = 0; c < colCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < rowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    let score = 0;
    let animationId; // Untuk menghentikan loop

    // 3. Kontrol Input
    function moveHandler(e) {
        const rect = cvs.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const relativeX = clientX - rect.left;
        if (relativeX > 0 && relativeX < cvs.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, { passive: false });

    function draw() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // Gambar Balok
        for (let c = 0; c < colCount; c++) {
            for (let r = 0; r < rowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let bX = (c * (brickWidth + brickPadding)) + offsetLeft;
                    let bY = (r * (brickHeight + brickPadding)) + offsetTop;
                    bricks[c][r].x = bX;
                    bricks[c][r].y = bY;
                    ctx.fillStyle = `hsl(${r * 50}, 70%, 55%)`;
                    ctx.fillRect(bX, bY, brickWidth, brickHeight);
                }
            }
        }

        // Gambar Bola
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();

        // Gambar Paddle
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(paddleX, cvs.height - 20, paddleWidth, paddleHeight);

        // --- DETEKSI PANTULAN ---

        // Pantulan Dinding Kiri & Kanan
        if (x + dx > cvs.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        // Pantulan Atas
        if (y + dy < ballRadius) {
            dy = -dy;
        } 
        // Pantulan Paddle & Tanah
        else if (y + dy > cvs.height - 20 - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                // Pantulan Paddle
                let hitPoint = x - (paddleX + paddleWidth / 2);
                dx = hitPoint * 0.15; 
                dy = -dy;
            } else if (y + dy > cvs.height - ballRadius) {
                // BOLA MENYENTUH TANAH
                cancelAnimationFrame(animationId); // Hentikan animasi
                
                // Simpan High Score (jika ada fungsinya)
                if (typeof updateHighScore === "function") updateHighScore('bricks', score);
                
                // Tampilkan Popup
                alert("GAME OVER! Bola jatuh ke tanah.\nSkor Kamu: " + score);
                
                // Hapus Event Listener agar tidak error saat di Home
                document.removeEventListener("mousemove", moveHandler);
                document.removeEventListener("touchmove", moveHandler);
                
                // Kembali ke Home
                goHome();
                return;
            }
        }

        // Tabrakan Balok
        for (let c = 0; c < colCount; c++) {
            for (let r = 0; r < rowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        stats.innerText = `Skor: ${score} | 🧱 Brick Breaker`;
                        if (score === rowCount * colCount) {
                            cancelAnimationFrame(animationId);
                            alert("SELAMAT! Kamu Menang!");
                            goHome();
                            return;
                        }
                    }
                }
            }
        }

        x += dx;
        y += dy;
        animationId = requestAnimationFrame(draw);
    }

    draw();
};