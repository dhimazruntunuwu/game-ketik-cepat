/**
 * Kraepelin Test Game - Fun Game Hub
 * Fitur: Dark Mode, Auto-Save, Seamless Leaderboard, & Mobile Responsive
 */

function startKraepelin() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    let score = 0;
    let timeLeft = 60; 
    let switchInterval = 15; 
    let currentColumn = [];
    let gameActive = false;
    let timerInterval, moveInterval;

    // UI Structure
    wrapper.innerHTML = `
        <div id="kraepelin-container" style="display: flex; flex-direction: column; align-items: center; padding: 10px; width: 100%; max-width: 600px; margin: 0 auto;">
            
            <div id="kraepelin-board" style="display: flex; gap: 15px; background: var(--white); padding: 20px; border-radius: 24px; border: 2px solid var(--prm-light); min-height: 350px; overflow: hidden; transition: all 0.3s ease; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); align-items: flex-end;">
                </div>
            
            <div id="kraepelin-controls" style="margin-top: 20px; text-align: center; width: 100%;">
                <input type="number" id="kraepelin-input" placeholder="?" 
                    style="width: 90px; font-size: 2.5rem; text-align: center; padding: 12px; border: 3px solid var(--prm); border-radius: 20px; outline: none; background: var(--bg); color: var(--slate-dark); transition: all 0.2s;">
                <p id="kraepelin-hint" style="margin-top: 12px; color: var(--slate); font-size: 0.85rem; font-weight: 500;">
                    Jumlahkan 2 angka terbawah, ketik digit terakhirnya.
                </p>
            </div>

            <div id="kraepelin-overlay" class="hidden" style="margin-top: 20px; width: 100%; animation: fadeIn 0.4s ease-out;">
                <div style="background: var(--prm-light); padding: 25px; border-radius: 24px; text-align: center; border: 2px solid var(--prm);">
                    <h2 style="color: var(--prm); margin: 0; font-size: 1.2rem;">Waktu Habis!</h2>
                    <div style="display: flex; justify-content: center; align-items: baseline; gap: 8px; margin: 15px 0;">
                        <span style="font-size: 3.5rem; font-weight: 800; color: var(--slate-dark);" id="kraepelin-final-score">0</span>
                        <span style="color: var(--prm); font-weight: 700;">Skor</span>
                    </div>
                    <button onclick="startKraepelin()" class="btn-back" style="width: 100%; background: var(--prm); color: white; border: none; padding: 15px; border-radius: 15px; font-weight: bold; cursor: pointer;">
                        Main Lagi
                    </button>
                </div>
                
                <div style="margin-top: 25px;">
                    <h3 style="text-align: center; color: var(--slate-dark); margin-bottom: 15px;">🏆 Peringkat Teratas</h3>
                    <div id="kraepelin-leaderboard-content" style="background: var(--white); border-radius: 20px; padding: 10px; border: 1px solid var(--prm-light);">
                        <p style="text-align:center; color:var(--slate); padding: 20px;">Memuat data...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const board = document.getElementById('kraepelin-board');
    const input = document.getElementById('kraepelin-input');
    const overlay = document.getElementById('kraepelin-overlay');
    const hint = document.getElementById('kraepelin-hint');
    
    // Auto-focus untuk Xiaomi/Mobile
    setTimeout(() => input.focus(), 200);

    function generateColumn() {
        const col = [];
        for (let i = 0; i < 12; i++) {
            col.push(Math.floor(Math.random() * 10));
        }
        return col;
    }

    function renderBoard() {
        board.innerHTML = '';
        currentColumn.forEach((num, index) => {
            const numDiv = document.createElement('div');
            numDiv.innerText = num;
            
            const isHighlight = index >= currentColumn.length - 2;
            numDiv.style.cssText = `
                font-size: 2rem; 
                font-weight: 800; 
                padding: 5px 10px;
                color: ${isHighlight ? 'var(--prm)' : 'var(--slate)'};
                opacity: ${isHighlight ? '1' : '0.25'};
                transition: all 0.2s ease;
                ${index === currentColumn.length - 1 ? 'border-bottom: 4px solid var(--prm)' : ''}
            `;
            board.prepend(numDiv); 
        });
    }

    function initGame() {
        score = 0;
        timeLeft = 60;
        currentColumn = generateColumn();
        gameActive = true;
        renderBoard();
        
        stats.innerText = `Skor: 0 | ⏳ 60s`;
        overlay.classList.add('hidden');
        input.classList.remove('hidden');
        hint.classList.remove('hidden');
        input.value = '';

        timerInterval = setInterval(() => {
            timeLeft--;
            stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
            if (timeLeft <= 0) endGame();
        }, 1000);

        moveInterval = setInterval(() => {
            if(!gameActive) return;
            currentColumn = generateColumn();
            renderBoard();
            // Efek visual pindah kolom
            board.style.transform = "scale(0.98)";
            setTimeout(() => board.style.transform = "scale(1)", 150);
        }, switchInterval * 1000);
    }

    input.oninput = () => {
        if (!gameActive) return;
        
        const typedValue = input.value.trim();
        if (typedValue === "") return;

        const val = parseInt(typedValue.slice(-1)); 
        const num1 = currentColumn[currentColumn.length - 1];
        const num2 = currentColumn[currentColumn.length - 2];
        const correctAns = (num1 + num2) % 10;

        if (val === correctAns) {
            score++;
            currentColumn.pop(); 
            if (currentColumn.length < 2) currentColumn = generateColumn();
            renderBoard();
            input.value = ''; 
        } else {
            // Feedback salah
            input.style.borderColor = "#ef4444";
            input.style.backgroundColor = "#fee2e2";
            setTimeout(() => {
                input.style.borderColor = "var(--prm)";
                input.style.backgroundColor = "var(--bg)";
                input.value = '';
            }, 180);
        }
    };

    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        clearInterval(moveInterval);
        
        // Transisi ke Layar Hasil
        input.classList.add('hidden');
        hint.classList.add('hidden');
        overlay.classList.remove('hidden');
        document.getElementById('kraepelin-final-score').innerText = score;

        // 1. Simpan ke Spreadsheet
        if (typeof saveToSpreadsheet === 'function') {
            saveToSpreadsheet('kraepelin', score);
        }

        // 2. Tampilkan Leaderboard di elemen lokal
        if (typeof showLeaderboard === 'function') {
            showLeaderboard('kraepelin', 'kraepelin-leaderboard-content');
        }
    }

    initGame();
}

window.startKraepelin = startKraepelin;