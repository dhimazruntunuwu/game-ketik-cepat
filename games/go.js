/**
 * Game Go (Weiqi/Baduk) - Module Version
 */

const GO_GRID = 9;
const GO_PADDING = 30;
const GO_CELL_SIZE = 40;
const GO_BOARD_SIZE = (GO_GRID - 1) * GO_CELL_SIZE + (GO_PADDING * 2);

let go_canvas, go_ctx;
let go_board = []; // 0: kosong, 1: hitam, 2: putih
let go_turn = 1;   // 1: hitam, 2: putih

function startGoGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // UI Game
    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="margin-bottom: 15px;">
                <span id="go-status" style="padding: 5px 15px; background: #2c3e50; color: white; border-radius: 20px; font-weight: bold;">
                    Giliran: HITAM
                </span>
            </div>
            <canvas id="go-canvas" width="${GO_BOARD_SIZE}" height="${GO_BOARD_SIZE}" 
                style="background:#f3b472; border:3px solid #5d4037; cursor:pointer; box-shadow: 0 8px 25px rgba(0,0,0,0.3); border-radius:4px;">
            </canvas>
            <div style="margin-top: 15px;">
                <button onclick="startGoGame()" style="padding: 8px 20px; border-radius: 5px; border: none; background: #e67e22; color: white; cursor: pointer; font-weight: bold;">
                    Reset Papan
                </button>
            </div>
        </div>
    `;

    go_canvas = document.getElementById('go-canvas');
    go_ctx = go_canvas.getContext('2d');

    // Inisialisasi Board Kosong (Array 2D)
    go_board = Array.from({ length: GO_GRID }, () => Array(GO_GRID).fill(0));
    go_turn = 1;

    go_draw();

    // Event Handling
    go_canvas.onclick = go_handleClick;
}

function go_draw() {
    go_ctx.clearRect(0, 0, GO_BOARD_SIZE, GO_BOARD_SIZE);

    // 1. Gambar Garis Papan (Grid)
    go_ctx.strokeStyle = "#4d3319";
    go_ctx.lineWidth = 1.5;
    for (let i = 0; i < GO_GRID; i++) {
        // Vertikal
        go_ctx.beginPath();
        go_ctx.moveTo(GO_PADDING + i * GO_CELL_SIZE, GO_PADDING);
        go_ctx.lineTo(GO_PADDING + i * GO_CELL_SIZE, GO_BOARD_SIZE - GO_PADDING);
        go_ctx.stroke();

        // Horizontal
        go_ctx.beginPath();
        go_ctx.moveTo(GO_PADDING, GO_PADDING + i * GO_CELL_SIZE);
        go_ctx.lineTo(GO_BOARD_SIZE - GO_PADDING, GO_PADDING + i * GO_CELL_SIZE);
        go_ctx.stroke();
    }

    // 2. Gambar Batu (Stones)
    for (let r = 0; r < GO_GRID; r++) {
        for (let c = 0; c < GO_GRID; c++) {
            if (go_board[r][c] !== 0) {
                const x = GO_PADDING + c * GO_CELL_SIZE;
                const y = GO_PADDING + r * GO_CELL_SIZE;

                go_ctx.beginPath();
                go_ctx.arc(x, y, GO_CELL_SIZE * 0.45, 0, Math.PI * 2);
                
                // Efek 3D Sederhana
                let gradient = go_ctx.createRadialGradient(x-3, y-3, 2, x, y, GO_CELL_SIZE*0.45);
                if (go_board[r][c] === 1) { // Hitam
                    gradient.addColorStop(0, "#666");
                    gradient.addColorStop(1, "#000");
                } else { // Putih
                    gradient.addColorStop(0, "#fff");
                    gradient.addColorStop(1, "#ccc");
                }
                
                go_ctx.fillStyle = gradient;
                go_ctx.fill();
                go_ctx.stroke();
            }
        }
    }
}

function go_handleClick(e) {
    const rect = go_canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const c = Math.round((x - GO_PADDING) / GO_CELL_SIZE);
    const r = Math.round((y - GO_PADDING) / GO_CELL_SIZE);

    if (r >= 0 && r < GO_GRID && c >= 0 && c < GO_GRID) {
        if (go_board[r][c] === 0) {
            // Taruh batu sementara untuk validasi
            const originalBoard = go_board.map(row => [...row]);
            go_board[r][c] = go_turn;
            
            // Cek apakah memakan lawan
            let opponent = go_turn === 1 ? 2 : 1;
            let capturedAny = go_processCaptures(opponent);
            
            // Cek Bunuh Diri
            if (!capturedAny && go_getGroupInfo(r, c, go_turn).liberties === 0) {
                go_board = originalBoard; // Batalkan langkah
                alert("Langkah terlarang: Bunuh diri!");
                return;
            }

            // Ganti Giliran
            go_turn = opponent;
            document.getElementById('go-status').innerText = `Giliran: ${go_turn === 1 ? 'HITAM' : 'PUTIH'}`;
            go_draw();
        }
    }
}

// Menghitung "Napas" (Liberties)
function go_getGroupInfo(r, c, color, visited = new Set()) {
    const key = `${r},${c}`;
    if (visited.has(key)) return { liberties: 0, stones: [] };
    visited.add(key);

    let liberties = new Set();
    let stones = [[r, c]];
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];

    directions.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < GO_GRID && nc >= 0 && nc < GO_GRID) {
            if (go_board[nr][nc] === 0) {
                liberties.add(`${nr},${nc}`);
            } else if (go_board[nr][nc] === color) {
                const child = go_getGroupInfo(nr, nc, color, visited);
                child.stones.forEach(s => stones.push(s));
                child.libertiesList.forEach(l => liberties.add(l));
            }
        }
    });

    return { 
        liberties: liberties.size, 
        stones: stones,
        libertiesList: Array.from(liberties) 
    };
}

function go_processCaptures(opponentColor) {
    let capturedAny = false;
    let checked = new Set();

    for (let r = 0; r < GO_GRID; r++) {
        for (let c = 0; c < GO_GRID; c++) {
            if (go_board[r][c] === opponentColor && !checked.has(`${r},${c}`)) {
                const group = go_getGroupInfo(r, c, opponentColor, new Set());
                
                // Tandai semua batu di grup ini agar tidak dicek ulang
                group.stones.forEach(s => checked.add(`${s[0]},${s[1]}`));

                if (group.liberties === 0) {
                    group.stones.forEach(([sr, sc]) => go_board[sr][sc] = 0);
                    capturedAny = true;
                }
            }
        }
    }
    return capturedAny;
}