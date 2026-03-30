window.startRacerGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <canvas id="racerCanvas" width="300" height="400" style="background:#334155; border:4px solid #1e293b; border-radius:12px; display:block; margin:auto; touch-action:none;"></canvas>
            
            <div style="margin-top:20px; display:flex; justify-content:center; gap:20px;">
                <button id="btnRaceLeft" style="width:80px; height:80px; background:#475569; color:white; border:none; border-radius:50%; font-size:2rem; cursor:pointer; active:scale(0.9);">◀</button>
                <button id="btnRaceRight" style="width:80px; height:80px; background:#475569; color:white; border:none; border-radius:50%; font-size:2rem; cursor:pointer; active:scale(0.9);">▶</button>
            </div>
            <p style="margin-top:10px; color:#64748b; font-size:0.8rem;">Hindari mobil kuning!</p>
        </div>
    `;

    const cvs = document.getElementById('racerCanvas');
    const ctx = cvs.getContext('2d');

    let score = 0;
    let speed = 4;
    let isGameOver = false;
    let enemies = [];
    const lanes = [30, 130, 230]; 

    const player = {
        x: 130, // Mulai di tengah
        y: 320,
        w: 40,
        h: 70
    };

    // --- LOGIKA PERGERAKAN ---
    const moveLeft = () => { if (player.x > 30) player.x -= 100; };
    const moveRight = () => { if (player.x < 230) player.x += 100; };

    // Event Listener Tombol
    document.getElementById('btnRaceLeft').onclick = moveLeft;
    document.getElementById('btnRaceRight').onclick = moveRight;

    // Support Keyboard
    window.onkeydown = (e) => {
        if (e.key === "ArrowLeft") moveLeft();
        if (e.key === "ArrowRight") moveRight();
    };

    function spawnEnemy() {
        if (isGameOver) return;
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        enemies.push({ x: lane, y: -100, w: 40, h: 70 });
        
        // Spawn musuh lebih cepat seiring bertambahnya skor
        let nextSpawn = Math.max(500, 1200 - (score * 15));
        setTimeout(spawnEnemy, nextSpawn);
    }

    function update() {
        if (isGameOver) return;

        enemies.forEach((en, index) => {
            en.y += speed;

            // Collision Detection
            if (player.x < en.x + en.w &&
                player.x + player.w > en.x &&
                player.y < en.y + en.h &&
                player.y + player.h > en.y) {
                
                isGameOver = true;
                if (typeof updateHighScore === "function") updateHighScore('racer', score);
                alert("BOOM! Mobil kamu hancur.\nSkor: " + score);
                goHome();
            }

            // Hapus musuh & tambah skor
            if (en.y > cvs.height) {
                enemies.splice(index, 1);
                score++;
                stats.innerText = `Skor: ${score} | 🏎️ Traffic Racer`;
                if (score % 5 === 0) speed += 0.3; // Makin lama makin kencang
            }
        });

        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        // Background Jalan
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Markah Jalan
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.setLineDash([20, 20]);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(100, 0); ctx.lineTo(100, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(200, 0); ctx.lineTo(200, 400); ctx.stroke();

        // Mobil Player (Merah)
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(player.x, player.y, player.w, player.h);
        // Detail Lampu & Kaca Player
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(player.x+5, player.y+10, 30, 15); // Kaca
        ctx.fillStyle = "#fef08a"; ctx.fillRect(player.x+5, player.y, 10, 5); // Lampu Depan

        // Mobil Musuh (Kuning)
        enemies.forEach(en => {
            ctx.fillStyle = "#fbbf24";
            ctx.fillRect(en.x, en.y, en.w, en.h);
            ctx.fillStyle = "#1e293b"; ctx.fillRect(en.x+5, en.y+45, 30, 15); // Kaca Musuh
        });
    }

    spawnEnemy();
    update();
};