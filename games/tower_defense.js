window.startTowerDefenseGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `<canvas id="tdCanvas" width="400" height="400" style="background:#1e293b; border-radius:15px; display:block; margin:auto; cursor:crosshair;"></canvas>`;
    
    const cvs = document.getElementById('tdCanvas');
    const ctx = cvs.getContext('2d');
    let enemies = [];
    let score = 0;
    let hp = 5;
    let gameActive = true;

    function spawnEnemy() {
        if(!gameActive) return;
        enemies.push({ x: 0, y: Math.random() * (cvs.height - 40) + 20, speed: Math.random() * 1.5 + 0.5 });
        setTimeout(spawnEnemy, 1500);
    }

    cvs.onclick = (e) => {
        const rect = cvs.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        enemies = enemies.filter(en => {
            const dist = Math.hypot(en.x + 10 - mouseX, en.y + 10 - mouseY);
            if(dist < 25) { score++; return false; }
            return true;
        });
        updateStats();
    };

    function updateStats() {
        stats.innerText = `Skor: ${score} | HP: ${hp} | 🏹 Tower Defense`;
    }

    function loop() {
        if(!gameActive) return;
        ctx.clearRect(0,0,400,400);
        
        // Garis Benteng
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(380, 0, 20, 400);

        enemies.forEach((en, i) => {
            en.x += en.speed;
            ctx.fillStyle = "#facc15";
            ctx.beginPath(); ctx.arc(en.x, en.y, 10, 0, Math.PI*2); ctx.fill();
            
            if(en.x > 380) {
                enemies.splice(i, 1);
                hp--; updateStats();
                if(hp <= 0) { gameActive = false; alert("Benteng Hancur!"); goHome(); }
            }
        });
        requestAnimationFrame(loop);
    }

    spawnEnemy(); loop();
};