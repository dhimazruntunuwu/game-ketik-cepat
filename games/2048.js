window.start2048Game = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // 1. Inisialisasi Board 4x4 (Array 16 elemen)
    let board = Array(16).fill(0);
    let score = 0;
    let touchStartX = 0, touchStartY = 0;

    stats.innerText = `Skor: 0 | 🔢 2048 Mode Santai`;

    // 2. Fungsi Gambar Tampilan
    function draw() {
        wrapper.innerHTML = `
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; background:#bbada0; padding:10px; width:300px; height:300px; margin:auto; border-radius:10px; touch-action:none; user-select:none;">
                ${board.map(n => {
                    let color = n === 0 ? '#cdc1b4' : (n <= 4 ? '#eee4da' : (n <= 16 ? '#f2b179' : '#f59563'));
                    let textColor = n <= 4 ? '#776e65' : '#f9f6f2';
                    return `<div style="height:65px; background:${color}; color:${textColor}; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:${n > 100 ? '1.2rem' : '1.5rem'}; border-radius:5px;">${n || ''}</div>`;
                }).join('')}
            </div>
            <p style="text-align:center; color:#64748b; margin-top:15px;">Gunakan <b>Swipe</b> atau <b>WASD/Panah</b></p>
        `;
    }

    // 3. Tambah Angka Acak (2 atau 4)
    function addNumber() {
        let empty = board.map((n, i) => n === 0 ? i : null).filter(n => n !== null);
        if (empty.length) {
            board[empty[Math.floor(Math.random() * empty.length)]] = Math.random() > 0.1 ? 2 : 4;
            draw();
        }
    }

    // 4. LOGIKA UTAMA: Geser & Gabung
    function slide(row) {
        let arr = row.filter(n => n !== 0); // Buang nol
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(n => n !== 0); // Buang nol lagi setelah gabung
        while (arr.length < 4) arr.push(0); // Isi sisanya dengan nol
        return arr;
    }

    function move(dir) {
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
        
        // Hanya tambah angka baru jika ada yang berubah
        if (JSON.stringify(oldBoard) !== JSON.stringify(board)) {
            addNumber();
            stats.innerText = `Skor: ${score} | 🔢 2048 Mode Santai`;
        }
    }

    // 5. Input Keyboard
    window.onkeydown = (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') move('left');
        if (e.key === 'ArrowRight' || e.key === 'd') move('right');
        if (e.key === 'ArrowUp' || e.key === 'w') move('up');
        if (e.key === 'ArrowDown' || e.key === 's') move('down');
    };

    // 6. Input Touch (Swipe HP)
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

    // Jalankan Game
    addNumber(); addNumber();
};