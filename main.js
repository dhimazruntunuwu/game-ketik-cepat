// Daftar Game (Total 14 Game)
const games = [
    { id: 'typing', name: 'Ketik Cepat', icon: '⌨️' },
    { id: 'snake', name: 'Snake Klasik', icon: '🐍' },
    { id: 'bug', name: 'Catch Bug', icon: '🦟' },
    { id: 'memory', name: 'Memo-Droid', icon: '🧠' },
    { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '⭕' },
    { id: 'math', name: 'Math Rush', icon: '➕' },
    { id: 'whac', name: 'Whack-a-Mole', icon: '🔨' },
    { id: 'dino', name: 'Dino Jump', icon: '🌵' },
    { id: 'code', name: 'Tebak Kode', icon: '🔐' },
    { id: 'color', name: 'Color Match', icon: '🌈' },
    { id: 'math_sub', name: 'Kurang-Kurangan', icon: '➖' },
    { id: 'math_mul', name: 'Kali-Kalian', icon: '✖️' },
    { id: 'math_div', name: 'Bagi-Bagian', icon: '➗' },
    { id: 'drawing', name: 'Menggambar', icon: '🎨' },
    { id: 'flappy', name: 'Flappy Box', icon: '🐦' },
    { id: '2048', name: '2048 Lite', icon: '🔢' },
    { id: 'stack', name: 'Tower Stack', icon: '🏗️' },
    { id: 'bricks', name: 'Brick Breaker', icon: '🧱' },
    { id: 'tetris', name: 'Tetris Classic', icon: '🕹️' },
    { id: 'racer', name: 'Traffic Racer', icon: '🏎️' },
    { id: 'knife', name: 'Knife Hit', icon: '🔪' },
    { id: 'miner', name: 'Gold Miner', icon: '⛏️' },
    { id: 'minesweeper', name: 'Ranjau Darat', icon: '💣' },
    { id: 'simon', name: 'Simon Says', icon: '🧠' },
    { id: 'jigsaw', name: 'Jigsaw', icon: '🧩' },
    {id: "ular_tangga", name: "Ular Tangga",icon: "🎲"},
    { id: "tebak_koin", name: "Tebak Koin", icon: "🪙" },
    { id: "suit", name: "Suit Jepang", icon: "✊" },
    { id: 'word_scramble', name: 'Susun Kata', icon: '🔤' },
    { id: 'tower_defense', name: 'Benteng TD', icon: '🏹' },
    { id: 'sudoku', name: 'Sudoku Mini', icon: '🔢' },
    { id: 'rhythm', name: 'Rhythm Master', icon: '🎵' },
    { id: 'hole', name: 'Hole.io Lite', icon: '🕳️' },
    { id: 'liquid_sort', name: 'Liquid Sort', icon: '🧪' },
    { id: 'lunar_lander', name: 'Lunar Lander', icon: '🚀' },
    { id: 'piano', name: 'Piano Hero', icon: '🎹' },
    { id: 'math_quest', name: 'Math Quest', icon: '🛡️' }

];

let timeLeft = 60;
let timerInterval;

function initMenu() {
    const grid = document.getElementById('menu-grid');
    if(!grid) return;
    grid.innerHTML = games.map(g => `
        <div class="game-card" onclick="launchGame('${g.id}')">
            <div class="icon">${g.icon}</div>
            <h3>${g.name}</h3>
        </div>
    `).join('');
}

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

function launchGame(id) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    
    const stats = document.getElementById('game-stats');

   // 2. Cek Mode (Santai vs Timer)
    const zenGames = ['snake', 'dino', 'drawing', 'code', 
        'bricks', 'tetris', 'racer', 'knife', 'minesweeper',
         'simon', 'jigsaw', 'ular_tangga', 'word_scramble',
        'tebak_koin', 'suit', 'tower_defense', 'sudoku',
        'rhythm', 'hole', 'liquid_sort', 'lunar_lander', 'piano',
        'math_quest'];
    if (zenGames.includes(id)) {
        stats.innerText = `Skor: 0 | 🦖 Mode Santai`;
    } else {
        startCountdown(); // Jalankan timer untuk Bug Game, Typing, dll.
    }

    // Pembersihan wrapper sebelum game baru dimulai
    document.getElementById('game-canvas-wrapper').innerHTML = '';

    switch(id) {
        case 'typing': startTypingGame(); break;
        case 'snake': startSnakeGame(); break;
        case 'bug': startBugGame(); break;
        case 'memory': startMemoryGame(); break;
        case 'tictactoe': startTictactoeGame(); break;
        case 'math': startMathGame(); break;
        case 'whac': startWhacGame(); break;
        case 'dino': startDinoGame(); break;
        case 'code': startCodeGame(); break;
        case 'color': startColorGame(); break;
        case 'math_sub': startSubtractionGame(); break;
        case 'math_mul': startMultiplicationGame(); break;
        case 'math_div': startDivisionGame(); break;
        case 'drawing': startDrawingGame(); break;
        case 'flappy': startFlappyGame(); break;
        case '2048': start2048Game(); break;
        case 'stack': startStackGame(); break;
        case 'bricks': startBricksGame(); break;
        case 'tetris': startTetrisGame(); break;
        case 'racer': startRacerGame(); break;
        case 'knife': startKnifeGame(); break;
        case 'minesweeper': startMinesweeperGame(); break;
        case 'simon': startSimonGame(); break;
        case 'miner': startMinerGame(); break;
        case 'jigsaw': startJigsawGame(); break;
        case 'ular_tangga': startUlarTanggaGame(); break;
        case 'tebak_koin': startTebakKoinGame(); break;
        case 'suit': startSuitGame(); break;
        case 'word_scramble': startWordScrambleGame(); break;
        case 'tower_defense': startTowerDefenseGame(); break;
        case 'sudoku': startSudokuGame(); break;
        case 'rhythm': startRhythmGame(); break;
        case 'hole': startHoleGame(); break;
        case 'liquid_sort': startLiquidSortGame(); break;
        case 'lunar_lander': startLunarLanderGame(); break;
        case 'piano': startPianoGame(); break;
        case 'math_quest': startMathQuest(); break;

        default: console.error("Fungsi game tidak ditemukan!");
    }
}

function goHome() {
    clearInterval(timerInterval);
    location.reload(); 
}

window.onload = initMenu;