function startSubtractionGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    let score = 0;
    let currentAns = 0;

    // Tampilkan awal game dengan timer global agar tidak kosong
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    function nextQ() {
        let a = Math.floor(Math.random() * 10) + 5; // Angka besar (5-15)
        let b = Math.floor(Math.random() * a);     // Angka kecil agar hasil tidak negatif
        currentAns = a - b;
        
        wrapper.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p style="font-size: 1.2rem; color: #64748b;">Ayo Kurang-Kurangan:</p>
                <h2 style="font-size:4.5rem; color:#e11d48; margin: 10px 0;">${a} - ${b} = ?</h2>
                <input type="number" id="math-ans" autofocus autocomplete="off"
                       style="width:160px; font-size:2.5rem; text-align:center; border:4px solid #fda4af; border-radius:20px; outline:none; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <p style="margin-top: 15px; color: #94a3b8;">Ketik jawabanmu!</p>
            </div>
        `;
        
        const input = document.getElementById('math-ans');
        
        input.addEventListener('input', () => {
            if(parseInt(input.value) === currentAns) {
                score++;
                
                // UPDATE STATS: Gabungkan skor dengan timeLeft dari main.js
                stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
                
                // Efek visual sukses (border berubah warna)
                input.style.borderColor = "#22c55e";
                input.style.backgroundColor = "#fff1f2";
                
                // Jeda 150ms agar anak bisa melihat jawaban benar sebelum soal berganti
                setTimeout(nextQ, 150);
            }
        });

        // Paksa focus agar keyboard muncul di Xiaomi 12T
        input.focus();
    }
    
    nextQ();
}