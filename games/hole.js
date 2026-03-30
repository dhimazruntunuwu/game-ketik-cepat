window.startHoleGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    wrapper.innerHTML = `<canvas id="holeCanvas" width="350" height="350" style="background:#334155; border-radius:20px; display:block; margin:auto; touch-action:none; max-width:95%;"></canvas>`;
    
    const cvs = document.getElementById('holeCanvas');
    const ctx = cvs.getContext('2d');
    let hole = { x: 175, y: 175, r: 20 };
    let food = [];
    let score = 0;

    for(let i=0; i<15; i++) food.push({ x: Math.random()*300+25, y: Math.random()*300+25, s: 12 });

    const moveHole = (e) => {
        const rect = cvs.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        hole.x = (clientX - rect.left) * (cvs.width / rect.width);
        hole.y = (clientY - rect.top) * (cvs.height / rect.height);
    };

    cvs.onmousemove = moveHole;
    cvs.ontouchmove = (e) => { e.preventDefault(); moveHole(e); };

    function draw() {
        ctx.fillStyle = "#1e293b"; ctx.fillRect(0,0,350,350);
        ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI*2); ctx.fill();
        
        food.forEach((f, i) => {
            ctx.fillStyle = "#f43f5e"; ctx.fillRect(f.x, f.y, f.s, f.s);
            if(Math.hypot(f.x + f.s/2 - hole.x, f.y + f.s/2 - hole.y) < hole.r) {
                food.splice(i, 1); score++; hole.r += 1.2;
                food.push({ x: Math.random()*300+25, y: Math.random()*300+25, s: 12 });
                stats.innerText = `Skor: ${score} | 🕳️ Hole.io`;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
};