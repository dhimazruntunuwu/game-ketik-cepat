/**
 * Minesweeper - 20 Progressive Levels
 * Fitur: Papan Membesar, Ranjau Makin Padat, Auto-Save & Leaderboard
 */

window.startMinesweeperGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // State Game
    let currentLevel = 1;
    const maxLevel = 20;
    let totalScore = 0;
    let board = [];
    let revealedCount = 0;
    let minesCount = 0;
    let rows = 0;
    let cols = 0;
    let isGameOver = false;

    function initLevel() {
        isGameOver = false;
        revealedCount = 0;
        
        // Logika Progresi: Papan membesar tiap level (min 6x6, max 14x14)
        rows = Math.min(6 + Math.floor(currentLevel / 3), 14);
        cols = rows;
        
        // Rasio ranjau meningkat (mulai 15% sampai 25% dari total sel)
        const mineRatio = 0.15 + (currentLevel * 0.005);
        minesCount = Math.floor(rows * cols * mineRatio);

        renderUI();
        createBoard();
    }

    function renderUI() {
        wrapper.innerHTML = `
            <div style="text-align:center; font-family: 'Segoe UI', sans-serif; user-select:none; color: #f8fafc; padding: 15px; background: #1e293b; border-radius: 20px;">
                
                <div style="background: #334155; padding: 10px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #475569; text-align: left; font-size: 0.8rem;">
                    <b style="color: #fbbf24;">📜 ATURAN MAIN:</b><br>
                    • Klik kotak untuk membuka area.<br>
                    • Angka menunjukkan jumlah ranjau di sekitarnya.<br>
                    • Jangan klik 💣 <b>Ranjau</b> atau game berakhir!<br>
                    • Buka semua kotak kosong untuk lanjut ke level berikutnya.
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: #0f172a; padding: 10px; border-radius: 10px;">
                    <div>Level: <span style="color:#fbbf24; font-weight:bold;">${currentLevel}</span>/20</div>
                    <div>Skor: <span style="color:#22c55e; font-weight:bold;">${totalScore}</span></div>
                    <div>Mines: <span style="color:#ef4444; font-weight:bold;">${minesCount}</span></div>
                </div>

                <div id="mineBoard" style="display:grid; grid-template-columns:repeat(${cols}, 30px); gap:2px; justify-content:center; background:#475569; padding:5px; border-radius:8px; margin:auto; border: 2px solid #334155;"></div>

                <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                    <button onclick="startMinesweeperGame()" style="padding:10px 20px; background:#3498db; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🔄 Reset</button>
                    <button id="btn-surrender-mine" onclick="surrenderMines()" style="padding:10px 20px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">🏳️ Menyerah</button>
                </div>

                <div id="mine-leaderboard-area" style="margin-top:20px;"></div>
            </div>
        `;
    }

    function createBoard() {
        const boardEl = document.getElementById('mineBoard');
        board = [];
        boardEl.innerHTML = "";

        for (let r = 0; r < rows; r++) {
            board[r] = [];
            for (let c = 0; c < cols; c++) {
                const cell = { isMine: false, revealed: false, count: 0, el: document.createElement('div') };
                cell.el.style = "width:30px; height:30px; background:#cbd5e1; border-radius:4px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.9rem; color:#1e293b; transition: 0.1s;";
                
                // Event Listener
                cell.el.onclick = () => revealCell(r, c);
                
                boardEl.appendChild(cell.el);
                board[r][c] = cell;
            }
        }

        // Sebar Ranjau secara acak
        let planted = 0;
        while (planted < minesCount) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * cols);
            if (!board[r][c].isMine) {
                board[r][c].isMine = true;
                planted++;
            }
        }

        // Hitung Tetangga Ranjau
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) continue;
                let count = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (board[r+i] && board[r+i][c+j] && board[r+i][c+j].isMine) count++;
                    }
                }
                board[r][c].count = count;
            }
        }
    }

    function revealCell(r, c) {
        if (isGameOver) return;
        const cell = board[r][c];
        if (cell.revealed) return;

        cell.revealed = true;
        cell.el.style.background = "#f8fafc";
        cell.el.style.cursor = "default";
        
        if (cell.isMine) {
            cell.el.innerText = "💣";
            cell.el.style.background = "#ef4444";
            gameOverEffect();
            return;
        }

        revealedCount++;
        totalScore += 5; // Poin tiap kotak terbuka
        document.getElementById('miner-score'); // Placeholder logic for UI update if needed

        if (cell.count > 0) {
            cell.el.innerText = cell.count;
            const colors = ["", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#06b6d4", "#000", "#444"];
            cell.el.style.color = colors[cell.count];
        } else {
            // Flood Fill jika kotak kosong
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (board[r+i] && board[r+i][c+j]) revealCell(r+i, c+j);
                }
            }
        }

        // Cek Menang Level
        if (revealedCount === (rows * cols) - minesCount) {
            if (currentLevel < maxLevel) {
                alert(`✨ Level ${currentLevel} Selesai! Lanjut ke Level ${currentLevel + 1}`);
                currentLevel++;
                totalScore += 100; // Bonus level
                initLevel();
            } else {
                alert("🏆 LEGEND! Kamu menyelesaikan semua level!");
                window.surrenderMines();
            }
        }
    }

    function gameOverEffect() {
        isGameOver = true;
        // Buka semua ranjau
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) {
                    board[r][c].el.innerText = "💣";
                    board[r][c].el.style.background = "#ef4444";
                }
            }
        }
        setTimeout(() => {
            alert("BOOM! Game Over.");
            window.surrenderMines();
        }, 500);
    }

    window.surrenderMines = function() {
        isGameOver = true;
        
        // Matikan tombol
        const btnS = document.getElementById('btn-surrender-mine');
        if(btnS) btnS.disabled = true;

        // 1. Simpan Skor ke Spreadsheet
        if (typeof saveToSpreadsheet === "function") {
            saveToSpreadsheet('minesweeper', totalScore);
        }

        // 2. Tampilkan Leaderboard
        if (typeof showLeaderboard === "function") {
            showLeaderboard('minesweeper');
        }
    };

    initLevel();
};