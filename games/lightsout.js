/**
 * Lights Out - Puzzle Logic Game
 * Tujuan: Matikan semua lampu (ubah semua sel menjadi gelap)
 */
const LO_GRID = 5;
const LO_CELL = 60;
let lo_board = [];

function startLightSout() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const size = LO_GRID * LO_CELL;
    
    // UI Game dengan Rules dan Tombol Kontrol
    wrapper.innerHTML = `
        <div style="text-align:center; font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 400px; margin: 0 auto; user-select: none;">
            <h2 style="color: #f1c40f; margin-bottom: 10px;">💡 Lights Out</h2>
            
            <canvas id="lo-canvas" width="${size}" height="${size}" 
                style="cursor:pointer; border:5px solid #2c3e50; border-radius:10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            </canvas>

            <div style="background: #2c3e50; color: white; padding: 15px; margin-top: 20px; text-align: left; border-radius: 8px; font-size: 0.9rem; line-height: 1.5; border-bottom: 4px solid #f1c40f;">
                <strong style="color: #f1c40f; display: block; margin-bottom: 5px;">📜 Cara Bermain:</strong>
                <ul style="padding-left: 20px; margin: 0;">
                    <li>Klik pada kotak untuk menyalakan/mematikan lampu.</li>
                    <li>Saat diklik, kotak tersebut <b>DAN</b> kotak di tetangganya (atas, bawah, kiri, kanan) akan berubah status.</li>
                    <li><b>Misi:</b> Buat seluruh papan menjadi <b>gelap (biru tua)</b>!</li>
                </ul>
            </div>

            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startLightSout()" style="padding: 12px 25px; background: #f1c40f; color: #2c3e50; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; transition: 0.2s;">
                    🔄 Acak Ulang
                </button>
                <button onclick="goHome()" style="padding: 12px 25px; background: #95a5a6; color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer;">
                    🏠 Menu
                </button>
            </div>
        </div>
    `;

    const canvas = document.getElementById('lo-canvas');
    const ctx = canvas.getContext('2d');

    // Inisialisasi papan kosong
    lo_board = Array.from({ length: LO_GRID }, () => Array(LO_GRID).fill(false));
    
    // Acak papan dengan melakukan klik random agar puzzle selalu bisa diselesaikan
    for(let i = 0; i < 15; i++) {
        let randR = Math.floor(Math.random() * LO_GRID);
        let randC = Math.floor(Math.random() * LO_GRID);
        toggleLights(randR, randC);
    }

    drawLO(ctx);

    // Event Klik
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        // Hitung koordinat klik (support responsive scaling)
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const c = Math.floor(((e.clientX - rect.left) * scaleX) / LO_CELL);
        const r = Math.floor(((e.clientY - rect.top) * scaleY) / LO_CELL);
        
        if (r >= 0 && r < LO_GRID && c >= 0 && c < LO_GRID) {
            toggleLights(r, c);
            drawLO(ctx);
            checkWin();
        }
    };
}

/**
 * Membalik status lampu (ON/OFF) di posisi target dan sekitarnya
 */
function toggleLights(r, c) {
    const targets = [[0,0], [-1,0], [1,0], [0,-1], [0,1]];
    targets.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < LO_GRID && nc >= 0 && nc < LO_GRID) {
            lo_board[nr][nc] = !lo_board[nr][nc];
        }
    });
}

/**
 * Gambar papan ke Canvas
 */
function drawLO(ctx) {
    ctx.clearRect(0, 0, LO_GRID * LO_CELL, LO_GRID * LO_CELL);
    for (let r = 0; r < LO_GRID; r++) {
        for (let c = 0; c < LO_GRID; c++) {
            const x = c * LO_CELL;
            const y = r * LO_CELL;

            // Background lampu (ON: Kuning, OFF: Biru Gelap)
            ctx.fillStyle = lo_board[r][c] ? "#f1c40f" : "#34495e";
            ctx.strokeStyle = "#2c3e50";
            ctx.lineWidth = 2;
            
            // Gambar kotak dengan sudut sedikit membulat (manual)
            ctx.fillRect(x + 2, y + 2, LO_CELL - 4, LO_CELL - 4);
            ctx.strokeRect(x + 2, y + 2, LO_CELL - 4, LO_CELL - 4);

            // Efek kilau jika lampu menyala
            if(lo_board[r][c]) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect(x + 5, y + 5, LO_CELL - 10, (LO_CELL - 10) / 2);
            }
        }
    }
}

/**
 * Cek Kemenangan
 */
function checkWin() {
    const isAllDark = lo_board.every(row => row.every(cell => !cell));
    if (isAllDark) {
        setTimeout(() => {
            alert("✨ MANTAP! Semua lampu berhasil dipadamkan!");
            goHome();
        }, 200);
    }
}