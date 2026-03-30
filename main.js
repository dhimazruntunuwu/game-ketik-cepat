/**
 * Konfigurasi Database Game
 * id: ID unik game
 * name: Nama yang tampil di menu
 * icon: Emoji ikon
 * isZen: true (Mode Santai), false (Pakai Timer 60s)
 * method: Nama fungsi yang dipanggil untuk mulai game
 */
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
    { id: 'math_story', name: 'Math Story', icon: '📚', isZen: true, method: 'startMathStory' }
];

let timeLeft = 60;
let timerInterval;

/**
 * Inisialisasi Menu Utama
 */
function initMenu() {
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
    clearInterval(timerInterval);
    location.reload(); 
}

window.onload = initMenu;