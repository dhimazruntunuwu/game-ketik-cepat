window.startLiquidSortGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // State Game
    let currentLevel = 1;
    let tubes = [];
    let selected = null;
    let gameActive = true;

    // Konfigurasi Progresif (Level 1-20)
    // Format: [Jumlah Warna, Tabung Kosong]
    const getLevelConfig = (lvl) => {
        const colors = Math.min(3 + Math.floor(lvl / 3), 10); // Mulai 3 warna, max 10
        const empty = lvl > 10 ? 3 : 2; // Level 11+ dapat 3 tabung kosong
        return { colors, empty };
    };

    const ALL_COLORS = [
        "#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7", 
        "#ed64a6", "#06b6d4", "#f97316", "#10b981", "#6366f1"
    ];

    function initLevel(lvl) {
        const config = getLevelConfig(lvl);
        const activeColors = ALL_COLORS.slice(0, config.colors);
        const TUBE_CAPACITY = 4;
        
        let pool = [];
        activeColors.forEach(c => {
            for(let i = 0; i < TUBE_CAPACITY; i++) pool.push(c);
        });

        // Shuffle Warna
        pool.sort(() => Math.random() - 0.5);

        tubes = [];
        for(let i = 0; i < config.colors; i++) {
            tubes.push(pool.splice(0, TUBE_CAPACITY));
        }
        for(let i = 0; i < config.empty; i++) {
            tubes.push([]);
        }
        gameActive = true;
        renderUI();
    }

    function renderUI() {
        wrapper.innerHTML = `
            <div style="text-align:center; padding:15px; font-family:sans-serif; user-select:none;">
                <h2 style="margin:0; color:var(--slate-dark);">🧪 Liquid Sort: Level ${currentLevel}/20</h2>
                
                <div style="font-size:0.8rem; color:var(--slate); margin:10px auto; max-width:400px; background:rgba(0,0,0,0.05); padding:10px; border-radius:10px;">
                    📍 <b>Aturan:</b> Pindahkan warna yang sama ke tabung yang sama. <br>
                    Warna hanya bisa dituang ke tabung <b>kosong</b> atau di atas warna yang <b>sama</b>.
                </div>

                <div id="tube-container" style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:20px auto; max-width:500px;"></div>
                
                <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                    <button onclick="resetLiquid()" style="padding:10px 20px; border-radius:12px; border:none; background:#6366f1; color:white; font-weight:bold; cursor:pointer;">🔄 Reset Level</button>
                    <button id="btn-surrender-liquid" onclick="surrenderLiquid()" style="padding:10px 20px; border-radius:12px; border:none; background:#ef4444; color:white; font-weight:bold; cursor:pointer;">🏳️ Menyerah</button>
                    <button onclick="goHome()" style="padding:10px 20px; border-radius:12px; border:none; background:var(--slate); color:white; font-weight:bold; cursor:pointer;">🏠 Keluar</button>
                </div>
                <div id="liquid-leaderboard-area" style="margin-top:20px;"></div>
            </div>`;
        renderTubes();
    }

    function renderTubes() {
        const container = document.getElementById('tube-container');
        if(!container) return;
        
        container.innerHTML = tubes.map((t, i) => {
            const isFullAndSame = t.length === 4 && t.every(c => c === t[0]);
            return `
                <div onclick="clickTube(${i})" style="
                    width:42px; height:140px; 
                    border:3px solid ${isFullAndSame ? '#22c55e' : '#cbd5e1'}; 
                    border-radius:0 0 20px 20px; 
                    display:flex; flex-direction:column-reverse; 
                    overflow:hidden; cursor:pointer;
                    background:${selected === i ? 'rgba(99, 102, 241, 0.1)' : 'var(--white)'}; 
                    transform:${selected === i ? 'translateY(-15px)' : 'translateY(0)'};
                    box-shadow:${selected === i ? '0 10px 20px rgba(0,0,0,0.1)' : 'none'};
                    transition:0.2s cubic-bezier(0.4, 0, 0.2, 1);">
                    ${t.map(c => `<div style="background:${c}; height:25%; width:100%; border-top:1px solid rgba(255,255,255,0.2)"></div>`).join('')}
                </div>
            `;
        }).join('');
    }

    window.clickTube = (idx) => {
        if(!gameActive) return;

        if(selected === null) {
            if(tubes[idx].length > 0) {
                selected = idx;
                renderTubes();
            }
        } else {
            const from = selected;
            const to = idx;
            
            if(from !== to && tubes[to].length < 4) {
                const colorToMove = tubes[from][tubes[from].length - 1];
                const targetTopColor = tubes[to][tubes[to].length - 1];
                
                if(!targetTopColor || targetTopColor === colorToMove) {
                    // Pindahkan semua warna yang sama sekaligus (biar gak capek klik)
                    while(tubes[from].length > 0 && 
                          tubes[from][tubes[from].length - 1] === colorToMove && 
                          tubes[to].length < 4) {
                        tubes[to].push(tubes[from].pop());
                    }
                }
            }
            selected = null;
            renderTubes();
            checkWin();
        }
    };

    window.resetLiquid = () => initLevel(currentLevel);

    window.surrenderLiquid = () => {
        gameActive = false;
        const score = (currentLevel - 1) * 150;
        
        const btn = document.getElementById('btn-surrender-liquid');
        btn.disabled = true;
        btn.style.opacity = "0.5";

        if(window.saveToSpreadsheet) saveToSpreadsheet('liquid_sort', score);
        if(window.showLeaderboard) showLeaderboard('liquid_sort');
        
        alert(`Permainan Berhenti! Skor akhir: ${score}`);
    };

    function checkWin() {
        const isWin = tubes.every(t => 
            t.length === 0 || (t.length === 4 && t.every(c => c === t[0]))
        );
        
        if(isWin) {
            gameActive = false;
            setTimeout(() => {
                if(currentLevel < 20) {
                    alert(`🌟 Level ${currentLevel} Selesai! Lanjut ke Level ${currentLevel + 1}`);
                    currentLevel++;
                    initLevel(currentLevel);
                } else {
                    alert("🏆 FANTASTIS! Kamu menyelesaikan semua 20 level!");
                    surrenderLiquid();
                }
            }, 300);
        }
    }

    initLevel(currentLevel);
};