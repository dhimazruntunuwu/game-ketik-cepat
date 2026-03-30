window.startMinerGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <canvas id="minerCanvas" width="320" height="400" style="background:#451a03; border:4px solid #78350f; border-radius:12px; display:block; margin:auto; touch-action:none;"></canvas>
            
            <div style="margin-top:20px;">
                <button id="btnHook" style="width:120px; height:60px; background:#eab308; color:#451a03; border:none; border-radius:12px; font-weight:bold; font-size:1.2rem; cursor:pointer; box-shadow: 0 4px #a16207; active:transform(translateY(2px));">AMBIL!</button>
            </div>
            <p style="margin-top:10px; color:#64748b; font-size:0.8rem;">Tunggu ayunan pas, lalu klik AMBIL!</p>
        </div>
    `;

    const cvs = document.getElementById('minerCanvas');
    const ctx = cvs.getContext('2d');

    // 1. Variabel Utama
    let score = 0;
    let angle = Math.PI / 2; // Mulai dari tengah bawah
    let angleDir = 0.03;
    let hookLen = 40;
    let hookState = "swing"; // swing, shoot, return
    let targetIdx = -1;
    let isGameOver = false;

    // 2. Objek Emas & Batu
    let items = [];
    function initItems() {
        items = [];
        // Tambah Emas (Kuning & Berharga)
        for(let i=0; i<5; i++) {
            items.push({ x: 30 + Math.random()*260, y: 150 + Math.random()*200, r: 15 + Math.random()*15, type: 'gold', color: '#fbbf24', val: 20 });
        }
        // Tambah Batu (Abu-abu & Berat/Lambat)
        for(let i=0; i<3; i++) {
            items.push({ x: 30 + Math.random()*260, y: 150 + Math.random()*200, r: 10 + Math.random()*10, type: 'stone', color: '#94a3b8', val: 5 });
        }
    }

    // 3. Logika Update
    function update() {
        if (isGameOver) return;

        if(hookState === "swing") {
            angle += angleDir;
            if(angle > Math.PI - 0.5 || angle < 0.5) angleDir = -angleDir;
        } 
        else if(hookState === "shoot") {
            hookLen += 6;
            
            // Cek Tabrakan dengan Item
            let hookX = 160 + Math.cos(angle) * hookLen;
            let hookY = 40 + Math.sin(angle) * hookLen;

            for(let i=0; i<items.length; i++) {
                let d = Math.hypot(hookX - items[i].x, hookY - items[i].y);
                if(d < items[i].r) {
                    hookState = "return";
                    targetIdx = i;
                    break;
                }
            }

            // Batas Dinding/Bawah
            if(hookLen > 380 || hookX < 0 || hookX > 320) hookState = "return";
        } 
        else if(hookState === "return") {
            // Jika bawa batu, tarikannya lebih lambat (realistis)
            let returnSpeed = (targetIdx !== -1 && items[targetIdx].type === 'stone') ? 2 : 5;
            hookLen -= returnSpeed;

            if(targetIdx !== -1) {
                items[targetIdx].x = 160 + Math.cos(angle) * hookLen;
                items[targetIdx].y = 40 + Math.sin(angle) * hookLen;
            }

            if(hookLen <= 40) {
                if(targetIdx !== -1) {
                    score += items[targetIdx].val;
                    items.splice(targetIdx, 1);
                    stats.innerText = `Skor: ${score} | ⛏️ Gold Miner`;
                    
                    // Kalau emas habis, spawn lagi
                    if(items.filter(it => it.type === 'gold').length === 0) initItems();
                }
                hookState = "swing";
                targetIdx = -1;
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    // 4. Render
    function draw() {
        ctx.clearRect(0, 0, 320, 400);

        // Gambar Tali & Pengait
        let hookX = 160 + Math.cos(angle) * hookLen;
        let hookY = 40 + Math.sin(angle) * hookLen;
        
        ctx.strokeStyle = "#d4d4d8"; 
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(160, 40); 
        ctx.lineTo(hookX, hookY); 
        ctx.stroke();

        // Gambar Kepala Pengait
        ctx.fillStyle = "#71717a";
        ctx.beginPath();
        ctx.arc(hookX, hookY, 8, 0, Math.PI*2);
        ctx.fill();

        // Gambar Semua Item
        items.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.r, 0, Math.PI*2);
            ctx.fill();
            // Efek kilau emas
            if(item.type === 'gold') {
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.fillRect(item.x - 5, item.y - 5, 5, 5);
            }
        });

        // Gambar Katrol di Atas
        ctx.fillStyle = "#27272a";
        ctx.fillRect(145, 0, 30, 40);
    }

    // Event Handler
    document.getElementById('btnHook').onclick = () => {
        if(hookState === "swing") hookState = "shoot";
    };

    initItems();
    update();
};