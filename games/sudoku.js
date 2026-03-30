window.startSudokuGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Board 4x4 (0 = kosong)
    let board = [
        [1, 0, 3, 0],
        [0, 0, 0, 2],
        [4, 0, 0, 0],
        [0, 2, 0, 1]
    ];

    wrapper.innerHTML = `
        <div style="text-align:center; font-family:sans-serif; padding:10px;">
            <h2 style="color:#6366f1;">🔢 Sudoku Mini (4x4)</h2>
            <div id="sudoku-grid" style="display:grid; grid-template-columns:repeat(4, 50px); gap:5px; justify-content:center; margin:20px auto; background:#6366f1; padding:5px; width:fit-content; border-radius:8px;">
                ${board.flat().map((n, i) => `
                    <input type="number" min="1" max="4" value="${n !== 0 ? n : ''}" 
                        ${n !== 0 ? 'disabled' : ''} 
                        data-idx="${i}"
                        style="width:50px; height:50px; text-align:center; font-size:1.5rem; font-weight:bold; border:none; border-radius:4px; ${n !== 0 ? 'background:#e0e7ff; color:#1e1b4b;' : 'background:white; color:#6366f1;'}">
                `).join('')}
            </div>
            <button id="solve-sudoku" style="padding:10px 20px; background:#6366f1; color:white; border:none; border-radius:8px; cursor:pointer;">CEK HASIL</button>
        </div>
    `;

    document.getElementById('solve-sudoku').onclick = function() {
        const inputs = document.querySelectorAll('#sudoku-grid input');
        let userBoard = [];
        let tempRow = [];
        
        inputs.forEach((input, i) => {
            tempRow.push(parseInt(input.value) || 0);
            if((i + 1) % 4 === 0) { userBoard.push(tempRow); tempRow = []; }
        });

        // Logika validasi sederhana (Cek apakah ada angka 0)
        if(userBoard.flat().includes(0)) {
            alert("Isi semua kotak!");
            return;
        }
        
        // Catatan: Untuk versi advance, tambahkan validasi baris/kolom di sini
        alert("Pekerjaan bagus! Logika Sudoku berhasil dikunci.");
        goHome();
    };
};