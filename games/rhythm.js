window.startRhythmGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // UI dengan Tombol di bawah
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none; touch-action:none;">
            <canvas id="rhythmCanvas" width="300" height="400" style="background:#111; border:4px solid #333; border-radius:15px; display:block; margin:auto; max-width:90%;"></canvas>
            
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; max-width:300px; margin:20px auto; padding:0 10px;">
                <button id="btn-lane-0" style="padding:20px 0; background:#f87171; color:white; border:none; border-radius:12px; font-weight:bold; box-shadow: 0 4px #b91c1c; active:transform:translateY(2px);">A</button>
                <button id="btn-lane-1" style="padding:20px 0; background:#60a5fa; color:white; border:none; border-radius:12px; font-weight:bold; box-shadow: 0 4px #1d4ed8; active:transform:translateY(2px);">S</button>
                <button id="btn-lane-2" style="padding:20px 0; background:#4ade80; color:white; border:none; border-radius:12px; font-weight:bold; box-shadow: 0 4px #047857; active:transform:translateY(2px);">D</button>
                <button id="btn-lane-3" style="padding:20px 0; background:#fbbf24; color:white; border:none; border-radius:12px; font-weight:bold; box-shadow: 0 4px #b45309; active:transform:translateY(2px);">F</button>
            </div>
            <p style="color:#64748b; font-size:0.8rem;">Tekan tombol saat balok menyentuh garis!</p>
        </div>
    `;
    
    const cvs = document.getElementById('rhythmCanvas');
    const ctx = cvs.getContext('2d');
    const keys = ['A', 'S', 'D', 'F'];
    const colors = ["#f87171", "#60a5fa", "#4ade80", "#fbbf24"];
    let notes = [];
    let score = 0;
    let active = true;

    // Fungsi Input Utama
    const handleInput = (lane) => {
        let hit = false;
        notes = notes.filter(n => {
            // Cek jika note berada di area hit (330px - 390px)
            if(n.lane === lane && n.y > 320 && n.y < 390) {
                score += 10;
                hit = true;
                return false;
            }
            return true;
        });

        if(hit) {
            stats.innerText = `Skor: ${score} | 🎵 Rhythm Master`;
            // Efek visual tombol ditekan
            const btn = document.getElementById(`btn-lane-${lane}`);
            btn.style.filter = "brightness(1.5)";
            setTimeout(() => btn.style.filter = "brightness(1)", 100);
        }
    };

    // Event Listener Keyboard
    window.onkeydown = (e) => {
        let idx = keys.indexOf(e.key.toUpperCase());
        if(idx !== -1) handleInput(idx);
    };

    // Event Listener Tombol (Mouse & Touch)
    keys.forEach((_, i) => {
        const btn = document.getElementById(`btn-lane-${i}`);
        btn.onmousedown = btn.ontouchstart = (e) => {
            e.preventDefault();
            handleInput(i);
        };
    });

    function spawnNote() {
        if(!active) return;
        notes.push({ lane: Math.floor(Math.random() * 4), y: -30 });
        setTimeout(spawnNote, 700);
    }

    function loop() {
        if(!active) return;
        ctx.fillStyle = "#111"; ctx.fillRect(0, 0, 300, 400);
        
        // Garis Jalur
        ctx.strokeStyle = "#222";
        for(let i=1; i<4; i++) {
            ctx.beginPath(); ctx.moveTo(i*75, 0); ctx.lineTo(i*75, 400); ctx.stroke();
        }
        
        // Area Hit (Target)
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(0, 340, 300, 40);
        ctx.strokeStyle = "#444";
        ctx.strokeRect(0, 340, 300, 40);

        // Update & Gambar Notes
        notes.forEach((n, i) => {
            n.y += 4.5; // Kecepatan jatuh
            ctx.fillStyle = colors[n.lane];
            ctx.shadowBlur = 10;
            ctx.shadowColor = colors[n.lane];
            ctx.fillRect(n.lane * 75 + 10, n.y, 55, 20);
            ctx.shadowBlur = 0; // Reset shadow agar tidak berat

            // Jika note terlewat
            if(n.y > 400) {
                notes.splice(i, 1);
            }
        });

        requestAnimationFrame(loop);
    }

    spawnNote();
    loop();

    // Fungsi Cleanup saat pindah game
    window.stopRhythm = () => active = false;
};