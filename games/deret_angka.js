/**
 * Game Tes Deret Angka (Number Series)
 * Menguji logika pola matematika dan kecepatan berpikir.
 */

function startDeretAngkaGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let score = 0;
    let currentIdx = 0;
    let timeLeft = 20; // Waktu per soal lebih cepat untuk deret angka
    let timerInterval;

    // --- DATABASE DERET (Pola Matematika) ---
    const questions = [
        { q: '2, 4, 6, 8, ...', a: ['10', '12', '9', '14'], c: 0, hint: '+2' },
        { q: '5, 10, 20, 40, ...', a: ['60', '80', '50', '100'], c: 1, hint: 'x2' },
        { q: '1, 1, 2, 3, 5, 8, ...', a: ['11', '12', '13', '15'], c: 2, hint: 'Fibonacci' },
        { q: '100, 95, 85, 70, ...', a: ['55', '50', '45', '60'], c: 1, hint: '-5, -10, -15, -20' },
        { q: '2, 3, 5, 8, 12, ...', a: ['15', '16', '17', '18'], c: 2, hint: '+1, +2, +3, +4, +5' },
        { q: '1, 4, 9, 16, 25, ...', a: ['30', '35', '36', '49'], c: 2, hint: 'n kuadrat (1², 2², ...)' },
        { q: '3, 6, 4, 8, 6, 12, ...', a: ['8', '10', '14', '16'], c: 1, hint: 'x2, -2, x2, -2' },
        { q: '12, 13, 15, 18, 22, ...', a: ['25', '26', '27', '28'], c: 2, hint: '+1, +2, +3, +4, +5' },
        { q: '81, 64, 49, 36, ...', a: ['25', '20', '16', '30'], c: 0, hint: 'Kuadrat mundur (9², 8², 7²...)' },
        { q: '2, 6, 18, 54, ...', a: ['108', '150', '162', '216'], c: 2, hint: 'x3' }
    ].sort(() => Math.random() - 0.5); // Acak urutan soal

    function renderQuestion() {
        const q = questions[currentIdx];
        
        wrapper.innerHTML = `
            <div id="deret-container" style="max-width: 500px; margin: 0 auto; text-align: center; animation: fadeIn 0.3s;">
                <div style="background: var(--prm); color: white; padding: 10px; border-radius: 12px; margin-bottom: 20px; font-weight: bold; display: flex; justify-content: space-between;">
                    <span>Soal ${currentIdx + 1}/${questions.length}</span>
                    <span id="deret-timer">⏳ ${timeLeft}s</span>
                </div>

                <div style="background: var(--white); padding: 40px 20px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 25px; border: 2px solid var(--prm-light);">
                    <h1 style="font-size: 2.5rem; letter-spacing: 2px; color: var(--slate-dark); margin: 0;">${q.q}</h1>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    ${q.a.map((opt, idx) => `
                        <button onclick="checkDeretAnswer(${idx})" 
                                style="padding: 20px; font-size: 1.3rem; background: var(--white); border: 2px solid var(--prm-light); border-radius: 15px; cursor: pointer; transition: 0.2s; font-weight: bold; color: var(--slate-dark);"
                                onmouseover="this.style.background='var(--prm-light)'; this.style.borderColor='var(--prm)'"
                                onmouseout="this.style.background='var(--white)'; this.style.borderColor='var(--prm-light)'">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        startTimer();
    }

    function startTimer() {
        timeLeft = 20;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            const timerEl = document.getElementById('deret-timer');
            if (timerEl) timerEl.innerText = `⏳ ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkDeretAnswer(-1); // Waktu habis dianggap salah
            }
        }, 1000);
    }

    window.checkDeretAnswer = (idx) => {
        clearInterval(timerInterval);
        const q = questions[currentIdx];
        
        if (idx === q.c) {
            score += 10;
            stats.innerText = `Skor: ${score} | 🔢 Deret Angka`;
        } else {
            // Optional: Beri feedback singkat kalau salah
            console.log("Salah! Polanya adalah: " + q.hint);
        }

        currentIdx++;
        if (currentIdx < questions.length) {
            renderQuestion();
        } else {
            finishDeret();
        }
    };

    function finishDeret() {
        // Stop timer jika masih berjalan
        clearInterval(timerInterval);

        wrapper.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; animation: bounceIn 0.6s;">
                <h2 style="color: var(--slate-dark);">Tes Deret Selesai!</h2>
                <p style="color: var(--slate);">Skor Analisis Kamu:</p>
                <h1 style="font-size: 4rem; color: var(--prm); margin: 10px 0;">${score}</h1>
                <p style="font-weight: bold; color: var(--slate-dark); margin-bottom: 25px;">
                    ${score >= 80 ? 'Jenius Matematika! 🧠' : 'Bagus, terus berlatih! 💪'}
                </p>
                
                <div style="display: flex; gap: 10px; flex-direction: column; margin-bottom: 30px;">
                    <button class="btn-back" onclick="startDeretAngkaGame()" style="width: 100%; background: var(--prm); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer;">Main Lagi</button>
                    <button onclick="goHome()" style="width: 100%; padding: 12px; background: none; border: 1px solid var(--slate); border-radius: 12px; color: var(--slate); cursor: pointer; font-weight: 600;">Kembali ke Menu</button>
                </div>

                <div id="deret-leaderboard-content" style="text-align: left; background: var(--bg); padding: 15px; border-radius: 15px; border: 1px solid var(--prm-light);">
                    <p style="text-align: center; color: var(--slate);">Memuat Leaderboard...</p>
                </div>
            </div>
        `;

        // 1. Simpan skor ke database (Spreadsheet)
        // ID Game: 'deret_angka'
        if (typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet('deret_angka', score);
        }

        // 2. Tampilkan Leaderboard setelah jeda singkat agar data masuk dulu
        setTimeout(() => {
            if (typeof showLeaderboard === 'function') {
                showLeaderboard('deret_angka', 'deret-leaderboard-content');
            }
        }, 1500);
    }

    renderQuestion();
}

window.startDeretAngkaGame = startDeretAngkaGame;