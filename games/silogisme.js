/**
 * Game Tes Penalaran Logis (Silogisme)
 * Menguji penarikan kesimpulan logis (Deductive Reasoning).
 */

function startSilogismeGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let score = 0;
    let currentIdx = 0;
    let timeLeft = 30; 
    let timerInterval;

    // --- DATABASE SOAL (Logika Silogisme) ---
    const questions = [
        { 
            q: "Premis 1: Semua mamalia menyusui.<br>Premis 2: Kucing adalah mamalia.", 
            a: ["Kucing mungkin menyusui", "Kucing adalah hewan menyusui", "Semua yang menyusui adalah kucing", "Tidak ada kesimpulan"], 
            c: 1 
        },
        { 
            q: "P1: Jika hari hujan, maka jalanan basah.<br>P2: Hari ini jalanan tidak basah.", 
            a: ["Hari ini pasti hujan", "Hari ini tidak hujan", "Hujan tidak menyebabkan basah", "Jalanan akan segera basah"], 
            c: 1 
        },
        { 
            q: "P1: Semua siswa kelas A lulus ujian.<br>P2: Sebagian siswa kelas A adalah atlet.", 
            a: ["Semua atlet lulus ujian", "Sebagian atlet lulus ujian", "Atlet tidak lulus ujian", "Siswa kelas A bukan atlet"], 
            c: 1 
        },
        { 
            q: "P1: Semua kayu adalah benda mati.<br>P2: Sebagian benda mati tenggelam dalam air.", 
            a: ["Semua kayu tenggelam dalam air", "Sebagian kayu tenggelam dalam air", "Kayu bukan benda mati", "Tidak dapat disimpulkan kayu itu tenggelam"], 
            c: 3 
        },
        { 
            q: "P1: Jika lampu menyala, maka ruangan terang.<br>P2: Ruangan gelap.", 
            a: ["Lampu tidak menyala", "Lampu rusak", "Listrik padam", "Ruangan tidak punya lampu"], 
            c: 0 
        },
        { 
            q: "P1: Semua programmer suka kopi.<br>P2: Dhimaz adalah seorang programmer.", 
            a: ["Dhimaz mungkin suka kopi", "Dhimaz suka kopi", "Semua orang suka kopi", "Programmer tidak suka teh"], 
            c: 1 
        },
        { 
            q: "P1: Semua bunga di taman berwarna merah.<br>P2: Sebagian bunga di taman adalah mawar.", 
            a: ["Semua mawar berwarna merah", "Sebagian mawar berwarna merah", "Mawar bukan bunga", "Semua bunga merah adalah mawar"], 
            c: 1 
        },
        { 
            q: "P1: Semua sarjana adalah orang pintar.<br>P2: Semua orang pintar rajin membaca.", 
            a: ["Semua sarjana rajin membaca", "Sebagian sarjana rajin membaca", "Orang pintar adalah sarjana", "Membaca hanya untuk sarjana"], 
            c: 0 
        }
    ].sort(() => Math.random() - 0.5);

    function renderQuestion() {
        const q = questions[currentIdx];
        
        wrapper.innerHTML = `
            <div id="silogisme-container" style="max-width: 550px; margin: 0 auto; animation: fadeIn 0.5s ease;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <span style="color: var(--prm); font-weight: bold;">Logika ${currentIdx + 1}/${questions.length}</span>
                    <span id="silogisme-timer" style="background: var(--prm); color: white; padding: 6px 15px; border-radius: 50px; font-weight: 800;">⏳ ${timeLeft}s</span>
                </div>

                <div style="background: var(--white); padding: 30px; border-radius: 20px; border-left: 8px solid var(--prm); box-shadow: 0 8px 20px rgba(0,0,0,0.05); margin-bottom: 25px;">
                    <p style="font-size: 1.15rem; color: var(--slate-dark); line-height: 1.8; margin: 0;">
                        ${q.q}
                    </p>
                    <hr style="margin: 20px 0; border: 0; border-top: 1px dashed var(--prm-light);">
                    <p style="font-weight: bold; color: var(--prm);">Kesimpulan yang paling tepat adalah...</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                    ${q.a.map((opt, idx) => `
                        <button onclick="checkSilogismeAnswer(${idx})" 
                                style="padding: 18px; text-align: left; font-size: 1rem; background: var(--bg); border: 2px solid var(--prm-light); border-radius: 15px; cursor: pointer; transition: all 0.2s; color: var(--slate-dark); font-weight: 600;"
                                onmouseover="this.style.borderColor='var(--prm)'; this.style.transform='translateX(5px)'"
                                onmouseout="this.style.borderColor='var(--prm-light)'; this.style.transform='translateX(0)'">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        startTimer();
    }

    function startTimer() {
        timeLeft = 30;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            const el = document.getElementById('silogisme-timer');
            if (el) el.innerText = `⏳ ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkSilogismeAnswer(-1);
            }
        }, 1000);
    }

    window.checkSilogismeAnswer = (idx) => {
        clearInterval(timerInterval);
        const q = questions[currentIdx];
        
        if (idx === q.c) {
            score += 12.5; 
            stats.innerText = `Skor: ${Math.round(score)} | ⚖️ Penalaran Logis`;
        }

        currentIdx++;
        if (currentIdx < questions.length) {
            renderQuestion();
        } else {
            finishSilogisme();
        }
    };

    function finishSilogisme() {
        // Hentikan timer
        clearInterval(timerInterval);

        wrapper.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; animation: fadeInUp 0.5s;">
                <div style="font-size: 5rem; margin-bottom: 15px;">⚖️</div>
                <h2 style="color: var(--slate-dark);">Tes Penalaran Selesai</h2>
                <h1 style="font-size: 4rem; color: var(--prm); margin: 10px 0;">${Math.round(score)}</h1>
                <p style="color: var(--slate); font-size: 1.1rem; margin-bottom: 30px;">
                    ${score >= 85 ? "Logika kamu sangat lurus dan presisi! 🔍" : "Bagus! Kamu punya dasar logika yang kuat. 💡"}
                </p>

                <div style="display: flex; gap: 10px; flex-direction: column; margin-bottom: 30px;">
                    <button class="btn-back" onclick="startSilogismeGame()" style="width: 100%; background: var(--prm); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer;">Coba Lagi</button>
                    <button onclick="goHome()" style="width: 100%; padding: 12px; background: none; border: 1px solid var(--slate); border-radius: 12px; color: var(--slate); cursor: pointer; font-weight: 600;">Ke Menu Utama</button>
                </div>

                <div id="silogisme-leaderboard-content" style="text-align: left; background: var(--bg); padding: 15px; border-radius: 15px; border: 1px solid var(--prm-light);">
                    <p style="text-align: center; color: var(--slate); font-size: 0.9rem;">Memperbarui peringkat...</p>
                </div>
            </div>
        `;

        // 1. Simpan skor ke database Spreadsheet
        // ID Game: 'silogisme_test'
        if (typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet('silogisme_test', Math.round(score));
        }

        // 2. Tampilkan Leaderboard
        // Delay 1.5 detik agar data baru sempat ter-input ke server
        setTimeout(() => {
            if (typeof showLeaderboard === 'function') {
                showLeaderboard('silogisme_test', 'silogisme-leaderboard-content');
            }
        }, 1500);
    }

    renderQuestion();
}

window.startSilogismeGame = startSilogismeGame;