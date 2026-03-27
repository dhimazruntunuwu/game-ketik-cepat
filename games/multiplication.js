function startMultiplicationGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    let score = 0;
    let currentAns = 0;

    // Tampilkan awal game dengan timer global agar sinkron
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    function nextQ() {
        // Angka 1-5 agar cocok untuk anak kecil
        let a = Math.floor(Math.random() * 5) + 1; 
        let b = Math.floor(Math.random() * 5) + 1;
        currentAns = a * b;
        
        wrapper.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p style="font-size: 1.2rem; color: #64748b;">Ayo Kali-Kalian:</p>
                <h2 style="font-size:4.5rem; color:#7c3aed; margin: 10px 0;">${a} x ${b} = ?</h2>
                <input type="number" id="math-ans" autofocus autocomplete="off"
                       style="width:160px; font-size:2.5rem; text-align:center; border:4px solid #ddd6fe; border-radius:20px; outline:none; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <p style="margin-top: 15px; color: #94a3b8;">Ketik jawabanmu!</p>
            </div>
        `;
        
        const input = document.getElementById('math-ans');
        
        input.addEventListener('input', () => {
            if(parseInt(input.value) === currentAns) {
                score++;
                
                // UPDATE STATS: Gabungkan skor dengan timeLeft dari main.js
                stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
                
                // Efek visual border ungu sukses
                input.style.borderColor = "#7c3aed";
                input.style.backgroundColor = "#f5f3ff";
                
                // Jeda singkat agar anak bisa melihat jawabannya benar
                setTimeout(nextQ, 150);
            }
        });

        // Fokus otomatis sangat penting untuk kenyamanan di Xiaomi 12T
        input.focus();
    }
    
    nextQ();
}