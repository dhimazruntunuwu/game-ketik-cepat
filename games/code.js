function startCodeGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Stats awal tanpa timer
    stats.innerText = `Tebakan: 0 | 🔢 Mode Santai`;

    let secretCode = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
    let attempts = 0;

    wrapper.innerHTML = `
        <div id="code-game" style="text-align: center; padding: 10px; font-family: sans-serif; max-width: 400px; margin: 0 auto;">
            <p style="font-size: 1.2rem; font-weight: bold; color: #1e293b; margin-bottom: 5px;">🔐 Pecahkan Kode Rahasia</p>
            
            <div style="background: #f1f5f9; padding: 10px; border-radius: 8px; text-align: left; font-size: 0.85rem; color: #475569; margin-bottom: 15px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 5px 0; font-weight: bold; color: #2563eb;">Cara Bermain:</p>
                <ul style="margin: 0; padding-left: 18px; line-height: 1.4;">
                    <li>Tebak 4 angka kombinasi (0-9).</li>
                    <li>🟩 : Angka <b>Benar</b> & Posisi <b>Pas</b>.</li>
                    <li>🟨 : Angka <b>Benar</b> tapi Posisi <b>Salah</b>.</li>
                    <li>⬛ : Angka tidak ada dalam kode.</li>
                </ul>
            </div>

            <input type="number" id="code-input" pattern="[0-9]*" inputmode="numeric" maxlength="4" placeholder="????" 
                   style="font-size: 2rem; width: 160px; text-align: center; border-radius: 12px; border: 3px solid #2563eb; outline: none; margin: 5px 0; padding: 5px;">
            
            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 5px;">Ketik 4 angka lalu tekan <b>Enter</b></p>
            
            <div id="code-feedback" style="margin-top: 15px; font-family: 'Courier New', monospace; font-size: 1.1rem; height: 160px; overflow-y: auto; background: #ffffff; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);"></div>
        </div>
    `;

    const input = document.getElementById('code-input');
    const feedback = document.getElementById('code-feedback');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value;
            
            // Validasi input harus 4 angka
            if (val.length !== 4) {
                alert("Harus masukkan 4 angka!");
                return;
            }

            attempts++;
            let guess = val.split('').map(Number);
            let result = "";
            
            // Logika cek angka
            guess.forEach((num, i) => {
                if (num === secretCode[i]) {
                    result += "🟩"; 
                } else if (secretCode.includes(num)) {
                    result += "🟨"; 
                } else {
                    result += "⬛"; 
                }
            });

            const entry = document.createElement('div');
            entry.style.padding = "6px 0";
            entry.style.borderBottom = "1px solid #f1f5f9";
            entry.style.display = "flex";
            entry.style.justifyContent = "center";
            entry.style.gap = "15px";
            entry.innerHTML = `<span style="font-weight:bold; letter-spacing: 3px; color: #334155;">${val}</span> <span style="letter-spacing: 2px;">${result}</span>`;
            
            // Masukkan tebakan terbaru ke atas
            feedback.prepend(entry);

            // Update stats
            stats.innerText = `Tebakan: ${attempts} | 🔢 Mode Santai`;
            
            input.value = "";

            if (result === "🟩🟩🟩🟩") {
                setTimeout(() => {
                    alert(`🎉 MANTAP! Kode ${secretCode.join('')} pecah dalam ${attempts} tebakan!`);
                    goHome();
                }, 100);
            }
        }
    });
    
    input.focus();
}