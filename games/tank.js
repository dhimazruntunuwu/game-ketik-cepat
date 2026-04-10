function startTankGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let gameLevel = 1;
    let score = 0;
    stats.innerText = `Skor: 0 | Lv. 1 | 🚀 Survival Mode`;

    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none; touch-action:manipulation;">
            <canvas id="tankCanvas" width="450" height="450" style="border:5px solid #334155; background:black; border-radius:10px; width:100%; max-width:450px;"></canvas>
            
            <div style="margin-top:15px; display:flex; justify-content:center; gap:20px; align-items:center;">
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px;">
                    <div style="grid-column: 2"><button onclick="changeTankDir('up')" style="padding:15px; border-radius:10px; border:none; background:#475569; color:white; font-size:1.5rem;">⬆️</button></div>
                    <div style="grid-column: 1"><button onclick="changeTankDir('left')" style="padding:15px; border-radius:10px; border:none; background:#475569; color:white; font-size:1.5rem;">⬅️</button></div>
                    <div style="grid-column: 2"><button onclick="changeTankDir('down')" style="padding:15px; border-radius:10px; border:none; background:#475569; color:white; font-size:1.5rem;">⬇️</button></div>
                    <div style="grid-column: 3; grid-row: 2"><button onclick="changeTankDir('right')" style="padding:15px; border-radius:10px; border:none; background:#475569; color:white; font-size:1.5rem;">➡️</button></div>
                </div>
                <div>
                    <button onclick="tankShootAction()" style="padding:25px; border-radius:50%; border:none; background:#ef4444; color:white; font-size:1.5rem; box-shadow: 0 5px #991b1b;">🔥</button>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('tankCanvas');
    const ctx = canvas.getContext('2d');
    const TILE_SIZE = 30;
    const GRID_SIZE = 15;
    
    let isGameOver = false;
    let tankBullets = [];
    let enemyBullets = [];
    let player = { x: 7, y: 13, dir: 'up' };
    let enemies = [];
    let moveCounter = 0;

    let tankMap = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,2,0,1,1,0,0,0,1,1,0,2,2,0],
        [0,2,2,0,1,1,0,2,0,1,1,0,2,2,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
        [1,1,3,3,3,1,0,2,0,1,3,3,3,1,1],
        [0,0,3,3,3,0,0,0,0,0,3,3,3,0,0],
        [0,1,0,1,0,2,2,2,2,2,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,2,2,0,2,0,2,2,1,0,1,0],
        [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
        [1,1,3,3,3,1,0,2,0,1,3,3,3,1,1],
        [0,0,3,3,3,0,0,0,0,0,3,3,3,0,0],
        [0,2,2,0,1,1,0,2,0,1,1,0,2,2,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    function spawnEnemies() {
        const possiblePoints = [];
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (tankMap[y][x] === 0) possiblePoints.push({x, y});
            }
        }
        for(let i=0; i<2; i++) {
            if (possiblePoints.length > 0) {
                const randIdx = Math.floor(Math.random() * possiblePoints.length);
                const p = possiblePoints.splice(randIdx, 1)[0];
                enemies.push({ 
                    x: p.x, y: p.y, dir: 'down', moveCounter: 0,
                    speed: Math.max(4, 12 - gameLevel), 
                    fireRate: Math.min(0.85, 0.6 + (gameLevel * 0.05)) 
                });
            }
        }
    }

    spawnEnemies();

    window.changeTankDir = (dir) => { if(!isGameOver) player.dir = dir; };
    window.tankShootAction = () => {
        if(isGameOver) return;
        tankBullets.push({ x: player.x * TILE_SIZE + 15, y: player.y * TILE_SIZE + 15, dir: player.dir });
    };

    document.onkeydown = e => {
        const key = e.key.toLowerCase();
        if(['w','arrowup'].includes(key)) changeTankDir('up');
        if(['s','arrowdown'].includes(key)) changeTankDir('down');
        if(['a','arrowleft'].includes(key)) changeTankDir('left');
        if(['d','arrowright'].includes(key)) changeTankDir('right');
        if(key === ' ') { tankShootAction(); e.preventDefault(); }
    };

    function gameLoopFunc() {
        if(isGameOver) return;
        if (enemies.length === 0) { gameLevel++; spawnEnemies(); stats.innerText = `Skor: ${score} | Lv. ${gameLevel}`; }

        moveCounter++;
        if (moveCounter >= 15) {
            let nx = player.x, ny = player.y;
            if(player.dir === 'up') ny--; else if(player.dir === 'down') ny++;
            else if(player.dir === 'left') nx--; else if(player.dir === 'right') nx++;
            if(nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && tankMap[ny][nx] === 0) {
                player.x = nx; player.y = ny;
            }
            enemies.forEach(en => {
                en.moveCounter++;
                if(en.moveCounter >= en.speed) {
                    let ex = en.x, ey = en.y;
                    if(en.dir === 'up') ey--; else if(en.dir === 'down') ey++;
                    else if(en.dir === 'left') ex--; else if(en.dir === 'right') ex++;
                    if(ex >= 0 && ex < GRID_SIZE && ey >= 0 && ey < GRID_SIZE && tankMap[ey][ex] === 0) {
                        en.x = ex; en.y = ey;
                    } else {
                        const dirs = ['up', 'down', 'left', 'right'];
                        en.dir = dirs[Math.floor(Math.random() * dirs.length)];
                    }
                    en.moveCounter = 0;
                    let isAlign = (en.x === player.x || en.y === player.y);
                    if(Math.random() < (isAlign ? en.fireRate : 0.15)) {
                        enemyBullets.push({ x: en.x * TILE_SIZE + 15, y: en.y * TILE_SIZE + 15, dir: en.dir });
                    }
                }
            });
            moveCounter = 0;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 450, 450);

        tankMap.forEach((row, y) => {
            row.forEach((cell, x) => {
                if(cell === 1) { ctx.fillStyle = "#8b4513"; ctx.fillRect(x*30+1, y*30+1, 28, 28); }
                else if(cell === 2) { ctx.fillStyle = "#64748b"; ctx.fillRect(x*30, y*30, 30, 30); }
                else if(cell === 3) { ctx.fillStyle = "#0ea5e9"; ctx.fillRect(x*30, y*30, 30, 30); }
            });
        });

        // DRAW PLAYER + BARREL
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(player.x*30+4, player.y*30+4, 22, 22);
        ctx.fillStyle = "#f1c40f"; // Warna Moncong sama dengan badan
        if(player.dir === 'up') ctx.fillRect(player.x*30+13, player.y*30-2, 4, 12);
        else if(player.dir === 'down') ctx.fillRect(player.x*30+13, player.y*30+20, 4, 12);
        else if(player.dir === 'left') ctx.fillRect(player.x*30-2, player.y*30+13, 12, 4);
        else if(player.dir === 'right') ctx.fillRect(player.x*30+20, player.y*30+13, 12, 4);

        // DRAW ENEMIES + BARREL
        enemies.forEach(en => {
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(en.x*30+4, en.y*30+4, 22, 22);
            ctx.fillStyle = "black"; // Moncong musuh warna hitam biar sangar
            if(en.dir === 'up') ctx.fillRect(en.x*30+13, en.y*30-2, 4, 12);
            else if(en.dir === 'down') ctx.fillRect(en.x*30+13, en.y*30+20, 4, 12);
            else if(en.dir === 'left') ctx.fillRect(en.x*30-2, en.y*30+13, 12, 4);
            else if(en.dir === 'right') ctx.fillRect(en.x*30+20, en.y*30+13, 12, 4);
        });

        // Bullets
        ctx.fillStyle = "#22c55e";
        for(let i = tankBullets.length-1; i>=0; i--) {
            let b = tankBullets[i];
            if(b.dir === 'up') b.y -= 8; else if(b.dir === 'down') b.y += 8;
            else if(b.dir === 'left') b.x -= 8; else if(b.dir === 'right') b.x += 8;
            ctx.fillRect(b.x-2, b.y-2, 5, 5);
            let gx = Math.floor(b.x/30), gy = Math.floor(b.y/30);
            if(gx<0||gx>=15||gy<0||gy>=15) tankBullets.splice(i,1);
            else if(tankMap[gy][gx] === 1) { tankMap[gy][gx]=0; tankBullets.splice(i,1); score+=10; }
            else if(tankMap[gy][gx] === 2) tankBullets.splice(i,1);
            enemies.forEach((en, ei) => { if(gx===en.x && gy===en.y) { enemies.splice(ei,1); tankBullets.splice(i,1); score+=50; }});
        }

        ctx.fillStyle = "white";
        for(let j = enemyBullets.length-1; j>=0; j--) {
            let eb = enemyBullets[j];
            let bSpeed = 5 + (gameLevel * 0.3);
            if(eb.dir === 'up') eb.y -= bSpeed; else if(eb.dir === 'down') eb.y += bSpeed;
            else if(eb.dir === 'left') eb.x -= bSpeed; else if(eb.dir === 'right') eb.x += bSpeed;
            ctx.fillRect(eb.x-2, eb.y-2, 4, 4);
            let egx = Math.floor(eb.x/30), egy = Math.floor(eb.y/30);
            if(egx<0||egx>=15||egy<0||egy>=15 || [1,2].includes(tankMap[egy][egx])) enemyBullets.splice(j,1);
            if(egx === player.x && egy === player.y) { isGameOver = true; handleGameOver(score, `Level: ${gameLevel}`); }
        }

        gameLoop = setTimeout(gameLoopFunc, 40);
    }

    function handleGameOver(finalScore, msg) {
        saveToSpreadsheet('tank', finalScore);
        alert(`GAME OVER!\n${msg}\nSkor: ${finalScore}`);
        showLeaderboard('tank');
        document.onkeydown = null;
    }
    gameLoopFunc();
}