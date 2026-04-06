/**
 * Code Breaker - Dhimaz Game Hub (Dark Mode)
 */

window.startCodeGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let secretCode = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
    let attempts = 0;
    let gameActive = true;

    stats.innerText = `Tebakan: 0 | 🔢 Mode Santai`;

    // Ganti background ke #0f172a (Dark Slate)
    wrapper.innerHTML = `
        <div id="code-game" style="text-align: center; padding: 15px; font-family: 'Segoe UI', sans-serif; max-width: 400px; margin: 0 auto; background: #0f172a; border-radius: 20px; color: #f8fafc; border: 1px solid #1e293b;">
            <p style="font-size: 1.2rem; font-weight: bold; color: #38bdf8; margin-bottom: 10px;">🔐 Code Breaker</p>
            
            <div style="background: #1e293b; padding: 12px; border-radius: 12px; text-align: left; font-size: 0.8rem; color: #94a3b8; margin-bottom: 15px; border: 1px solid #334155; line-height: 1.5;">
                <b style="color: #38bdf8;">Petunjuk:</b><br>
                🟩 Angka & Posisi Benar<br>
                🟨 Angka Benar, Posisi Salah<br>
                ⬛ Tidak ada dalam kode
            </div>

            <input type="number" id="code-input" pattern="[0-9]*" inputmode="numeric" maxlength="4" placeholder="????" 
                   style="font-size: 2.2rem; width: 180px; text-align: center; border-radius: 15px; border: 3px solid #38bdf8; outline: none; margin: 5px 0; padding: 10px; letter-spacing: 5px; color: #f8fafc; background: #1e293b; transition: 0.3s;">
            
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 8px;">Ketik 4 angka lalu tekan <b>Enter</b></p>
            
            <div id="code-feedback" style="margin-top: 15px; font-family: 'Courier New', monospace; font-size: 1.1rem; max-height: 180px; overflow-y: auto; background: #020617; padding: 10px; border-radius: 12px; border: 1px solid #1e293b; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); display: flex; flex-direction: column;">
                <div style="color: #475569; font-style: italic; font-size: 0.9rem; padding: 20px;">Menunggu tebakan...</div>
            </div>

            <div style="margin-top: 15px;">
                <button id="btn-surrender" style="background: none; border: none; color: #64748b; font-size: 0.8rem; text-decoration: underline; cursor: pointer;">🏳️ Menyerah</button>
            </div>
        </div>
    `;

    const input = document.getElementById('code-input');
    const feedback = document.getElementById('code-feedback');
    const btnSurrender = document.getElementById('btn-surrender');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && gameActive) {
            const val = input.value;
            if (val.length !== 4) return alert("Masukkan 4 angka!");

            attempts++;
            if(attempts === 1) feedback.innerHTML = "";

            let guessArr = val.split('').map(Number);
            let secretArr = [...secretCode];
            let result = ["⬛", "⬛", "⬛", "⬛"];
            
            // 1. Cek Green
            guessArr.forEach((num, i) => {
                if (num === secretArr[i]) {
                    result[i] = "🟩";
                    secretArr[i] = null;
                    guessArr[i] = -1;
                }
            });

            // 2. Cek Yellow
            guessArr.forEach((num, i) => {
                if (num !== -1 && secretArr.includes(num)) {
                    result[i] = "🟨";
                    secretArr[secretArr.indexOf(num)] = null;
                }
            });

            const entry = document.createElement('div');
            entry.style.cssText = "padding: 8px 0; border-bottom: 1px solid #1e293b; display: flex; justify-content: center; gap: 20px; color: #cbd5e1;";
            entry.innerHTML = `<span style="font-weight:bold; letter-spacing: 4px;">${val}</span> <span style="letter-spacing: 2px;">${result.join('')}</span>`;
            
            feedback.prepend(entry);
            stats.innerText = `Tebakan: ${attempts} | 🔢 Mode Santai`;
            input.value = "";

            if (result.join('') === "🟩🟩🟩🟩") {
                gameActive = false;
                input.disabled = true;
                input.style.borderColor = "#22c55e";
                let score = Math.max(100, 1000 - (attempts * 20));

                setTimeout(() => {
                    alert(`🎉 KODE TERPECAHKAN!\nSkor: ${score}`);
                    if (window.saveToSpreadsheet) saveToSpreadsheet('code_breaker', score);
                    if (window.showLeaderboard) showLeaderboard('code_breaker');
                }, 300);
            }
        }
    });

    btnSurrender.onclick = () => {
        if(confirm("Menyerah?")) {
            alert("Kodenya adalah: " + secretCode.join(''));
            if (window.showLeaderboard) showLeaderboard('code_breaker');
        }
    };
    
    input.focus();
}