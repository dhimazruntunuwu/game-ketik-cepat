function startBugGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    // Beri area yang jelas
    wrapper.innerHTML = `
        <div id="bug-field" style="width:100%; height:350px; background:#f1f5f9; position:relative; overflow:hidden; border:2px solid #cbd5e1; border-radius:12px; cursor:crosshair;">
            <div id="target-bug" style="position:absolute; font-size:40px; cursor:pointer; user-select:none; transition: all 0.2s ease;">🦟</div>
        </div>
    `;
    
    const bug = document.getElementById('target-bug');
    const field = document.getElementById('bug-field');
    let score = 0;

    function move() {
        // Ambil ukuran dari field yang baru dibuat
        const maxX = field.clientWidth - 50;
        const maxY = field.clientHeight - 50;
        
        const x = Math.max(0, Math.floor(Math.random() * maxX));
        const y = Math.max(0, Math.floor(Math.random() * maxY));
        
        bug.style.left = x + 'px';
        bug.style.top = y + 'px';
    }

    bug.onclick = (e) => {
        e.stopPropagation();
        score++;
        stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
        move();
    };

    // Jeda 50ms supaya layout sempat ter-render sebelum move() dijalankan
    setTimeout(move, 50);
}