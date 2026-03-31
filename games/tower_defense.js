/**
 * Benteng TD - Tower Defense Simple
 * Cara Main: Klik/Tap pada musuh (bola kuning) sebelum mencapai benteng merah.
 */

window.startTowerDefenseGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi variabel game
    let enemies = [];
    let score = 0;
    let hp = 5;
    let gameActive = true;
    let spawnTimeout;

    // Tambahkan HTML UI dan Canvas
    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', sans-serif; max-width: 400px; margin: 0 auto; user-select: none;">
            <h2 style="color: #ef4444; margin-bottom: 10px;">🏹 Benteng Defense</h2>
            
            <canvas id="tdCanvas" width="400" height="400" 
                style="background:#1e293b; border-radius:15px; display:block; margin:auto; cursor:crosshair; max-width: 100%; height: auto; border: 4px solid #334155;">
            </canvas>

            <div style="background: #f8fafc; border-left: 5px solid #ef4444; padding: 12px; margin-top: 15px; text-align: left; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 5px 0; color: #1e293b;">📜 Aturan Permainan:</h4>
                <ul style="font-size: 0.85rem; color: #475569; padding-left: 20px; margin: 0; line-height: 1.4;">
                    <li><b>Misi:</b> Jangan biarkan musuh menyentuh garis <b>merah</b>.</li>
                    <li><b>Serang:</b> Klik atau Tap langsung pada bola kuning untuk menghancurkannya.</li>
                    <li><b>HP:</b> Kamu punya 5 nyawa. Jika habis, benteng runtuh!</li>
                </ul>
            </div>

            <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startTowerDefenseGame()" style="padding: 10px 20px; background:#ef4444; color:white; border:none; border-radius:25px; font-weight:bold; cursor:pointer;">
                    🔄 Ulang Game
                </button>
            </div>
        </div>
    `;

    const cvs = document.getElementById('tdCanvas');
    const ctx = cvs.getContext('2d');

    // Fungsi Spawn Musuh
    function spawnEnemy() {
        if(!gameActive) return;
        
        // Musuh muncul dari kiri (x: 0) dengan y acak
        enemies.push({ 
            x: 0, 
            y: Math.random() * (cvs.height - 60) + 30, 
            speed: Math.random() * 1.5 + 0.8 + (score * 0.05), // Kecepatan meningkat seiring skor
            radius: 12
        });

        // Waktu spawn semakin cepat seiring kenaikan skor
        let spawnRate = Math.max(500, 1500 - (score * 20));
        spawnTimeout = setTimeout(spawnEnemy, spawnRate);
    }

    // Input Click/Touch
    cvs.onclick = (e) => {
        if(!gameActive) return;

        const rect = cvs.getBoundingClientRect();
        // Kalkulasi skala jika layar HP mengecilkan canvas
        const scaleX = cvs.width / rect.width;
        const scaleY = cvs.height / rect.height;
        
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        let hit = false;
        enemies = enemies.filter(en => {
            const dist = Math.hypot(en.x - mouseX, en.y - mouseY);
            // Toleransi klik 25px agar lebih mudah di HP
            if(dist < 25) { 
                score++; 
                hit = true;
                return false; 
            }
            return true;
        });

        if(hit) updateStats();
    };

    function updateStats() {
        stats.innerText = `Skor: ${score} | HP: ${hp} | 🏹 Tower Defense`;
    }

    // Game Loop
    function loop() {
        if(!gameActive) {
            clearTimeout(spawnTimeout); // Bersihkan timeout saat game stop
            return;
        }

        ctx.clearRect(0, 0, cvs.width, cvs.height);
        
        // Gambar Area Benteng (Garis Merah)
        ctx.fillStyle = "rgba(239, 68, 68, 0.3)";
        ctx.fillRect(370, 0, 30, 400);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(395, 0, 5, 400);

        // Update & Gambar Musuh
        enemies.forEach((en, i) => {
            en.x += en.speed;

            // Glow Effect Musuh
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#facc15";
            ctx.fillStyle = "#facc15";
            ctx.beginPath(); 
            ctx.arc(en.x, en.y, en.radius, 0, Math.PI*2); 
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow

            // Cek jika musuh tembus benteng
            if(en.x > 375) {
                enemies.splice(i, 1);
                hp--; 
                updateStats();
                
                // Efek getar layar sederhana jika kena hit (opsional)
                cvs.style.transform = "translateX(5px)";
                setTimeout(() => cvs.style.transform = "translateX(0)", 50);

                if(hp <= 0) { 
                    gameActive = false; 
                    alert(`💥 Game Over! Benteng Hancur.\nSkor Akhir: ${score}`); 
                    goHome(); 
                }
            }
        });

        requestAnimationFrame(loop);
    }

    // Inisialisasi awal
    updateStats();
    spawnEnemy(); 
    loop();
};