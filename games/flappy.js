window.startFlappyGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // 1. Setup Canvas & UI
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <canvas id="flappyCanvas" width="320" height="480" style="background:#70c5ce; border:4px solid #334155; border-radius:12px; display:block; margin:auto; touch-action:none;"></canvas>
            <p style="margin-top:10px; color:#64748b; font-family:sans-serif;">Klik/Tap/Spasi untuk Terbang!</p>
        </div>
    `;

    const cvs = document.getElementById('flappyCanvas');
    const ctx = cvs.getContext('2d');

    // 2. Variabel Game
    let birdX = 50;
    let birdY = 200;
    let birdSize = 20;
    let birdV = 0;
    let gravity = 0.25;
    let jump = -4.8;
    
    let pipes = [];
    let frame = 0;
    let score = 0;
    let isGameOver = false;

    // 3. Kontrol Input
    const flap = (e) => {
        if (e) e.preventDefault();
        if (!isGameOver) birdV = jump;
    };

    window.onclick = flap;
    window.onkeydown = (e) => { if(e.code === 'Space') flap(e); };

    // 4. Game Loop
    function loop() {
        if (isGameOver) return;

        // Bersihkan Canvas
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // Fisika Burung
        birdV += gravity;
        birdY += birdV;

        // Background Langit
        ctx.fillStyle = "#70c5ce";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Buat Pipa Baru (Setiap 1.5 - 2 detik)
        if (frame % 100 === 0) {
            let minPipeHeight = 50;
            let gap = 130; // Lebar celah pipa
            let maxPipeHeight = cvs.height - gap - minPipeHeight;
            let pipeY = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight)) + minPipeHeight;
            
            pipes.push({ 
                x: cvs.width, 
                y: pipeY, 
                gap: gap, 
                width: 50,
                passed: false 
            });
        }

        // Gambar & Update Pipa
        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= 2; // Kecepatan gerak pipa ke kiri

            // Gambar Pipa Atas
            ctx.fillStyle = "#22c55e";
            ctx.strokeStyle = "#166534";
            ctx.lineWidth = 2;
            
            ctx.fillRect(p.x, 0, p.width, p.y);
            ctx.strokeRect(p.x, 0, p.width, p.y);

            // Gambar Pipa Bawah
            ctx.fillRect(p.x, p.y + p.gap, p.width, cvs.height);
            ctx.strokeRect(p.x, p.y + p.gap, p.width, cvs.height);

            // --- LOGIKA TABRAKAN SOLID ---
            if (
                birdX + birdSize > p.x && 
                birdX < p.x + p.width && 
                (birdY < p.y || birdY + birdSize > p.y + p.gap)
            ) {
                endGame();
            }

            // Hitung Skor
            if (!p.passed && birdX > p.x + p.width) {
                p.passed = true;
                score++;
                stats.innerText = `Skor: ${score} | 📦 Flappy Mode`;
            }

            // Hapus pipa yang sudah keluar layar
            if (p.x + p.width < 0) {
                pipes.splice(i, 1);
            }
        }

        // Gambar Burung
        ctx.fillStyle = "#facc15"; // Kuning
        ctx.fillRect(birdX, birdY, birdSize, birdSize);
        ctx.strokeStyle = "#000";
        ctx.strokeRect(birdX, birdY, birdSize, birdSize);

        // Cek Batas Layar (Atas/Bawah)
        if (birdY + birdSize > cvs.height || birdY < 0) {
            endGame();
        }

        frame++;
        requestAnimationFrame(loop);
    }

    function endGame() {
        // Jika sudah game over, jangan jalankan fungsi ini lagi
        if (isGameOver) return; 
        
        isGameOver = true;

        // 1. Matikan kontrol input segera
        window.onclick = null;
        window.onkeydown = null;

        // 2. KIRIM DATA KE SPREADSHEET
        // Gunakan ID 'flappy' sesuai dengan daftar games di main.js
        saveToSpreadsheet('flappy', score);

        // 3. Tampilkan pesan skor
        // Gunakan sedikit delay agar render frame terakhir terlihat dulu
        setTimeout(() => {
            alert(`Yah, Kandas! Skor Akhir: ${score}`);
            
            // 4. TAMPILKAN LEADERBOARD GLOBAL
            showLeaderboard('flappy');
        }, 100);
    }

    loop();
};