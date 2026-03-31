/**
 * Othello - Strategy Game
 */
const OT_GRID = 8;
const OT_CELL = 45;
let ot_board = [];
let ot_turn = 1; // 1: Hitam, 2: Putih

function startOthello() { // Tambahkan ID 'othello' di games database kamu jika ingin pakai ini
    const wrapper = document.getElementById('game-canvas-wrapper');
    const size = OT_GRID * OT_CELL;
    
    wrapper.innerHTML = `
        <div style="text-align:center;">
            <h4 id="ot-status">Giliran: HITAM</h4>
            <canvas id="ot-canvas" width="${size}" height="${size}" style="background:#27ae60; border:4px solid #2ecc71; cursor:pointer;"></canvas>
            <p id="ot-score">H: 2 | P: 2</p>
        </div>
    `;

    const canvas = document.getElementById('ot-canvas');
    const ctx = canvas.getContext('2d');

    // Setup Awal (4 bidak di tengah)
    ot_board = Array.from({ length: OT_GRID }, () => Array(OT_GRID).fill(0));
    ot_board[3][3] = 2; ot_board[3][4] = 1;
    ot_board[4][3] = 1; ot_board[4][4] = 2;
    ot_turn = 1;

    drawOT(ctx);

    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const c = Math.floor((e.clientX - rect.left) / OT_CELL);
        const r = Math.floor((e.clientY - rect.top) / OT_CELL);

        if (isValidOthelloMove(r, c, ot_turn, true)) {
            ot_turn = ot_turn === 1 ? 2 : 1;
            drawOT(ctx);
            updateOTScore();
        }
    };
}

function isValidOthelloMove(r, c, color, doFlip = false) {
    if (ot_board[r][c] !== 0) return false;
    let foundCapture = false;
    const opponent = color === 1 ? 2 : 1;
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

    dirs.forEach(([dr, dc]) => {
        let nr = r + dr, nc = c + dc;
        let piecesToFlip = [];
        while (nr >= 0 && nr < OT_GRID && nc >= 0 && nc < OT_GRID && ot_board[nr][nc] === opponent) {
            piecesToFlip.push([nr, nc]);
            nr += dr; nc += dc;
        }
        if (piecesToFlip.length > 0 && nr >= 0 && nr < OT_GRID && nc >= 0 && nc < OT_GRID && ot_board[nr][nc] === color) {
            foundCapture = true;
            if (doFlip) {
                ot_board[r][c] = color;
                piecesToFlip.forEach(([fr, fc]) => ot_board[fr][fc] = color);
            }
        }
    });
    return foundCapture;
}

function drawOT(ctx) {
    ctx.clearRect(0, 0, OT_GRID * OT_CELL, OT_GRID * OT_CELL);
    for (let r = 0; r < OT_GRID; r++) {
        for (let c = 0; c < OT_GRID; c++) {
            ctx.strokeStyle = "#1e8449";
            ctx.strokeRect(c * OT_CELL, r * OT_CELL, OT_CELL, OT_CELL);
            if (ot_board[r][c] !== 0) {
                ctx.beginPath();
                ctx.arc(c * OT_CELL + OT_CELL/2, r * OT_CELL + OT_CELL/2, OT_CELL*0.4, 0, Math.PI*2);
                ctx.fillStyle = ot_board[r][c] === 1 ? "#000" : "#fff";
                ctx.fill();
            }
        }
    }
    document.getElementById('ot-status').innerText = `Giliran: ${ot_turn === 1 ? 'HITAM' : 'PUTIH'}`;
}

function updateOTScore() {
    let h = 0, p = 0;
    ot_board.forEach(row => row.forEach(cell => {
        if(cell === 1) h++; if(cell === 2) p++;
    }));
    document.getElementById('ot-score').innerText = `H: ${h} | P: ${p}`;
}