function startDinoGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan stats awal
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div style="text-align:center;">
            <canvas id="dinoCanvas" width="600" height="150" style="border-bottom:2px solid #333; background:#fff; width:100%; max-width:600px;"></canvas>
            <p style="color:#64748b; margin-top:10px;">Ketuk layar untuk melompat!</p>
        </div>
    `;
    
    const canvas = document.getElementById('dinoCanvas');
    const ctx = canvas.getContext('2d');
    
    let dinoY = 130, jump = false, score = 0, cactusX = 600;
    let isGameOver = false;

    // Kontrol lompat
    window.onclick = () => { if(dinoY === 130) jump = true; };

    function loop() {
        if(isGameOver) return; // Hentikan loop jika kalah

        ctx.clearRect(0, 0, 600, 150);

        // Logika Lompat (Gravity & Jump)
        if(jump) { 
            dinoY -= 5; 
            if(dinoY <= 60) jump = false; 
        } else if(dinoY < 130) { 
            dinoY += 5; 
        }

        // Logika Rintangan (Cactus)
        cactusX -= 7; // Sedikit lebih cepat biar seru
        if(cactusX < -20) { 
            cactusX = 600; 
            score++; 
            // Update skor dan sinkronkan dengan timer global
            stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
        }

        // Gambar Dino (Warna Biru biar senada dengan Hub)
        ctx.fillStyle = "#2563eb"; 
        ctx.fillRect(50, dinoY - 20, 25, 25); 

        // Gambar Rintangan (Merah)
        ctx.fillStyle = "#ef4444"; 
        ctx.fillRect(cactusX, 110, 20, 40); 

        // Deteksi Tabrakan
        if(cactusX < 75 && cactusX > 30 && dinoY > 110) {
            isGameOver = true;
            alert(`Yah, Nabrak! Skor Kamu: ${score}`);
            goHome(); // Kembali ke menu utama (main.js akan clear timer)
            return;
        }

        // Update timer secara berkala jika tidak ada perubahan skor
        if (frameCounter % 30 === 0) { // Update setiap ~0.5 detik
             stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
        }
        frameCounter++;

        requestAnimationFrame(loop);
    }

    let frameCounter = 0;
    loop();
}