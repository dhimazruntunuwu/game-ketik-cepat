window.startSimonGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308']; // Merah, Biru, Hijau, Kuning
    let sequence = [], userSequence = [], level = 0;

    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <div id="simonPad" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; max-width:250px; margin:auto;">
                ${colors.map((c, i) => `<div id="pad-${i}" onclick="checkSimon(${i})" style="height:110px; background:${c}; border-radius:15px; opacity:0.6; cursor:pointer; transition:0.2s;"></div>`).join('')}
            </div>
            <p id="simonStatus" style="margin-top:20px; font-weight:bold; color:#1e293b;">Perhatikan Urutannya!</p>
        </div>
    `;

    function nextRound() {
        level++;
        userSequence = [];
        sequence.push(Math.floor(Math.random() * 4));
        stats.innerText = `Level: ${level} | 🧠 Simon Says`;
        playSequence();
    }

    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            flashPad(sequence[i]);
            i++;
            if (i >= sequence.length) clearInterval(interval);
        }, 800);
    }

    function flashPad(idx) {
        const el = document.getElementById(`pad-${idx}`);
        el.style.opacity = "1";
        el.style.transform = "scale(1.05)";
        setTimeout(() => {
            el.style.opacity = "0.6";
            el.style.transform = "scale(1)";
        }, 400);
    }

    window.checkSimon = function(idx) {
        flashPad(idx);
        userSequence.push(idx);
        
        // DETEKSI SALAH URUTAN (GAME OVER)
    if (userSequence[userSequence.length - 1] !== sequence[userSequence.length - 1]) {
        // Ambil level terakhir yang diselesaikan (level saat ini dikurangi 1 jika gagal di tengah jalan)
        // Atau gunakan 'level' saja sebagai pencapaian tertinggi
        const finalScore = level; 

        alert(`Salah Urutan! Game Over.\nSkor Kamu: Level ${finalScore}`);

        // --- TAMBAHKAN LOGIKA INI ---
        saveToSpreadsheet('simon', finalScore); // Kirim ke spreadsheet
        showLeaderboard('simon');               // Tampilkan papan skor
        
        // goHome(); // Hapus atau pindahkan goHome ke dalam penutup leaderboard jika perlu
        return;
    }

    if (userSequence.length === sequence.length) {
        setTimeout(nextRound, 1000);
    }
    };

    nextRound();
};