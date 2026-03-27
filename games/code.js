function startCodeGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan stats awal dengan timer global
    stats.innerText = `Tebakan: 0 | ⏳ ${timeLeft}s`;

    let secretCode = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
    let attempts = 0;

    wrapper.innerHTML = `
        <div id="code-game" style="text-align: center; padding: 10px;">
            <p style="font-size: 1.2rem;">Tebak 4 angka rahasia (0-9)</p>
            <input type="text" id="code-input" maxlength="4" placeholder="1234" autocomplete="off"
                   style="font-size: 2rem; width: 160px; text-align: center; border-radius: 12px; border: 3px solid #2563eb; outline: none; margin: 10px 0;">
            <p style="font-size: 0.9rem; color: #64748b;">Tekan Enter untuk cek jawaban</p>
            <div id="code-feedback" style="margin-top: 15px; font-family: 'Courier New', monospace; font-size: 1.1rem; max-height: 200px; overflow-y: auto; background: #f8fafc; padding: 10px; border-radius: 8px;"></div>
        </div>
    `;

    const input = document.getElementById('code-input');
    const feedback = document.getElementById('code-feedback');

    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && input.value.length === 4) {
            attempts++;
            let guess = input.value.split('').map(Number);
            let result = "";
            
            guess.forEach((num, i) => {
                if (num === secretCode[i]) result += "🟩"; // Benar posisi
                else if (secretCode.includes(num)) result += "🟨"; // Benar angka, salah posisi
                else result += "⬛"; // Salah total
            });

            // Tambahkan baris feedback baru ke atas (scrollable)
            const entry = document.createElement('div');
            entry.innerHTML = `<span style="font-weight:bold">${input.value}</span> : ${result}`;
            feedback.prepend(entry);

            // UPDATE STATS: Gabungkan Tebakan dengan Timer Global
            stats.innerText = `Tebakan: ${attempts} | ⏳ ${timeLeft}s`;
            
            input.value = "";

            if (result === "🟩🟩🟩🟩") {
                // Hentikan timer global (opsional, goHome sudah melakukannya)
                alert(`MANTAP! Kode ${secretCode.join('')} pecah dalam ${attempts} tebakan!`);
                goHome();
            }
        }
    });
    
    input.focus();
}