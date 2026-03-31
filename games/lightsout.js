/**
 * Lights Out - Puzzle Logic
 */
const LO_GRID = 5;
const LO_CELL = 60;
let lo_board = [];

function startLightSout() { // Sesuaikan dengan method di database kamu (Laser Mirror/Lights Out)
    const wrapper = document.getElementById('game-canvas-wrapper');
    const size = LO_GRID * LO_CELL;
    
    wrapper.innerHTML = `
        <div style="text-align:center; font-family:sans-serif;">
            <h3 id="lo-status" style="color:#f1c40f;">Matikan Semua Lampu!</h3>
            <canvas id="lo-canvas" width="${size}" height="${size}" style="cursor:pointer; border:5px solid #2c3e50; border-radius:10px;"></canvas>
            <br><button onclick="startLightReflector()" style="margin-top:15px; padding:10px 20px;">Acak Ulang</button>
        </div>
    `;

    const canvas = document.getElementById('lo-canvas');
    const ctx = canvas.getContext('2d');

    // Inisialisasi & Acak (Harus bisa diselesaikan)
    lo_board = Array.from({ length: LO_GRID }, () => Array(LO_GRID).fill(false));
    for(let i=0; i<15; i++) { // Lakukan 15 langkah acak agar puzzle valid
        toggleLights(Math.floor(Math.random()*LO_GRID), Math.floor(Math.random()*LO_GRID));
    }

    drawLO(ctx);

    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const c = Math.floor((e.clientX - rect.left) / LO_CELL);
        const r = Math.floor((e.clientY - rect.top) / LO_CELL);
        toggleLights(r, c);
        drawLO(ctx);
        if (lo_board.every(row => row.every(cell => !cell))) {
            setTimeout(() => alert("Selamat! Semua lampu padam!"), 100);
        }
    };
}

function toggleLights(r, c) {
    const targets = [[0,0], [-1,0], [1,0], [0,-1], [0,1]];
    targets.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < LO_GRID && nc >= 0 && nc < LO_GRID) {
            lo_board[nr][nc] = !lo_board[nr][nc];
        }
    });
}

function drawLO(ctx) {
    for (let r = 0; r < LO_GRID; r++) {
        for (let c = 0; c < LO_GRID; c++) {
            ctx.fillStyle = lo_board[r][c] ? "#f1c40f" : "#34495e";
            ctx.strokeStyle = "#2c3e50";
            ctx.fillRect(c * LO_CELL, r * LO_CELL, LO_CELL, LO_CELL);
            ctx.strokeRect(c * LO_CELL, r * LO_CELL, LO_CELL, LO_CELL);
            // Efek cahaya
            if(lo_board[r][c]) {
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.fillRect(c * LO_CELL, r * LO_CELL, LO_CELL, LO_CELL/2);
            }
        }
    }
}