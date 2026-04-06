window.startJigsawGame = function () {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');

    // 1. Setup UI (Referensi di Atas, Canvas Tengah, Tombol Bawah)
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none; font-family:sans-serif; padding:10px; max-width: 800px; margin: auto;">
            
            <div style="margin-bottom: 15px;">
                <p style="margin: 0 0 8px 0; color: #db2777; font-weight: bold; font-size: 0.85rem;">CONTOH JADI:</p>
                <div style="width: 120px; height: 70px; margin: auto; border: 3px solid #fecdd3; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <img src="images/sanrio.png" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;">
                </div>
            </div>

            <canvas id="jigsawCanvas" width="760" height="420" 
                style="background:#fff1f2; border:4px solid #fecdd3; border-radius:16px; display:block; margin:auto; touch-action:none; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 100%; height: auto;">
            </canvas>
            
            <div style="margin-top:20px; display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; max-width:180px; margin:auto;">
                <div></div>
                <button id="jigUp" style="padding:15px; background:#f472b6; color:white; border:none; border-radius:15px; font-size:1.5rem; cursor:pointer; box-shadow: 0 4px #db2777;">▲</button>
                <div></div>
                <button id="jigLeft" style="padding:15px; background:#f472b6; color:white; border:none; border-radius:15px; font-size:1.2rem; cursor:pointer; box-shadow: 0 4px #db2777;">◀</button>
                <button id="jigDown" style="padding:15px; background:#f472b6; color:white; border:none; border-radius:15px; font-size:1.5rem; cursor:pointer; box-shadow: 0 4px #db2777;">▼</button>
                <button id="jigRight" style="padding:15px; background:#f472b6; color:white; border:none; border-radius:15px; font-size:1.2rem; cursor:pointer; box-shadow: 0 4px #db2777;">▶</button>
            </div>

            <p style="margin-top:15px; color:#db2777; font-size:0.9rem; font-weight:bold;">Gerakkan kotak kosong menggunakan tombol!</p>
        </div>
    `;

    const cvs = document.getElementById('jigsawCanvas');
    const ctx = cvs.getContext('2d');

    // 2. Konfigurasi 4x4
    const COLS = 4;
    const ROWS = 4;
    const pieceW = cvs.width / COLS;
    const pieceH = cvs.height / ROWS;

    let pieces = [];
    let emptyIdx = (COLS * ROWS) - 1;
    let moves = 0;
    let isWin = false;

    // 3. Load Gambar
    const img = new Image();
    img.src = 'images/sanrio.png';

    img.onload = () => {
        initPuzzle();
        draw();
    };

    img.onerror = () => {
        alert("Gambar 'images/sanrio.png' tidak ditemukan!");
        if (typeof goHome === 'function') goHome();
    };

    // 4. Inisialisasi
    function initPuzzle() {
        pieces = [];
        for (let i = 0; i < COLS * ROWS; i++) pieces.push(i);

        // Acak puzzle
        for (let i = 0; i < 200; i++) {
            const dirs = ['up', 'down', 'left', 'right'];
            moveEmptySlot(dirs[Math.floor(Math.random() * 4)], true);
        }
        moves = 0;
    }

    // 5. Logika Pergerakan Slot Kosong
    function moveEmptySlot(dir, isShuffle = false) {
        if (isWin && !isShuffle) return;
        let targetIdx = -1;

        if (dir === 'up' && emptyIdx >= COLS) targetIdx = emptyIdx - COLS;
        else if (dir === 'down' && emptyIdx < COLS * (ROWS - 1)) targetIdx = emptyIdx + COLS;
        else if (dir === 'left' && emptyIdx % COLS !== 0) targetIdx = emptyIdx - 1;
        else if (dir === 'right' && (emptyIdx + 1) % COLS !== 0) targetIdx = emptyIdx + 1;

        if (targetIdx !== -1) {
            [pieces[emptyIdx], pieces[targetIdx]] = [pieces[targetIdx], pieces[emptyIdx]];
            emptyIdx = targetIdx;

            if (!isShuffle) {
                moves++;
                stats.innerText = `Gerakan: ${moves} | 🧩 Jigsaw 4x4`;
                draw();
                checkWin();
            }
        }
    }

    // 6. Deteksi Menang
    function checkWin() {
        if (pieces.every((p, i) => p === i)) {
            isWin = true;
            draw();
            const finalMoves = moves;

            setTimeout(() => {
                alert(`💞 MANTAAP! 💞\nSelesai dalam ${finalMoves} gerakan.`);
                if (typeof saveToSpreadsheet === 'function') saveToSpreadsheet('jigsaw', finalMoves);
                if (typeof showLeaderboard === 'function') showLeaderboard('jigsaw');
            }, 300);
        }
    }

    // 7. Render
    function draw() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        for (let i = 0; i < pieces.length; i++) {
            let pIdx = pieces[i];
            if (pIdx === (COLS * ROWS) - 1 && !isWin) continue;

            let sw = img.width / COLS, sh = img.height / ROWS;
            let sx = (pIdx % COLS) * sw, sy = Math.floor(pIdx / COLS) * sh;
            let dx = (i % COLS) * pieceW, dy = Math.floor(i / COLS) * pieceH;

            ctx.drawImage(img, sx, sy, sw, sh, dx, dy, pieceW, pieceH);
            ctx.strokeStyle = "#fecdd3";
            ctx.lineWidth = 2;
            ctx.strokeRect(dx, dy, pieceW, pieceH);
        }
    }

    // 8. Event Listener Tombol
    document.getElementById('jigUp').onclick = () => moveEmptySlot('up');
    document.getElementById('jigDown').onclick = () => moveEmptySlot('down');
    document.getElementById('jigLeft').onclick = () => moveEmptySlot('left');
    document.getElementById('jigRight').onclick = () => moveEmptySlot('right');

    window.onkeydown = (e) => {
        if (e.key === "ArrowUp") moveEmptySlot('up');
        if (e.key === "ArrowDown") moveEmptySlot('down');
        if (e.key === "ArrowLeft") moveEmptySlot('left');
        if (e.key === "ArrowRight") moveEmptySlot('right');
    };
};