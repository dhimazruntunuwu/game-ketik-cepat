window.startUlarTanggaGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // 1. UI Setup (Pemilihan Pemain & Area Game)
    wrapper.innerHTML = `
        <div id="setup-ular" style="text-align:center; font-family:sans-serif; padding:20px; background:#f8fafc; border-radius:20px;">
            <h2 style="color:#4f46e5; margin-bottom:10px;">🎲 Ular Tangga Pro</h2>
            <p style="color:#64748b;">Silakan pilih jumlah pemain untuk memulai:</p>
            <div style="display:flex; gap:12px; justify-content:center; margin-top:20px;">
                <button onclick="initUlarGame(2)" style="padding:12px 24px; background:#4f46e5; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold; transition:0.2s;" onmouseover="this.style.background='#3730a3'" onmouseout="this.style.background='#4f46e5'">2 Pemain</button>
                <button onclick="initUlarGame(3)" style="padding:12px 24px; background:#4f46e5; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold; transition:0.2s;" onmouseover="this.style.background='#3730a3'" onmouseout="this.style.background='#4f46e5'">3 Pemain</button>
                <button onclick="initUlarGame(4)" style="padding:12px 24px; background:#4f46e5; color:white; border:none; border-radius:12px; cursor:pointer; font-weight:bold; transition:0.2s;" onmouseover="this.style.background='#3730a3'" onmouseout="this.style.background='#4f46e5'">4 Pemain</button>
            </div>
        </div>

        <div id="game-ular" style="display:none; text-align:center; font-family:sans-serif;">
            <canvas id="snakesCanvas" width="400" height="400" style="background:#ffffff; border:4px solid #334155; border-radius:12px; display:block; margin:auto; box-shadow: 0 10px 30px rgba(0,0,0,0.15); touch-action:none;"></canvas>
            
            <div style="margin-top:15px; background:#f1f5f9; padding:15px; border-radius:20px; max-width:400px; margin-left:auto; margin-right:auto; border:1px solid #e2e8f0;">
                <div id="turnBox" style="padding:10px; border-radius:12px; margin-bottom:12px; transition: 0.4s; border:2px solid transparent;">
                    <span id="turnInfo" style="font-weight:900; font-size:1.2rem; letter-spacing:1px;">MENUNGGU...</span>
                </div>
                <button id="rollDice" style="padding:16px 40px; background:#4f46e5; color:white; border:none; border-radius:15px; font-weight:bold; cursor:pointer; font-size:1.2rem; box-shadow: 0 5px #3730a3; transition:0.1s;">🎲 KOCOK DADU</button>
                <p id="diceResult" style="margin-top:12px; font-weight:bold; color:#1e293b; font-size:1.1rem; height:24px;">Hasil: -</p>
            </div>
        </div>
    `;

    const cvs = document.getElementById('snakesCanvas');
    const ctx = cvs.getContext('2d');
    const SIZE = 10;
    const tileW = cvs.width / SIZE;
    const tileH = cvs.height / SIZE;

    // State Game
    let players = [];
    let currentPlayer = 0;
    let isMoving = false;

    // Konfigurasi Visual & Game
    const colors = ["#ec4899", "#3b82f6", "#10b981", "#f59e0b"]; // Pink, Blue, Green, Orange
    const ladders = { 2: 21, 7: 29, 20: 40, 35: 51, 65: 83, 70: 88 };
    const snakes = { 26: 4, 46: 18, 61: 17, 88: 52, 94: 69, 98: 78 };

    // 2. Inisialisasi Game
    window.initUlarGame = function(count) {
        players = [];
        for(let i=0; i<count; i++) {
            players.push({ pos: 0, color: colors[i], id: i + 1 });
        }
        document.getElementById('setup-ular').style.display = 'none';
        document.getElementById('game-ular').style.display = 'block';
        currentPlayer = 0;
        updateTurnUI();
        drawBoard();
    };

    // Helper: Konversi indeks (0-99) ke Koordinat X,Y (Zig-zag)
    function getCoords(pos) {
        let row = Math.floor(pos / SIZE);
        let col = pos % SIZE;
        if (row % 2 !== 0) col = (SIZE - 1) - col; // Jalur Ular (Boustrophedon)
        let x = col * tileW;
        let y = cvs.height - (row + 1) * tileH;
        return { x: x + tileW/2, y: y + tileH/2, left: x, top: y };
    }

    function updateTurnUI() {
        const info = document.getElementById('turnInfo');
        const box = document.getElementById('turnBox');
        const p = players[currentPlayer];
        info.innerText = `GILIRAN: PEMAIN ${p.id}`;
        info.style.color = p.color;
        box.style.borderColor = p.color;
        box.style.backgroundColor = `${p.color}15`;
    }

    // 3. Render Papan
    function drawBoard() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        
        // Gambar Grid & Angka
        for (let i = 0; i < 100; i++) {
            const coords = getCoords(i);
            
            // Background kotak selang-seling
            ctx.fillStyle = (Math.floor(i / 1) % 2 === 0) ? "#f8fafc" : "#ffffff";
            ctx.fillRect(coords.left, coords.top, tileW, tileH);
            
            // Garis pembatas kotak (Stroke)
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 1;
            ctx.strokeRect(coords.left, coords.top, tileW, tileH);

            // Angka kotak (Hitam tebal)
            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "left";
            ctx.fillText(i + 1, coords.left + 5, coords.top + 15);
        }

        // Gambar Tangga (Biru) & Ular (Merah)
        ctx.lineCap = "round";
        for (let s in ladders) {
            let start = getCoords(parseInt(s)), end = getCoords(ladders[s]);
            ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
            // Aksen tangga
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke(); ctx.setLineDash([]);
        }
        for (let s in snakes) {
            let start = getCoords(parseInt(s)), end = getCoords(snakes[s]);
            ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 6;
            ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
        }

        // Gambar Bidak Pemain
        players.forEach((p, index) => {
            let coords = getCoords(p.pos);
            ctx.save();
            ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,0,0,0.4)";
            ctx.fillStyle = p.color;
            ctx.beginPath();
            // Offset agar tidak tumpang tindih
            let offset = (index - players.length/2) * 6;
            ctx.arc(coords.x + offset, coords.y + offset, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.stroke();
            ctx.restore();
        });
    }

    // 4. Logika Gerak & Animasi
    document.getElementById('rollDice').onclick = async function() {
        if(isMoving) return;
        isMoving = true;

        const btn = document.getElementById('rollDice');
        btn.style.transform = "translateY(2px)";
        btn.style.boxShadow = "none";

        let dice = Math.floor(Math.random() * 6) + 1;
        document.getElementById('diceResult').innerText = `🎲 Hasil Dadu: ${dice}`;
        
        let p = players[currentPlayer];

        // Efek Jalan Per Kotak
        for (let i = 0; i < dice; i++) {
            if (p.pos < 99) {
                p.pos++;
                drawBoard();
                await new Promise(r => setTimeout(r, 200)); // Delay per langkah
            }
        }

        // Cek Menang
        if (p.pos >= 99) {
            p.pos = 99;
            drawBoard();
            setTimeout(() => {
                alert(`🏆 SELAMAT! PEMAIN ${p.id} MENANG!`);
                location.reload(); // Atau panggil goHome()
            }, 500);
            return;
        }

        // Cek Ular atau Tangga setelah berhenti
        await new Promise(r => setTimeout(r, 400));
        if (ladders[p.pos]) {
            p.pos = ladders[p.pos];
            drawBoard();
            await new Promise(r => setTimeout(r, 400));
        } else if (snakes[p.pos]) {
            p.pos = snakes[p.pos];
            drawBoard();
            await new Promise(r => setTimeout(r, 400));
        }

        // Reset tombol & Ganti Giliran
        btn.style.transform = "translateY(0)";
        btn.style.boxShadow = "0 5px #3730a3";
        
        currentPlayer = (currentPlayer + 1) % players.length;
        updateTurnUI();
        isMoving = false;
    };
};