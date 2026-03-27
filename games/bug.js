function startBugGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Pastikan di awal game stats menampilkan skor 0 dan timer dari main.js
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div id="bug-field" style="height:300px; background:#e2e8f0; position:relative; overflow:hidden; border-radius:10px;">
            <div id="target-bug" style="position:absolute; font-size:40px; cursor:pointer; user-select:none;">🦟</div>
        </div>
    `;
    
    const bug = document.getElementById('target-bug');
    let score = 0;

    function move() {
        const x = Math.random() * (wrapper.offsetWidth - 50);
        const y = Math.random() * 250;
        bug.style.left = x + 'px';
        bug.style.top = y + 'px';
    }

    bug.onclick = () => {
        score++;
        // Pakai variabel timeLeft global dari main.js
        stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
        move();
    };

    // LOGIKA SETINTERVAL DI SINI DIHAPUS 
    // Karena sudah diatur oleh startCountdown() di main.js

    move();
}