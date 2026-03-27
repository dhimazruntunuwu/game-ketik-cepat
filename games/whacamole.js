function startWhacGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan awal
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div style="text-align:center;">
            <p style="margin-bottom:10px; color:#64748b;">Pukul Monster yang muncul! 👺</p>
            <div id="mole-grid" style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; max-width:350px; margin:0 auto;"></div>
        </div>
    `;
    
    const grid = document.getElementById('mole-grid');
    let score = 0;
    let isGameOver = false;

    // Buat 9 lubang
    for(let i=0; i<9; i++) {
        const hole = document.createElement('div');
        // Style lubang (warna tanah coklat tua)
        hole.style = `
            height:100px; background:#451a03; border-radius:50%; 
            display:flex; align-items:center; justify-content:center; 
            font-size:3rem; cursor:pointer; border: 4px solid #78350f;
            box-shadow: inset 0 8px 10px rgba(0,0,0,0.5);
            user-select: none; transition: 0.1s;
        `;
        
        hole.onclick = function() {
            if(isGameOver) return;

            if(this.innerText === '👺') {
                score++;
                this.innerText = '💥'; // Efek dipukul
                this.style.background = "#92400e";
                
                // Update skor dengan timer global
                stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
                
                setTimeout(() => {
                    this.innerText = '';
                    this.style.background = "#451a03";
                }, 200);
            }
        };
        grid.appendChild(hole);
    }

    // Interval kemunculan monster
    const moleTimer = setInterval(() => {
        // Cek apakah game sudah dihentikan oleh main.js (kembali ke home)
        // atau jika waktu habis (biasanya goHome() akan reload page, tapi ini untuk jaga-jaga)
        if(document.getElementById('mole-grid') === null || timeLeft <= 0) {
            clearInterval(moleTimer);
            isGameOver = true;
            return;
        }

        const holes = grid.querySelectorAll('div');
        holes.forEach(h => {
            h.innerText = '';
            h.style.background = "#451a03";
        });

        const randomHole = holes[Math.floor(Math.random() * 9)];
        randomHole.innerText = '👺';
        randomHole.style.background = "#78350f";
    }, 800);
}