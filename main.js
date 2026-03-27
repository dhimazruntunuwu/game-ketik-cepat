// Daftar Game (Total 13 Game)
const games = [
    { id: 'typing', name: 'Ketik Cepat', icon: '⌨️' },
    { id: 'snake', name: 'Snake Klasik', icon: '🐍' },
    { id: 'bug', name: 'Catch Bug', icon: '🦟' },
    { id: 'memory', name: 'Memo-Droid', icon: '🧩' },
    { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '⭕' },
    { id: 'math', name: 'Math Rush', icon: '➕' },
    { id: 'whac', name: 'Whack-a-Mole', icon: '🔨' },
    { id: 'dino', name: 'Dino Jump', icon: '🦖' },
    { id: 'code', name: 'Tebak Kode', icon: '🔢' },
    { id: 'color', name: 'Color Match', icon: '🎨' },
    { id: 'math_sub', name: 'Kurang-Kurangan', icon: '➖' },
    { id: 'math_mul', name: 'Kali-Kalian', icon: '✖️' },
    { id: 'math_div', name: 'Bagi-Bagian', icon: '➗' }
];

let timeLeft = 60; // Timer dalam detik
let timerInterval;

// Inisialisasi Menu Grid
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

// Fungsi Countdown Global
function startCountdown() {
    const stats = document.getElementById('game-stats');
    timeLeft = 60; // Reset ke 1 menit setiap game mulai
    
    // Bersihkan interval lama jika ada (mencegah timer double)
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        // Update tampilan skor dan waktu
        // Kita ambil bagian skor saja jika stats.innerText sudah ada isinya
        let currentScore = stats.innerText.split('|')[0] || "Skor: 0";
        stats.innerText = `${currentScore} | ⏳ ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Waktu Habis! Game Selesai.");
            goHome(); // Kembali ke menu utama
        }
    }, 1000);
}

// Fungsi untuk Menjalankan Game berdasarkan ID
function launchGame(id) {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    
    // Jalankan timer setiap kali game dipilih
    startCountdown();

    // Switch Case untuk memanggil fungsi dari file di folder games/
    switch(id) {
        case 'typing': startTypingGame(); break;
        case 'snake': startSnakeGame(); break;
        case 'bug': startBugGame(); break;
        case 'memory': startMemoryGame(); break;
        case 'tictactoe': startTictactoeGame(); break;
        case 'math': startMathGame(); break;
        case 'whac': startWhacGame(); break;
        case 'dino': startPlatformerGame(); break;
        case 'code': startCodeGame(); break;
        case 'color': startColorGame(); break;
        case 'math_sub': startSubtractionGame(); break;
        case 'math_mul': startMultiplicationGame(); break;
        case 'math_div': startDivisionGame(); break;
        default: console.error("Fungsi game tidak ditemukan!");
    }
}

// Fungsi Kembali ke Menu Utama
function goHome() {
    clearInterval(timerInterval); // Hentikan timer agar tidak jalan di background
    location.reload(); 
}

window.onload = initMenu;