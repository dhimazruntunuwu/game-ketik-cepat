window.startMinesweeperGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    const rows = 10, cols = 10, minesCount = 15;
    let board = [], revealedCount = 0;

    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <div id="mineBoard" style="display:grid; grid-template-columns:repeat(${cols}, 30px); gap:2px; justify-content:center; background:#475569; padding:5px; border-radius:8px; margin:auto;"></div>
            <p style="margin-top:10px; color:#64748b; font-size:0.8rem;">Hati-hati! Ada ${minesCount} ranjau tersembunyi.</p>
        </div>
    `;

    const boardEl = document.getElementById('mineBoard');

    // Buat Board
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = { isMine: false, revealed: false, count: 0, el: document.createElement('div') };
            cell.el.style = "width:30px; height:30px; background:#cbd5e1; border-radius:4px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.9rem;";
            cell.el.onclick = () => revealCell(r, c);
            boardEl.appendChild(cell.el);
            board[r][c] = cell;
        }
    }

    // Sebar Ranjau
    let planted = 0;
    while (planted < minesCount) {
        let r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            planted++;
        }
    }

    // Hitung Tetangga
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

    function revealCell(r, c) {
        const cell = board[r][c];
        if (cell.revealed) return;
        cell.revealed = true;
        cell.el.style.background = "#f8fafc";
        
        if (cell.isMine) {
            cell.el.innerText = "💣";
            cell.el.style.background = "#ef4444";
            alert("BOOM! Kamu menginjak ranjau.");
            goHome();
            return;
        }

        revealedCount++;
        if (cell.count > 0) cell.el.innerText = cell.count;
        else {
            // Logika Flood Fill (Buka sekitar jika kosong)
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (board[r+i] && board[r+i][c+j]) revealCell(r+i, c+j);
                }
            }
        }

        if (revealedCount === (rows * cols) - minesCount) {
            alert("Selamat! Area Aman.");
            goHome();
        }
    }
};