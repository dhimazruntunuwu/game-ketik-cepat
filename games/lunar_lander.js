/**
 * Lunar Lander V2 - Dhimaz Game Hub
 * Features: Rules UI, Speed-based Scoring, Precision Landing
 */

window.startLunarLanderGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Variabel Awal
    let startTime = Date.now();
    let ship = { x: 175, y: 50, vy: 0, fuel: 100, gravity: 0.05, thrust: 0.18 };
    let isThrusting = false;
    let active = true;

    // --- UI RENDER DENGAN ATURAN MAIN ---
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none; touch-action:none; font-family:'Segoe UI', sans-serif;">
            
            <div style="background:#1e293b; color:#f1f5f9; padding:10px; border-radius:12px; margin-bottom:15px; font-size:0.85rem; display:inline-block; text-align:left; border:1px solid #334155; max-width:350px;">
                <b style="color:#fbbf24;">📋 ATURAN MAIN:</b>
                <ul style="margin:5px 0; padding-left:20px;">
                    <li>Mendarat di <span style="color:#22c55e; font-weight:bold;">Area Hijau</span>.</li>
                    <li>Kecepatan (V-Speed) harus <span style="color:#22c55e;">di bawah 1.2</span>.</li>
                    <li>Skor = <span style="color:#3498db;">(Sisa Fuel × 10) - (Detik × 5)</span>.</li>
                    <li>Meleset atau Terlalu Cepat = <span style="color:#ef4444;">MELEDAK (Skor 0)</span>.</li>
                </ul>
            </div>

            <div style="position:relative; width:350px; margin:auto;">
                <canvas id="lunarCanvas" width="350" height="400" style="background:#020617; display:block; margin:auto; border-radius:15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"></canvas>
                
                <div style="position:absolute; top:15px; left:15px; text-align:left; color:#f8fafc; font-family:monospace; pointer-events:none; background:rgba(0,0,0,0.4); padding:5px; border-radius:5px;">
                    <div>FUEL : <span id="fuel-val">100</span>%</div>
                    <div>SPEED: <span id="speed-val">0.00</span></div>
                </div>
            </div>

            <div style="margin-top:20px;">
                <button id="btn-thrust" 
                    style="width:90px; height:90px; background:#f59e0b; color:white; border:none; border-radius:50%; font-weight:bold; font-size:1.2rem; box-shadow: 0 8px #b45309; cursor:pointer; -webkit-tap-highlight-color: transparent;">
                    GAS!
                </button>
            </div>
        </div>
    `;

    const cvs = document.getElementById('lunarCanvas');
    const ctx = cvs.getContext('2d');
    const fuelDisp = document.getElementById('fuel-val');
    const speedDisp = document.getElementById('speed-val');
    const btnThrust = document.getElementById('btn-thrust');

    // --- INPUT CONTROLLER ---
    const startThrust = (e) => { if(e) e.preventDefault(); isThrusting = true; btnThrust.style.transform = "translateY(4px)"; btnThrust.style.boxShadow = "0 4px #b45309"; };
    const stopThrust = () => { isThrusting = false; btnThrust.style.transform = "translateY(0)"; btnThrust.style.boxShadow = "0 8px #b45309"; };

    btnThrust.onmousedown = btnThrust.ontouchstart = startThrust;
    btnThrust.onmouseup = btnThrust.ontouchend = stopThrust;
    window.onkeydown = (e) => { if(e.key === " ") startThrust(); };
    window.onkeyup = (e) => { if(e.key === " ") stopThrust(); };

    function loop() {
        if(!active) return;
        
        ctx.clearRect(0,0,350,400);

        // Bintang (Static Background)
        ctx.fillStyle = "white";
        for(let i=0; i<15; i++) ctx.fillRect((i*77)%350, (i*150)%400, 1, 1);

        // Update Fisika
        if(isThrusting && ship.fuel > 0) { 
            ship.vy -= ship.thrust; 
            ship.fuel -= 0.4; 
            
            // Efek Api
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.moveTo(ship.x - 6, ship.y + 10);
            ctx.lineTo(ship.x + 6, ship.y + 10);
            ctx.lineTo(ship.x, ship.y + 25 + Math.random()*15);
            ctx.fill();
        }

        ship.vy += ship.gravity;
        ship.y += ship.vy;

        // Gambar Kapal
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(ship.x - 10, ship.y - 10, 20, 15); // Body
        ctx.fillStyle = "#94a3b8";
        ctx.fillRect(ship.x - 12, ship.y + 5, 24, 3); // Kaki

        // Gambar Landasan
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(125, 385, 100, 10);

        // Telemetri Update
        fuelDisp.innerText = Math.max(0, Math.floor(ship.fuel));
        speedDisp.innerText = ship.vy.toFixed(2);
        speedDisp.style.color = (ship.vy < 1.2) ? "#22c55e" : "#f87171";

        // Cek Landing
        if(ship.y > 375) {
            active = false;
            let duration = (Date.now() - startTime) / 1000;
            let finalScore = 0;

            const safePlace = (ship.x > 125 && ship.x < 225);
            const safeSpeed = (ship.vy < 1.2);

            if(safePlace && safeSpeed) {
                // RUMUS: Sisa Fuel dikurangi Penalti Waktu
                finalScore = Math.floor((ship.fuel * 10) - (duration * 5));
                if(finalScore < 100) finalScore = 100; // Minimal skor jika berhasil
                
                alert(`🚀 LANDING SUCCESS!\n\nWaktu: ${duration.toFixed(1)}s\nSisa Fuel: ${Math.floor(ship.fuel)}%\nTotal Skor: ${finalScore}`);
            } else {
                let reason = !safePlace ? "Meleset dari landasan!" : "Terlalu kencang (V-Speed > 1.2)!";
                alert(`💥 KABOOM!\n\n${reason}\nSkor: 0`);
                finalScore = 0;
            }

            // Simpan dan tampilkan leaderboard
            if(window.saveToSpreadsheet) saveToSpreadsheet('lunar_lander', finalScore);
            if(window.showLeaderboard) showLeaderboard('lunar_lander');
            
        } else {
            requestAnimationFrame(loop);
        }
    }

    loop();
};