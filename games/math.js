function startMathGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan awal dengan timer dari main.js
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div id="math-box" style="text-align: center; padding: 20px;">
            <p style="font-size: 1.2rem; color: #64748b;">Ayo Tambah Angka Ini:</p>
            <h2 id="question" style="font-size: 4.5rem; color: #2563eb; margin: 10px 0;">1 + 1</h2>
            <input type="number" id="math-ans" autocomplete="off"
                   style="font-size: 2.5rem; width: 160px; text-align: center; border: 4px solid #cbd5e1; border-radius: 20px; outline: none; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <p style="margin-top: 15px; color: #94a3b8;">Ketik jawabanmu!</p>
        </div>
    `;

    const qEl = document.getElementById('question');
    const ansInp = document.getElementById('math-ans');
    let score = 0;
    let currentAns = 0;

    function nextQ() {
        // Angka 1-20 agar pas untuk anak kecil belajar berhitung
        let a = Math.floor(Math.random() * 20) + 1;
        let b = Math.floor(Math.random() * 20) + 1;
        currentAns = a + b;
        
        qEl.innerText = `${a} + ${b}`;
        ansInp.value = '';
        ansInp.focus();
    }

    ansInp.addEventListener('input', () => {
        if(parseInt(ansInp.value) === currentAns) {
            score++;
            
            // UPDATE STATS: Gabungkan skor dengan timer global
            stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
            
            // Efek border hijau jika benar
            ansInp.style.borderColor = "#22c55e";
            
            // Jeda sedikit agar tidak terlalu kaget saat soal berganti
            setTimeout(() => {
                ansInp.style.borderColor = "#cbd5e1";
                nextQ();
            }, 150);
        }
    });

    nextQ();
}