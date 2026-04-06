/**
 * Rhythm Master V2 - Dhimaz Game Hub
 * Optimized for Android (S22 Ultra / Xiaomi 12T)
 */

window.startRhythmGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // --- STATE UTAMA ---
    let score = 0;
    let level = 1;
    let misses = 0;
    const maxMisses = 5;
    let active = true;
    let isPaused = false;
    let notes = [];
    let noteSpeed = 4.0;
    let spawnInterval = 1000;
    let lastSpawn = 0;

    const colors = ["#f87171", "#60a5fa", "#4ade80", "#fbbf24"];
    const keys = ['A', 'S', 'D', 'F'];

    // --- AUDIO ENGINE (INSTRUMEN SYNTH) ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playSynth(freq, type = 'triangle', duration = 0.5) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    // --- UI RENDER ---
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none; touch-action:none; font-family:'Segoe UI', sans-serif; position:relative;">
            <div style="display:flex; justify-content:space-between; max-width:300px; margin:auto; padding:10px; font-weight:bold; color:#475569;">
                <span id="lvl-display" style="background:#6366f1; color:white; padding:2px 10px; border-radius:5px;">LVL ${level}</span>
                <span id="miss-display" style="color:#ef4444;">💔 ${maxMisses - misses}</span>
            </div>
            
            <div style="position:relative; width:300px; margin:auto;">
                <canvas id="rhythmCanvas" width="300" height="400" style="background:#0f172a; border:4px solid #334155; border-radius:15px; display:block; box-shadow: 0 10px 25px rgba(0,0,0,0.3);"></canvas>
                
                <div id="lvl-overlay" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#fbbf24; font-size:2.5rem; font-weight:900; display:none; text-shadow:0 0 15px rgba(0,0,0,0.8); pointer-events:none; z-index:10; white-space:nowrap; animation: pulse 0.5s infinite;">
                    LEVEL UP! 🚀
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; max-width:300px; margin:20px auto; padding:0 5px;">
                ${keys.map((k, i) => `
                    <button id="btn-lane-${i}" 
                        style="padding:25px 0; background:${colors[i]}; color:white; border:none; border-radius:15px; font-weight:bold; font-size:1.4rem; box-shadow: 0 6px rgba(0,0,0,0.4); active:transform:translateY(4px); transition: 0.1s;">
                        ${k}
                    </button>
                `).join('')}
            </div>

            <button onclick="surrenderRhythm()" style="margin-top:10px; background:transparent; color:#94a3b8; border:1px solid #cbd5e1; padding:5px 15px; border-radius:20px; cursor:pointer; font-size:0.8rem;">🏳️ Menyerah</button>
        </div>
        <style>
            @keyframes pulse { 0% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.1); } 100% { transform: translate(-50%, -50%) scale(1); } }
        </style>
    `;

    const cvs = document.getElementById('rhythmCanvas');
    const ctx = cvs.getContext('2d');
    const overlay = document.getElementById('lvl-overlay');

    // --- LOGIC LEVEL UP ---
    function triggerLevelUp() {
        if (level >= 20) return;
        isPaused = true;
        level++;
        notes = []; 
        overlay.style.display = 'block';
        
        // Suara Arpeggio Naik
        playSynth(440, 'sine', 0.8);
        setTimeout(() => playSynth(554.37, 'sine', 0.8), 150);
        setTimeout(() => playSynth(659.25, 'sine', 0.8), 300);

        setTimeout(() => {
            overlay.style.display = 'none';
            isPaused = false;
            noteSpeed += 0.7; // Tambah kecepatan
            spawnInterval = Math.max(250, spawnInterval - 120); // Tambah kerapatan
            document.getElementById('lvl-display').innerText = `LVL ${level}`;
        }, 1800); 
    }

    const handleInput = (lane) => {
        if(!active || isPaused) return;
        let hit = false;
        
        for(let i = 0; i < notes.length; i++) {
            const n = notes[i];
            // Hit area yang pas (320px - 390px)
            if(n.lane === lane && n.y > 310 && n.y < 395) {
                hit = true;
                notes.splice(i, 1);
                score += 100;
                playSynth(200 + (lane * 80), 'triangle', 0.4); 
                break;
            }
        }

        if(hit) {
            stats.innerText = `Skor: ${score}`;
            if(score > 0 && score % 1000 === 0) triggerLevelUp();
            
            const btn = document.getElementById(`btn-lane-${lane}`);
            btn.style.filter = "brightness(1.8)";
            btn.style.transform = "translateY(5px)";
            setTimeout(() => {
                btn.style.filter = "brightness(1)";
                btn.style.transform = "translateY(0)";
            }, 100);
        }
    };

    // --- INPUT BINDING ---
    window.onkeydown = (e) => {
        let idx = keys.indexOf(e.key.toUpperCase());
        if(idx !== -1) handleInput(idx);
    };

    keys.forEach((_, i) => {
        const btn = document.getElementById(`btn-lane-${i}`);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleInput(i);
        });
        btn.addEventListener('mousedown', () => handleInput(i));
    });

    // --- GAME LOOP ---
    function gameLoop(time) {
        if(!active) return;
        
        if(!isPaused) {
            ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, 300, 400);
            
            // Grid Lines
            ctx.strokeStyle = "#1e293b";
            ctx.lineWidth = 2;
            for(let i=1; i<4; i++) {
                ctx.beginPath(); ctx.moveTo(i*75, 0); ctx.lineTo(i*75, 400); ctx.stroke();
            }

            // Target Zone Visual
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(0, 340, 300, 45);
            ctx.strokeStyle = "#334155";
            ctx.strokeRect(0, 340, 300, 45);

            // Spawning
            if(time - lastSpawn > spawnInterval) {
                notes.push({ lane: Math.floor(Math.random() * 4), y: -30 });
                lastSpawn = time;
            }

            // Processing Notes
            for(let i = notes.length - 1; i >= 0; i--) {
                const n = notes[i];
                n.y += noteSpeed;

                ctx.fillStyle = colors[n.lane];
                ctx.shadowBlur = 15;
                ctx.shadowColor = colors[n.lane];
                ctx.fillRect(n.lane * 75 + 8, n.y, 59, 18);
                ctx.shadowBlur = 0;

                // Meleset / Miss
                if(n.y > 400) {
                    notes.splice(i, 1);
                    misses++;
                    playSynth(80, 'sawtooth', 0.3); // Suara gagal low-pitch
                    document.getElementById('miss-display').innerText = `💔 ${Math.max(0, maxMisses - misses)}`;
                    if(misses >= maxMisses) gameOver();
                }
            }
        }
        requestAnimationFrame(gameLoop);
    }

    window.surrenderRhythm = function() {
        if(confirm("Yakin mau menyerah? Skor kamu akan disimpan.")) gameOver();
    };

    function gameOver() {
        if(!active) return;
        active = false;
        alert(`GAME OVER!\nLevel: ${level}\nTotal Skor: ${score}`);
        
        // Simpan ke Leaderboard Dhimaz Hub
        if(window.saveToSpreadsheet) saveToSpreadsheet('rhythm_master', score);
        if(window.showLeaderboard) showLeaderboard('rhythm_master');
    }

    requestAnimationFrame(gameLoop);
};