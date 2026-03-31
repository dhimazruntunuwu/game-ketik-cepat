/**
 * Konfigurasi Database Game
 * id: ID unik game
 * name: Nama yang tampil di menu
 * icon: Emoji ikon
 * isZen: true (Mode Santai), false (Pakai Timer 60s)
 * method: Nama fungsi yang dipanggil untuk mulai game
 */

// URL Web App dari Google Apps Script (Ganti dengan URL milikmu)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVoVPNOf_aGlgDvj7VlUHS65-FYe896rwt0alTEYoPD9idL_j5PM8szBhlOzr9Ws76/exec";

const games = [
    { id: 'typing', name: 'Ketik Cepat', icon: '⌨️', isZen: false, method: 'startTypingGame' },
    { id: 'snake', name: 'Snake Klasik', icon: '🐍', isZen: true, method: 'startSnakeGame' },
    { id: 'bug', name: 'Catch Bug', icon: '🦟', isZen: false, method: 'startBugGame' },
    { id: 'memory', name: 'Memo-Droid', icon: '🧠', isZen: false, method: 'startMemoryGame' },
    { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '⭕', isZen: false, method: 'startTictactoeGame' },
    { id: 'math', name: 'Math Rush', icon: '➕', isZen: false, method: 'startMathGame' },
    { id: 'whac', name: 'Whack-a-Mole', icon: '🔨', isZen: false, method: 'startWhacGame' },
    { id: 'dino', name: 'Dino Jump', icon: '🌵', isZen: true, method: 'startDinoGame' },
    { id: 'code', name: 'Tebak Kode', icon: '🔐', isZen: true, method: 'startCodeGame' },
    { id: 'color', name: 'Color Match', icon: '🌈', isZen: false, method: 'startColorGame' },
    { id: 'math_sub', name: 'Kurang-Kurangan', icon: '➖', isZen: false, method: 'startSubtractionGame' },
    { id: 'math_mul', name: 'Kali-Kalian', icon: '✖️', isZen: false, method: 'startMultiplicationGame' },
    { id: 'math_div', name: 'Bagi-Bagian', icon: '➗', isZen: false, method: 'startDivisionGame' },
    { id: 'drawing', name: 'Menggambar', icon: '🎨', isZen: true, method: 'startDrawingGame' },
    { id: 'flappy', name: 'Flappy Box', icon: '🐦', isZen: false, method: 'startFlappyGame' },
    { id: '2048', name: '2048 Lite', icon: '🔢', isZen: false, method: 'start2048Game' },
    { id: 'stack', name: 'Tower Stack', icon: '🏗️', isZen: false, method: 'startStackGame' },
    { id: 'bricks', name: 'Brick Breaker', icon: '🧱', isZen: true, method: 'startBricksGame' },
    { id: 'tetris', name: 'Tetris Classic', icon: '🕹️', isZen: true, method: 'startTetrisGame' },
    { id: 'racer', name: 'Traffic Racer', icon: '🏎️', isZen: true, method: 'startRacerGame' },
    { id: 'knife', name: 'Knife Hit', icon: '🔪', isZen: true, method: 'startKnifeGame' },
    { id: 'miner', name: 'Gold Miner', icon: '⛏️', isZen: false, method: 'startMinerGame' },
    { id: 'minesweeper', name: 'Ranjau Darat', icon: '💣', isZen: true, method: 'startMinesweeperGame' },
    { id: 'simon', name: 'Simon Says', icon: '🧠', isZen: true, method: 'startSimonGame' },
    { id: 'jigsaw', name: 'Jigsaw', icon: '🧩', isZen: true, method: 'startJigsawGame' },
    { id: 'ular_tangga', name: 'Ular Tangga', icon: '🎲', isZen: true, method: 'startUlarTanggaGame' },
    { id: 'tebak_koin', name: 'Tebak Koin', icon: '🪙', isZen: true, method: 'startTebakKoinGame' },
    { id: 'suit', name: 'Suit Jepang', icon: '✊', isZen: true, method: 'startSuitGame' },
    { id: 'word_scramble', name: 'Susun Kata', icon: '🔤', isZen: true, method: 'startWordScrambleGame' },
    { id: 'tower_defense', name: 'Benteng TD', icon: '🏹', isZen: true, method: 'startTowerDefenseGame' },
    { id: 'sudoku', name: 'Sudoku Mini', icon: '🔢', isZen: true, method: 'startSudokuGame' },
    { id: 'rhythm', name: 'Rhythm Master', icon: '🎵', isZen: true, method: 'startRhythmGame' },
    { id: 'hole', name: 'Hole.io Lite', icon: '🕳️', isZen: true, method: 'startHoleGame' },
    { id: 'liquid_sort', name: 'Liquid Sort', icon: '🧪', isZen: true, method: 'startLiquidSortGame' },
    { id: 'lunar_lander', name: 'Lunar Lander', icon: '🚀', isZen: true, method: 'startLunarLanderGame' },
    { id: 'piano', name: 'Piano Hero', icon: '🎹', isZen: true, method: 'startPianoGame' },
    { id: 'math_quest', name: 'Math Quest', icon: '🛡️', isZen: true, method: 'startMathQuest' },
    { id: 'math_story', name: 'Math Story', icon: '📚', isZen: true, method: 'startMathStory' },
    { id: 'gravity', name: 'Gravity Flip', icon: '🌌', isZen: true, method: 'startGravityGame' },
    { id: 'light_reflector', name: 'Laser Mirror', icon: '🔦', isZen: true, method: 'startLightReflector' },
    { id: 'word', name: 'Word Search', icon: '🗺️', isZen: true, method: 'startWordSearchGame' },
    { id: 'pong', name: 'Pong Remake', icon: '🎾', isZen: true, method: 'startPongGame' },
    { id: 'go', name: 'Go Game', icon: '⚪', isZen: true, method: 'startGoGame' }, 
    { id: 'othello', name: 'Othello', icon: '🌗', isZen: true, method: 'startOthello' },
    { id: 'light_sout', name: 'Lights Out', icon: '💡', isZen: true, method: 'startLightSout' },
];

let timeLeft = 60;
let timerInterval;
let lastScrollPosition = 0;

// --- 1. LOGIKA USERNAME & PENYIMPANAN ---
function checkUser() {
    const savedName = localStorage.getItem('playerName');
    const userDisplay = document.getElementById('user-display');
    const modal = document.getElementById('name-modal');
    const editLabel = document.getElementById('edit-label');

    if (savedName) {
        userDisplay.innerText = `👤 ${savedName}`;
        modal.classList.add('hidden'); // Sembunyikan modal jika nama sudah ada
        if (editLabel) editLabel.style.display = 'inline';
    } else {
        userDisplay.innerText = '';
        modal.classList.remove('hidden'); // Tampilkan modal jika nama kosong
        if (editLabel) editLabel.style.display = 'none';
        
        // Fokuskan ke input secara otomatis
        setTimeout(() => {
            document.getElementById('username-input').focus();
        }, 100);
    }
}

// Tambahkan trigger Enter pada input agar lebih user-friendly
document.getElementById('username-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        saveName();
    }
});

function editName() {
    // 1. Tampilkan modal kembali
    const modal = document.getElementById('name-modal');
    const input = document.getElementById('username-input');
    const savedName = localStorage.getItem('playerName');

    if (modal) {
        modal.classList.remove('hidden');
        
        // 2. Isi input dengan nama lama agar user tinggal ubah sedikit jika mau
        if (input && savedName) {
            input.value = savedName;
            input.focus();
            input.select(); // Otomatis blok teks agar mudah diganti
        }
    }
}

function saveName() {
    const input = document.getElementById('username-input');
    const name = input.value.trim();

    if (name.length >= 2) {
        // 1. Simpan nama baru
        localStorage.setItem('playerName', name);
        
        // 2. Sembunyikan modal
        const modal = document.getElementById('name-modal');
        if (modal) modal.classList.add('hidden');
        
        // 3. Update tampilan nama di header
        checkUser();
    } else {
        alert("Masukkan nama minimal 2 karakter ya!");
    }
}

function saveName() {
    const input = document.getElementById('username-input');
    const name = input.value.trim();

    if (name.length >= 2) {
        localStorage.setItem('playerName', name);
        checkUser();
    } else {
        alert("Masukkan nama minimal 2 karakter ya!");
    }
}

// --- TAMBAHAN 1: LOGIKA TEMA (DARK MODE) ---
function initTheme() {
    // Ambil preferensi dari storage, default ke 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'light' ? '🌙 Mode Gelap' : '☀️ Mode Terang';
    }
}
// ------------------------------------------

// --- 3. GLOBAL LEADERBOARD (SPREADSHEET) ---
function saveToSpreadsheet(gameId, score) {
    const playerName = localStorage.getItem('playerName') || 'Anonymous';
    const data = { playerName, gameId, score };

    fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
        mode: 'no-cors'
    })
    .then(() => console.log("Skor dikirim ke Spreadsheet!"))
    .catch(err => console.error("Gagal kirim skor:", err));
}

async function showLeaderboard(gameId) {
    const wrapper = document.getElementById('game-canvas-wrapper');
    // Buat loading sederhana
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = "<p>Memuat Skor Global...</p>";
    wrapper.appendChild(loadingDiv);

    try {
        const response = await fetch(SCRIPT_URL);
        const allData = await response.json();
        
        // Filter data berdasarkan Game ID dan urutkan skor tertinggi
        const gameScores = allData
            .filter(d => d.gameId === gameId)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Ambil Top 5 saja

        let html = `
            <div class="leaderboard-container">
                <h4>🏆 Top 5 Global: ${gameId.toUpperCase()}</h4>
                <table class="leaderboard-table">
                    ${gameScores.map((s, i) => `
                        <tr>
                            <td>${i + 1}. ${s.name}</td>
                            <td><b>${s.score}</b></td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
        
        loadingDiv.remove();
        wrapper.innerHTML += html;
    } catch (err) {
        loadingDiv.innerHTML = "<p>Gagal memuat skor global.</p>";
        console.error(err);
    }
}

/**
 * Inisialisasi Menu Utama
 */
function initMenu() {
    initTheme();
    checkUser();
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    grid.innerHTML = games.map(g => `
        <div class="game-card" onclick="launchGame('${g.id}')">
            <div class="icon">${g.icon}</div>
            <h3>${g.name}</h3>
        </div>
    `).join('');
}

/**
 * Logika Timer Countdown
 */
function startCountdown() {
    const stats = document.getElementById('game-stats');
    timeLeft = 60; 
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        let currentScore = stats.innerText.split('|')[0] || "Skor: 0";
        stats.innerText = `${currentScore} | ⏳ ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Waktu Habis! Game Selesai.");
            goHome();
        }
    }, 1000);
}

/**
 * Fungsi Launch Game Otomatis (Tanpa Switch Case)
 */
function launchGame(id) {
    const game = games.find(g => g.id === id);
    if (!game) return console.error("Game tidak ditemukan!");

    // --- SIMPAN POSISI SCROLL SEBELUM PINDAH ---
    lastScrollPosition = window.scrollY;

    // UI Transition
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    document.getElementById('game-canvas-wrapper').innerHTML = '';

    const stats = document.getElementById('game-stats');

    // Pengaturan Mode Game (Zen vs Timer)
    if (game.isZen) {
        stats.innerText = `Skor: 0 | 🦖 Mode Santai`;
        clearInterval(timerInterval);
    } else {
        startCountdown();
    }

    /**
     * Memanggil fungsi game secara dinamis.
     * window[game.method] akan mencari fungsi global dengan nama tersebut.
     */
    if (typeof window[game.method] === 'function') {
        window[game.method]();
    } else {
        console.error(`Fungsi ${game.method} belum dibuat di folder /games/!`);
        alert("Game ini sedang dalam pengembangan.");
        goHome();
    }
}

function goHome() {
    // Hentikan timer agar tidak bocor ke game lain
    clearInterval(timerInterval);
    
    // Sembunyikan area game & tampilkan menu (Tanpa Refresh)
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    
    // Bersihkan canvas agar memori tidak berat
    const wrapper = document.getElementById('game-canvas-wrapper');
    wrapper.innerHTML = ''; 
    
    // Reset skor tampilan
    document.getElementById('game-stats').innerText = "Skor: 0";
    
    // --- KEMBALIKAN POSISI SCROLL ---
    // Gunakan setTimeout agar browser selesai merender menu sebelum scroll dijalankan
    setTimeout(() => {
        window.scrollTo({
            top: lastScrollPosition,
            behavior: 'instant' // Gunakan 'smooth' jika ingin efek animasi scroll
        });
    }, 10);
}

window.onload = initMenu;