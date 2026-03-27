function startTypingGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // 1. TAMBAHKAN INI: Inisialisasi tampilan stats saat game baru dibuka
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    const words = [
        "ayam", "ikan", "kucing", "kuda", "sapi", "rusa", "burung", "bebek", "gajah", "singa", "ulat", "semut",
        "buku", "meja", "kursi", "pintu", "lampu", "kasur", "piring", "gelas", "sendok", "tas", "baju", "topi",
        "mata", "pipi", "gigi", "kaki", "jari", "bahu", "mama", "papa", "adik", "kakak", "nenek", "kakek",
        "apel", "jeruk", "pisang", "nasi", "susu", "roti", "madu", "keju", "tahu", "tempe", "semangka", "mangga",
        "awan", "bulan", "bumi", "daun", "bunga", "pohon", "hujan", "biru", "merah", "hijau", "kuning", "putih",
        "main", "lari", "baca", "tulis", "makan", "minum", "tidur", "lompat", "senang", "lucu", "besar", "kecil",
        "satu", "dua", "tiga", "empat", "lima", "bola", "roda", "mobil", "sepeda", "balon", "boneka", "layangan"
    ];
    
    let currentWord = words[Math.floor(Math.random() * words.length)];
    let score = 0;

    wrapper.innerHTML = `
        <div id="typing-box" style="text-align: center; padding: 20px;">
            <p style="color: #64748b; font-size: 1.2rem; margin-bottom: 5px;">Ayo Ketik Kata Ini:</p>
            <h2 id="target-word" style="font-size: 4rem; color: #2563eb; margin-bottom: 20px; text-transform: lowercase;">${currentWord}</h2>
            <input type="text" id="type-input" placeholder="Ketik di sini..." autocomplete="off"
                style="width: 100%; max-width: 350px; padding: 15px; border-radius: 15px; border: 4px solid #cbd5e1; font-size: 1.8rem; text-align: center; outline: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                <span style="background: #dcfce7; color: #166534; padding: 5px 15px; border-radius: 20px; font-weight: bold;">Semangat! 🌟</span>
            </div>
        </div>
    `;

    const input = document.getElementById('type-input');
    const target = document.getElementById('target-word');

    input.addEventListener('input', () => {
        const val = input.value.trim().toLowerCase();
        
        if (val === currentWord.toLowerCase()) {
            score++;
            currentWord = words[Math.floor(Math.random() * words.length)];
            target.innerText = currentWord;
            input.value = "";
            
            // 2. UPDATE STATS: Menggunakan variabel timeLeft global dari main.js
            stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
            
            input.style.backgroundColor = "#dcfce7";
            setTimeout(() => { input.style.backgroundColor = "white"; }, 200);
        }
        
        // Logika warna border
        if (val === "") {
            input.style.borderColor = "#cbd5e1";
        } else if (currentWord.toLowerCase().startsWith(val)) {
            input.style.borderColor = "#22c55e";
        } else {
            input.style.borderColor = "#ef4444";
        }
    });
    
    input.focus();
}