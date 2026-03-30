window.startTebakKoinGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `
        <div style="text-align:center; font-family:sans-serif; padding:20px; background:#f0f9ff; border-radius:20px;">
            <h2 style="color:#0369a1;">🪙 Tebak Sisi Koin</h2>
            
            <div id="coin-container" style="width:150px; height:150px; margin:30px auto; perspective:1000px;">
                <div id="coin" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; transition: transform 2s cubic-bezier(0.3, 1, 0.3, 1);">
                    <div style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:#fbbf24; border:8px solid #d97706; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:3rem; color:#d97706; font-weight:bold; box-shadow: inset 0 0 20px rgba(0,0,0,0.1);">1</div>
                    <div style="position:absolute; width:100%; height:100%; backface-visibility:hidden; background:#fbbf24; border:8px solid #d97706; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:3rem; color:#d97706; font-weight:bold; transform:rotateY(180deg); box-shadow: inset 0 0 20px rgba(0,0,0,0.1);">👑</div>
                </div>
            </div>

            <div id="controls">
                <p style="font-weight:bold; color:#0c4a6e;">Pilih tebakan Anda:</p>
                <div style="display:flex; gap:15px; justify-content:center; margin-top:15px;">
                    <button onclick="playCoin('ANGKA')" style="padding:12px 25px; background:#0ea5e9; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px #0284c7;">ANGKA (1)</button>
                    <button onclick="playCoin('GAMBAR')" style="padding:12px 25px; background:#0ea5e9; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer; box-shadow: 0 4px #0284c7;">GAMBAR (👑)</button>
                </div>
            </div>

            <div id="result-area" style="margin-top:25px; min-height:50px;">
                <p id="coin-status" style="font-size:1.2rem; font-weight:bold; color:#0369a1;"></p>
            </div>
        </div>
    `;

    let winCount = 0;
    let totalPlay = 0;
    let isSpinning = false;

    window.playCoin = function(guess) {
        if (isSpinning) return;
        isSpinning = true;

        const coin = document.getElementById('coin');
        const status = document.getElementById('coin-status');
        
        status.innerText = "Koin sedang diputar...";
        totalPlay++;

        // Tentukan hasil secara acak (0 = Angka, 1 = Gambar)
        const result = Math.random() < 0.5 ? 'ANGKA' : 'GAMBAR';
        
        // Logika Putaran: Tambahkan kelipatan 360 agar selalu berputar banyak
        const extraSpins = (Math.floor(Math.random() * 5) + 5) * 360; 
        const finalRotation = result === 'ANGKA' ? extraSpins : extraSpins + 180;

        coin.style.transform = `rotateY(${finalRotation}deg)`;

        setTimeout(() => {
            isSpinning = false;
            if (guess === result) {
                winCount++;
                status.innerHTML = `<span style="color:#16a34a;">BENAR! 🎉</span><br>Hasilnya adalah ${result}`;
            } else {
                status.innerHTML = `<span style="color:#dc2626;">SALAH! 😅</span><br>Hasilnya adalah ${result}`;
            }
            
            stats.innerText = `Menang: ${winCount} / Total: ${totalPlay} | 🪙 Tebak Koin`;
        }, 2100); // Sedikit lebih lama dari durasi transisi CSS
    };
};