// gravity_switcher.js

function startGravityGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');

    // 1. Setup UI & Canvas
    wrapper.innerHTML = `
        <div style="position: relative; text-align: center; width: 100%; max-width: 600px; margin: auto; font-family: sans-serif;">
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; background: #333; color: white; padding: 5px 15px; border-radius: 5px;">
                <span id="game-speed-display">Speed: 4.0</span>
                <span id="game-interval-display">Intensity: Normal</span>
            </div>
            <canvas id="gravityCanvas" width="600" height="300" style="background: #f0f0f0; display: block; border-radius: 8px; border: 2px solid #333; width: 100%; transition: background 0.2s;"></canvas>
            <button id="flipBtn" style="margin-top: 15px; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; background: #3498db; color: white; border: none; border-radius: 50px; cursor: pointer; touch-action: manipulation; transition: 0.1s;">
                FLIP GRAVITY (Space)
            </button>
            <p style="color: #666; font-size: 0.8rem; margin-top: 10px;">Hati-hati: Game semakin cepat setiap rintangan muncul!</p>
        </div>
    `;

    const canvas = document.getElementById('gravityCanvas');
    const ctx = canvas.getContext('2d');
    const flipBtn = document.getElementById('flipBtn');
    const stats = document.getElementById('game-stats');
    const speedDisp = document.getElementById('game-speed-display');
    const intervalDisp = document.getElementById('game-interval-display');

    // --- State Game ---
    let score = 0;
    let gameActive = true;
    let gameSpeed = 4;
    let spawnTimer = 0;
    let spawnInterval = 100; // Jeda antar rintangan (dalam frame)
    const minSpawnInterval = 45; // Batas tersulit agar tetap bisa dimainkan

    // --- Konfigurasi Karakter ---
    let player = {
        x: 80,
        y: 150,
        width: 30,
        height: 30,
        velocityY: 0
    };

    let gravity = 0.6;
    let isUpsideDown = false;
    let groundY = canvas.height - 30;
    let ceilingY = 30;
    let obstacles = [];

    // --- Kontrol ---
    const handleAction = (e) => {
        if (e.type === 'keydown' && e.code !== 'Space') return;
        if (!gameActive) return;

        isUpsideDown = !isUpsideDown;
        gravity = -gravity;

        // Feedback Visual Tombol
        flipBtn.style.background = isUpsideDown ? "#e74c3c" : "#3498db";
        flipBtn.style.transform = "scale(0.95)";
        setTimeout(() => flipBtn.style.transform = "scale(1)", 100);

        if (e && e.preventDefault) e.preventDefault();
    };

    window.addEventListener('keydown', handleAction);
    flipBtn.addEventListener('click', handleAction);

    function spawnObstacle() {
        const h = 40 + Math.random() * 70; // Tinggi bervariasi
        const onCeiling = Math.random() > 0.5; // Muncul di atas atau bawah

        obstacles.push({
            x: canvas.width,
            y: onCeiling ? ceilingY : groundY - h,
            w: 25,
            h: h,
            color: "#2c3e50"
        });
    }

    function update() {
        if (!gameActive) return;

        // Gerakan Player
        player.velocityY += gravity;
        player.y += player.velocityY;

        // Batas Atas & Bawah
        if (player.y + player.height > groundY) {
            player.y = groundY - player.height;
            player.velocityY = 0;
        } else if (player.y < ceilingY) {
            player.y = ceilingY;
            player.velocityY = 0;
        }

        // --- Logika Kesulitan Progresif ---
        spawnTimer++;
        if (spawnTimer > spawnInterval) {
            spawnObstacle();
            spawnTimer = 0;

            // Makin lama makin cepat
            gameSpeed += 0.06;

            // Makin lama rintangan makin rapat
            if (spawnInterval > minSpawnInterval) {
                spawnInterval -= 1;
            }

            // Update info debug di UI
            speedDisp.innerText = `Speed: ${gameSpeed.toFixed(1)}`;
            if (spawnInterval < 60) intervalDisp.innerText = "Intensity: HARD";
            else if (spawnInterval < 80) intervalDisp.innerText = "Intensity: Medium";
        }

        obstacles.forEach((obs, index) => {
            obs.x -= gameSpeed;

            // Collision Detection
            if (
                player.x < obs.x + obs.w &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.h &&
                player.y + player.height > obs.y
            ) {
                gameOver();
            }

            // Skor & Cleanup
            if (obs.x + obs.w < 0) {
                obstacles.splice(index, 1);
                score++;
                stats.innerText = `Skor: ${score} | 🌌 Mode Santai`;

                // Efek flash tipis setiap skor kelipatan 10
                if (score % 10 === 0) {
                    canvas.style.background = "#d5d5d5";
                    setTimeout(() => canvas.style.background = "#f0f0f0", 50);
                }
            }
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Jalur Atas & Bawah
        ctx.fillStyle = "#333";
        ctx.fillRect(0, groundY, canvas.width, 10);
        ctx.fillRect(0, ceilingY - 10, canvas.width, 10);

        // Rintangan
        obstacles.forEach(obs => {
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        });

        // Player (dengan rotasi)
        ctx.save();
        ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
        if (isUpsideDown) ctx.rotate(Math.PI);

        // Glow effect untuk player
        ctx.shadowBlur = 10;
        ctx.shadowColor = isUpsideDown ? "#e74c3c" : "#3498db";
        ctx.fillStyle = isUpsideDown ? "#e74c3c" : "#3498db";

        ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
        ctx.restore();
    }

    function gameOver() {
        gameActive = false;

        // --- TAMBAHKAN BARIS INI ---
        saveToSpreadsheet('gravity_flip', score);

        alert(`GAME OVER!\nSkor Akhir: ${score}\nKecepatan Terakhir: ${gameSpeed.toFixed(1)}`);

        // Munculkan papan peringkat
        showLeaderboard('gravity_flip');
        //window.removeEventListener('keydown', handleAction);
        //goHome(); // Kembali ke menu utama (fungsi di main.js)
    }

    function loop() {
        if (!document.getElementById('gravityCanvas')) {
            window.removeEventListener('keydown', handleAction);
            gameActive = false;
            return;
        }
        update();
        draw();
        if (gameActive) requestAnimationFrame(loop);
    }

    loop();
}