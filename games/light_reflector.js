// light_reflector.js

let currentLevel = 1;

function startLightReflector() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    wrapper.innerHTML = `
        <div style="text-align: center; max-width: 600px; margin: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; color: #fff; background: #333; padding: 5px 15px; border-radius: 5px;">
                <span id="level-display" style="font-weight: bold; color: #f1c40f;">LEVEL: ${currentLevel}</span>
                <span style="font-size: 0.8rem;">Hindari Blok Hitam!</span>
            </div>
            <canvas id="laserCanvas" width="500" height="400" style="background: #1a1a1a; border-radius: 8px; cursor: pointer; width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"></canvas>
            <div style="margin-top: 10px; padding: 10px; background: #222; color: #bbb; border-radius: 5px; font-size: 0.85rem; line-height: 1.4;">
                Klik grid untuk <b>/</b> ➔ Klik lagi untuk <b>\\</b> ➔ Klik lagi untuk <b>Hapus</b>
            </div>
        </div>
    `;

    const canvas = document.getElementById('laserCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 50;
    const cols = canvas.width / gridSize;
    const rows = canvas.height / gridSize;

    let mirrors = []; 
    let obstacles = []; // Rintangan (Wall)
    let target = { x: 0, y: 0 };
    let laserSource = { x: 0, y: 0, dir: 'RIGHT' };
    let gameWin = false;

    // --- GENERATOR LEVEL OTOMATIS ---
    function setupLevel(lvl) {
        gameWin = false;
        mirrors = [];
        obstacles = [];
        
        // Randomize posisi Source (sisi kiri)
        laserSource = { x: 0, y: Math.floor(Math.random() * (rows - 2)) + 1, dir: 'RIGHT' };
        
        // Randomize posisi Target (sisi kanan)
        target = { x: cols - 1, y: Math.floor(Math.random() * (rows - 2)) + 1 };

        // Tambah Rintangan berdasarkan level (makin tinggi level, makin banyak blok)
        const obstacleCount = Math.min(lvl + 1, 12); 
        for (let i = 0; i < obstacleCount; i++) {
            let obsX = Math.floor(Math.random() * (cols - 4)) + 2;
            let obsY = Math.floor(Math.random() * rows);
            // Pastikan rintangan tidak menimpa target/source
            if (!(obsX === target.x && obsY === target.y)) {
                obstacles.push({ x: obsX, y: obsY });
            }
        }
        
        const display = document.getElementById('level-display');
        if(display) display.innerText = `LEVEL: ${lvl}`;
    }

    setupLevel(currentLevel);

    // --- EVENT LISTENER ---
    canvas.addEventListener('click', (e) => {
        if (gameWin) return;
        const rect = canvas.getBoundingClientRect();
        const gridX = Math.floor((e.clientX - rect.left) / (rect.width / cols));
        const gridY = Math.floor((e.clientY - rect.top) / (rect.height / rows));

        // Cek jika klik di area terlarang (source, target, atau rintangan)
        const isObstacle = obstacles.some(o => o.x === gridX && o.y === gridY);
        if ((gridX === laserSource.x && gridY === laserSource.y) || 
            (gridX === target.x && gridY === target.y) || isObstacle) return;

        const existingIdx = mirrors.findIndex(m => m.x === gridX && m.y === gridY);
        if (existingIdx > -1) {
            if (mirrors[existingIdx].type === 0) mirrors[existingIdx].type = 1;
            else mirrors.splice(existingIdx, 1);
        } else {
            mirrors.push({ x: gridX, y: gridY, type: 0 });
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Grid
        ctx.strokeStyle = "#252525";
        ctx.lineWidth = 1;
        for (let i = 0; i <= canvas.width; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Rintangan (Blok Hitam/Batu)
        obstacles.forEach(obs => {
            ctx.fillStyle = "#444";
            ctx.strokeStyle = "#888";
            ctx.lineWidth = 2;
            ctx.fillRect(obs.x * gridSize + 2, obs.y * gridSize + 2, gridSize - 4, gridSize - 4);
            ctx.strokeRect(obs.x * gridSize + 5, obs.y * gridSize + 5, gridSize - 10, gridSize - 10);
        });

        // Source & Target
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#f1c40f"; ctx.shadowColor = "#f1c40f";
        ctx.fillRect(laserSource.x * gridSize + 10, laserSource.y * gridSize + 10, 30, 30);
        
        ctx.fillStyle = "#2ecc71"; ctx.shadowColor = "#2ecc71";
        ctx.fillRect(target.x * gridSize + 5, target.y * gridSize + 5, 40, 40);
        ctx.shadowBlur = 0;

        // Cermin
        mirrors.forEach(m => {
            ctx.strokeStyle = "#00d2ff";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.beginPath();
            if (m.type === 0) {
                ctx.moveTo(m.x * gridSize + 10, m.y * gridSize + 40);
                ctx.lineTo(m.x * gridSize + 40, m.y * gridSize + 10);
            } else {
                ctx.moveTo(m.x * gridSize + 10, m.y * gridSize + 10);
                ctx.lineTo(m.x * gridSize + 40, m.y * gridSize + 40);
            }
            ctx.stroke();
        });
    }

    function calculateLaser() {
        let curX = laserSource.x;
        let curY = laserSource.y;
        let dir = laserSource.dir;
        
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff0000";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ff0000";
        ctx.moveTo(curX * gridSize + 25, curY * gridSize + 25);

        for (let i = 0; i < 100; i++) {
            if (dir === 'RIGHT') curX++;
            else if (dir === 'LEFT') curX--;
            else if (dir === 'UP') curY--;
            else if (dir === 'DOWN') curY++;

            ctx.lineTo(curX * gridSize + 25, curY * gridSize + 25);

            // Cek Rintangan (Blok) - Laser Berhenti jika kena rintangan
            if (obstacles.some(o => o.x === curX && o.y === curY)) break;

            // Cek Cermin
            const mirror = mirrors.find(m => m.x === curX && m.y === curY);
            if (mirror) {
                if (mirror.type === 0) {
                    if (dir === 'RIGHT') dir = 'UP';
                    else if (dir === 'LEFT') dir = 'DOWN';
                    else if (dir === 'UP') dir = 'RIGHT';
                    else if (dir === 'DOWN') dir = 'LEFT';
                } else {
                    if (dir === 'RIGHT') dir = 'DOWN';
                    else if (dir === 'LEFT') dir = 'UP';
                    else if (dir === 'UP') dir = 'LEFT';
                    else if (dir === 'DOWN') dir = 'RIGHT';
                }
            }

            // Cek Menang
            if (curX === target.x && curY === target.y) {
                if (!gameWin) {
                    gameWin = true;
                    setTimeout(() => {
                        alert(`Level ${currentLevel} Selesai!`);
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

    function loop() {
        if (!document.getElementById('laserCanvas')) {
            currentLevel = 1; // Reset level jika keluar
            return;
        }
        draw();
        calculateLaser();
        requestAnimationFrame(loop);
    }

    loop();
}