function startCodeGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Stats awal tanpa timer
    stats.innerText = `Tebakan: 0 | 🔢 Mode Santai`;

    let secretCode = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
    let attempts = 0;

    wrapper.innerHTML = `
        <div id="code-game" style="text-align: center; padding: 10px;">
            <p style="font-size: 1.2rem; font-weight: bold; color: #1e293b;">Tebak 4 Angka Rahasia</p>
            <input type="number" id="code-input" pattern="[0-9]*" inputmode="numeric" maxlength="4" placeholder="????" 
                   style="font-size: 2rem; width: 160px; text-align: center; border-radius: 12px; border: 3px solid #2563eb; outline: none; margin: 10px 0; padding: 5px;">
            <p style="font-size: 0.9rem; color: #64748b;">Ketik 4 angka lalu tekan Enter</p>
            <div id="code-feedback" style="margin-top: 15px; font-family: 'Courier New', monospace; font-size: 1.1rem; height: 180px; overflow-y: auto; background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;"></div>
        </div>
    `;

    const input = document.getElementById('code-input');
    const feedback = document.getElementById('code-feedback');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value;
            if (val.length !== 4) return;

            attempts++;
            let guess = val.split('').map(Number);
            let result = "";
            
            // Logika cek angka
            guess.forEach((num, i) => {
                if (num === secretCode[i]) result += "🟩"; 
                else if (secretCode.includes(num)) result += "🟨"; 
                else result += "⬛"; 
            });

            const entry = document.createElement('div');
            entry.style.padding = "4px 0";
            entry.style.borderBottom = "1px solid #f1f5f9";
            entry.innerHTML = `<span style="font-weight:bold; letter-spacing: 2px;">${val}</span> : ${result}`;
            feedback.prepend(entry);

            // Update stats tanpa timer
            stats.innerText = `Tebakan: ${attempts} | 🔢 Mode Santai`;
            
            input.value = "";

            if (result === "🟩🟩🟩🟩") {
                setTimeout(() => {
                    alert(`MANTAP! Kode ${secretCode.join('')} pecah dalam ${attempts} tebakan!`);
                    goHome();
                }, 100);
            }
        }
    });
    
    input.focus();
}