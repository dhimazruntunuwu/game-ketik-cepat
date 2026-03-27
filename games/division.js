function startDivisionGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    let score = 0;
    let currentAns = 0;

    // Tampilkan awal game dengan timer global
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    function nextQ() {
        let b = Math.floor(Math.random() * 4) + 1; // Pembagi 1-5
        let ans = Math.floor(Math.random() * 5) + 1; // Hasil bagi 1-5
        let a = b * ans; // Angka yang dibagi (selalu bulat)
        currentAns = ans;
        
        wrapper.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p style="font-size: 1.2rem; color: #64748b;">Ayo Bagi Angka Ini:</p>
                <h2 style="font-size:4.5rem; color:#0891b2; margin: 10px 0;">${a} : ${b} = ?</h2>
                <input type="number" id="math-ans" autofocus autocomplete="off"
                       style="width:160px; font-size:2.5rem; text-align:center; border:4px solid #a5f3fc; border-radius:20px; outline:none; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <p style="margin-top: 15px; color: #94a3b8;">Ketik jawabanmu!</p>
            </div>
        `;
        
        const input = document.getElementById('math-ans');
        
        input.addEventListener('input', () => {
            if(parseInt(input.value) === currentAns) {
                score++;
                
                // UPDATE STATS: Gabungkan skor dengan timeLeft dari main.js
                stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
                
                // Efek visual sukses
                input.style.borderColor = "#22c55e"; 
                setTimeout(nextQ, 150); // Beri jeda sangat singkat agar anak melihat jawaban benar
            }
        });

        // Pastikan input langsung aktif (penting untuk UX Android)
        input.focus();
    }
    
    nextQ();
}