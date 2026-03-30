window.startPianoGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    let audioCtx = null;
    let activeOscillators = {}; // Menyimpan suara yang sedang aktif

    // --- FUNGSI SUARA (Sustain & Smooth) ---
    function noteOn(key) {
        const freq = notesFreq[key];
        if (!freq) return;
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Hentikan jika nada yang sama sedang bunyi
        if (activeOscillators[key]) noteOff(key);

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Attack: Suara masuk mulus (0.02 detik)
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.02);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();

        activeOscillators[key] = { osc, gain };
    }

    function noteOff(key) {
        if (activeOscillators[key]) {
            const { osc, gain } = activeOscillators[key];
            const now = audioCtx.currentTime;

            // Release: Suara memudar halus (0.3 detik) saat dilepas
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.stop(now + 0.4);
            delete activeOscillators[key];
        }
    }

    const notesFreq = { 
        '1': 261.63, '2': 293.66, '3': 329.63, '4': 349.23, 
        '5': 392.00, '6': 440.00, '7': 493.88, 'i': 523.25 
    };

    const playlist = {
        pelangi: [
            {time:1000,note:'1',lyric:"Pe-"},{time:1400,note:'2',lyric:"lan-"},{time:1800,note:'3',lyric:"gi "},
            {time:2200,note:'3',lyric:"pe-"},{time:2600,note:'2',lyric:"lan-"},{time:3000,note:'1',lyric:"gi"},
            {time:3600,note:'3',lyric:"A-"},{time:4000,note:'4',lyric:"lam-"},{time:4400,note:'5',lyric:"mu "},
            {time:4800,note:'5',lyric:"in-"},{time:5200,note:'4',lyric:"dah-"},{time:5600,note:'3',lyric:"mu"},
            {time:6200,note:'5',lyric:"Me-"},{time:6600,note:'6',lyric:"rah "},{time:7000,note:'5',lyric:"ku-"},
            {time:7400,note:'4',lyric:"ning "},{time:7800,note:'3',lyric:"hi-"},{time:8200,note:'2',lyric:"jau"},
            {time:8800,note:'1',lyric:"Di "},{time:9200,note:'5',lyric:"la-"},{time:9600,note:'5',lyric:"ngit "},
            {time:10000,note:'4',lyric:"yang "},{time:10400,note:'3',lyric:"bi-"},{time:10800,note:'2',lyric:"ru"},
            {time:11400,note:'1',lyric:"Pe-"},{time:11800,note:'2',lyric:"luk-"},{time:12200,note:'3',lyric:"is-"},
            {time:12600,note:'3',lyric:"mu "},{time:13000,note:'2',lyric:"a-"},{time:13400,note:'1',lyric:"gung"},
            {time:14000,note:'1',lyric:"Si-"},{time:14400,note:'5',lyric:"a-"},{time:14800,note:'5',lyric:"pa "},
            {time:15200,note:'4',lyric:"ge-"},{time:15600,note:'3',lyric:"ra-"},{time:16000,note:'2',lyric:"ngan"},
            {time:16600,note:'1',lyric:"Pe-"},{time:17000,note:'2',lyric:"lan-"},{time:17400,note:'3',lyric:"gi "},
            {time:17800,note:'5',lyric:"pe-"},{time:18200,note:'2',lyric:"lan-"},{time:18600,note:'1',lyric:"gi!"}
        ],
        twinkle: [
            {time:1000,note:'1',lyric:"Twin-"},{time:1400,note:'1',lyric:"kle "},{time:1800,note:'5',lyric:"twin-"},{time:2200,note:'5',lyric:"kle "},
            {time:2600,note:'6',lyric:"lit-"},{time:3000,note:'6',lyric:"tle "},{time:3400,note:'5',lyric:"star,"},
            {time:4200,note:'4',lyric:"How "},{time:4600,note:'4',lyric:"I "},{time:5000,note:'3',lyric:"won-"},{time:5400,note:'3',lyric:"der "},
            {time:5800,note:'2',lyric:"what "},{time:6200,note:'2',lyric:"you "},{time:6600,note:'1',lyric:"are."},
            {time:7400,note:'5',lyric:"Up "},{time:7800,note:'5',lyric:"a-"},{time:8200,note:'4',lyric:"bove "},{time:8600,note:'4',lyric:"the "},
            {time:9000,note:'3',lyric:"world "},{time:9400,note:'3',lyric:"so "},{time:9800,note:'2',lyric:"high,"},
            {time:10600,note:'5',lyric:"Like "},{time:11000,note:'5',lyric:"a "},{time:11400,note:'4',lyric:"dia-"},{time:11800,note:'4',lyric:"mond "},
            {time:12200,note:'3',lyric:"in "},{time:12600,note:'3',lyric:"the "},{time:13000,note:'2',lyric:"sky."},
            {time:13800,note:'1',lyric:"Twin-"},{time:14200,note:'1',lyric:"kle "},{time:14600,note:'5',lyric:"twin-"},{time:15000,note:'5',lyric:"kle "},
            {time:15400,note:'6',lyric:"lit-"},{time:15800,note:'6',lyric:"tle "},{time:16200,note:'5',lyric:"star,"},
            {time:17000,note:'4',lyric:"How "},{time:17400,note:'4',lyric:"I "},{time:17800,note:'3',lyric:"won-"},{time:18200,note:'3',lyric:"der "},
            {time:18600,note:'2',lyric:"what "},{time:19000,note:'2',lyric:"you "},{time:19400,note:'1',lyric:"are!"}
        ],
        kartini: [
            {time:1000,note:'1',lyric:"I-"},{time:1400,note:'2',lyric:"bu "},{time:1800,note:'3',lyric:"ki-"},{time:2200,note:'4',lyric:"ta "},{time:2600,note:'5',lyric:"Kar-"},
            {time:3400,note:'3',lyric:"ti-"},{time:3800,note:'1',lyric:"ni,"},
            {time:4600,note:'6',lyric:"Pu-"},{time:5000,note:'i',lyric:"tri "},{time:5400,note:'5',lyric:"se-"},{time:5800,note:'4',lyric:"ja-"},{time:6200,note:'3',lyric:"ti."},
            {time:7000,note:'4',lyric:"Pu-"},{time:7400,note:'6',lyric:"tri "},{time:7800,note:'5',lyric:"In-"},{time:8200,note:'4',lyric:"do-"},{time:8600,note:'3',lyric:"ne-"},{time:9000,note:'2',lyric:"sia,"},
            {time:9800,note:'4',lyric:"ha-"},{time:10200,note:'2',lyric:"rum "},{time:10600,note:'7',lyric:"na-"},{time:11000,note:'2',lyric:"ma-"},{time:11400,note:'1',lyric:"nya."},
            {time:12400,note:'3',lyric:"Wah-"},{time:12800,note:'3',lyric:"ai "},{time:13200,note:'3',lyric:"I-"},{time:13600,note:'3',lyric:"bu "},{time:14000,note:'4',lyric:"ki-"},{time:14400,note:'5',lyric:"ta "},
            {time:14800,note:'3',lyric:"Kar-"},{time:15200,note:'1',lyric:"ti-"},{time:15600,note:'2',lyric:"ni,"},
            {time:16400,note:'3',lyric:"pu-"},{time:16800,note:'2',lyric:"tri "},{time:17200,note:'7',lyric:"yang "},{time:17600,note:'2',lyric:"mu-"},{time:17600,note:'2',lyric:"mu-"},{time:18000,note:'1',lyric:"li-"},{time:18400,note:'1',lyric:"a!"}
        ],
        pelangi: [
        {time:1000,note:'1',lyric:"Pe-"},{time:1400,note:'2',lyric:"lan-"},{time:1800,note:'3',lyric:"gi "},
        {time:2200,note:'3',lyric:"pe-"},{time:2600,note:'2',lyric:"lan-"},{time:3000,note:'1',lyric:"gi"},
        {time:3600,note:'3',lyric:"A-"},{time:4000,note:'4',lyric:"lam-"},{time:4400,note:'5',lyric:"mu "},
        {time:4800,note:'5',lyric:"in-"},{time:5200,note:'4',lyric:"dah-"},{time:5600,note:'3',lyric:"mu"},
        {time:6200,note:'5',lyric:"Me-"},{time:6600,note:'6',lyric:"rah "},{time:7000,note:'5',lyric:"ku-"},
        {time:7400,note:'4',lyric:"ning "},{time:7800,note:'3',lyric:"hi-"},{time:8200,note:'2',lyric:"jau"},
        {time:8800,note:'1',lyric:"Di "},{time:9200,note:'5',lyric:"la-"},{time:9600,note:'5',lyric:"ngit "},
        {time:10000,note:'4',lyric:"yang "},{time:10400,note:'3',lyric:"bi-"},{time:10800,note:'2',lyric:"ru"},
        {time:11400,note:'1',lyric:"Pe-"},{time:11800,note:'2',lyric:"luk-"},{time:12200,note:'3',lyric:"is-"},
        {time:12600,note:'3',lyric:"mu "},{time:13000,note:'2',lyric:"a-"},{time:13400,note:'1',lyric:"gung"},
        {time:14000,note:'1',lyric:"Si-"},{time:14400,note:'5',lyric:"a-"},{time:14800,note:'5',lyric:"pa "},
        {time:15200,note:'4',lyric:"ge-"},{time:15600,note:'3',lyric:"ra-"},{time:16000,note:'2',lyric:"ngan"},
        {time:16600,note:'1',lyric:"Pe-"},{time:17000,note:'2',lyric:"lan-"},{time:17400,note:'3',lyric:"gi "},
        {time:17800,note:'5',lyric:"pe-"},{time:18200,note:'2',lyric:"lan-"},{time:18600,note:'1',lyric:"gi!"}
    ],
        
    };

    // --- STRUKTUR UI ---
    wrapper.innerHTML = `
        <div id="piano-container" style="text-align:center; font-family:sans-serif; background:#020617; border-radius:20px; color:white; min-height:85vh; display:flex; flex-direction:column; justify-content:space-between; padding:15px; box-sizing:border-box; overflow:hidden; user-select:none;">
            <div id="piano-menu" style="margin:auto 0;">
                <h2 style="color:#f472b6; font-size:1.8rem; margin-bottom:20px;">🎹 Piano Hero Full</h2>
                <button onclick="initPianoMode('manual')" style="width:90%; padding:20px; background:#3b82f6; color:white; border:none; border-radius:15px; font-weight:bold; margin-bottom:15px; box-shadow: 0 5px #1d4ed8;">🎹 MODE BEBAS</button>
                <button onclick="showSongSelection()" style="width:90%; padding:20px; background:#db2777; color:white; border:none; border-radius:15px; font-weight:bold; box-shadow: 0 5px #9d174d;">🎵 PILIH LAGU</button>
            </div>

            <div id="song-menu" style="display:none; margin:auto 0;">
                <h3 style="color:#f472b6;">Daftar Lagu Full:</h3>
                <button onclick="startWithSong('pelangi')" style="width:90%; padding:15px; background:#1e293b; color:white; border:1px solid #334155; border-radius:12px; margin-bottom:10px;">🌈 Pelangi-Pelangi</button>
                <button onclick="startWithSong('twinkle')" style="width:90%; padding:15px; background:#1e293b; color:white; border:1px solid #334155; border-radius:12px; margin-bottom:10px;">⭐ Twinkle Twinkle</button>
                <button onclick="startWithSong('kartini')" style="width:90%; padding:15px; background:#1e293b; color:white; border:1px solid #334155; border-radius:12px; margin-bottom:10px;">🇮🇩 Ibu Kita Kartini</button>
                <button onclick="startWithSong('pelangi')" style="width:90%; padding:15px; background:#1e293b; color:white; border:1px solid #334155; border-radius:12px; margin-bottom:10px;">🇮🇩 Pelangi</button>
                <button onclick="startPianoGame()" style="width:90%; padding:10px; background:none; color:#64748b; border:none; margin-top:10px;">⬅ Kembali</button>
            </div>

            <div id="piano-gameplay" style="display:none; flex:1; flex-direction:column;">
                <div id="lyric-display" style="height:60px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:bold; color:#f472b6; text-align:center; padding:0 10px;">---</div>
                <canvas id="pianoCanvas" width="320" height="400" style="background:rgba(255,255,255,0.02); border-radius:15px; margin:5px auto; flex:1; width:100%; max-width:350px;"></canvas>
                <div id="piano-keys" style="display:flex; justify-content:center; gap:2px; padding-bottom:10px;">
                    ${Object.keys(notesFreq).map(key => `
                        <div id="key-${key}" 
                            onmousedown="window.pressPiano('${key}')" onmouseup="window.releasePiano('${key}')" onmouseleave="window.releasePiano('${key}')"
                            ontouchstart="event.preventDefault(); window.pressPiano('${key}')" ontouchend="event.preventDefault(); window.releasePiano('${key}')"
                            style="flex:1; height:120px; background:white; color:black; border-radius:0 0 8px 8px; font-weight:bold; display:flex; align-items:flex-end; justify-content:center; padding-bottom:15px; border:1px solid #ddd; font-size:1.1rem; position:relative;">
                            ${key === 'i' ? '1<span style="position:absolute; top:12px; left:50%; transform:translateX(-50%); font-size:1.5rem;">.</span>' : key}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // --- LOGIKA GAME ---
    let activeNotes = [];
    let startTime = 0;
    let isRunning = false;
    let gameMode = '';

    window.showSongSelection = () => {
        document.getElementById('piano-menu').style.display = 'none';
        document.getElementById('song-menu').style.display = 'block';
    };

    window.initPianoMode = (mode) => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx.resume();
        gameMode = mode;
        document.getElementById('piano-menu').style.display = 'none';
        document.getElementById('piano-gameplay').style.display = 'flex';
        document.getElementById('lyric-display').innerText = "Freestyle Mode";
        document.getElementById('pianoCanvas').style.display = 'none';
    };

    window.startWithSong = (songKey) => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx.resume();
        gameMode = 'song';
        document.getElementById('song-menu').style.display = 'none';
        document.getElementById('piano-gameplay').style.display = 'flex';
        document.getElementById('pianoCanvas').style.display = 'block';
        
        activeNotes = playlist[songKey].map(d => ({ ...d, y: -50, targetTime: d.time, hit: false }));
        startTime = Date.now();
        isRunning = true;
        loop();
    };

    window.pressPiano = (key) => {
        if(notesFreq[key]) {
            noteOn(key);
            const btn = document.getElementById(`key-${key}`);
            if(btn) {
                btn.style.background = "#f472b6";
                btn.style.transform = "scaleY(0.95)";
            }

            if(gameMode === 'song' && isRunning) {
                const now = Date.now() - startTime;
                for (let n of activeNotes) {
                    // Logic: Cari nada terdekat yang belum di-hit, lalu break agar tidak hapus masal
                    if (n.note === key && !n.hit && Math.abs(n.targetTime - now) < 600) {
                        n.hit = true;
                        document.getElementById('lyric-display').innerText = n.lyric;
                        break; 
                    }
                }
            }
        }
    };

    window.releasePiano = (key) => {
        noteOff(key);
        const btn = document.getElementById(`key-${key}`);
        if(btn) {
            btn.style.background = "white";
            btn.style.transform = "scaleY(1)";
        }
    };

    function loop() {
        if(!isRunning) return;
        const cvs = document.getElementById('pianoCanvas');
        if(!cvs) return;
        const ctx = cvs.getContext('2d');
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        const now = Date.now() - startTime;

        // Garis target
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath(); ctx.moveTo(0, 350); ctx.lineTo(320, 350); ctx.stroke();

        activeNotes.forEach((n) => {
            n.y = (now - (n.targetTime - 4000)) * 0.1; 
            if(!n.hit && n.y < 400) {
                const xPos = (Object.keys(notesFreq).indexOf(n.note)) * (320/8) + 2;
                ctx.fillStyle = n.y > 310 ? "#f472b6" : "#60a5fa";
                ctx.fillRect(xPos, n.y, 35, 25);
                
                // Titik nada tinggi (i)
                if(n.note === 'i') {
                    ctx.fillStyle = "white";
                    ctx.beginPath(); ctx.arc(xPos + 17, n.y - 6, 2.5, 0, Math.PI * 2); ctx.fill();
                }
            }
        });

        // Cek jika lagu selesai
        if(now > activeNotes[activeNotes.length-1].time + 2000) {
            isRunning = false;
            alert("Lagu Selesai! Hebat!");
            startPianoGame();
        } else {
            requestAnimationFrame(loop);
        }
    }
};