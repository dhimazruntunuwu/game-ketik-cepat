window.startMathQuest = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // --- STATE GAME ---
    let gameState = {
        currentPage: 'intro',
        currentRoom: 1,
        totalRooms: 20, // Total 20 Level
        hp: 3,
        timer: 180, // 3 Menit
        currentProblem: null,
        feedback: '// Menunggu dekripsi...',
        score: 0
    };

    let timerInterval = null;

    // --- LOGIKA PROGRESSIVE DIFFICULTY (Sesuai Request: Tambah, Kurang, Kali, Bagi) ---
    function generateProblem(room) {
        let a, b, op, ans, q;
        
        if (room <= 4) { 
            // Level 1-4: Penjumlahan & Pengurangan (Angka 5-30)
            a = Math.floor(Math.random() * 25) + 5;
            b = Math.floor(Math.random() * 20) + 5;
            op = Math.random() > 0.5 ? '+' : '-';
            if (op === '-') [a, b] = a < b ? [b, a] : [a, b]; // Cegah hasil minus
            ans = op === '+' ? a + b : a - b;
            q = `${a} ${op} ${b} = ?`;
        } 
        else if (room <= 8) {
            // Level 5-8: Perkalian (Tabel 2-12)
            a = Math.floor(Math.random() * 11) + 2;
            b = Math.floor(Math.random() * 12) + 1;
            op = '×';
            ans = a * b;
            q = `${a} ${op} ${b} = ?`;
        }
        else if (room <= 12) {
            // Level 9-12: Pembagian (Hasil bulat)
            ans = Math.floor(Math.random() * 12) + 2; // Jawaban bulat
            b = Math.floor(Math.random() * 10) + 2;   // Pembagi
            a = ans * b;                              // Angka yang dibagi
            op = '÷';
            q = `${a} ${op} ${b} = ?`;
        }
        else if (room <= 16) {
            // Level 13-16: Operasi Campuran 3 Angka (Tambah + Kurang)
            a = Math.floor(Math.random() * 50) + 20;
            b = Math.floor(Math.random() * 30) + 10;
            let c = Math.floor(Math.random() * 20) + 5;
            ans = a + b - c;
            q = `${a} + ${b} - ${c} = ?`;
        }
        else {
            // Level 17-20: Hard Mode (Perkalian Puluhan atau Campuran Kali + Tambah)
            a = Math.floor(Math.random() * 5) + 2;
            b = Math.floor(Math.random() * 10) + 5;
            let c = Math.floor(Math.random() * 15) + 5;
            ans = (a * b) + c;
            q = `(${a} × ${b}) + ${c} = ?`;
        }

        return { q: q, ans: ans };
    }

    // --- RENDER ENGINE (Anti-Refresh Input) ---
    function render() {
        if (gameState.currentPage === 'intro') {
            wrapper.innerHTML = `
                <div id="mq-container" style="text-align:center; font-family:monospace; background:#020617; color:#33ff33; padding:30px; border-radius:15px; border:2px solid #33ff33; box-shadow: 0 0 20px rgba(0,255,0,0.2);">
                    <h2 style="color:#f472b6; letter-spacing:2px;">> MATH QUEST: HARDCORE</h2>
                    <p style="color:#a1a1aa; line-height:1.6; margin:20px 0;">
                        Sistem terenkripsi! Selesaikan 20 level matematika.<br>
                        Setiap level akan semakin sulit.<br>
                        Waktu Anda: 3 Menit.
                    </p>
                    <button onclick="window.mqAction('start')" style="padding:15px 40px; background:#33ff33; border:none; color:#020617; cursor:pointer; font-weight:bold; font-size:1.1rem; border-radius:5px;">MULAI DEKRIPSI</button>
                </div>`;
        } else if (gameState.currentPage === 'playing') {
            wrapper.innerHTML = `
                <div id="mq-container" style="text-align:center; font-family:monospace; background:#020617; color:#33ff33; padding:20px; border-radius:15px; border:2px solid #33ff33; min-height:380px; position:relative;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid rgba(51,255,51,0.3); padding-bottom:10px;">
                        <span>LVL: <b id="mq-room" style="color:#fff;">1/20</b></span>
                        <span id="mq-timer" style="color:#fff; font-weight:bold;">⏱ 03:00</span>
                        <span id="mq-hp" style="color:#ff3333;">HP: ❤️❤️❤️</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:30px; border-radius:10px; margin:20px 0; border:1px solid rgba(51,255,51,0.1);">
                        <h1 id="mq-question" style="font-size:3rem; margin:0; color:#fff; text-shadow: 0 0 10px rgba(255,255,255,0.5);">0 + 0 = ?</h1>
                    </div>
                    <input type="number" id="mq-input" placeholder="CODE" style="width:180px; padding:15px; background:rgba(0,0,0,0.5); border:2px solid #33ff33; color:#33ff33; font-size:2rem; text-align:center; outline:none; border-radius:10px;">
                    <p id="mq-feedback" style="margin-top:25px; font-weight:bold; letter-spacing:1px; min-height:1.2em;">// STANDBY</p>
                </div>`;
            
            const input = document.getElementById('mq-input');
            input.addEventListener('keypress', (e) => { if(e.key === 'Enter') window.mqAction('submit'); });
            input.focus();
            
            refreshUI();
        }
    }

    // Fungsi Update Teks (Tidak mengganggu input user)
    function refreshUI() {
        if (gameState.currentPage !== 'playing') return;
        
        document.getElementById('mq-room').innerText = `${gameState.currentRoom}/${gameState.totalRooms}`;
        document.getElementById('mq-hp').innerText = `HP: ${'❤️'.repeat(gameState.hp)}`;
        document.getElementById('mq-question').innerText = gameState.currentProblem.q;
        
        const feedbackEl = document.getElementById('mq-feedback');
        feedbackEl.innerText = gameState.feedback;
        feedbackEl.style.color = gameState.feedback.includes('SALAH') ? '#ff3333' : '#33ff33';
        
        const min = Math.floor(gameState.timer / 60);
        const sec = gameState.timer % 60;
        const timerEl = document.getElementById('mq-timer');
        timerEl.innerText = `⏱ ${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (gameState.timer < 30) timerEl.style.color = '#ff3333';
    }

    window.mqAction = (action) => {
        if (action === 'start') {
            gameState.currentPage = 'playing';
            gameState.currentRoom = 1;
            gameState.hp = 3;
            gameState.timer = 180; 
            gameState.currentProblem = generateProblem(1);
            render();
            
            if(timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                gameState.timer--;
                if (gameState.timer <= 0) {
                    clearInterval(timerInterval);
                    finishGame(false, "WAKTU HABIS!");
                } else {
                    refreshUI();
                }
            }, 1000);
        } else if (action === 'submit') {
            const input = document.getElementById('mq-input');
            if(input.value === "") return;

            const val = parseInt(input.value);
            
            if (val === gameState.currentProblem.ans) {
                gameState.currentRoom++;
                gameState.feedback = "✔️ AKSES DITERIMA!";
                
                if (gameState.currentRoom > gameState.totalRooms) {
                    clearInterval(timerInterval);
                    finishGame(true, "DEKRIPSI BERHASIL!");
                } else {
                    gameState.currentProblem = generateProblem(gameState.currentRoom);
                    input.value = '';
                    refreshUI();
                }
            } else {
                gameState.hp--;
                gameState.feedback = "❌ KODE SALAH! (HP -1)";
                input.value = '';
                if (gameState.hp <= 0) {
                    clearInterval(timerInterval);
                    finishGame(false, "SYSTEM CRASHED!");
                } else {
                    refreshUI();
                }
            }
        }
    };

    function finishGame(win, message) {
        gameState.currentPage = 'end';
        wrapper.innerHTML = `
            <div style="text-align:center; font-family:monospace; background:#020617; color:${win ? '#33ff33' : '#ff3333'}; padding:40px; border-radius:15px; border:2px solid ${win ? '#33ff33' : '#ff3333'};">
                <h1 style="margin:0;">${message}</h1>
                <p style="color:#fff; margin:20px 0;">Room Terakhir: ${gameState.currentRoom - 1} / ${gameState.totalRooms}</p>
                <button onclick="startMathQuest()" style="padding:15px 30px; background:none; border:2px solid ${win ? '#33ff33' : '#ff3333'}; color:${win ? '#33ff33' : '#ff3333'}; cursor:pointer; font-weight:bold;">ULANGI MISI</button>
            </div>`;
    }

    render();
};