// games/drawing.js
function startDrawingGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    
    // Konfigurasi Ukuran: 90% Lebar Layar dan 80% Tinggi Layar
    const targetWidth = window.innerWidth * 0.9;
    const targetHeight = window.innerHeight * 0.8; 

    wrapper.innerHTML = `
        <div style="text-align:center; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; font-family: sans-serif; padding-bottom: 20px;">
            
            <canvas id="gameCanvas" width="${targetWidth}" height="${targetHeight}" 
                style="border:3px solid #333; background:#fff; border-radius:12px; cursor:crosshair; touch-action:none; box-shadow: 0 6px 15px rgba(0,0,0,0.3); max-width: 95%; padding: 0;">
            </canvas>
            
            <div style="display: flex; gap: 12px; align-items: center; justify-content: center; flex-wrap: wrap; background: #f1f1f1; padding: 12px; border-radius: 15px; border: 1px solid #ccc; width: 90%; max-width: ${targetWidth}px;">
                
                <div style="display: flex; align-items: center; gap: 8px; background: white; padding: 5px 12px; border-radius: 8px; border: 1px solid #bbb;">
                    <input type="color" id="customColor" value="#000000" style="cursor:pointer; width:35px; height:35px; border:none; background:none;">
                    <label for="customColor" style="font-size: 13px; font-weight: bold;">Warna</label>
                </div>

                <div style="display: flex; gap: 5px;">
                    <button id="btnPencil" onclick="setMode('pencil')" style="padding: 10px 15px; background:#007bff; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">✏️</button>
                    <button id="btnEraser" onclick="setMode('eraser')" style="padding: 10px 15px; background:#fff; color:#333; border:1px solid #ccc; border-radius:8px; cursor:pointer; font-weight:bold;">🧽</button>
                </div>

                <div style="display: flex; align-items: center; gap: 8px; background: white; padding: 5px 12px; border-radius: 8px; border: 1px solid #bbb;">
                    <input type="range" id="sizeSlider" min="1" max="100" value="5" style="cursor:pointer; width: 80px;">
                    <span id="sizeValue" style="font-weight: bold; min-width: 20px;">5</span>
                </div>

                <button id="btnClear" style="padding: 10px 15px; background:#dc3545; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">🗑️ Reset</button>
            </div>
        </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const customColorInput = document.getElementById('customColor');
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    const btnClear = document.getElementById('btnClear');
    
    let painting = false;
    let currentMode = 'pencil';
    let lastColor = '#000000';

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;

    // Perbaikan Logika Sinkronisasi Kursor
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    window.setMode = (mode) => {
        currentMode = mode;
        const btnPencil = document.getElementById('btnPencil');
        const btnEraser = document.getElementById('btnEraser');

        if (mode === 'eraser') {
            ctx.strokeStyle = '#FFFFFF';
            btnEraser.style.background = '#6c757d';
            btnEraser.style.color = 'white';
            btnPencil.style.background = '#fff';
            btnPencil.style.color = '#333';
        } else {
            ctx.strokeStyle = lastColor;
            btnPencil.style.background = '#007bff';
            btnPencil.style.color = 'white';
            btnEraser.style.background = '#fff';
            btnEraser.style.color = '#333';
        }
    };

    customColorInput.addEventListener('input', (e) => {
        lastColor = e.target.value;
        if (currentMode === 'pencil') ctx.strokeStyle = lastColor;
    });

    sizeSlider.addEventListener('input', (e) => {
        ctx.lineWidth = e.target.value;
        sizeValue.innerText = e.target.value;
    });

    btnClear.onclick = () => {
        if(confirm("Hapus semua gambar?")) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    function startPosition(e) { painting = true; draw(e); }
    function finishedPosition() { painting = false; ctx.beginPath(); }

    function draw(e) {
        if (!painting) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', (e) => { if(e.target === canvas) e.preventDefault(); startPosition(e); }, {passive: false});
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', (e) => { if(e.target === canvas) e.preventDefault(); draw(e); }, {passive: false});
}