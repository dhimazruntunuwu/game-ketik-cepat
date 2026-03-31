/**
 * Traffic Racer - 20 Levels Edition
 * Fitur: Progresi Kesulitan, Panel Aturan, Auto-Save & Leaderboard
 */

window.startRacerGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // State Game Utama
    let score = 0;
    let level = 1;
    const maxLevel = 20;
    let targetScore = 10; // Target untuk level 1
    let speed = 4;
    let spawnRate = 1500; // milidetik
    let isGameOver = false;
    let enemies = [];
    const lanes = [30, 130, 230];

    const player = {
        x: 130,
        y: 320,
        w: 40,
        h: 70
    };

    // Render UI Lengkap
    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', sans-serif; user-select:none; color: #f8fafc; padding: 15px; background: #1e293b; border-radius: 20px;">
            
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: #334155; padding: 10px; border-radius: 12px; text-align: left; font-size: 0.8rem; border: 1px solid #475569;">
                    <b style="color: #fbbf24;">📜 ATURAN:</b><br>
                    • Hindari <span style="color:#fbbf24">Mobil Kuning</span>!<br>
                    • Capai target skor untuk naik level.<br>
                    • Level 20 adalah tantangan puncak.
                </div>
                <div style="background: #0f172a; padding: 10px; border-radius: 12px; display: flex; flex-direction: column; justify-content: center; border: 1px solid #1e293b;">
                    <div style="font-size: 0.8rem;">LV: <span id="racer-level" style="color:#38bdf8; font-weight:bold;">1</span> / 20</div>
                    <div style="font-size: 1.1rem; font-weight: bold;">SKOR: <span id="racer-score" style="color:#22c55e;">0</span></div>
                    <div style="font-size: 0.7rem; color: #64748b;">Target: <span id="racer-target">10</span></div>
                </div>
            </div>

            <canvas id="racerCanvas" width="300" height="400" style="background:#334155; border:4px solid #0f172a; border-radius:12px; display:block; margin:auto; touch-action:none;"></canvas>
            
            <div style="margin-top:20px; display:flex; justify-content:center; gap:20px;">
                <button id="btnRaceLeft" style="width:70px; height:70px; background:#475569; color:white; border:none; border-radius:50%; font-size:1.8rem; cursor:pointer; box-shadow: 0 4px #1e293b;">◀</button>
                <button id="btnRaceRight" style="width:70px; height:70px; background:#475569; color:white; border:none; border-radius:50%; font-size:1.8rem; cursor:pointer; box-shadow: 0 4px #1e293b;">▶</button>
            </div>

            <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startRacerGame()" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 Reset</button>
                <button id="btnSurrenderRacer" onclick="surrenderRacer()" style="padding:10px 20px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🏳️ Menyerah</button>
            </div>

            <div id="racer-leaderboard-area" style="margin-top:15px;"></div>
        </div>
    `;

    const cvs = document.getElementById('racerCanvas');
    const ctx = cvs.getContext('2d');

    // Kontrol Pergerakan
    const moveLeft = () => { if (player.x > 30 && !isGameOver) player.x -= 100; };
    const moveRight = () => { if (player.x < 230 && !isGameOver) player.x += 100; };

    document.getElementById('btnRaceLeft').onclick = moveLeft;
    document.getElementById('btnRaceRight').onclick = moveRight;

    window.onkeydown = (e) => {
        if (e.key === "ArrowLeft") moveLeft();
        if (e.key === "ArrowRight") moveRight();
    };

    function spawnEnemy() {
        if (isGameOver) return;
        
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        enemies.push({ x: lane, y: -100, w: 40, h: 70 });
        
        // Kalkulasi Spawn Rate berdasarkan level (Makin kecil makin rapat)
        let nextSpawn = Math.max(400, spawnRate - (level * 40));
        setTimeout(spawnEnemy, nextSpawn);
    }

    function update() {
        if (isGameOver) return;

        enemies.forEach((en, index) => {
            en.y += speed + (level * 0.5); // Kecepatan bertambah tiap level

            // Collision Detection
            if (player.x < en.x + en.w &&
                player.x + player.w > en.x &&
                player.y < en.y + en.h &&
                player.y + player.h > en.y) {
                
                isGameOver = true;
                handleGameOver("TABRAKAN! Mobil kamu hancur.");
            }

            // Hapus musuh & tambah skor
            if (en.y > cvs.height) {
                enemies.splice(index, 1);
                score++;
                updateUI();
                checkLevelUp();
            }
        });

        draw();
        requestAnimationFrame(update);
    }

    function updateUI() {
        document.getElementById('racer-score').innerText = score;
    }

    function checkLevelUp() {
        if (score >= targetScore && level < maxLevel) {
            level++;
            targetScore += 10 + (level * 2);
            document.getElementById('racer-level').innerText = level;
            document.getElementById('racer-target').innerText = targetScore;
            // Visual Level Up Flash
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(0,0, cvs.width, cvs.height);
        }
    }

    function draw() {
        // Background
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Markah Jalan Bergerak (Animasi sederhana)
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.setLineDash([20, 30]);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(100, 0); ctx.lineTo(100, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(200, 0); ctx.lineTo(200, 400); ctx.stroke();

        // Player
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(player.x, player.y, player.w, player.h);
        ctx.fillStyle = "#38bdf8"; ctx.fillRect(player.x+5, player.y+10, 30, 15); // Kaca
        ctx.fillStyle = "#fef08a"; ctx.fillRect(player.x+5, player.y, 10, 5); ctx.fillRect(player.x+25, player.y, 10, 5); // Lampu

        // Enemy
        enemies.forEach(en => {
            ctx.fillStyle = "#fbbf24";
            ctx.fillRect(en.x, en.y, en.w, en.h);
            ctx.fillStyle = "#1e293b"; ctx.fillRect(en.x+5, en.y+45, 30, 15); // Kaca Belakang
        });
    }

    function handleGameOver(msg) {
        alert(msg + "\nLevel: " + level + " | Skor Akhir: " + score);
        window.surrenderRacer();
    }

    window.surrenderRacer = function() {
        isGameOver = true;
        const btnS = document.getElementById('btnSurrenderRacer');
        if(btnS) btnS.disabled = true;

        // Simpan ke Spreadsheet (Asumsi fungsi global tersedia)
        if (typeof saveToSpreadsheet === "function") {
            saveToSpreadsheet('traffic_racer', score);
        }

        // Tampilkan Leaderboard di dalam game
        if (typeof showLeaderboard === "function") {
            showLeaderboard('traffic_racer');
        }
    };

    spawnEnemy();
    update();
};