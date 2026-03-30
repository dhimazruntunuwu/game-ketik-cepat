window.startLiquidSortGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    wrapper.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <div id="tube-container" style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-bottom:20px; max-width:600px; margin-left:auto; margin-right:auto;"></div>
            <p style="color:#6366f1; font-weight:bold; font-family:sans-serif;">Ketuk tabung untuk memindah warna!</p>
            <button onclick="startLiquidSortGame()" style="padding:8px 16px; border-radius:8px; border:none; background:#6366f1; color:white; cursor:pointer;">Acak Ulang</button>
        </div>`;
    
    // Konfigurasi Game
    const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ed64a6"]; // 6 Warna
    const TUBE_CAPACITY = 4;
    const EMPTY_TUBES = 2;
    
    let tubes = [];
    let selected = null;

    // Fungsi untuk mengacak level
    function initGame() {
        let pool = [];
        COLORS.forEach(c => {
            for(let i = 0; i < TUBE_CAPACITY; i++) pool.push(c);
        });
        
        // Shuffle (Acak) pool warna
        pool.sort(() => Math.random() - 0.5);
        
        // Masukkan ke tabung
        tubes = [];
        for(let i = 0; i < COLORS.length; i++) {
            tubes.push(pool.splice(0, TUBE_CAPACITY));
        }
        // Tambah tabung kosong
        for(let i = 0; i < EMPTY_TUBES; i++) {
            tubes.push([]);
        }
    }

    window.clickTube = (idx) => {
        if(selected === null) {
            if(tubes[idx].length > 0) selected = idx;
        } else {
            const from = selected;
            const to = idx;
            
            // Validasi pindah: 
            // 1. Bukan tabung yang sama
            // 2. Tabung tujuan belum penuh
            // 3. Warna harus sama dengan warna atas tujuan ATAU tujuan kosong
            if(from !== to && tubes[to].length < TUBE_CAPACITY) {
                const colorToMove = tubes[from][tubes[from].length - 1];
                const targetColor = tubes[to][tubes[to].length - 1];
                
                if(!targetColor || targetColor === colorToMove) {
                    tubes[to].push(tubes[from].pop());
                }
            }
            selected = null;
        }
        render();
        checkWin();
    };

    function render() {
        const container = document.getElementById('tube-container');
        container.innerHTML = tubes.map((t, i) => `
            <div onclick="clickTube(${i})" style="
                width:45px; 
                height:150px; 
                border:4px solid #cbd5e1; 
                border-radius:0 0 25px 25px; 
                display:flex; 
                flex-direction:column-reverse; 
                overflow:hidden; 
                cursor:pointer;
                background:${selected === i ? '#f1f5f9' : 'white'}; 
                transform:${selected === i ? 'translateY(-10px)' : 'translateY(0)'};
                box-shadow:${selected === i ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'};
                transition:0.2s;">
                ${t.map(c => `<div style="background:${c}; height:${100/TUBE_CAPACITY}%; width:100%; border-top:1px solid rgba(255,255,255,0.3)"></div>`).join('')}
            </div>
        `).join('');
    }

    function checkWin() {
        const isWin = tubes.every(t => 
            t.length === 0 || 
            (t.length === TUBE_CAPACITY && t.every(c => c === t[0]))
        );
        
        if(isWin) {
            setTimeout(() => { 
                alert("🎉 Selamat! Kamu berhasil menyortir semua warna!"); 
                if(window.goHome) goHome(); 
            }, 300);
        }
    }

    initGame();
    render();
};