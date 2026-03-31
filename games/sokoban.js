/**
 * Sokoban - Logic Puzzle Game
 * 0: Lantai, 1: Tembok, 2: Target, 3: Kotak, 4: Pemain
 */

const SOKO_CELL = 40;

// Template Level (Agar bisa di-reset dengan sempurna)
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

function startSokoban() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // Copy level dari template agar map asli tidak rusak saat dimainkan
    soko_map = SOKO_LEVEL_1.map(row => [...row]);

    const rows = soko_map.length;
    const cols = soko_map[0].length;

    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">📦 Sokoban Puzzle</h2>
            
            <canvas id="soko-canvas" width="${cols * SOKO_CELL}" height="${rows * SOKO_CELL}" 
                style="border: 5px solid #34495e; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); background: #ecf0f1;">
            </canvas>

            <div style="background: #fff; border-left: 5px solid #f39c12; padding: 15px; margin-top: 20px; text-align: left; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h4 style="margin-top: 0; color: #d35400;">📜 Aturan Permainan:</h4>
                <ul style="font-size: 0.85rem; color: #34495e; padding-left: 20px; line-height: 1.5;">
                    <li><b>Tujuan:</b> Dorong semua <b>kotak oranye</b> ke titik <b>target hijau</b>.</li>
                    <li><b>Kontrol:</b> Gunakan tombol <b>Panah (Arrow)</b> atau <b>WASD</b>.</li>
                    <li><b>Dorong:</b> Hanya bisa mendorong <b>1 kotak</b> ke ruang kosong.</li>
                    <li><b>Peringatan:</b> Kotak tidak bisa ditarik! Hati-hati jangan sampai terpojok.</li>
                </ul>
            </div>

            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startSokoban()" style="padding: 10px 20px; cursor:pointer; background:#e67e22; color:white; border:none; border-radius:25px; font-weight:bold;">
                    🔄 Reset Level
                </button>
            </div>
        </div>
    `;

    soko_canvas = document.getElementById('soko-canvas');
    soko_ctx = soko_canvas.getContext('2d');

    // Cari posisi pemain
    for(let r=0; r<soko_map.length; r++) {
        for(let c=0; c<soko_map[r].length; c++) {
            if(soko_map[r][c] === 4) playerPos = { r, c };
        }
    }

    drawSoko();

    // Event Keyboard
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

function moveSoko(dr, dc) {
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;
    
    // Cek objek di depan pemain
    const targetCell = soko_map[nr][nc];

    // 1. Jika jalan ke Lantai (0) atau Target Kosong (2)
    if (targetCell === 0 || targetCell === 2) {
        moveEntity(playerPos.r, playerPos.c, nr, nc, 4);
        playerPos = { r: nr, c: nc };
    } 
    // 2. Jika menabrak Kotak (3)
    else if (targetCell === 3 || targetCell === 5) { // 5 adalah kotak yang sudah di target
        const nnr = nr + dr;
        const nnc = nc + dc;
        const behindBox = soko_map[nnr][nnc];

        // Bisa dorong jika di belakang kotak adalah lantai atau target
        if (behindBox === 0 || behindBox === 2) {
            // Pindahkan Kotak dulu
            soko_map[nnr][nnc] = (behindBox === 2) ? 5 : 3; 
            // Pindahkan Pemain
            moveEntity(playerPos.r, playerPos.c, nr, nc, 4);
            playerPos = { r: nr, c: nc };
        }
    }
    
    drawSoko();
    checkSokoWin();
}

// Fungsi bantu memindahkan entitas sambil menjaga status 'Target' di bawahnya
function moveEntity(oldR, oldC, newR, newC, type) {
    // Cek apakah posisi lama itu sebenarnya area target
    const wasTarget = SOKO_LEVEL_1[oldR][oldC] === 2;
    soko_map[oldR][oldC] = wasTarget ? 2 : 0;

    // Taruh entitas di posisi baru
    soko_map[newR][newC] = type;
}

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
                soko_ctx.fillStyle = type === 5 ? "#27ae60" : "#e67e22"; // Hijau jika sudah pas di target
                soko_ctx.fillRect(x+4, y+4, SOKO_CELL-8, SOKO_CELL-8);
                soko_ctx.strokeStyle = "#d35400";
                soko_ctx.lineWidth = 2;
                soko_ctx.strokeRect(x+4, y+4, SOKO_CELL-8, SOKO_CELL-8);
                // X Mark pada kotak
                soko_ctx.beginPath();
                soko_ctx.moveTo(x+10, y+10); soko_ctx.lineTo(x+SOKO_CELL-10, y+SOKO_CELL-10);
                soko_ctx.moveTo(x+SOKO_CELL-10, y+10); soko_ctx.lineTo(x+10, y+SOKO_CELL-10);
                soko_ctx.stroke();
            }
            // Pemain (Biru)
            if (type === 4) {
                soko_ctx.fillStyle = "#3498db";
                soko_ctx.beginPath();
                soko_ctx.arc(x + SOKO_CELL/2, y + SOKO_CELL/2, SOKO_CELL*0.35, 0, Math.PI*2);
                soko_ctx.fill();
                // Mata Pemain
                soko_ctx.fillStyle = "white";
                soko_ctx.fillRect(x+14, y+12, 4, 4); soko_ctx.fillRect(x+22, y+12, 4, 4);
            }
        }
    }
}

function checkSokoWin() {
    // Cek apakah masih ada kotak (3) yang belum berada di atas target (5)
    let win = true;
    for (let r = 0; r < soko_map.length; r++) {
        for (let c = 0; c < soko_map[r].length; c++) {
            // Jika masih ada target (2) yang belum terisi kotak, belum menang
            if (soko_map[r][c] === 2) win = false;
            // Jika ada kotak (3) yang belum jadi kotak-target (5), belum menang
            if (soko_map[r][c] === 3) win = false;
        }
    }

    if (win) {
        setTimeout(() => {
            alert("🎉 Luar Biasa! Semua kotak telah sampai di target.");
            goHome();
        }, 300);
    }
}