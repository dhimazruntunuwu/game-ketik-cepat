/**
 * Knife Hit - Professional Version
 * Fitur: Animasi Lempar, Panel Aturan, Auto-Save & Leaderboard
 */

window.startKnifeGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // State Game
    let score = 0;
    let angle = 0;
    let knives = []; 
    let isGameOver = false;
    let rotationSpeed = 0.03;
    let activeKnifeY = null; // Posisi Y pisau yang sedang meluncur

    // Render UI Lengkap dengan Panel Aturan
    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; user-select: none; color: #f8fafc; padding: 15px; background: #0f172a; border-radius: 20px;">
            
            <div style="background: #1e293b; padding: 10px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #334155; text-align: left; font-size: 0.85rem;">
                <strong style="color: #38bdf8; display: block; margin-bottom: 5px;">📜 ATURAN MAIN:</strong>
                <ul style="margin: 0; padding-left: 20px; color: #cbd5e1;">
                    <li>Klik/Tap Canvas untuk <b>melempar pisau</b>.</li>
                    <li>Dapatkan <b>+1 Poin</b> setiap pisau menancap di kayu.</li>
                    <li><b>GAME OVER</b> jika pisau mengenai pisau lain!</li>
                    <li>Kecepatan putaran akan meningkat seiring skor.</li>
                </ul>
            </div>

            <div id="knife-score" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: #38bdf8;">
                SCORE: 0
            </div>
            
            <div style="position: relative; display: inline-block;">
                <canvas id="knifeCanvas" width="300" height="400" 
                    style="background: radial-gradient(circle, #1e293b, #0f172a); border-radius:15px; display:block; cursor:pointer; touch-action: none; box-shadow: 0 0 20px rgba(0,0,0,0.5); border: 2px solid #334155;"></canvas>
            </div>

            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startKnifeGame()" style="padding:12px 25px; background:#3498db; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; transition: 0.2s;">🔄 Restart</button>
                <button id="btn-surrender-knife" onclick="surrenderKnife()" style="padding:12px 25px; background:#e74c3c; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer; transition: 0.2s;">🏳️ Menyerah</button>
            </div>
            
            <div id="knife-leaderboard-area" style="margin-top:20px;"></div>
        </div>
    `;

    const cvs = document.getElementById('knifeCanvas');
    const ctx = cvs.getContext('2d');

    function draw() {
        if (isGameOver) return;

        ctx.clearRect(0, 0, cvs.width, cvs.height);
        
        // 1. Gambar Batang Kayu Berputar
        ctx.save();
        ctx.translate(150, 120); 
        ctx.rotate(angle);
        
        // Visual Kayu
        ctx.fillStyle = "#78350f";
        ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#451a03"; ctx.lineWidth = 5; ctx.stroke();
        // Lingkaran serat kayu
        ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, 35, 0, Math.PI*2); ctx.stroke();

        // Pisau-pisau yang sudah menancap (Ikut berputar)
        knives.forEach(kAngle => {
            ctx.save();
            ctx.rotate(kAngle);
            // Bilah Pisau
            ctx.fillStyle = "#e2e8f0";
            ctx.fillRect(-2, 55, 4, 40); 
            // Gagang
            ctx.fillStyle = "#475569";
            ctx.fillRect(-4, 95, 8, 12); 
            ctx.restore();
        });
        ctx.restore();

        // 2. Logika & Gambar Animasi Pisau Meluncur
        if (activeKnifeY !== null) {
            // Gambar Pisau yang sedang terbang
            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(148, activeKnifeY, 4, 45); // Bilah
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(146, activeKnifeY + 45, 8, 10); // Gagang
            
            activeKnifeY -= 25; // Kecepatan gerak ke atas

            // Deteksi benturan dengan kayu (Radius 55 + sedikit offset)
            if (activeKnifeY <= 175) {
                checkHit();
                activeKnifeY = null;
            }
        } else {
            // Pisau "Ready" di posisi bawah
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = "#94a3b8";
            ctx.fillRect(148, 330, 4, 45);
            ctx.globalAlpha = 1.0;
        }

        // Update rotasi kayu
        angle += rotationSpeed; 
        requestAnimationFrame(draw);
    }

    function checkHit() {
        // Hitung sudut benturan relatif terhadap kayu
        // Sisi bawah kayu berada di Math.PI / 2
        let hitAngle = (Math.PI / 2 - angle) % (Math.PI * 2);
        if (hitAngle < 0) hitAngle += Math.PI * 2;

        // Cek tabrakan dengan pisau lain (Toleransi sudut 0.28 radian)
        const hitMargin = 0.28;
        let isCrash = knives.some(k => {
            let diff = Math.abs(k - hitAngle);
            return diff < hitMargin || diff > (Math.PI * 2 - hitMargin);
        });

        if (isCrash) {
            isGameOver = true;
            // Animasi terpental (Opsional, di sini kita langsung panggil menyerah/kalah)
            setTimeout(() => {
                alert("KLANG! Pisau bertabrakan! 💥");
                surrenderKnife();
            }, 50);
        } else {
            // Menancap Berhasil
            knives.push(hitAngle);
            score++;
            document.getElementById('knife-score').innerText = `SCORE: ${score}`;
            
            // Tambah kecepatan setiap 3 poin
            if (score % 3 === 0) rotationSpeed += 0.005;
        }
    }

    // Input Handler
    cvs.addEventListener('mousedown', (e) => {
        if (activeKnifeY === null && !isGameOver) {
            activeKnifeY = 330; // Mulai lemparan
        }
    });

    // Fungsi Menyerah & Berhenti
    window.surrenderKnife = function() {
        isGameOver = true;
        
        const btn = document.getElementById('btn-surrender-knife');
        if(btn) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
        }

        // Simpan skor otomatis
        if (typeof saveToSpreadsheet === "function") {
            saveToSpreadsheet('knife_hit', score);
        }

        // Langsung tampilkan peringkat
        if (typeof showLeaderboard === "function") {
            showLeaderboard('knife_hit');
        }
    };

    draw();
};