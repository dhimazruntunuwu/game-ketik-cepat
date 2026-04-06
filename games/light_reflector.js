// light_reflector.js
let currentLevel = 1;
let reflectorActive = true;
let animationId;

function startLightReflector() {
    reflectorActive = true;
    const wrapper = document.getElementById('game-canvas-wrapper');
    wrapper.innerHTML = `
        <div style="text-align: center; max-width: 600px; margin: auto; font-family: sans-serif; background: #111; padding: 15px; border-radius: 15px; border: 2px solid #333;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #fff; background: #222; padding: 10px 20px; border-radius: 10px;">
                <span id="level-display" style="font-weight: bold; color: #00d2ff; font-size: 1.2rem;">LEVEL: ${currentLevel}</span>
                <span id="score-display" style="color: #2ecc71;">Score: ${(currentLevel - 1) * 200}</span>
            </div>

            <div style="position: relative;">
                <canvas id="laserCanvas" width="500" height="400" style="background: #050505; border: 3px solid #444; border-radius: 8px; cursor: crosshair; width: 100%; touch-action: none;"></canvas>
            </div>

            <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button onclick="surrenderReflector()" style="padding: 12px; background: #e74c3c; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">🏳️ Menyerah</button>
                <button onclick="resetReflectorLevel()" style="padding: 12px; background: #f39c12; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">🔄 Reset Level</button>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #1a1a1a; color: #888; border-radius: 8px; font-size: 0.8rem; text-align: left; border-left: 4px solid #00d2ff;">
                <b>CARA MAIN:</b> Pantulkan laser merah ke kotak hijau. <br>
                🚫 <b>Blok Abu-abu:</b> Menghalangi laser. <br>
                🌀 <b>Portal Ungu:</b> Teleportasi laser (Level 5+).
            </div>
        </div>
    `;

    const canvas = document.getElementById('laserCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 50;
    const cols = canvas.width / gridSize;
    const rows = canvas.height / gridSize;

    let mirrors = []; 
    let obstacles = [];
    let portals = []; // Rintangan Advance
    let target = { x: 0, y: 0 };
    let laserSource = { x: 0, y: 0, dir: 'RIGHT' };
    let gameWin = false;

    function setupLevel(lvl) {
        gameWin = false;
        mirrors = [];
        obstacles = [];
        portals = [];
        
        // Source & Target Setup
        laserSource = { x: 0, y: Math.floor(Math.random() * (rows - 2)) + 1, dir: 'RIGHT' };
        target = { x: cols - 1, y: Math.floor(Math.random() * (rows - 2)) + 1 };

        // Obstacles (Makin tinggi level makin padat)
        const obsCount = Math.min(lvl + 2, 15); 
        for (let i = 0; i < obsCount; i++) {
            let ox = Math.floor(Math.random() * (cols - 4)) + 2;
            let oy = Math.floor(Math.random() * rows);
            if (!(ox === target.x && oy === target.y)) obstacles.push({ x: ox, y: oy });
        }

        // Portals (Muncul mulai level 5)
        if (lvl >= 5) {
            portals.push({ 
                in: { x: 2, y: 1 }, 
                out: { x: cols - 3, y: rows - 2 } 
            });
        }

        document.getElementById('level-display').innerText = `LEVEL: ${lvl}`;
        document.getElementById('score-display').innerText = `Score: ${(lvl - 1) * 200}`;
    }

    setupLevel(currentLevel);

    canvas.onclick = (e) => {
        if (gameWin || !reflectorActive) return;
        const rect = canvas.getBoundingClientRect();
        const gridX = Math.floor((e.clientX - rect.left) / (rect.width / cols));
        const gridY = Math.floor((e.clientY - rect.top) / (rect.height / rows));

        // Validasi Klik
        if ((gridX === laserSource.x && gridY === laserSource.y) || 
            (gridX === target.x && gridY === target.y) ||
            obstacles.some(o => o.x === gridX && o.y === gridY)) return;

        const idx = mirrors.findIndex(m => m.x === gridX && m.y === gridY);
        if (idx > -1) {
            if (mirrors[idx].type === 0) mirrors[idx].type = 1;
            else mirrors.splice(idx, 1);
        } else {
            mirrors.push({ x: gridX, y: gridY, type: 0 });
        }
    };

    function draw() {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Grid subtle
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvas.width; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Obstacles
        obstacles.forEach(o => {
            ctx.fillStyle = "#333";
            ctx.fillRect(o.x * gridSize + 4, o.y * gridSize + 4, gridSize - 8, gridSize - 8);
            ctx.strokeStyle = "#555";
            ctx.strokeRect(o.x * gridSize + 8, o.y * gridSize + 8, gridSize - 16, gridSize - 16);
        });

        // Portals
        portals.forEach(p => {
            ctx.fillStyle = "#8e44ad";
            ctx.beginPath(); ctx.arc(p.in.x*gridSize+25, p.in.y*gridSize+25, 15, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(p.out.x*gridSize+25, p.out.y*gridSize+25, 15, 0, Math.PI*2); ctx.fill();
        });

        // Source & Target
        ctx.fillStyle = "#f1c40f"; ctx.fillRect(laserSource.x * gridSize + 12, laserSource.y * gridSize + 12, 26, 26);
        ctx.fillStyle = "#2ecc71"; ctx.fillRect(target.x * gridSize + 5, target.y * gridSize + 5, 40, 40);

        // Mirrors
        mirrors.forEach(m => {
            ctx.strokeStyle = "#00d2ff"; ctx.lineWidth = 4; ctx.lineCap = "round";
            ctx.beginPath();
            if (m.type === 0) {
                ctx.moveTo(m.x * gridSize + 10, m.y * gridSize + 40); ctx.lineTo(m.x * gridSize + 40, m.y * gridSize + 10);
            } else {
                ctx.moveTo(m.x * gridSize + 10, m.y * gridSize + 10); ctx.lineTo(m.x * gridSize + 40, m.y * gridSize + 40);
            }
            ctx.stroke();
        });
    }

    function calculateLaser() {
        let curX = laserSource.x, curY = laserSource.y, dir = laserSource.dir;
        ctx.beginPath(); ctx.lineWidth = 3; ctx.strokeStyle = "#ff3e3e";
        ctx.shadowBlur = 8; ctx.shadowColor = "red";
        ctx.moveTo(curX * gridSize + 25, curY * gridSize + 25);

        for (let i = 0; i < 60; i++) {
            if (dir === 'RIGHT') curX++; else if (dir === 'LEFT') curX--;
            else if (dir === 'UP') curY--; else if (dir === 'DOWN') curY++;

            ctx.lineTo(curX * gridSize + 25, curY * gridSize + 25);

            // Portal Logic
            const portal = portals.find(p => (p.in.x === curX && p.in.y === curY));
            if (portal) {
                curX = portal.out.x; curY = portal.out.y;
                ctx.moveTo(curX * gridSize + 25, curY * gridSize + 25);
            }

            if (obstacles.some(o => o.x === curX && o.y === curY)) break;

            const m = mirrors.find(m => m.x === curX && m.y === curY);
            if (m) {
                if (m.type === 0) {
                    if (dir === 'RIGHT') dir = 'UP'; else if (dir === 'LEFT') dir = 'DOWN';
                    else if (dir === 'UP') dir = 'RIGHT'; else if (dir === 'DOWN') dir = 'LEFT';
                } else {
                    if (dir === 'RIGHT') dir = 'DOWN'; else if (dir === 'LEFT') dir = 'UP';
                    else if (dir === 'UP') dir = 'LEFT'; else if (dir === 'DOWN') dir = 'RIGHT';
                }
            }

            if (curX === target.x && curY === target.y) {
                if (!gameWin) {
                    gameWin = true;
                    setTimeout(() => {
                        alert(`Level ${currentLevel} Clean!`);
                        currentLevel++;
                        setupLevel(currentLevel);
                    }, 200);
                }
                break;
            }
            if (curX < 0 || curX >= cols || curY < 0 || curY >= rows) break;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    window.resetReflectorLevel = () => setupLevel(currentLevel);

    window.surrenderReflector = () => {
        reflectorActive = false;
        cancelAnimationFrame(animationId);
        const finalScore = (currentLevel - 1) * 200;
        
        // Mock global functions from your Fun Game Hub
        if (window.saveToSpreadsheet) saveToSpreadsheet('light_reflector', finalScore);
        if (window.showLeaderboard) showLeaderboard('light_reflector');
        
        alert(`Game Over! Total Skor: ${finalScore}`);
    };

    function loop() {
        if (!document.getElementById('laserCanvas') || !reflectorActive) return;
        draw();
        calculateLaser();
        animationId = requestAnimationFrame(loop);
    }
    loop();
}