window.startFlappyGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // 1. Setup UI (Struktur Stabil agar tidak goyang)
    wrapper.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; user-select: none; width: 320px; margin: auto; padding: 10px; font-family: sans-serif;">
            
            <div id="flappy-score-display" style="margin-bottom: 10px; font-weight: bold; font-size: 1.1rem; color: #334155;">
                Skor: 0 | 🐦 Flappy Hub
            </div>
            
            <canvas id="flappyCanvas" width="320" height="480" 
                style="background:#70c5ce; border:4px solid #334155; border-radius:12px; display:block; touch-action:none; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            </canvas>
            
            <div style="margin-top: 20px; width: 100%; height: 80px; display: flex; justify-content: center;">
                <button id="flap-btn" style="
                    width: 100%; 
                    height: 65px; 
                    font-size: 1.2rem; 
                    font-weight: bold; 
                    background: #3498db; 
                    color: white; 
                    border: none; 
                    border-radius: 15px;
                    cursor: pointer;
                    position: relative; /* Penting untuk animasi top */
                    top: 0;
                    box-shadow: 0 6px 0 #2980b9; /* Efek 3D menggunakan shadow */
                    transition: none; 
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                ">TAP UNTUK TERBANG</button>
            </div>

            <p style="margin-top: 5px; color: #94a3b8; font-size: 0.8rem;">Spasi juga bisa!</p>
        </div>
    `;

    const cvs = document.getElementById('flappyCanvas');
    const ctx = cvs.getContext('2d');
    const flapBtn = document.getElementById('flap-btn');
    const scoreText = document.getElementById('flappy-score-display');

    // 2. Variabel Game
    let birdX = 50;
    let birdY = 200;
    let birdSize = 24;
    let birdV = 0;
    let gravity = 0.25;
    let jump = -5.0;
    
    let pipes = [];
    let frame = 0;
    let score = 0;
    let isGameOver = false;
    let animationId;

    // 3. Kontrol Input (Animasi Tanpa Goyang)
    const flap = (e) => {
        if (e) e.preventDefault();
        if (!isGameOver) {
            birdV = jump;
            
            // Animasi Tombol: Hanya geser posisi visual, bukan ukuran fisik
            flapBtn.style.top = "4px";
            flapBtn.style.boxShadow = "0 2px 0 #2980b9";
            
            setTimeout(() => {
                if(!isGameOver) {
                    flapBtn.style.top = "0px";
                    flapBtn.style.boxShadow = "0 6px 0 #2980b9";
                }
            }, 100);
        }
    };

    flapBtn.addEventListener('mousedown', flap);
    flapBtn.addEventListener('touchstart', flap, { passive: false });
    
    const handleKeyDown = (e) => { 
        if(e.code === 'Space') {
            e.preventDefault();
            flap(); 
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 4. Game Loop
    function loop() {
        if (isGameOver) return;

        ctx.clearRect(0, 0, cvs.width, cvs.height);

        // Fisika Burung
        birdV += gravity;
        birdY += birdV;

        // Background
        ctx.fillStyle = "#70c5ce";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // Pipa
        if (frame % 90 === 0) {
            let gap = 145;
            let pipeY = Math.floor(Math.random() * (cvs.height - gap - 120)) + 60;
            pipes.push({ x: cvs.width, y: pipeY, gap: gap, width: 55, passed: false });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= 2.5;

            ctx.fillStyle = "#22c55e";
            ctx.strokeStyle = "#14532d";
            ctx.lineWidth = 3;
            
            ctx.fillRect(p.x, 0, p.width, p.y);
            ctx.strokeRect(p.x, 0, p.width, p.y);
            ctx.fillRect(p.x, p.y + p.gap, p.width, cvs.height);
            ctx.strokeRect(p.x, p.y + p.gap, p.width, cvs.height);

            // Tabrakan
            if (birdX + birdSize - 4 > p.x && birdX + 4 < p.x + p.width && (birdY + 4 < p.y || birdY + birdSize - 4 > p.y + p.gap)) {
                endGame();
            }

            // Skor
            if (!p.passed && birdX > p.x + p.width) {
                p.passed = true;
                score++;
                scoreText.innerText = `Skor: ${score} | 🐦 Flappy Hub`;
            }
            if (p.x + p.width < 0) pipes.splice(i, 1);
        }

        // Gambar Burung
        ctx.fillStyle = "#facc15";
        ctx.fillRect(birdX, birdY, birdSize, birdSize);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(birdX, birdY, birdSize, birdSize);
        // Mata
        ctx.fillStyle = "white";
        ctx.fillRect(birdX + 14, birdY + 4, 7, 7);
        ctx.fillStyle = "black";
        ctx.fillRect(birdX + 18, birdY + 7, 3, 3);

        if (birdY + birdSize > cvs.height || birdY < -20) endGame();

        frame++;
        animationId = requestAnimationFrame(loop);
    }

    function endGame() {
        if (isGameOver) return; 
        isGameOver = true;
        cancelAnimationFrame(animationId);

        flapBtn.innerText = "GAME OVER";
        flapBtn.style.background = "#94a3b8";
        flapBtn.style.boxShadow = "0 4px 0 #64748b";
        flapBtn.style.top = "2px";

        window.removeEventListener('keydown', handleKeyDown);

        if (typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet('flappy', score);
        }

        setTimeout(() => {
            alert(`Game Over! Skor Anda: ${score}`);
            if (typeof showLeaderboard === 'function') {
                showLeaderboard('flappy');
            }
        }, 100);
    }

    loop();
};