/**
 * Konfigurasi Database Game
 * id: ID unik game
 * name: Nama yang tampil di menu
 * icon: Emoji ikon
 * isZen: true (Mode Santai), false (Pakai Timer 60s)
 * method: Nama fungsi yang dipanggil untuk mulai game
 */

// URL Web App dari Google Apps Script (Ganti dengan URL milikmu)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby96nWUkoD0lMp0BU9PugQhAGJ38ZK0ZCd4N36ftjJsYTl1JUGeUcquNHLBH7F2hu5N/exec";

const games = [
    // --- KATEGORI: ASAH OTAK ---
    { id: 'typing', name: 'Ketik Cepat', icon: '⌨️', category: 'Asah Otak', isZen: false, method: 'startTypingGame' },
    { id: 'memory', name: 'Memo-Droid', icon: '🧠', category: 'Asah Otak', isZen: false, method: 'startMemoryGame' },
    { id: 'code', name: 'Tebak Kode', icon: '🔐', category: 'Asah Otak', isZen: true, method: 'startCodeGame' },
    { id: 'simon', name: 'Simon Says', icon: '🧠', category: 'Asah Otak', isZen: true, method: 'startSimonGame' },
    { id: 'word_scramble', name: 'Susun Kata', icon: '🔤', category: 'Asah Otak', isZen: true, method: 'startWordScrambleGame' },
    { id: 'sudoku', name: 'Sudoku Mini', icon: '🔢', category: 'Asah Otak', isZen: true, method: 'startSudokuGame' },
    { id: 'word', name: 'Word Search', icon: '🗺️', category: 'Asah Otak', isZen: true, method: 'startWordSearchGame' },
    { id: 'iq_test', name: 'Tes Logika', icon: '🧠', category: 'Asah Otak', isZen: true, method: 'startIQTest' },
    { id: 'kraepelin', name: 'Tes Kraepelin', icon: '📊', category: 'Asah Otak', isZen: true, method: 'startKraepelin' },
    { id: 'minesweeper', name: 'Ranjau Darat', icon: '💣', category: 'Asah Otak', isZen: true, method: 'startMinesweeperGame' },
    { id: 'light_sout', name: 'Lights Out', icon: '💡', category: 'Asah Otak', isZen: true, method: 'startLightSout' },
    { id: 'sokoban', name: 'Sokoban', icon: '📦', category: 'Asah Otak', isZen: true, method: 'startSokoban' },

    // --- KATEGORI: ARCADE ---
    { id: 'snake', name: 'Snake Klasik', icon: '🐍', category: 'Arcade', isZen: true, method: 'startSnakeGame' },
    { id: 'bug', name: 'Catch Bug', icon: '🦟', category: 'Arcade', isZen: false, method: 'startBugGame' },
    { id: 'whac', name: 'Whack-a-Mole', icon: '🔨', category: 'Arcade', isZen: false, method: 'startWhacGame' },
    { id: 'dino', name: 'Dino Jump', icon: '🌵', category: 'Arcade', isZen: true, method: 'startDinoGame' },
    { id: 'color', name: 'Color Match', icon: '🌈', category: 'Arcade', isZen: false, method: 'startColorGame' },
    { id: 'flappy', name: 'Flappy Box', icon: '🐦', category: 'Arcade', isZen: true, method: 'startFlappyGame' },
    { id: 'stack', name: 'Tower Stack', icon: '🏗️', category: 'Arcade', isZen: false, method: 'startStackGame' },
    { id: 'bricks', name: 'Brick Breaker', icon: '🧱', category: 'Arcade', isZen: true, method: 'startBricksGame' },
    { id: 'tetris', name: 'Tetris Classic', icon: '🕹️', category: 'Arcade', isZen: true, method: 'startTetrisGame' },
    { id: 'racer', name: 'Traffic Racer', icon: '🏎️', category: 'Arcade', isZen: true, method: 'startRacerGame' },
    { id: 'knife', name: 'Knife Hit', icon: '🔪', category: 'Arcade', isZen: true, method: 'startKnifeGame' },
    { id: 'miner', name: 'Gold Miner', icon: '⛏️', category: 'Arcade', isZen: true, method: 'startMinerGame' },
    { id: 'tower_defense', name: 'Benteng TD', icon: '🏹', category: 'Arcade', isZen: true, method: 'startTowerDefenseGame' },
    { id: 'rhythm', name: 'Rhythm Master', icon: '🎵', category: 'Arcade', isZen: true, method: 'startRhythmGame' },
    { id: 'hole', name: 'Hole.io Lite', icon: '🕳️', category: 'Arcade', isZen: true, method: 'startHoleGame' },
    { id: 'lunar_lander', name: 'Lunar Lander', icon: '🚀', category: 'Arcade', isZen: true, method: 'startLunarLanderGame' },
    { id: 'gravity', name: 'Gravity Flip', icon: '🌌', category: 'Arcade', isZen: true, method: 'startGravityGame' },
    { id: 'tower_builder', name: 'Tower Stack', icon: '🏢', category: 'Arcade', isZen: true, method: 'startTowerGame' },

    // --- KATEGORI: MATEMATIKA ---
    { id: 'math', name: 'Math Rush', icon: '➕', category: 'Matematika', isZen: false, method: 'startMathGame' },
    { id: 'math_sub', name: 'Kurang-Kurangan', icon: '➖', category: 'Matematika', isZen: false, method: 'startSubtractionGame' },
    { id: 'math_mul', name: 'Kali-Kalian', icon: '✖️', category: 'Matematika', isZen: false, method: 'startMultiplicationGame' },
    { id: 'math_div', name: 'Bagi-Bagian', icon: '➗', category: 'Matematika', isZen: false, method: 'startDivisionGame' },
    { id: 'math_quest', name: 'Math Quest', icon: '🛡️', category: 'Matematika', isZen: true, method: 'startMathQuest' },
    { id: 'math_story', name: 'Math Story', icon: '📚', category: 'Matematika', isZen: true, method: 'startMathStory' },
    { id: '2048', name: '2048 Lite', icon: '🔢', category: 'Matematika', isZen: false, method: 'start2048Game' },

    // --- KATEGORI: BOARD GAME ---
    { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '⭕', category: 'Board Game', isZen: false, method: 'startTictactoeGame' },
    { id: 'ular_tangga', name: 'Ular Tangga', icon: '🎲', category: 'Board Game', isZen: true, method: 'startUlarTanggaGame' },
    { id: 'suit', name: 'Suit Jepang', icon: '✊', category: 'Board Game', isZen: true, method: 'startSuitGame' },
    { id: 'go', name: 'Go Game', icon: '⚪', category: 'Board Game', isZen: true, method: 'startGoGame' }, 
    { id: 'othello', name: 'Othello', icon: '🌗', category: 'Board Game', isZen: true, method: 'startOthello' },

    // --- KATEGORI: CASUAL ---
    { id: 'tebak_koin', name: 'Tebak Koin', icon: '🪙', category: 'Casual', isZen: true, method: 'startTebakKoinGame' },
    { id: 'drawing', name: 'Menggambar', icon: '🎨', category: 'Casual', isZen: true, method: 'startDrawingGame' },
    { id: 'jigsaw', name: 'Jigsaw', icon: '🧩', category: 'Casual', isZen: true, method: 'startJigsawGame' },
    { id: 'liquid_sort', name: 'Liquid Sort', icon: '🧪', category: 'Casual', isZen: true, method: 'startLiquidSortGame' },
    { id: 'piano', name: 'Piano Hero', icon: '🎹', category: 'Casual', isZen: true, method: 'startPianoGame' },
    { id: 'light_reflector', name: 'Laser Mirror', icon: '🔦', category: 'Casual', isZen: true, method: 'startLightReflector' },
    { id: 'pong', name: 'Pong Remake', icon: '🎾', category: 'Casual', isZen: true, method: 'startPongGame' },
];


let timeLeft = 60;
let timerInterval;
let lastScrollPosition = 0;
let gameLoop;

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

// --- 3. LOGIKA KOTAK SARAN ---
function submitSaran() {
    const input = document.getElementById('suggestion-input');
    const btn = document.getElementById('send-suggestion-btn');
    const saranText = input.value.trim();
    
    // Ambil nama dari localStorage sesuai dengan fungsi saveName() Anda
    const playerName = localStorage.getItem('playerName') || 'Anonymous';

    if (!saranText) {
        alert("Sarannya diisi dulu ya!");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Mengirim...";

    fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Penting untuk Google Apps Script
        headers: {
            "Content-Type": "text/plain", // Gunakan text/plain untuk menghindari preflight CORS
        },
        body: JSON.stringify({
            playerName: playerName,
            gameId: "KOTAK_SARAN", // Ini kunci agar masuk ke Sheet "Saran"
            score: saranText       // Teks saran dikirim sebagai 'score'
        })
    })
    .then(() => {
        alert("Terima kasih sudah memberi saran! 💞");
        input.value = "";
    })
    .catch(err => {
        console.error("Gagal kirim saran:", err);
        alert("Gagal mengirim saran.");
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "Kirim Saran";
    });
}

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
    const loadingDiv = document.createElement('div');
    loadingDiv.id = "leaderboard-loading";
    loadingDiv.innerHTML = "<p>⌛ Mengambil peringkat...</p>";
    wrapper.appendChild(loadingDiv);

    try {
        const response = await fetch(SCRIPT_URL + "?t=" + Date.now());
        const allData = await response.json();
        
        console.log("Data dari Server:", allData); // Cek di Console F12 apakah data muncul

        // Gunakan toLowerCase() agar filter tidak sensitif huruf besar/kecil
        const gameScores = allData
            .filter(d => String(d.gameId).toLowerCase() === String(gameId).toLowerCase())
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        let html = `
            <div class="leaderboard-container">
                <h4>🏆 Top 5 Global: ${gameId.toUpperCase()}</h4>
                <table border="1" style="width:100%; border-collapse: collapse;">
                    ${gameScores.length > 0 ? gameScores.map((s, i) => `
                        <tr>
                            <td>${i + 1}. ${s.name}</td>
                            <td><b>${s.score}</b></td>
                        </tr>
                    `).join('') : '<tr><td>Belum ada skor untuk game ini.</td></tr>'}
                </table>
            </div>
        `;
        
        document.getElementById('leaderboard-loading')?.remove();
        wrapper.insertAdjacentHTML('beforeend', html);
    } catch (err) {
        document.getElementById('leaderboard-loading').innerHTML = "<p>Gagal memuat skor.</p>";
    }
}

/**
 * Inisialisasi Menu Utama
 */
/**
 * Inisialisasi Menu Utama - Diurutkan berdasarkan Abjad Kategori
 */
function initMenu() {
    initTheme();
    checkUser();
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    // Ambil semua kategori unik dari array games, lalu urutkan A-Z
    const categories = [...new Set(games.map(g => g.category))].sort();

    grid.innerHTML = categories.map(cat => {
        const categoryGames = games.filter(g => g.category === cat);
        if (categoryGames.length === 0) return '';

        return `
            <div class="category-wrapper">
                <h2>${cat}</h2>
                <div class="game-grid">
                    ${categoryGames.map(g => `
                        <div class="game-card" onclick="launchGame('${g.id}')">
                            <div class="icon">${g.icon}</div>
                            <h3>${g.name}</h3>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
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

    // HENTIKAN GAME LOOP (Penting!)
    if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        clearInterval(gameLoop);
    }
    
    // Hapus event listener keyboard agar tidak tabrakan
    window.onkeydown = null;
    
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