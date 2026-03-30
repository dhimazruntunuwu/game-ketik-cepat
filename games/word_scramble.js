window.startWordScrambleGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    const words = ["MAKAN", "MINUM", "BELAJAR", "PROGRAMMER", "INDONESIA", "SURABAYA", "KODING", "GADGET", "KOMPUTER", "LAPTOP"];
    let currentWord = "";
    let scrambled = "";
    let score = 0;

    wrapper.innerHTML = `
        <div style="text-align:center; font-family:sans-serif; padding:20px; background:#f0fdf4; border-radius:20px;">
            <h2 style="color:#16a34a;">🔤 Susun Kata</h2>
            <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <p style="font-size:0.9rem; color:#64748b;">Susun huruf acak ini:</p>
                <h1 id="scrambled-word" style="letter-spacing:8px; color:#16a34a; margin:15px 0;">-----</h1>
                <input type="text" id="word-input" placeholder="Ketik jawaban..." style="padding:12px; width:80%; border:2px solid #bbf7d0; border-radius:10px; font-size:1.1rem; text-align:center; outline:none;">
                <br><br>
                <button id="check-word" style="padding:12px 30px; background:#16a34a; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">TEBAK!</button>
            </div>
            <p id="word-msg" style="margin-top:15px; font-weight:bold;"></p>
        </div>
    `;

    function nextWord() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        scrambled = currentWord.split('').sort(() => Math.random() - 0.5).join('');
        document.getElementById('scrambled-word').innerText = scrambled;
        document.getElementById('word-input').value = "";
        document.getElementById('word-input').focus();
    }

    document.getElementById('check-word').onclick = function() {
        const input = document.getElementById('word-input').value.toUpperCase();
        const msg = document.getElementById('word-msg');
        if(input === currentWord) {
            score++;
            msg.innerText = "BENAR! 🌟"; msg.style.color = "#16a34a";
            stats.innerText = `Skor: ${score} | 🔤 Word Scramble`;
            setTimeout(nextWord, 1000);
        } else {
            msg.innerText = "SALAH! Coba lagi."; msg.style.color = "#dc2626";
        }
    };

    nextWord();
};