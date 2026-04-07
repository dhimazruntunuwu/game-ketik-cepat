/**
 * Raven's Progressive Matrices Game
 * Menguji logika pola visual 3x3.
 */

function startRavenGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let score = 0;
    let currentLevel = 0;

    // --- DATABASE LEVEL (Pola Visual 3x3) ---
    // Diatur dalam array 9 elemen (indeks 8 adalah yang dicari '?')
    const levels = [
        {
            title: "Pola Rotasi Searah Jarum Jam",
            matrix: ['⬆️', '➡️', '⬇️', '➡️', '⬇️', '⬅️', '⬇️', '⬅️', '?'],
            options: ['⬆️', '➡️', '⬇️', '⬅️'],
            correct: 0 // Jawaban: ⬆️
        },
        {
            title: "Pola Penjumlahan Bentuk",
            matrix: ['⚪', '⚪', '⚪⚪', '⬛', '⬛', '⬛⬛', '🔷', '🔷', '?'],
            options: ['🔷🔷', '⬛⬛', '⚪', '💠'],
            correct: 0 // Jawaban: 🔷🔷
        },
        {
            title: "Pola Perubahan Warna/Isi",
            matrix: ['🍎', '🍏', '🍎', '🍐', '🍋', '🍐', '🍇', '🫐', '?'],
            options: ['🫐', '🍇', '🍒', '🍊'],
            correct: 1 // Jawaban: 🍇 (Pola A-B-A)
        },
        {
            title: "Pola Progresi Ukuran",
            matrix: ['🌱', '🌿', '🌳', '🥚', '🐣', '🐥', '☁️', '🌧️', '?'],
            options: ['⛈️', '☀️', '🌈', '🌊'],
            correct: 0 // Jawaban: ⛈️ (Tahapan cuaca)
        }
    ];

    function renderLevel() {
        const lvl = levels[currentLevel];
        
        wrapper.innerHTML = `
            <div style="max-width: 400px; margin: 0 auto; text-align: center;">
                <h2 style="font-size: 1.1rem; color: var(--prm); margin-bottom: 20px;">${lvl.title}</h2>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: var(--prm-light); padding: 15px; border-radius: 20px; margin-bottom: 30px;">
                    ${lvl.matrix.map((item, i) => `
                        <div style="aspect-ratio: 1; background: var(--white); display: flex; align-items: center; justify-content: center; font-size: 2rem; border-radius: 12px; border: 2px solid ${item === '?' ? 'var(--prm)' : 'transparent'}; color: ${item === '?' ? 'var(--prm)' : 'inherit'}; font-weight: bold;">
                            ${item}
                        </div>
                    `).join('')}
                </div>

                <p style="margin-bottom: 15px; font-weight: 600; color: var(--slate);">Pilih gambar yang tepat:</p>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${lvl.options.map((opt, idx) => `
                        <button onclick="checkRavenAnswer(${idx})" style="padding: 20px; font-size: 1.5rem; background: var(--white); border: 2px solid var(--prm-light); border-radius: 15px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='var(--prm)'" onmouseout="this.style.borderColor='var(--prm-light)'">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.checkRavenAnswer = (idx) => {
        if (idx === levels[currentLevel].correct) {
            score += 25;
            currentLevel++;
            stats.innerText = `Skor: ${score} | 🧩 Raven's Test`;
            
            if (currentLevel < levels.length) {
                renderLevel();
            } else {
                finishRaven();
            }
        } else {
            alert("Jawaban kurang tepat, coba perhatikan polanya lagi!");
        }
    };

    function finishRaven() {
        wrapper.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; animation: zoomIn 0.5s ease;">
                <div style="font-size: 5rem; margin-bottom: 10px;">🏆</div>
                <h2 style="color: var(--slate-dark);">Tes Selesai!</h2>
                <p style="color: var(--slate);">Skor Logika Visual Anda:</p>
                <h1 style="font-size: 4rem; color: var(--prm); margin: 10px 0;">${score}</h1>
                
                <div style="display: flex; gap: 10px; flex-direction: column; margin-bottom: 30px;">
                    <button class="btn-back" onclick="startRavenGame()" style="width: 100%; background: var(--prm); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer;">Ulangi Tes</button>
                    <button onclick="goHome()" style="width: 100%; padding: 12px; background: none; border: 1px solid var(--slate); border-radius: 12px; color: var(--slate); cursor: pointer; font-weight: 600;">Kembali ke Menu</button>
                </div>

                <div id="raven-leaderboard-content" style="text-align: left; background: var(--bg); padding: 15px; border-radius: 15px; border: 1px solid var(--prm-light);">
                    <p style="text-align: center; color: var(--slate); font-size: 0.9rem;">Sinkronisasi Leaderboard...</p>
                </div>
            </div>
        `;

        // 1. Simpan hasil ke Google Sheets (ID: 'raven_matrices')
        if (typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet('raven_matrices', score);
        }

        // 2. Tampilkan Leaderboard
        // Menggunakan delay agar spreadsheet sempat memproses data baru
        setTimeout(() => {
            if (typeof showLeaderboard === 'function') {
                showLeaderboard('raven_matrices', 'raven-leaderboard-content');
            }
        }, 1500);
    }

    renderLevel();
}

// Ekspos ke global
window.startRavenGame = startRavenGame;