function startPlatformerGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan awal
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div style="text-align:center;">
            <canvas id="platCanvas" width="600" height="200" style="border-bottom: 3px solid #333; width: 100%; background: #f8fafc;"></canvas>
            <p style="margin-top:10px; color:#64748b;">Klik/Tap untuk Melompat!</p>
        </div>
    `;
    
    const canvas = document.getElementById('platCanvas');
    const ctx = canvas.getContext('2d');

    let dino = { x: 50, y: 150, w: 30, h: 30, dy: 0, jump: false };
    let obstacles = [];
    let score = 0;
    let frame = 0;
    let isGameOver = false;

    function spawnObstacle() {
        // Munculkan rintangan setiap 100 frame
        if (frame % 100 === 0) {
            obstacles.push({ x: 600, y: 150, w: 20, h: 30 });
        }
    }

    function update() {
        if (isGameOver) return; // Hentikan animasi jika kalah

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dino Physics
        if (dino.jump) {
            dino.dy = -10;
            dino.jump = false;
        }
        dino.y += dino.dy;
        dino.dy += 0.5; // Gravity
        if (dino.y > 150) dino.y = 150;

        // Gambar Dino (Biru)
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(dino.x, dino.y, dino.w, dino.h);

        // Update & Gambar Obstacles
        obstacles.forEach((ob) => {
            ob.x -= 5;
            ctx.fillStyle = "#ef4444"; // Merah
            ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

            // Collision detection
            if (dino.x < ob.x + ob.w && 
                dino.x + dino.w > ob.x && 
                dino.y < ob.y + ob.h && 
                dino.y + dino.h > ob.y) {
                
                isGameOver = true;
                alert("Game Over! Skor: " + score);
                goHome(); // main.js akan menghentikan timer global
            }
        });

        obstacles = obstacles.filter(ob => ob.x > -20);
        spawnObstacle();
        
        frame++;
        
        // Update Skor setiap rintangan berhasil dilewati atau per frame (opsional)
        // Di sini kita update stats setiap frame agar timer detikannya terlihat mengalir
        score++;
        stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;

        requestAnimationFrame(update);
    }

    // Listener lompat khusus di area canvas/wrapper
    window.onclick = () => { 
        if(dino.y === 150) dino.jump = true; 
    };

    update();
}