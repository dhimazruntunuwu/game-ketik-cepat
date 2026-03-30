window.startLunarLanderGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    wrapper.innerHTML = `<canvas id="lunarCanvas" width="350" height="400" style="background:#020617; display:block; margin:auto; border-radius:15px; touch-action:none; max-width:95%;"></canvas>`;
    
    const cvs = document.getElementById('lunarCanvas');
    const ctx = cvs.getContext('2d');
    let ship = { x: 175, y: 50, vy: 0, fuel: 100 };
    let isThrusting = false;
    let active = true;

    const startThrust = (e) => { e.preventDefault(); isThrusting = true; };
    const stopThrust = () => isThrusting = false;

    cvs.onmousedown = startThrust; cvs.onmouseup = stopThrust;
    cvs.ontouchstart = startThrust; cvs.ontouchend = stopThrust;
    window.onkeydown = (e) => { if(e.key === " ") isThrusting = true; };
    window.onkeyup = (e) => { if(e.key === " ") isThrusting = false; };

    function loop() {
        if(!active) return;
        ctx.clearRect(0,0,350,400);
        
        if(isThrusting && ship.fuel > 0) { ship.vy -= 0.15; ship.fuel -= 0.4; }
        ship.vy += 0.05; ship.y += ship.vy;

        // Api Jet
        if(isThrusting && ship.fuel > 0) {
            ctx.fillStyle = "#f59e0b"; ctx.beginPath();
            ctx.moveTo(ship.x-5, ship.y+10); ctx.lineTo(ship.x+5, ship.y+10); ctx.lineTo(ship.x, ship.y+25); ctx.fill();
        }

        // Kapal & Landasan
        ctx.fillStyle = "#f8fafc"; ctx.fillRect(ship.x-10, ship.y-10, 20, 20);
        ctx.fillStyle = "#22c55e"; ctx.fillRect(125, 380, 100, 10);

        stats.innerText = `Bahan Bakar: ${Math.floor(ship.fuel)}% | Kecepatan: ${ship.vy.toFixed(1)}`;

        if(ship.y > 370) {
            active = false;
            if(ship.x > 125 && ship.x < 225 && ship.vy < 1.2) alert("🚀 Pendaratan Berhasil!");
            else alert("💥 Meledak! Terlalu cepat.");
            goHome();
        } else { requestAnimationFrame(loop); }
    }
    loop();
};