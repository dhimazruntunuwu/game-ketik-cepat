/**
 * IQ Test Game - Fun Game Hub
 * Logika: 20 Soal Acak, Estimasi IQ, Save & Show Leaderboard.
 */

function startIQTest() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Reset Stats Header
    stats.innerText = `Skor: 0 | 🧠 Logika Test`;

    wrapper.innerHTML = `
        <div id="iq-quiz-container" style="width: 100%; max-width: 500px; margin: 0 auto; text-align: left; padding: 20px;">
            <div id="iq-question-box">
                <div style="display: flex; justify-content: space-between; color: var(--slate); font-size: 0.8rem; margin-bottom: 10px;">
                    <span id="iq-progress">Soal 1/20</span>
                    <span id="iq-category">Mode: Penalaran Logika</span>
                </div>
                <h2 id="iq-q-title" style="margin-bottom: 20px; font-size: 1.2rem; min-height: 60px;">Menyiapkan tes...</h2>
                <div id="iq-options" style="display: flex; flex-direction: column; gap: 10px;"></div>
            </div>

            <div id="iq-result-box" class="hidden" style="text-align: center;">
                <p style="color: var(--slate); margin-bottom: 5px;">Estimasi Logika Anda:</p>
                <h1 style="font-size: 4rem; margin: 0; color: var(--prm);" id="iq-final-score">0</h1>
                <p style="font-weight: bold; margin-top: 10px;" id="iq-msg"></p>
                
                <div style="margin-top: 25px;">
                    <button onclick="startIQTest()" class="btn-back" style="width: 100%; margin-bottom: 10px;">Main Lagi</button>
                    <button onclick="goHome()" style="width: 100%; padding: 10px; background: none; border: 1px solid var(--slate); border-radius: 8px; cursor: pointer;">Kembali ke Menu</button>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                <h3 style="margin-bottom: 15px;">🏆 Peringkat Global</h3>
                <div id="leaderboard-content">Memuat data...</div>
            </div>
        </div>
    `;

    const allQuestions = [
        { q: "Lanjutkan pola: 1, 1, 2, 3, 5, 8, ...", a: ["10", "12", "13", "15"], c: 2 },
        { q: "Lanjutkan pola: 100, 90, 81, 73, ...", a: ["66", "65", "64", "60"], c: 0 },
        { q: "Lanjutkan pola: 1, 4, 9, 16, 25, ...", a: ["30", "35", "36", "49"], c: 2 },
        { q: "Jika 5 mesin butuh 5 menit untuk membuat 5 alat, berapa menit 100 mesin buat 100 alat?", a: ["100", "50", "5", "1"], c: 2 },
        { q: "Berapa hasil dari 2 + 2 x 2?", a: ["8", "6", "4", "10"], c: 1 },
        { q: "Lanjutkan pola: 2, 5, 11, 23, ...", a: ["46", "47", "48", "35"], c: 1 },
        { q: "Mobil : Bensin = Pelari : ...", a: ["Sepatu", "Lintasan", "Makanan", "Medali"], c: 2 },
        { q: "Bulan : Bumi = Bumi : ...", a: ["Bintang", "Matahari", "Planet", "Satelit"], c: 1 },
        { q: "Guru : Sekolah = Dokter : ...", a: ["Pasien", "Obat", "Rumah Sakit", "Suntikan"], c: 2 },
        { q: "Andi lebih tinggi dari Budi. Budi lebih tinggi dari Caca. Siapa yang terpendek?", a: ["Andi", "Budi", "Caca", "Sama saja"], c: 2 },
        { q: "Satu tahun ada berapa bulan yang punya 28 hari?", a: ["1", "6", "12", "0"], c: 2 },
        { q: "Ayah Mary punya 5 anak: Nana, Nene, Nini, Nono. Siapa anak ke-5?", a: ["Nunu", "Nana", "Mary", "Noni"], c: 2 },
        { q: "Jika kamu menyalip orang di posisi kedua, kamu di posisi mana?", a: ["Satu", "Dua", "Tiga", "Terakhir"], c: 1 },
        { q: "Manakah yang berbeda: Januari, Maret, Mei, Juni?", a: ["Januari", "Maret", "Mei", "Juni"], c: 3 },
        { q: "Berapa banyak sisi pada kubus?", a: ["4", "6", "8", "12"], c: 1 },
        { q: "Warna campuran Biru dan Kuning adalah...", a: ["Ungu", "Hijau", "Oranye", "Cokelat"], c: 1 },
        { q: "Mata uang Jepang adalah...", a: ["Yuan", "Won", "Yen", "Dollar"], c: 2 },
        { q: "Ibukota Indonesia (saat ini) adalah...", a: ["Surabaya", "Bandung", "Jakarta", "IKN"], c: 2 },
        { q: "Tangan : Sarung Tangan = Kepala : ...", a: ["Rambut", "Topi", "Kacamata"], c: 1 },
        { q: "Jika hari ini Senin, hari apa 3 hari setelah kemarin?", a: ["Selasa", "Rabu", "Kamis"], c: 1 }
    ];

    // Acak soal
    const questions = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 20);

    let currentIdx = 0;
    let correctCount = 0;

    function renderQuestion() {
        const q = questions[currentIdx];
        document.getElementById('iq-progress').innerText = `Soal ${currentIdx + 1}/20`;
        document.getElementById('iq-q-title').innerText = q.q;
        
        const optionsDiv = document.getElementById('iq-options');
        optionsDiv.innerHTML = '';

        q.a.forEach((ans, i) => {
            const btn = document.createElement('button');
            btn.innerText = ans;
            btn.style.cssText = "padding: 15px; border-radius: 12px; border: 2px solid var(--prm-light); background: var(--white); color: var(--slate-dark); cursor: pointer; text-align: left; font-weight: 600; transition: 0.2s;";

            btn.onmouseover = () => btn.style.background = "var(--prm-light)";
            btn.onmouseout = () => btn.style.background = "var(--white)";

            btn.onclick = () => {
                if (i === q.c) {
                    correctCount++;
                    stats.innerText = `Skor: ${correctCount * 5} | 🧠 Logika Test`;
                }

                currentIdx++;
                if (currentIdx < questions.length) {
                    renderQuestion();
                } else {
                    finishGame();
                }
            };
            optionsDiv.appendChild(btn);
        });
    }

    function finishGame() {
        document.getElementById('iq-question-box').classList.add('hidden');
        const resultBox = document.getElementById('iq-result-box');
        resultBox.classList.remove('hidden');

        // Kalkulasi Skor IQ (Base 70 + poin benar)
        const iqResult = Math.round(70 + (correctCount * 3.5));
        document.getElementById('iq-final-score').innerText = iqResult;

        let msg = "";
        if (iqResult >= 130) msg = "Jenius! Kemampuan analisismu luar biasa. 🚀";
        else if (iqResult >= 110) msg = "Cerdas! Kamu di atas rata-rata. ✨";
        else if (iqResult >= 90) msg = "Bagus! Kamu memiliki logika yang stabil. 👍";
        else msg = "Teruslah berlatih untuk mengasah otakmu! 📚";

        document.getElementById('iq-msg').innerText = msg;

        // --- 1. SIMPAN KE SPREADSHEET ---
        // Parameter: 'iq_test' adalah ID game, iqResult adalah skornya
        saveToSpreadsheet('logika_test', iqResult);

        // --- 2. TAMPILKAN LEADERBOARD ---
        // Memanggil fungsi global untuk menampilkan peringkat di elemen #leaderboard-content
        showLeaderboard('logika_test');
    }

    renderQuestion();
}

window.startIQTest = startIQTest;