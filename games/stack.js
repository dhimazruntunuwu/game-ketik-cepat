window.startStackGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <canvas id="stackCanvas" width="300" height="400" style="background:#f1f5f9; border:4px solid #334155; border-radius:12px; display:block; margin:auto; touch-action:none;"></canvas>
            <p style="margin-top:10px; color:#64748b;">Klik/Tap untuk Menaruh Balok!</p>
        </div>
    `;

    const cvs = document.getElementById('stackCanvas');
    const ctx = cvs.getContext('2d');

    // Variabel Game
    let score = 0;
    let speed = 2;
    let isGameOver = false;
    
    // Properti Balok
    let blocks = [];
    let currentBlock = {
        x: 0,
        y: 360, // Mulai dari bawah
        w: 150, // Lebar awal
        h: 20,
        dir: 1
    };

    // Balok Dasar (Lantai 0)
    blocks.push({ x: 75, y: 380, w: 150, h: 20 });

    function initNewBlock() {
        score++;
        stats.innerText = `Skor: ${score} | 🏗️ Tower Stack`;
        
        // Kecepatan nambah setiap 5 lantai
        if (score % 5 === 0) speed += 0.5;

        currentBlock = {
            x: 0,
            y: 380 - ((blocks.length) * 20),
            w: blocks[blocks.length - 1].w, // Lebar ikut balok di bawahnya
            h: 20,
            dir: 1
        };

        // Jika layar sudah penuh, kita "geser" semua balok ke bawah (Camera Follow)
        if (currentBlock.y < 100) {
            blocks.forEach(b => b.y += 20);
            currentBlock.y += 20;
        }
    }

    window.onclick = () => {
        if (isGameOver) return;

        let lastBlock = blocks[blocks.length - 1];
        let diff = currentBlock.x - lastBlock.x;

        // 1. Cek apakah meleset total
        if (Math.abs(diff) >= lastBlock.w) {
            endGame();
            return;
        }

        // 2. POTONG BALOK (Slicing Logic)
        if (currentBlock.x > lastBlock.x) {
            // Potong kanan
            currentBlock.w -= diff;
        } else {
            // Potong kiri
            currentBlock.w += diff;
            currentBlock.x = lastBlock.x;
        }

        blocks.push({...currentBlock});
        initNewBlock();
    };

    function loop() {
        if (isGameOver) return;

        // Bersihkan Canvas
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // Gambar Balok-balok yang sudah terpasang
        blocks.forEach((b, i) => {
            ctx.fillStyle = `hsl(${i * 15}, 70%, 50%)`;
            ctx.fillRect(b.x, b.y, b.w, b.h);
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.strokeRect(b.x, b.y, b.w, b.h);
        });

        // Animasi Balok yang sedang bergerak
        currentBlock.x += speed * currentBlock.dir;
        if (currentBlock.x + currentBlock.w > cvs.width || currentBlock.x < 0) {
            currentBlock.dir *= -1;
        }

        // Gambar Balok Aktif
        ctx.fillStyle = `hsl(${blocks.length * 15}, 70%, 50%)`;
        ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);

        requestAnimationFrame(loop);
    }

    function endGame() {
        if (isGameOver) return; // Mencegah fungsi terpanggil dua kali
        
        isGameOver = true;

        // 1. Matikan kontrol klik agar tidak ada balok jatuh setelah game over
        window.onclick = null;

        // 2. KIRIM DATA KE SPREADSHEET
        // Gunakan ID 'stack' (pastikan sama dengan ID di main.js)
        saveToSpreadsheet('stack', score);

        // 3. Beri sedikit jeda sebelum menampilkan alert dan leaderboard
        setTimeout(() => {
            alert(`Yah, Runtuh! Tinggi Menara: ${score} Lantai`);
            
            // 4. TAMPILKAN LEADERBOARD GLOBAL
            showLeaderboard('stack');
        }, 100);
    }

    loop();
};