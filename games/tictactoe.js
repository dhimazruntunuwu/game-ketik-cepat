function startTictactoeGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan awal
    stats.innerText = `Giliran: X | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div style="text-align:center; padding:10px;">
            <p id="ttt-status" style="margin-bottom:15px; font-size:1.2rem; color:#64748b;">Pemain X, silakan klik kotak!</p>
            <div id="ttt-grid" style="display:grid; grid-template-columns:repeat(3,100px); gap:8px; justify-content:center; margin:0 auto;"></div>
            <button onclick="startTictactoeGame()" style="margin-top:20px; padding:10px 20px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer;">Reset Papan</button>
        </div>
    `;
    
    const grid = document.getElementById('ttt-grid');
    const statusText = document.getElementById('ttt-status');
    let board = Array(9).fill(null);
    let xIsNext = true;
    let isGameOver = false;

    for(let i=0; i<9; i++) {
        const cell = document.createElement('div');
        // Styling kotak agar lebih modern dan pas di Xiaomi 12T
        cell.style = `
            width:100px; height:100px; background:#f8fafc; 
            border:3px solid #cbd5e1; border-radius:12px; 
            display:flex; align-items:center; justify-content:center; 
            font-size:3rem; font-weight:bold; cursor:pointer; 
            transition: 0.2s;
        `;
        
        cell.onclick = () => {
            if(board[i] || isGameOver) return;
            
            const currentPlayer = xIsNext ? 'X' : 'O';
            board[i] = currentPlayer;
            
            cell.innerText = currentPlayer;
            cell.style.color = xIsNext ? '#2563eb' : '#ef4444'; // X Biru, O Merah
            cell.style.borderColor = xIsNext ? '#93c5fd' : '#fca5a5';
            
            const winner = calculateWinner(board);
            const isDraw = !winner && board.every(square => square !== null);

            if(winner) {
                isGameOver = true;
                stats.innerText = `Pemenang: ${winner} | ⏳ ${timeLeft}s`;
                statusText.innerText = `Selamat! ${winner} Menang! 🎉`;
                setTimeout(() => { alert("Pemenang: " + winner); goHome(); }, 500);
            } else if(isDraw) {
                isGameOver = true;
                stats.innerText = `Seri! | ⏳ ${timeLeft}s`;
                statusText.innerText = "Wah, Hasilnya Seri! 🤝";
                setTimeout(() => { alert("Permainan Seri!"); goHome(); }, 500);
            } else {
                xIsNext = !xIsNext;
                const nextPlayer = xIsNext ? 'X' : 'O';
                stats.innerText = `Giliran: ${nextPlayer} | ⏳ ${timeLeft}s`;
                statusText.innerText = `Sekarang giliran Pemain ${nextPlayer}`;
            }
        };
        grid.appendChild(cell);
    }

    function calculateWinner(squares) {
        const lines = [
            [0,1,2], [3,4,5], [6,7,8], // Horizontal
            [0,3,6], [1,4,7], [2,5,8], // Vertikal
            [0,4,8], [2,4,6]           // Diagonal
        ];
        for(let l of lines) {
            const [a,b,c] = l;
            if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
}