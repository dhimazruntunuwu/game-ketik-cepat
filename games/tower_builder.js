/**
 * Tower Builder - 20 Levels Precision Edition
 * Fitur: Balok Terpotong, Progresi Speed, Auto-Save & Leaderboard
 */

window.startTowerGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // State Game
    let level = 1;
    const maxLevel = 20;
    let score = 0;
    let isGameOver = false;
    
    // Dimensi Balok
    let stack = []; // Menyimpan data tiap lantai {x, y, w}
    let currentW = 150;
    let currentX = 0;
    let speed = 2;
    let direction = 1; // 1: kanan, -1: kiri
    let targetLevelStack = 5; // Target tumpukan per level

    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', sans-serif; user-select:none; color: #f8fafc; padding: 15px; background: #0f172a; border-radius: 20px;">
            
            <div style="background: #1e293b; padding: 10px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #334155; text-align: left; font-size: 0.8rem;">
                <b style="color: #38bdf8;">📜 CARA BERMAIN:</b><br>
                • Tap untuk menumpuk balok.<br>
                • Bagian yang tidak pas akan <b>terpotong</b>.<br>
                • Jangan sampai balok meleset total!<br>
                • Capai target tinggi untuk naik level.
            </div>

            <div style="display: flex; justify-content: space-around; margin-bottom: 10px; font-weight: bold;">
                <div style="color: #38bdf8;">LV: <span id="tower-lv">1</span></div>
                <div style="color: #22c55e;">SKOR: <span id="tower-score">0</span></div>
                <div style="color: #94a3b8;">TARGET: <span id="tower-target">5</span></div>
            </div>

            <canvas id="towerCanvas" width="300" height="400" style="background:#1e293b; border-radius:12px; display:block; margin:auto; cursor:pointer; border: 2px solid #334155;"></canvas>

            <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startTowerGame()" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 Reset</button>
                <button id="btnSurrenderTower" onclick="surrenderTower()" style="padding:10px 20px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🏳️ Menyerah</button>
            </div>

            <div id="tower-leaderboard-area" style="margin-top:15px;"></div>
        </div>
    `;

    const cvs = document.getElementById('towerCanvas');
    const ctx = cvs.getContext('2d');

    function initGame() {
        stack = [{ x: 75, w: 150, color: '#334155' }]; // Dasar tower
        currentW = 150;
        currentX = 0;
        isGameOver = false;
        speed = 2 + (level * 0.5);
        targetLevelStack = 5 + (level * 2);
        
        document.getElementById('tower-lv').innerText = level;
        document.getElementById('tower-target').innerText = targetLevelStack;
    }

    function update() {
        if (isGameOver) return;

        // Gerakkan balok yang sedang aktif
        currentX += speed * direction;
        if (currentX + currentW > 300 || currentX < 0) {
            direction *= -1;
        }

        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        ctx.clearRect(0, 0, 300, 400);

        // Gambar tumpukan yang sudah ada
        stack.forEach((box, i) => {
            // Geser kamera ke bawah jika tower makin tinggi
            let displayY = 370 - (i * 30);
            ctx.fillStyle = box.color || `hsl(${(i * 20) % 360}, 60%, 50%)`;
            ctx.fillRect(box.x, displayY, box.w, 28);
        });

        // Gambar balok yang sedang bergerak
        if (!isGameOver) {
            let activeY = 370 - (stack.length * 30);
            ctx.fillStyle = `hsl(${(stack.length * 20) % 360}, 70%, 60%)`;
            ctx.fillRect(currentX, activeY, currentW, 28);
        }
    }

    cvs.onclick = () => {
        if (isGameOver) return;

        let lastBox = stack[stack.length - 1];
        let diff = currentX - lastBox.x;

        // Cek apakah meleset total
        if (Math.abs(diff) >= currentW) {
            handleGameOver("Meleset! Tower runtuh.");
            return;
        }

        // Hitung pemotongan
        if (diff > 0) {
            // Terpotong di kanan
            currentW -= diff;
        } else {
            // Terpotong di kiri
            currentW += diff;
            currentX = lastBox.x;
        }

        // Tambah ke stack
        stack.push({ x: currentX, w: currentW });
        score += 10 * level;
        document.getElementById('tower-score').innerText = score;

        // Cek Level Up
        if (stack.length >= targetLevelStack) {
            if (level < maxLevel) {
                level++;
                alert(`LEVEL ${level}! Kecepatan meningkat.`);
                initGame();
            } else {
                alert("CONGRATS! Kamu mencapai puncak Level 20!");
                window.surrenderTower();
            }
        }
    };

    function handleGameOver(msg) {
        isGameOver = true;
        alert(msg + "\nSkor Akhir: " + score);
        window.surrenderTower();
    }

    window.surrenderTower = function() {
    isGameOver = true;
    const btn = document.getElementById('btnSurrenderTower');
    if(btn) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
    }

    // 1. Simpan ke Spreadsheet
    if (typeof saveToSpreadsheet === "function") {
        saveToSpreadsheet('tower_builder', score);
    }

    // 2. Tampilkan Leaderboard (Gunakan ID yang konsisten)
    // Pastikan ID 'tower_builder' sama dengan yang ada di daftar games[]
    if (typeof showLeaderboard === "function") {
        // Beri jeda sedikit agar server sempat memproses data baru
        setTimeout(() => {
            showLeaderboard('tower_builder');
        }, 500); 
    }
};

    initGame();
    update();
};