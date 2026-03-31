/**
 * Gold Miner - 20 Levels Edition
 * Fitur: Progresi Kesulitan, Panel Aturan, Auto-Save & Leaderboard
 */

window.startMinerGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // State Game Utama
    let score = 0;
    let level = 1;
    let maxLevel = 20;
    let targetScore = 50; // Target level 1
    let isGameOver = false;
    
    // Hook/Pengait
    let angle = Math.PI / 2;
    let angleDir = 0.03;
    let hookLen = 40;
    let hookState = "swing"; // swing, shoot, return
    let targetIdx = -1;
    let swingSpeed = 0.03;

    // Items
    let items = [];

    function initLevel() {
        items = [];
        targetScore = level * 60; // Target naik tiap level
        swingSpeed = 0.03 + (level * 0.005); // Ayunan makin cepat
        
        // Spawn Emas
        for(let i=0; i < 5 + Math.floor(level/2); i++) {
            items.push({ 
                x: 30 + Math.random()*260, 
                y: 150 + Math.random()*220, 
                r: 12 + Math.random()*15, 
                type: 'gold', 
                color: '#fbbf24', 
                val: 20 
            });
        }
        // Spawn Batu (Makin banyak di level tinggi)
        for(let i=0; i < 3 + Math.floor(level/1.5); i++) {
            items.push({ 
                x: 30 + Math.random()*260, 
                y: 150 + Math.random()*220, 
                r: 10 + Math.random()*12, 
                type: 'stone', 
                color: '#94a3b8', 
                val: 5 
            });
        }
    }

    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', sans-serif; user-select:none; color: #f8fafc; padding: 10px; background: #27272a; border-radius: 20px;">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: #451a03; padding: 10px; border-radius: 12px; text-align: left; font-size: 0.75rem; border: 1px solid #78350f;">
                    <b style="color: #fbbf24;">📜 ATURAN:</b><br>
                    • Ambil <span style="color:#fbbf24">Emas</span> untuk skor & kecepatan.<br>
                    • Hindari <span style="color:#94a3b8">Batu</span> (Berat/Lambat).<br>
                    • Capai Target untuk lanjut level.
                </div>
                <div style="background: #18181b; padding: 10px; border-radius: 12px; display: flex; flex-direction: column; justify-content: center; border: 1px solid #3f3f46;">
                    <div style="font-size: 0.9rem;">LEVEL: <span id="miner-level" style="color:#fbbf24; font-weight:bold;">1</span> / 20</div>
                    <div style="font-size: 1.1rem; font-weight: bold;">SKOR: <span id="miner-score" style="color:#22c55e;">0</span></div>
                    <div style="font-size: 0.7rem; color: #a1a1aa;">Target: <span id="miner-target">50</span></div>
                </div>
            </div>

            <canvas id="minerCanvas" width="320" height="420" style="background: linear-gradient(#7dd3fc, #451a03 30%); border:4px solid #78350f; border-radius:12px; display:block; margin:auto;"></canvas>
            
            <div style="margin-top:20px; display: flex; gap: 10px; justify-content: center;">
                <button id="btnHook" style="width:140px; height:60px; background:#eab308; color:#451a03; border:none; border-radius:12px; font-weight:bold; font-size:1.2rem; cursor:pointer; box-shadow: 0 4px #a16207;">AMBIL!</button>
                <button id="btnSurrender" style="padding: 0 20px; background:#ef4444; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">🏳️ Menyerah</button>
            </div>

            <div id="miner-leaderboard-area" style="margin-top:15px;"></div>
        </div>
    `;

    const cvs = document.getElementById('minerCanvas');
    const ctx = cvs.getContext('2d');

    function update() {
        if (isGameOver) return;

        // 1. Logika Ayunan (Swing)
        if(hookState === "swing") {
            angle += angleDir * (swingSpeed / 0.03);
            if(angle > Math.PI - 0.5 || angle < 0.5) angleDir = -angleDir;
        } 
        // 2. Logika Menembak (Shoot)
        else if(hookState === "shoot") {
            hookLen += 7;
            let hookX = 160 + Math.cos(angle) * hookLen;
            let hookY = 60 + Math.sin(angle) * hookLen;

            for(let i=0; i<items.length; i++) {
                let d = Math.hypot(hookX - items[i].x, hookY - items[i].y);
                if(d < items[i].r) {
                    hookState = "return";
                    targetIdx = i;
                    break;
                }
            }
            if(hookLen > 400 || hookX < 0 || hookX > 320) hookState = "return";
        } 
        // 3. Logika Menarik (Return)
        else if(hookState === "return") {
            // Kalkulasi berat: Batu level tinggi makin berat
            let weight = (targetIdx !== -1 && items[targetIdx].type === 'stone') ? (2 - (level * 0.05)) : 6;
            if (weight < 0.8) weight = 0.8; // Minimal speed agar tidak macet

            hookLen -= weight;

            if(targetIdx !== -1) {
                items[targetIdx].x = 160 + Math.cos(angle) * hookLen;
                items[targetIdx].y = 60 + Math.sin(angle) * hookLen;
            }

            if(hookLen <= 40) {
                if(targetIdx !== -1) {
                    score += items[targetIdx].val;
                    items.splice(targetIdx, 1);
                    
                    // Update UI
                    document.getElementById('miner-score').innerText = score;
                    
                    // Cek Naik Level
                    if(score >= targetScore) {
                        if(level < maxLevel) {
                            level++;
                            alert(`LEVEL ${level}! Target: ${level * 60}`);
                            document.getElementById('miner-level').innerText = level;
                            document.getElementById('miner-target').innerText = level * 60;
                            initLevel();
                        } else {
                            alert("TAMAT! Kamu Penambang Terkaya!");
                            window.surrenderMiner();
                        }
                    }
                    
                    // Re-spawn jika emas habis tapi target belum tercapai
                    if(items.filter(it => it.type === 'gold').length === 0) {
                        spawnMoreGold();
                    }
                }
                hookState = "swing";
                targetIdx = -1;
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    function spawnMoreGold() {
        for(let i=0; i<3; i++) {
            items.push({ x: 30 + Math.random()*260, y: 150 + Math.random()*220, r: 12 + Math.random()*15, type: 'gold', color: '#fbbf24', val: 20 });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, 320, 420);

        // Gambar Tanah
        ctx.fillStyle = "#5c2d10";
        ctx.fillRect(0, 80, 320, 340);

        // Gambar Tali
        let hookX = 160 + Math.cos(angle) * hookLen;
        let hookY = 60 + Math.sin(angle) * hookLen;
        ctx.strokeStyle = "#d4d4d8"; 
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(160, 60); 
        ctx.lineTo(hookX, hookY); 
        ctx.stroke();

        // Gambar Pengait
        ctx.save();
        ctx.translate(hookX, hookY);
        ctx.rotate(angle + Math.PI/2);
        ctx.strokeStyle = "#a1a1aa";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 8, Math.PI, 0); // Bentuk jangkar sederhana
        ctx.stroke();
        ctx.restore();

        // Gambar Items
        items.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.r, 0, Math.PI*2);
            ctx.fill();
            if(item.type === 'gold') {
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.fillRect(item.x - 4, item.y - 4, 4, 4);
            } else {
                ctx.strokeStyle = "#475569";
                ctx.stroke();
            }
        });

        // Gambar Katrol (Mesin)
        ctx.fillStyle = "#27272a";
        ctx.fillRect(145, 20, 30, 40);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.arc(160, 40, 5, 0, Math.PI*2); ctx.fill();
    }

    document.getElementById('btnHook').onclick = () => {
        if(hookState === "swing") hookState = "shoot";
    };

    window.surrenderMiner = function() {
        isGameOver = true;
        const btnH = document.getElementById('btnHook');
        const btnS = document.getElementById('btnSurrender');
        if(btnH) btnH.disabled = true;
        if(btnS) btnS.disabled = true;

        // Simpan Skor & Leaderboard
        if (typeof saveToSpreadsheet === "function") {
            saveToSpreadsheet('gold_miner', score);
        }
        if (typeof showLeaderboard === "function") {
            showLeaderboard('gold_miner');
        }
    };

    document.getElementById('btnSurrender').onclick = window.surrenderMiner;

    initLevel();
    update();
};