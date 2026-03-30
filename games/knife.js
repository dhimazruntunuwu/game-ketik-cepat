window.startKnifeGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `
        <canvas id="knifeCanvas" width="300" height="400" style="background:#1e293b; border-radius:12px; display:block; margin:auto;"></canvas>
    `;

    const cvs = document.getElementById('knifeCanvas'), ctx = cvs.getContext('2d');
    let score = 0, angle = 0, knives = [], canThrow = true;

    function draw() {
        ctx.clearRect(0, 0, 300, 400);
        
        // 1. Gambar Kayu Berputar
        ctx.save();
        ctx.translate(150, 120);
        ctx.rotate(angle);
        ctx.fillStyle = "#78350f";
        ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI*2); ctx.fill();
        
        // Gambar Pisau yang sudah tertancap
        knives.forEach(k => {
            ctx.save();
            ctx.rotate(k);
            ctx.fillStyle = "#cbd5e1";
            ctx.fillRect(-2, 50, 4, 40);
            ctx.restore();
        });
        ctx.restore();

        // 2. Gambar Pisau Siap Lempar
        if(canThrow) {
            ctx.fillStyle = "#f8fafc";
            ctx.fillRect(148, 320, 4, 40);
        }

        angle += 0.03; // Kecepatan putar
        requestAnimationFrame(draw);
    }

    cvs.onclick = () => {
        if(!canThrow) return;
        
        // Cek apakah mengenai pisau lain (logika sederhana berdasarkan sudut)
        let hitAngle = (Math.PI/2 - angle) % (Math.PI*2);
        if(hitAngle < 0) hitAngle += Math.PI*2;

        let isCollision = knives.some(k => Math.abs(k - hitAngle) < 0.2);
        
        if(isCollision) {
            alert("Game Over! Kena pisau lain.");
            updateHighScore('knife', score);
            goHome();
        } else {
            knives.push(hitAngle);
            score++;
            stats.innerText = `Skor: ${score} | 🔪 Knife Hit`;
        }
    };

    draw();
};