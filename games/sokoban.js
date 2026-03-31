/**
 * Sokoban - Mobile & Desktop Version
 * 0: Lantai, 1: Tembok, 2: Target, 3: Kotak, 4: Pemain, 5: Kotak di Target
 */

const SOKO_CELL = 40;

// Template Level 1
const SOKO_LEVEL_1 = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 1, 1, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 1],
    [1, 0, 4, 3, 2, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

let soko_map = [];
let soko_canvas, soko_ctx;
let playerPos = { r: 0, c: 0 };

/**
 * Memulai Game Sokoban
 */
function startSokoban() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // Copy level agar tidak merusak template asli saat reset
    soko_map = SOKO_LEVEL_1.map(row => [...row]);

    const rows = soko_map.length;
    const cols = soko_map[0].length;

    // Layout HTML dengan Tombol Kontrol untuk HP
    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', sans-serif; max-width: 100%; margin: 0 auto; user-select: none; padding: 10px;">
            <h2 style="margin: 0 0 10px 0; color: #2c3e50;">📦 Sokoban Puzzle</h2>
            
            <canvas id="soko-canvas" width="${cols * SOKO_CELL}" height="${rows * SOKO_CELL}" 
                style="border: 4px solid #34495e; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); background: #ecf0f1; max-width: 100%; height: auto;">
            </canvas>

            <div style="display: grid; grid-template-columns: repeat(3, 65px); grid-gap: 10px; justify-content: center; margin-top: 15px;">
                <div></div>
                <button class="soko-btn" onclick="moveSoko(-1, 0)">▲</button>
                <div></div>
                <button class="soko-btn" onclick="moveSoko(0, -1)">◀</button>
                <button class="soko-btn" onclick="moveSoko(1, 0)">▼</button>
                <button class="soko-btn" onclick="moveSoko(0, 1)">▶</button>
            </div>

            <div style="margin-top: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <button onclick="startSokoban()" style="padding: 12px 30px; background:#e67e22; color:white; border:none; border-radius:25px; font-weight:bold; cursor:pointer; width: 200px;">
                    🔄 Reset Level
                </button>
                <p style="font-size: 0.8rem; color: #7f8c8d; margin: 0;">Tujuan: Dorong kotak ke titik hijau</p>
            </div>
        </div>

        <style>
            .soko-btn {
                width: 65px; height: 65px; font-size: 24px; border-radius: 12px; 
                border: none; background: #3498db; color: white; cursor: pointer;
                box-shadow: 0 4px #2980b9; transition: 0.1s;
            }
            .soko-btn:active {
                box-shadow: 0 0 #2980b9;
                transform: translateY(4px);
                background: #2980b9;
            }
        </style>
    `;

    soko_canvas = document.getElementById('soko-canvas');
    soko_ctx = soko_canvas.getContext('2d');

    // Cari posisi awal pemain
    for(let r=0; r<soko_map.length; r++) {
        for(let c=0; c<soko_map[r].length; c++) {
            if(soko_map[r][c] === 4) playerPos = { r, c };
        }
    }

    drawSoko();

    // Kontrol Keyboard (Desktop)
    window.onkeydown = (e) => {
        let dr = 0, dc = 0;
        const key = e.key.toLowerCase();
        if (key === "arrowup" || key === "w") dr = -1;
        if (key === "arrowdown" || key === "s") dr = 1;
        if (key === "arrowleft" || key === "a") dc = -1;
        if (key === "arrowright" || key === "d") dc = 1;

        if (dr !== 0 || dc !== 0) {
            e.preventDefault();
            moveSoko(dr, dc);
        }
    };
}

/**
 * Logika Pergerakan
 */
function moveSoko(dr, dc) {
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    
    // Objek di koordinat tujuan
    const targetCell = soko_map[nr][nc];

    // 1. Jalan ke Lantai (0) atau Target Kosong (2)
    if (targetCell === 0 || targetCell === 2) {
        updateMapPos(playerPos.r, playerPos.c, nr, nc, 4);
        playerPos = { r: nr, c: nc };
    } 
    // 2. Menabrak Kotak (3 atau 5)
    else if (targetCell === 3 || targetCell === 5) {
        const nnr = nr + dr;
        const nnc = nc + dc;
        const behindBox = soko_map[nnr][nnc];

        // Dorong kotak jika di baliknya kosong (lantai/target)
        if (behindBox === 0 || behindBox === 2) {
            // Pindahkan Kotak
            soko_map[nnr][nnc] = (behindBox === 2) ? 5 : 3; 
            // Pindahkan Pemain
            updateMapPos(playerPos.r, playerPos.c, nr, nc, 4);
            playerPos = { r: nr, c: nc };
        }
    }
    
    drawSoko();
    checkSokoWin();
}

/**
 * Helper untuk update array map
 */
function updateMapPos(oldR, oldC, newR, newC, type) {
    // Kembalikan posisi lama ke status aslinya (lantai atau target)
    const wasTarget = SOKO_LEVEL_1[oldR][oldC] === 2;
    soko_map[oldR][oldC] = wasTarget ? 2 : 0;

    // Set entitas di posisi baru
    soko_map[newR][newC] = type;
}

/**
 * Render Visual ke Canvas
 */
function drawSoko() {
    soko_ctx.clearRect(0, 0, soko_canvas.width, soko_canvas.height);

    for (let r = 0; r < soko_map.length; r++) {
        for (let c = 0; c < soko_map[r].length; c++) {
            const x = c * SOKO_CELL;
            const y = r * SOKO_CELL;
            const type = soko_map[r][c];

            // Tembok
            if (type === 1) {
                soko_ctx.fillStyle = "#7f8c8d";
                soko_ctx.fillRect(x, y, SOKO_CELL, SOKO_CELL);
                soko_ctx.strokeStyle = "#2c3e50";
                soko_ctx.strokeRect(x, y, SOKO_CELL, SOKO_CELL);
            } 
            // Target (Titik Hijau)
            if (type === 2 || SOKO_LEVEL_1[r][c] === 2) {
                soko_ctx.fillStyle = "#2ecc71";
                soko_ctx.beginPath();
                soko_ctx.arc(x + SOKO_CELL/2, y + SOKO_CELL/2, 6, 0, Math.PI*2);
                soko_ctx.fill();
            }
            // Kotak (Oranye)
            if (type === 3 || type === 5) {
                soko_ctx.fillStyle = type === 5 ? "#27ae60" : "#e67e22"; 
                soko_ctx.fillRect(x+4, y+4, SOKO_CELL-8, SOKO_CELL-8);
                soko_ctx.strokeStyle = "#d35400";
                soko_ctx.strokeRect(x+4, y+4, SOKO_CELL-8, SOKO_CELL-8);
                // Dekorasi 'X' pada kotak
                soko_ctx.beginPath();
                soko_ctx.moveTo(x+10, y+10); soko_ctx.lineTo(x+SOKO_CELL-10, y+SOKO_CELL-10);
                soko_ctx.moveTo(x+SOKO_CELL-10, y+10); soko_ctx.lineTo(x+10, y+SOKO_CELL-10);
                soko_ctx.stroke();
            }
            // Pemain (Karakter Biru)
            if (type === 4) {
                soko_ctx.fillStyle = "#3498db";
                soko_ctx.beginPath();
                soko_ctx.arc(x + SOKO_CELL/2, y + SOKO_CELL/2, SOKO_CELL*0.35, 0, Math.PI*2);
                soko_ctx.fill();
                // Detail Mata
                soko_ctx.fillStyle = "white";
                soko_ctx.fillRect(x+14, y+12, 4, 4); soko_ctx.fillRect(x+22, y+12, 4, 4);
            }
        }
    }
}

/**
 * Cek Status Kemenangan
 */
function checkSokoWin() {
    let win = true;
    for (let r = 0; r < soko_map.length; r++) {
        for (let c = 0; c < soko_map[r].length; c++) {
            // Jika masih ada target (2) atau kotak belum di target (3), belum menang
            if (soko_map[r][c] === 2 || soko_map[r][c] === 3) {
                win = false;
                break;
            }
        }
    }

    if (win) {
        setTimeout(() => {
            alert("🎉 Selamat! Kamu berhasil menyelesaikan puzzle ini.");
            goHome();
        }, 300);
    }
}