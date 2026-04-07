/**
 * Game Tes Logika Arismetik (Soal Cerita Matematika)
 * Menguji kecepatan pemrosesan logika numerik.
 */

function startArismetikGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let score = 0;
    let currentIdx = 0;
    let timeLeft = 30; // 30 detik per soal cerita
    let timerInterval;

    // --- DATABASE SOAL (Logika Arismetik) ---
    const questions = [
        { 
            q: "Andi membeli 5 buku seharga Rp 20.000. Berapa harga 8 buku yang sama?", 
            a: ["Rp 28.000", "Rp 32.000", "Rp 35.000", "Rp 40.000"], 
            c: 1 
        },
        { 
            q: "Jika 6 orang dapat menyelesaikan pekerjaan dalam 4 hari, berapa orang yang dibutuhkan untuk selesai dalam 3 hari?", 
            a: ["7 orang", "8 orang", "9 orang", "10 orang"], 
            c: 1 
        },
        { 
            q: "Umur Budi 3 kali umur Ani. Jika umur Ani 12 tahun, berapa umur Budi 5 tahun lagi?", 
            a: ["36 tahun", "41 tahun", "45 tahun", "50 tahun"], 
            c: 1 
        },
        { 
            q: "Sebuah kereta api melaju 90 km/jam. Berapa jarak yang ditempuh dalam waktu 40 menit?", 
            a: ["45 km", "50 km", "60 km", "75 km"], 
            c: 2 
        },
        { 
            q: "Seorang pedagang membeli barang seharga Rp 250.000 dan ingin untung 20%. Harga jualnya adalah...", 
            a: ["Rp 275.000", "Rp 300.000", "Rp 325.000", "Rp 350.000"], 
            c: 1 
        },
        { 
            q: "Jika 5 mesin membuat 5 baju dalam 5 menit, maka 100 mesin membuat 100 baju dalam...", 
            a: ["100 menit", "20 menit", "5 menit", "1 menit"], 
            c: 2 
        },
        { 
            q: "Dua buah angka jika dijumlahkan hasilnya 30 dan jika dikurangkan hasilnya 6. Angka terbesarnya adalah...", 
            a: ["15", "16", "18", "21"], 
            c: 2 
        },
        { 
            q: "Sebuah tangki air berisi 1/3 bagian. Jika ditambah 10 liter, tangki menjadi setengah penuh. Kapasitas tangki adalah...", 
            a: ["30 liter", "60 liter", "90 liter", "120 liter"], 
            c: 1 
        }
    ].sort(() => Math.random() - 0.5);

    function renderQuestion() {
        const q = questions[currentIdx];
        
        wrapper.innerHTML = `
            <div id="arismetik-container" style="max-width: 500px; margin: 0 auto; animation: slideIn 0.4s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <span style="font-weight: bold; color: var(--prm);">Soal ${currentIdx + 1}/${questions.length}</span>
                    <span id="arismetik-timer" style="background: var(--prm); color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;">⏳ ${timeLeft}s</span>
                </div>

                <div style="background: var(--white); padding: 30px 20px; border-radius: 20px; border: 2px solid var(--prm-light); box-shadow: 0 10px 20px rgba(0,0,0,0.05); margin-bottom: 30px;">
                    <p style="font-size: 1.2rem; color: var(--slate-dark); line-height: 1.6; margin: 0; text-align: center;">
                        ${q.q}
                    </p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                    ${q.a.map((opt, idx) => `
                        <button onclick="checkArismetikAnswer(${idx})" 
                                style="padding: 15px; text-align: left; font-size: 1.1rem; background: var(--bg); border: 2px solid var(--prm-light); border-radius: 12px; cursor: pointer; transition: 0.2s; color: var(--slate-dark); font-weight: 500;"
                                onmouseover="this.style.borderColor='var(--prm)'; this.style.background='var(--white)'"
                                onmouseout="this.style.borderColor='var(--prm-light)'; this.style.background='var(--bg)'">
                            ${String.fromCharCode(65 + idx)}. ${opt}
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
            const el = document.getElementById('arismetik-timer');
            if (el) el.innerText = `⏳ ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkArismetikAnswer(-1);
            }
        }, 1000);
    }

    window.checkArismetikAnswer = (idx) => {
        clearInterval(timerInterval);
        const q = questions[currentIdx];
        
        if (idx === q.c) {
            score += 12.5; // Agar total 100 kalau benar 8
            stats.innerText = `Skor: ${Math.round(score)} | 📈 Logika Arismetik`;
        }

        currentIdx++;
        if (currentIdx < questions.length) {
            renderQuestion();
        } else {
            finishArismetik();
        }
    };

    function finishArismetik() {
        // Stop timer
        clearInterval(timerInterval);

        wrapper.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; animation: slideIn 0.5s ease;">
                <div style="font-size: 4rem; margin-bottom: 10px;">📉</div>
                <h2 style="color: var(--slate-dark);">Hasil Tes Arismetik</h2>
                <h1 style="font-size: 3.5rem; color: var(--prm); margin: 10px 0;">${Math.round(score)}</h1>
                <p style="color: var(--slate); margin-bottom: 30px;">
                    ${score >= 80 ? "Sangat Cepat & Akurat! 🚀" : "Bagus, pertahankan ketelitianmu! ⚖️"}
                </p>
                
                <div style="display: flex; gap: 10px; flex-direction: column; margin-bottom: 30px;">
                    <button class="btn-back" onclick="startArismetikGame()" style="width: 100%; background: var(--prm); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; cursor: pointer;">Coba Lagi</button>
                    <button onclick="goHome()" style="width: 100%; padding: 12px; background: none; border: 1px solid var(--slate); border-radius: 12px; color: var(--slate); cursor: pointer; font-weight: 600;">Ke Menu Utama</button>
                </div>

                <div id="arismetik-leaderboard-content" style="text-align: left; background: var(--bg); padding: 15px; border-radius: 15px; border: 1px solid var(--prm-light);">
                    <p style="text-align: center; color: var(--slate);">Memuat peringkat...</p>
                </div>
            </div>
        `;

        // 1. Simpan hasil ke Google Sheets
        // Menggunakan ID 'arismetik_test' sesuai standar yang kita buat
        if (typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet('arismetik_test', Math.round(score));
        }

        // 2. Tampilkan Leaderboard
        // Memberi delay 1.5 detik agar penulisan data di Apps Script selesai dulu
        setTimeout(() => {
            if (typeof showLeaderboard === 'function') {
                showLeaderboard('arismetik_test', 'arismetik-leaderboard-content');
            }
        }, 1500);
    }

    renderQuestion();
}

window.startArismetikGame = startArismetikGame;