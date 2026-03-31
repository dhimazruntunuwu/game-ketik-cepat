/**
 * Sokoban - 20 Progressive Levels
 * Mekanik Menyerah: Stop Game -> Simpan Skor -> Munculkan Leaderboard (Tetap di Page Game)
 */

const SOKO_CELL = 35; 
let soko_current_level = 0;
let soko_map = [];
let soko_canvas, soko_ctx;
let playerPos = { r: 0, c: 0 };
let soko_active = true;

// Database 20 Level
const SOKO_LEVELS = [
    [[1,1,1,1,1],[1,4,0,2,1],[1,0,3,0,1],[1,2,0,0,1],[1,1,1,1,1]], // 1
    [[1,1,1,1,1,1],[1,4,0,0,2,1],[1,0,3,0,0,1],[1,0,2,3,0,1],[1,1,1,1,1,1]], // 2
    [[1,1,1,1,1,1,1],[1,2,0,0,1,1,1],[1,0,3,3,0,4,1],[1,2,0,0,0,0,1],[1,1,1,1,1,1,1]], // 3 (Fixed)
    [[1,1,1,1,1,1,1],[1,1,2,0,0,1,1],[1,2,3,4,0,1,1],[1,1,0,3,0,1,1],[1,1,1,1,1,1,1]], // 4
    [[1,1,1,1,1,1,1],[1,2,0,1,1,1,1],[1,0,3,0,0,0,1],[1,4,3,2,0,0,1],[1,1,1,1,1,1,1]], // 5
    [[1,1,1,1,1,1,1,1],[1,0,0,0,1,2,0,1],[1,4,3,0,0,2,0,1],[1,0,3,0,0,0,0,1],[1,1,1,1,1,1,1,1]], // 6
    [[1,1,1,1,1,1,1,1],[1,2,2,0,1,0,0,1],[1,0,0,3,3,4,0,1],[1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1]], // 7
    [[1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1],[1,0,2,2,1,0,0,0,1],[1,0,3,3,4,0,0,0,1],[1,1,1,1,1,1,1,1,1]], // 8
    [[1,1,1,1,1,1,1,1,1],[1,4,0,1,0,2,0,0,1],[1,0,3,0,3,2,0,0,1],[1,0,0,1,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], // 9
    [[1,1,1,1,1,1,1,1,1],[1,0,0,2,2,0,0,0,1],[1,1,0,3,3,0,1,1,1],[1,4,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], // 10
    [[1,1,1,1,1,1,1,1,1,1],[1,0,2,2,2,0,0,0,0,1],[1,0,0,3,3,3,4,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], // 11
    [[1,1,1,1,1,1,1,1,1,1],[1,4,0,0,1,2,2,2,0,1],[1,0,3,3,3,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], // 12
    [[1,1,1,1,1,1,1,1,1,1],[1,2,0,2,0,2,0,2,0,1],[1,0,3,0,3,0,3,0,4,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], // 13
    [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,0,0,0,4,0,1],[1,2,2,2,3,3,3,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], // 14
    [[1,1,1,1,1,1,1,1,1,1],[1,2,2,2,2,0,0,0,0,1],[1,3,3,3,3,0,0,4,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], // 15
    [[1,1,1,1,1,1,1,1,1,1,1],[1,4,0,0,0,1,2,2,2,0,1],[1,0,3,3,3,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], // 16
    [[1,1,1,1,1,1,1,1,1,1,1],[1,2,2,3,3,0,0,0,0,0,1],[1,2,2,3,3,0,4,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], // 17
    [[1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,2,2,2,2,1,0,0,0,1],[1,0,3,3,3,3,4,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], // 18
    [[1,1,1,1,1,1,1,1,1,1,1],[1,2,0,2,0,2,0,2,0,0,1],[1,0,3,0,3,0,3,0,4,0,1],[1,1,1,1,1,1,1,1,1,1,1]], // 19
    [[1,1,1,1,1,1,1,1,1,1,1,1],[1,2,2,2,2,2,0,0,0,4,0,1],[1,3,3,3,3,3,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1]]  // 20
];

function startSokoban() {
    soko_active = true;
    const wrapper = document.getElementById('game-canvas-wrapper');
    const levelData = SOKO_LEVELS[soko_current_level];
    
    soko_map = levelData.map(row => [...row]);
    const rows = soko_map.length;
    const cols = soko_map[0].length;

    wrapper.innerHTML = `
        <div style="text-align:center; font-family: sans-serif; user-select: none; padding: 10px;">
            <h3 style="margin:5px; color:#2c3e50;">📦 Level ${soko_current_level + 1} / 20</h3>
            
            <div id="soko-container" style="position:relative; display:inline-block;">
                <canvas id="soko-canvas" width="${cols * SOKO_CELL}" height="${rows * SOKO_CELL}" 
                    style="border:4px solid #34495e; border-radius:8px; background:#ecf0f1; max-width:95vw; display:block;"></canvas>
            </div>

            <div id="soko-controls" style="display: grid; grid-template-columns: repeat(3, 65px); grid-gap: 10px; justify-content: center; margin-top: 15px;">
                <div></div><button class="soko-btn" onclick="moveSoko(-1, 0)">▲</button><div></div>
                <button class="soko-btn" onclick="moveSoko(0, -1)">◀</button>
                <button class="soko-btn" onclick="moveSoko(1, 0)">▼</button>
                <button class="soko-btn" onclick="moveSoko(0, 1)">▶</button>
            </div>

            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startSokoban()" style="padding:12px 25px; background:#e67e22; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">🔄 Reset</button>
                <button id="btn-surrender" onclick="surrenderSokoban()" style="padding:12px 25px; background:#e74c3c; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">🏳️ Menyerah</button>
                <button onclick="goHome()" style="padding:12px 25px; background:#95a5a6; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">🏠 Keluar</button>
            </div>

            <div id="soko-leaderboard-area" style="margin-top:20px;"></div>
        </div>
        <style>
            .soko-btn { width:65px; height:65px; font-size:24px; border-radius:12px; border:none; background:#3498db; color:white; box-shadow:0 4px #2980b9; cursor:pointer; }
            .soko-btn:active { transform:translateY(2px); box-shadow:0 2px #2980b9; }
        </style>
    `;

    soko_canvas = document.getElementById('soko-canvas');
    soko_ctx = soko_canvas.getContext('2d');

    for(let r=0; r<soko_map.length; r++) {
        for(let c=0; c<soko_map[r].length; c++) {
            if(soko_map[r][c] === 4) playerPos = { r, c };
        }
    }

    drawSoko();

    window.onkeydown = (e) => {
        if(!soko_active) return;
        let dr = 0, dc = 0;
        const key = e.key.toLowerCase();
        if (key === "arrowup" || key === "w") dr = -1;
        if (key === "arrowdown" || key === "s") dr = 1;
        if (key === "arrowleft" || key === "a") dc = -1;
        if (key === "arrowright" || key === "d") dc = 1;
        if (dr !== 0 || dc !== 0) { e.preventDefault(); moveSoko(dr, dc); }
    };
}

function moveSoko(dr, dc) {
    if(!soko_active) return;
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    const targetCell = soko_map[nr][nc];

    if (targetCell === 0 || targetCell === 2) {
        updateMapPos(playerPos.r, playerPos.c, nr, nc, 4);
        playerPos = { r: nr, c: nc };
    } 
    else if (targetCell === 3 || targetCell === 5) {
        const nnr = nr + dr;
        const nnc = nc + dc;
        const behindBox = soko_map[nnr][nnc];
        if (behindBox === 0 || behindBox === 2) {
            soko_map[nnr][nnc] = (behindBox === 2) ? 5 : 3; 
            updateMapPos(playerPos.r, playerPos.c, nr, nc, 4);
            playerPos = { r: nr, c: nc };
        }
    }
    drawSoko();
    checkSokoWin();
}

function updateMapPos(oldR, oldC, newR, newC, type) {
    const wasTarget = SOKO_LEVELS[soko_current_level][oldR][oldC] === 2;
    soko_map[oldR][oldC] = wasTarget ? 2 : 0;
    soko_map[newR][newC] = type;
}

function drawSoko() {
    soko_ctx.clearRect(0, 0, soko_canvas.width, soko_canvas.height);
    for (let r = 0; r < soko_map.length; r++) {
        for (let c = 0; c < soko_map[r].length; c++) {
            const x = c * SOKO_CELL, y = r * SOKO_CELL, type = soko_map[r][c];
            if (type === 1) { soko_ctx.fillStyle = "#7f8c8d"; soko_ctx.fillRect(x,y,SOKO_CELL,SOKO_CELL); }
            if (type === 2 || SOKO_LEVELS[soko_current_level][r][c] === 2) { 
                soko_ctx.fillStyle = "#2ecc71"; soko_ctx.beginPath(); 
                soko_ctx.arc(x+SOKO_CELL/2, y+SOKO_CELL/2, 5, 0, Math.PI*2); soko_ctx.fill(); 
            }
            if (type === 3 || type === 5) {
                soko_ctx.fillStyle = type === 5 ? "#27ae60" : "#e67e22";
                soko_ctx.fillRect(x+4,y+4,SOKO_CELL-8,SOKO_CELL-8);
                soko_ctx.strokeStyle = "rgba(0,0,0,0.2)"; soko_ctx.strokeRect(x+4,y+4,SOKO_CELL-8,SOKO_CELL-8);
            }
            if (type === 4) {
                soko_ctx.fillStyle = "#3498db"; soko_ctx.beginPath();
                soko_ctx.arc(x+SOKO_CELL/2, y+SOKO_CELL/2, SOKO_CELL*0.35, 0, Math.PI*2); soko_ctx.fill();
            }
        }
    }
}

function checkSokoWin() {
    let win = true;
    for (let r = 0; r < soko_map.length; r++) {
        for (let c = 0; c < soko_map[r].length; c++) {
            if (soko_map[r][c] === 2 || soko_map[r][c] === 3) { win = false; break; }
        }
    }
    if (win) {
        if (soko_current_level < SOKO_LEVELS.length - 1) {
            soko_current_level++;
            setTimeout(() => { alert("Level Selesai!"); startSokoban(); }, 200);
        } else {
            alert("🏆 SEMPURNA! Semua level tuntas!");
            surrenderSokoban(); // Tamat otomatis simpan skor
        }
    }
}

/**
 * Menyerah: Simpan skor, matikan kontrol, tampilkan leaderboard di area bawah game
 */
function surrenderSokoban() {
    soko_active = false; // Matikan kontrol game
    const finalScore = soko_current_level * 100;
    
    // Nonaktifkan tombol menyerah agar tidak double submit
    document.getElementById('btn-surrender').disabled = true;
    document.getElementById('btn-surrender').style.opacity = "0.5";

    // 1. Simpan Skor ke Spreadsheet
    saveToSpreadsheet('sokoban', finalScore);
    
    // 2. Tampilkan Leaderboard di element soko-leaderboard-area
    // Catatan: Pastikan showLeaderboard kamu bisa menerima argumen target element, 
    // atau jika global, dia akan muncul di modal standar.
    showLeaderboard('sokoban');
    
    console.log("Game stopped, score " + finalScore + " submitted.");
}