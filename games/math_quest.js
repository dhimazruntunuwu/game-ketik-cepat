window.startMathQuest = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // --- STATE GAME ---
    let gameState = {
        currentPage: 'intro',
        currentRoom: 1,
        totalRooms: 10, // Dibuat lebih panjang agar seru
        hp: 3,
        timer: 120,
        currentProblem: null,
        feedback: '// Menunggu dekripsi...',
        score: 0
    };

    let timerInterval = null;

    function generateProblem(room) {
        let a, b, op, ans;
        if (room <= 2) { // Level 1-2: Penjumlahan
            a = Math.floor(Math.random() * 15) + 1;
            b = Math.floor(Math.random() * 15) + 1;
            op = '+'; ans = a + b;
        } else if (room <= 5) { // Level 3-5: Pengurangan & Perkalian Kecil
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 10) + 1;
            op = '-'; ans = a - b;
        } else { // Level 6+: Perkalian & Campuran
            a = Math.floor(Math.random() * 10) + 2;
            b = Math.floor(Math.random() * 9) + 2;
            op = '×'; ans = a * b;
        }
        return { q: `${a} ${op} ${b} = ?`, ans: ans };
    }

    // --- RENDER ENGINE (Mencegah Input Terhapus) ---
    function render() {
        if (gameState.currentPage === 'intro') {
            wrapper.innerHTML = `
                <div id="mq-container" style="text-align:center; font-family:monospace; background:#020617; color:#33ff33; padding:30px; border-radius:15px; border:2px solid #33ff33;">
                    <h2 style="color:#f472b6;">> MATH QUEST: ESCAPE</h2>
                    <p style="color:#a1a1aa; line-height:1.6;">Sistem terkunci. Selesaikan 10 enkripsi matematika dalam 2 menit untuk membuka gerbang pelarian.</p>
                    <button onclick="window.mqAction('start')" style="padding:15px 30px; background:none; border:2px solid #33ff33; color:#33ff33; cursor:pointer; font-weight:bold; margin-top:20px;">[ MULAI DEKRIPSI ]</button>
                </div>`;
        } else if (gameState.currentPage === 'playing') {
            // Render Struktur Utama HANYA SEKALI
            wrapper.innerHTML = `
                <div id="mq-container" style="text-align:center; font-family:monospace; background:#020617; color:#33ff33; padding:20px; border-radius:15px; border:2px solid #33ff33; min-height:350px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid #33ff33; padding-bottom:10px;">
                        <span>ROOM: <b id="mq-room">1/10</b></span>
                        <span id="mq-timer" style="color:#fff;">⏱ 02:00</span>
                        <span id="mq-hp" style="color:#ff3333;">HP: ❤️❤️❤️</span>
                    </div>
                    <div style="background:rgba(0,255,0,0.05); padding:20px; border-radius:10px; margin-bottom:20px;">
                        <h1 id="mq-question" style="font-size:2.5rem; margin:0; color:#fff;">0 + 0 = ?</h1>
                    </div>
                    <input type="number" id="mq-input" placeholder="CODE" style="width:150px; padding:15px; background:none; border:2px solid #33ff33; color:#fff; font-size:1.5rem; text-align:center; outline:none;">
                    <p id="mq-feedback" style="margin-top:20px; font-weight:bold;">// Ready...</p>
                </div>`;
            
            // Pasang Listener Enter
            const input = document.getElementById('mq-input');
            input.addEventListener('keypress', (e) => { if(e.key === 'Enter') window.mqAction('submit'); });
            input.focus();
            
            refreshUI(); // Isi data pertama kali
        }
    }

    // Hanya update teks, tidak me-render ulang elemen (Input Aman!)
    function refreshUI() {
        if (gameState.currentPage !== 'playing') return;
        
        document.getElementById('mq-room').innerText = `${gameState.currentRoom}/${gameState.totalRooms}`;
        document.getElementById('mq-hp').innerText = `HP: ${'❤️'.repeat(gameState.hp)}`;
        document.getElementById('mq-question').innerText = gameState.currentProblem.q;
        document.getElementById('mq-feedback').innerText = gameState.feedback;
        
        // Update Timer
        const min = Math.floor(gameState.timer / 60);
        const sec = gameState.timer % 60;
        const timerEl = document.getElementById('mq-timer');
        timerEl.innerText = `⏱ ${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (gameState.timer < 20) timerEl.style.color = '#ff3333';
    }

    window.mqAction = (action) => {
        if (action === 'start') {
            gameState.currentPage = 'playing';
            gameState.currentRoom = 1;
            gameState.hp = 3;
            gameState.timer = 120;
            gameState.currentProblem = generateProblem(1);
            render();
            
            timerInterval = setInterval(() => {
                gameState.timer--;
                if (gameState.timer <= 0 || gameState.hp <= 0) {
                    clearInterval(timerInterval);
                    finishGame(false);
                } else {
                    refreshUI();
                }
            }, 1000);
        } else if (action === 'submit') {
            const input = document.getElementById('mq-input');
            const val = parseInt(input.value);
            
            if (val === gameState.currentProblem.ans) {
                gameState.currentRoom++;
                gameState.feedback = "✔️ KODE BENAR!";
                if (gameState.currentRoom > gameState.totalRooms) {
                    clearInterval(timerInterval);
                    finishGame(true);
                } else {
                    gameState.currentProblem = generateProblem(gameState.currentRoom);
                    input.value = '';
                    refreshUI();
                }
            } else {
                gameState.hp--;
                gameState.feedback = "❌ KODE SALAH! (HP -1)";
                input.value = '';
                refreshUI();
            }
        }
    };

    function finishGame(win) {
        gameState.currentPage = 'end';
        wrapper.innerHTML = `
            <div style="text-align:center; font-family:monospace; background:#020617; color:${win ? '#33ff33' : '#ff3333'}; padding:40px; border-radius:15px; border:2px solid ${win ? '#33ff33' : '#ff3333'};">
                <h2>${win ? '[ SYSTEM DECRYPTED ]' : '[ SYSTEM OVERLOAD ]'}</h2>
                <p style="color:#fff;">${win ? 'Anda berhasil meloloskan diri!' : 'Sistem meledak sebelum kode selesai.'}</p>
                <button onclick="startMathQuest()" style="padding:15px; background:none; border:2px solid ${win ? '#33ff33' : '#ff3333'}; color:${win ? '#33ff33' : '#ff3333'}; cursor:pointer; margin-top:20px;">MAIN LAGI</button>
            </div>`;
    }

    render();
};