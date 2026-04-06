/**
 * Rhythm Master - Dhimaz Game Hub
 * Features: 20 Levels, Sound Effects, Life System, Leaderboard
 */

window.startRhythmGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // State Game
    let score = 0;
    let level = 1;
    let misses = 0;
    const maxMisses = 5;
    let active = true;
    let notes = [];
    let noteSpeed = 4.5;
    let spawnInterval = 800;
    const colors = ["#f87171", "#60a5fa", "#4ade80", "#fbbf24"];
    const keys = ['A', 'S', 'D', 'F'];

    // --- AUDIO SYSTEM ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playNoteSound(freq) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playFailSound() {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }

    // --- UI RENDER ---
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none; touch-action:none; font-family:sans-serif;">
            <div style="display:flex; justify-content:space-between; max-width:300px; margin:auto; color:#475569; font-weight:bold; margin-bottom:10px;">
                <span>LVL: ${level}/20</span>
                <span id="miss-display" style="color:#ef4444;">💔 ${maxMisses - misses}</span>
            </div>
            <canvas id="rhythmCanvas" width="300" height="400" style="background:#0f172a; border:4px solid #334155; border-radius:15px; display:block; margin:auto; box-shadow:0 0 20px rgba(0,0,0,0.5);"></canvas>
            
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; max-width:300px; margin:20px auto;">
                ${keys.map((k, i) => `
                    <button id="btn-lane-${i}" style="padding:25px 0; background:${colors[i]}; color:white; border:none; border-radius:12px; font-weight:bold; font-size:1.2rem; box-shadow: 0 6px rgba(0,0,0,0.3); cursor:pointer;">${k}</button>
                `).join('')}
            </div>
            <button onclick="surrenderRhythm()" style="background:#ef4444; color:white; border:none; padding:8px 15px; border-radius:8px; cursor:pointer; font-size:0.8rem;">🏳️ Menyerah</button>
        </div>
    `;

    const cvs = document.getElementById('rhythmCanvas');
    const ctx = cvs.getContext('2d');

    // --- LOGIC GAME ---
    const updateDifficulty = () => {
        // Setiap naik level, kecepatan naik dan interval spawn turun
        level = Math.floor(score / 500) + 1;
        if (level > 20) level = 20;
        
        noteSpeed = 4.5 + (level * 0.4); 
        spawnInterval = Math.max(300, 800 - (level * 25));
    };

    const handleInput = (lane) => {
        if(!active) return;
        let hit = false;
        
        for(let i = 0; i < notes.length; i++) {
            const n = notes[i];
            // Hit area 330 - 390
            if(n.lane === lane && n.y > 320 && n.y < 390) {
                hit = true;
                notes.splice(i, 1);
                score += 50;
                playNoteSound(261.63 + (lane * 50)); // Suara harmonis
                break;
            }
        }

        if(hit) {
            updateDifficulty();
            stats.innerText = `Skor: ${score} | Lvl: ${level}`;
            const btn = document.getElementById(`btn-lane-${lane}`);
            btn.style.transform = "translateY(4px)";
            btn.style.filter = "brightness(1.5)";
            setTimeout(() => {
                btn.style.transform = "translateY(0)";
                btn.style.filter = "brightness(1)";
            }, 100);
        }
    };

    // Input Handlers
    window.onkeydown = (e) => {
        let idx = keys.indexOf(e.key.toUpperCase());
        if(idx !== -1) handleInput(idx);
    };

    keys.forEach((_, i) => {
        const btn = document.getElementById(`btn-lane-${i}`);
        btn.onmousedown = btn.ontouchstart = (e) => {
            e.preventDefault();
            handleInput(i);
        };
    });

    let lastSpawn = 0;
    function spawn(time) {
        if(!active) return;
        if(time - lastSpawn > spawnInterval) {
            notes.push({ lane: Math.floor(Math.random() * 4), y: -30 });
            lastSpawn = time;
        }
        requestAnimationFrame(spawn);
    }

    function loop() {
        if(!active) return;
        
        // Background & Grid
        ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, 300, 400);
        ctx.strokeStyle = "#1e293b";
        for(let i=1; i<4; i++) {
            ctx.beginPath(); ctx.moveTo(i*75, 0); ctx.lineTo(i*75, 400); ctx.stroke();
        }

        // Target Line
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0, 345, 300, 30);
        ctx.strokeStyle = "#475569";
        ctx.strokeRect(0, 345, 300, 30);

        // Notes Update
        for(let i = notes.length - 1; i >= 0; i--) {
            const n = notes[i];
            n.y += noteSpeed;

            ctx.fillStyle = colors[n.lane];
            ctx.shadowBlur = 15;
            ctx.shadowColor = colors[n.lane];
            ctx.fillRect(n.lane * 75 + 10, n.y, 55, 15);
            ctx.shadowBlur = 0;

            if(n.y > 400) {
                notes.splice(i, 1);
                misses++;
                playFailSound();
                document.getElementById('miss-display').innerText = `💔 ${Math.max(0, maxMisses - misses)}`;
                
                if(misses >= maxMisses) {
                    gameOver();
                }
            }
        }
        requestAnimationFrame(loop);
    }

    window.surrenderRhythm = function() {
        gameOver();
    };

    function gameOver() {
        if(!active) return;
        active = false;
        alert(`GAME OVER!\nLevel Terakhir: ${level}\nTotal Skor: ${score}`);
        
        // Integrasi Leaderboard (Sesuai sistem Dhimaz Hub)
        if(window.saveToSpreadsheet) saveToSpreadsheet('rhythm_master', score);
        if(window.showLeaderboard) showLeaderboard('rhythm_master');
    }

    requestAnimationFrame(spawn);
    requestAnimationFrame(loop);
};