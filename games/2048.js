window.start2048Game = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let board = Array(16).fill(0);
    let score = 0;
    let touchStartX = 0, touchStartY = 0;
    let isGameOver = false; // Flag untuk status game

    stats.innerText = `Skor: 0 | 🔢 2048 Mode Santai`;

    function draw() {
        wrapper.innerHTML = `
            <div id="game-2048-container" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; background:#bbada0; padding:10px; width:300px; height:300px; margin:auto; border-radius:10px; touch-action:none; user-select:none;">
                ${board.map(n => {
                    let color = n === 0 ? '#cdc1b4' : (n <= 4 ? '#eee4da' : (n <= 16 ? '#f2b179' : '#f59563'));
                    let textColor = n <= 4 ? '#776e65' : '#f9f6f2';
                    return `<div style="height:65px; background:${color}; color:${textColor}; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:${n > 100 ? '1.2rem' : '1.5rem'}; border-radius:5px;">${n || ''}</div>`;
                }).join('')}
            </div>
            <p style="text-align:center; color:#64748b; margin-top:15px;">Gunakan <b>Swipe</b> atau <b>WASD/Panah</b></p>
        `;
    }

    function addNumber() {
        let empty = board.map((n, i) => n === 0 ? i : null).filter(n => n !== null);
        if (empty.length) {
            board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() > 0.1 ? 2 : 4;
            draw();
            checkGameOver(); // Cek setiap kali angka baru muncul
        }
    }

    // --- TAMBAHAN: FUNGSI CEK GAME OVER ---
    function checkGameOver() {
        // Cek jika masih ada kotak kosong
        if (board.includes(0)) return;

        // Cek jika masih ada angka bertetangga yang sama (Horizontal & Vertical)
        for (let i = 0; i < 16; i++) {
            // Cek Kanan
            if (i % 4 !== 3 && board[i] === board[i + 1]) return;
            // Cek Bawah
            if (i < 12 && board[i] === board[i + 4]) return;
        }

        // Jika sampai sini, berarti tidak ada gerakan lagi
        isGameOver = true;
        
        // 1. Kirim ke Spreadsheet
        saveToSpreadsheet('2048', score); 

        // 2. Beritahu user
        alert(`Game Over! Skor Akhir: ${score}`);

        // 3. Tampilkan Leaderboard
        showLeaderboard('2048');
    }

    function slide(row) {
        let arr = row.filter(n => n !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(n => n !== 0);
        while (arr.length < 4) arr.push(0);
        return arr;
    }

    function move(dir) {
        if (isGameOver) return; // Stop jika game sudah selesai
        
        let oldBoard = [...board];
        for (let i = 0; i < 4; i++) {
            let row = [];
            if (dir === 'left' || dir === 'right') {
                row = [board[i*4], board[i*4+1], board[i*4+2], board[i*4+3]];
                if (dir === 'right') row.reverse();
                row = slide(row);
                if (dir === 'right') row.reverse();
                [board[i*4], board[i*4+1], board[i*4+2], board[i*4+3]] = row;
            } else {
                row = [board[i], board[i+4], board[i+8], board[i+12]];
                if (dir === 'down') row.reverse();
                row = slide(row);
                if (dir === 'down') row.reverse();
                [board[i], board[i+4], board[i+8], board[i+12]] = row;
            }
        }
        
        if (JSON.stringify(oldBoard) !== JSON.stringify(board)) {
            addNumber();
            stats.innerText = `Skor: ${score} | 🔢 2048 Mode Santai`;
        }
    }

    window.onkeydown = (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 's', 'd', 'w'].includes(e.key)) {
            e.preventDefault(); // Mencegah layar scroll saat main
            if (e.key === 'ArrowLeft' || e.key === 'a') move('left');
            if (e.key === 'ArrowRight' || e.key === 'd') move('right');
            if (e.key === 'ArrowUp' || e.key === 'w') move('up');
            if (e.key === 'ArrowDown' || e.key === 's') move('down');
        }
    };

    wrapper.ontouchstart = (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    };

    wrapper.ontouchend = (e) => {
        let diffX = e.changedTouches[0].clientX - touchStartX;
        let diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 30) move(diffX > 0 ? 'right' : 'left');
        } else {
            if (Math.abs(diffY) > 30) move(diffY > 0 ? 'down' : 'up');
        }
    };

    addNumber(); addNumber();
};