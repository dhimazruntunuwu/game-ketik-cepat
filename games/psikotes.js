/**
 * Psikotes Rekrutmen Game - Fun Game Hub
 * Fitur: Raven's Matrices (Pola Gambar), Deret Angka, Arismetik (Soal Cerita), Silogisme.
 * Aturan: 20 Soal Acak, Timer 60s per Soal, Skor & Leaderboard.
 */

function startPsikotesGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Konfigurasi Game
    let score = 0;
    let currentIdx = 0;
    let timeLeft = 60; // Waktu per soal
    let gameActive = false;
    let timerInterval;

    // --- DATABASE SOAL (Logic Utama ada di sini) ---
    const allQuestions = [
        // 1. RAVEN'S MATRICES (Pola Gambar Dinamis pakai CSS/Emoji)
        { 
            type: 'raven',
            q: '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:5px; width:120px; margin:auto;"><div>⬛</div><div>⬜</div><div>⬛</div><div>⬜</div><div>⬛</div><div>⬜</div><div>⬛</div><div>⬜</div><div style="color:var(--prm);">?</div></div>', 
            a: ['⬛', '⬜', '⚪', '🔷'], 
            c: 0 // Jawaban: ⬛ (Pola Catur)
        },
        { 
            type: 'raven',
            q: '<div style="font-size:2rem; letter-spacing:10px;">⬆️➡️⬇️<span style="color:var(--prm);">?</span></div>', 
            a: ['⬆️', '➡️', '⬇️', '⬅️'], 
            c: 3 // Jawaban: ⬅️ (Putar Searah Jarum Jam)
        },

        // 2. DERET ANGKA (Logic Pemrograman)
        { type: 'logic', q: 'Lanjutkan deret: 2, 4, 8, 16, ...', a: ['20', '24', '32', '64'], c: 2 },
        { type: 'logic', q: 'Lanjutkan deret: 1, 1, 2, 3, 5, 8, ...', a: ['10', '12', '13', '15'], c: 2 }, // Fibonacci
        { type: 'logic', q: 'Lanjutkan deret: 100, 90, 81, 73, ...', a: ['66', '65', '64', '62'], c: 0 }, // -10, -9, -8, -7

        // 3. LOGIKA ARISMETIK (Soal Cerita Dasar)
        { type: 'arithmetic', q: 'Andi membeli 3 buku seharga Rp 15.000. Berapa harga 5 buku?', a: ['Rp 20.000', 'Rp 22.500', 'Rp 25.000', 'Rp 30.000'], c: 2 },
        { type: 'arithmetic', q: 'Sebuah mobil melaju 60 km/jam. Berapa km jarak yang ditempuh dalam 2,5 jam?', a: ['120 km', '135 km', '150 km', '160 km'], c: 2 },
        { type: 'arithmetic', q: 'Jika 5 mesin membuat 5 alat dalam 5 menit, berapa menit 100 mesin membuat 100 alat?', a: ['100', '50', '5', '1'], c: 2 },

        // 4. PENALARAN LOGIS (Silogisme)
        { type: 'syllogism', q: 'Premis 1: Semua mamalia menyusui.<br>Premis 2: Kucing adalah mamalia.<br>Kesimpulan?', a: ['Kucing menyusui', 'Kucing tidak menyusui', 'Semua yang menyusui adalah kucing'], c: 0 },
        { type: 'syllogism', q: 'P1: Semua programmer suka kopi.<br>P2: Andi adalah programmer.<br>Kesimpulan?', a: ['Andi suka teh', 'Andi suka kopi', 'Andi tidak suka kopi'], c: 1 },
        { type: 'syllogism', q: 'P1: Jika hujan, jalanan basah.<br>P2: Hari ini hujan.<br>Kesimpulan?', a: ['Jalanan kering', 'Jalanan basah', 'Hari ini cerah'], c: 1 }
    ];

    // Acak Soal & Ambil 10 saja (biar tidak kepanjangan)
    const questions = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 10);

    // --- TEMPLATE UI (Support Dark Mode) ---
    wrapper.innerHTML = `
        <div id="psikotes-container" style="width: 100%; max-width: 550px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; transition: background 0.3s ease;">
            
            <div id="psikotes-quiz-box" style="background: var(--white); padding: 25px; border-radius: 24px; border: 2px solid var(--prm-light); box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--prm-light);">
                    <span id="psikotes-progress" style="color: var(--slate); font-weight: 600; font-size: 0.9rem;">Soal 1/10</span>
                    <span id="psikotes-timer" style="background: var(--prm); color: white; padding: 5px 12px; border-radius: 50px; font-weight: 700; font-size: 0.9rem;">⏳ 60s</span>
                </div>

                <div id="psikotes-question-content" style="text-align: center; margin-bottom: 25px;">
                    <h2 id="psikotes-q-text" style="font-size: 1.25rem; color: var(--slate-dark); margin: 0; min-height: 50px; line-height: 1.5;">Memuat...</h2>
                </div>

                <div id="psikotes-options" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    </div>
            </div>

            <div id="psikotes-result-box" class="hidden" style="text-align: center; background: var(--white); padding: 30px; border-radius: 24px; border: 2px solid var(--prm); animation: fadeInDown 0.5s ease;">
                <p style="color: var(--slate); margin: 0;">Skor Akhir Anda:</p>
                <h1 style="font-size: 4rem; color: var(--prm); margin: 10px 0;" id="psikotes-final-score">0</h1>
                <p id="psikotes-msg" style="font-weight: 700; color: var(--slate-dark); margin-bottom: 25px;"></p>
                
                <div style="display: flex; gap: 10px; flex-direction: column;">
                    <button onclick="startPsikotesGame()" class="btn-back" style="width: 100%; background: var(--prm); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer;">Main Lagi</button>
                    <button onclick="goHome()" style="width: 100%; padding: 10px; background: none; border: 1px solid var(--slate); border-radius: 12px; color: var(--slate); cursor: pointer;">Kembali ke Menu</button>
                </div>

                <div id="psikotes-leaderboard-content" style="margin-top: 30px; text-align: left;"></div>
            </div>
        </div>
    `;

    const quizBox = document.getElementById('psikotes-quiz-box');
    const resultBox = document.getElementById('psikotes-result-box');
    const qText = document.getElementById('psikotes-q-text');
    const optionsDiv = document.getElementById('psikotes-options');
    const timerDisplay = document.getElementById('psikotes-timer');

    // --- LOGIKA GAME ---
    function renderQuestion() {
        if (!gameActive) return;
        
        const q = questions[currentIdx];
        document.getElementById('psikotes-progress').innerText = `Soal ${currentIdx + 1}/10 | ${q.type.toUpperCase()}`;
        
        // Render Konten (Bisa HTML Gambar atau Teks)
        qText.innerHTML = q.q;

        // Reset & Render Tombol Opsi
        optionsDiv.innerHTML = '';
        q.a.forEach((ans, i) => {
            const btn = document.createElement('button');
            btn.innerHTML = ans;
            // Styling Tombol (Responsive & Dark Mode Safe)
            btn.style.cssText = `
                padding: 18px; 
                border-radius: 15px; 
                border: 2px solid var(--prm-light); 
                background: var(--bg); 
                color: var(--slate-dark); 
                cursor: pointer; 
                font-weight: 600; 
                font-size: 1rem;
                transition: all 0.2s ease;
                text-align: center;
                width: 100%;
            `;

            // Efek Hover
            btn.onmouseover = () => { btn.style.borderColor = "var(--prm)"; btn.style.background = "var(--prm-light)"; };
            btn.onmouseout = () => { btn.style.borderColor = "var(--prm-light)"; btn.style.background = "var(--bg)"; };

            btn.onclick = () => { handleAnswer(i); };
            optionsDiv.appendChild(btn);
        });

        startQuestionTimer();
    }

    function startQuestionTimer() {
        timeLeft = 60; // Reset waktu per soal
        clearInterval(timerInterval);
        timerDisplay.innerText = `⏳ 60s`;
        timerDisplay.style.background = "var(--prm)";

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = `⏳ ${timeLeft}s`;

            // Efek Merah kalau waktu mau habis
            if (timeLeft <= 10) { timerDisplay.style.background = "#ef4444"; }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleAnswer(-1); // Anggap salah kalau waktu habis
            }
        }, 1000);
    }

    function handleAnswer(selectedIdx) {
        if (!gameActive) return;
        clearInterval(timerInterval); // Stop timer soal

        const q = questions[currentIdx];
        
        // Logika Scoring
        if (selectedIdx === q.c) {
            score += 10; // Benar dapet 10 poin
            stats.innerText = `Skor: ${score} | 🧠 Psikotes`;
        }

        currentIdx++;
        if (currentIdx < questions.length) {
            renderQuestion();
        } else {
            finishGame();
        }
    }

    function finishGame() {
        gameActive = false;
        clearInterval(timerInterval);
        quizBox.classList.add('hidden');
        resultBox.classList.remove('hidden');
        document.getElementById('psikotes-final-score').innerText = score;

        // Pesan Berdasarkan Skor
        let msg = "";
        if (score >= 90) msg = "Luar Biasa! Kemampuan analisismu sangat tajam. 🔥";
        else if (score >= 70) msg = "Bagus! Kamu memiliki logika yang kuat di atas rata-rata. ✨";
        else if (score >= 50) msg = "Cukup Baik! Terus latih fokus dan logikamu. 👍";
        else msg = "Jangan menyerah! Terus berlatih soal-soal logika. 📚";
        
        document.getElementById('psikotes-msg').innerText = msg;

        // Simpan ke Spreadsheet & Tampilkan Leaderboard
        if (typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet('psikotes_test', score);
        }
        if (typeof showLeaderboard === 'function') {
            showLeaderboard('psikotes_test', 'psikotes-leaderboard-content');
        }
    }

    // --- MULAI GAME ---
    gameActive = true;
    renderQuestion();
}

// Ekspos fungsi ke global window agar bisa dipanggil main.js
window.startPsikotesGame = startPsikotesGame;