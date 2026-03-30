window.startLiquidSortGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    wrapper.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <div id="tube-container" style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap; margin-bottom:20px;"></div>
            <p style="color:#6366f1; font-weight:bold;">Ketuk tabung untuk memindah warna!</p>
        </div>`;
    
    let tubes = [["#ef4444", "#3b82f6", "#ef4444"], ["#3b82f6", "#ef4444", "#3b82f6"], []];
    let selected = null;

    window.clickTube = (idx) => {
        if(selected === null) {
            if(tubes[idx].length > 0) selected = idx;
        } else {
            if(selected !== idx && tubes[idx].length < 3) {
                const color = tubes[selected].pop();
                tubes[idx].push(color);
            }
            selected = null;
        }
        render();
        checkWin();
    };

    function render() {
        const container = document.getElementById('tube-container');
        container.innerHTML = tubes.map((t, i) => `
            <div onclick="clickTube(${i})" style="width:50px; height:130px; border:4px solid #cbd5e1; border-radius:0 0 30px 30px; display:flex; flex-direction:column-reverse; overflow:hidden; background:${selected===i?'#e2e8f0':'white'}; transition:0.2s;">
                ${t.map(c => `<div style="background:${c}; height:33.3%; width:100%; border-top:1px solid rgba(255,255,255,0.2)"></div>`).join('')}
            </div>
        `).join('');
    }

    function checkWin() {
        if(tubes.every(t => t.length === 0 || (t.length === 3 && t.every(c => c === t[0])))) {
            setTimeout(() => { alert("🎉 Berhasil Disortir!"); goHome(); }, 300);
        }
    }
    render();
};