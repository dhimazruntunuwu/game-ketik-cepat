function startDinoGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    stats.innerText = `Skor: 0 | 🦖 Mode Santai`;

    // 1. Buat HTML Canvas
    wrapper.innerHTML = `
        <div style="text-align:center; width:100%;">
            <canvas id="dinoCanvas" width="600" height="150" style="border-bottom:4px solid #334155; background:#fff; width:100%; max-width:600px; display:block; margin:0 auto;"></canvas>
            <p style="color:#64748b; margin-top:10px; font-family:sans-serif;">Klik atau tekan <b>Spasi</b> untuk melompat!</p>
        </div>
    `;
    
    const canvas = document.getElementById('dinoCanvas');
    if (!canvas) return; // Safety check
    const ctx = canvas.getContext('2d');
    
    // 2. Variabel Game
    const canvasHeight = 150;
    const dinoSize = 30;
    const groundY = canvasHeight - dinoSize; // 120

    let dinoY = groundY; 
    let velocityY = 0;
    let score = 0;
    let cactusX = 600;
    let isGameOver = false;

    // 3. Fungsi Lompat (Local agar tidak bentrok)
    const jumpAction = () => {
        if (dinoY >= groundY - 1) {
            velocityY = -10;
        }
    };

    // Pasang listener secara spesifik
    window.onclick = jumpAction;
    window.onkeydown = (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Biar layar gak scrolling
            jumpAction();
        }
    };

    // 4. Game Loop
    function loop() {
        if (isGameOver) return;

        ctx.clearRect(0, 0, 600, 150);

        // Fisika
        velocityY += 0.6;
        dinoY += velocityY;

        // Kunci di Lantai
        if (dinoY > groundY) {
            dinoY = groundY;
            velocityY = 0;
        }

        // Gerakan Kaktus
        cactusX -= 8;
        if (cactusX < -30) {
            cactusX = 600;
            score++;
            stats.innerText = `Skor: ${score} | 🦖 Mode Santai`;
        }

        // Gambar Dino (Biru) - Math.floor cegah melayang
        ctx.fillStyle = "#2563eb"; 
        ctx.fillRect(50, Math.floor(dinoY), dinoSize, dinoSize); 

        // Gambar Kaktus (Merah)
        ctx.fillStyle = "#ef4444"; 
        ctx.fillRect(cactusX, 110, 20, 40); 

        // Deteksi Tabrakan
        if (cactusX < 80 && cactusX > 30 && dinoY > 80) {
            isGameOver = true;
            
            // 1. Matikan listener input agar tidak ada lompatan setelah mati
            window.onclick = null;
            window.onkeydown = null;
            
            // 2. KIRIM SKOR KE SPREADSHEET
            // Pastikan ID 'dino' sesuai dengan list di main.js kamu
            saveToSpreadsheet('dino', score); 

            // 3. Tampilkan pesan Game Over
            alert(`Yah, Nabrak! Skor Akhir: ${score}`);
            
            // 4. TAMPILKAN LEADERBOARD GLOBAL
            showLeaderboard('dino');

            // Kita tidak memanggil goHome() secara otomatis agar 
            // user punya waktu melihat papan skor di layar.
            return;
        }

        requestAnimationFrame(loop);
    }

    // Mulai loop setelah jeda singkat (agar canvas render sempurna)
    setTimeout(() => {
        loop();
    }, 50);
}