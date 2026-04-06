/**
 * Word Search Game - Dhimaz Game Hub Edition
 * High-Precision Touch & Persistent Highlighting
 */

const WS_GRID_SIZE = 12; 
const WS_CELL_SIZE = 35; 
const WS_WORDS_LIBRARY = [
    // --- KATA DASAR & UMUM ---
    "MAKAN", "MINUM", "TIDUR", "LARI", "JALAN", "DUDUK", "BACA", "TULIS", "LIHAT", "DENGAR",
    "SENYUM", "TAWA", "MAIN", "KERJA", "BELAJAR", "BANGUN", "MANDI", "MASAK", "SAPU", "BERSIH",
    
    // --- BENDA SEKITAR ---
    "MEJA", "KURSI", "LEMARI", "PINTU", "JENDELA", "LAMPU", "KASUR", "BANTAL", "CERMIN", "SISIR",
    "PIRING", "GELAS", "SENDOK", "GARPU", "WAJAN", "TIMBA", "PANCUR", "PAGAR", "ATAP", "LANTAI",
    "BUKU", "PENSIL", "PENA", "KERTAS", "PENGGARIS", "TAS", "SEPATU", "KAOS", "CELANA", "TOPI",
    "KOMPUTER", "PONSEL", "KABEL", "LAYAR", "MOUSE", "KAMERA", "RADIO", "TELEVISI", "KIPAS", "JAM",
    
    // --- HEWAN (FAUNA) ---
    "AYAM", "BEBEK", "SAPI", "KAMBING", "KUDA", "GAJAH", "SINGA", "MACAN", "ZEBRA", "JERAPAH",
    "KUCING", "ANJING", "KELINCI", "TIKUS", "BURUNG", "ELANG", "MERPATI", "BELETOK", "AYAM", "IKAN",
    "PAUS", "HIU", "LUMBA", "PENYU", "KATAK", "ULAR", "BUAYA", "KOMODO", "LALAT", "NYAMUK",
    "LEBAH", "SEMUT", "LABALABA", "KUPUKUPU", "CAPUNG", "BELALANG", "ULAT", "CACING", "GURITA", "KEPITING",
    
    // --- BUAH & TUMBUHAN ---
    "APEL", "JERUK", "MANGGA", "PISANG", "ANGGUR", "MELON", "SEMANGKA", "NANAS", "DURIAN", "RAMBUTAN",
    "SALAK", "SAWO", "JAMBU", "PEPAYA", "MANGGIS", "KELAPA", "ALPUKAT", "STRAWBERI", "CERI", "KURMA",
    "MAWAR", "MELATI", "ANGGREK", "POHON", "DAUN", "AKAR", "BATANG", "BUNGA", "RUMPUT", "BAMBU",
    
    // --- ANGGOTA TUBUH ---
    "KEPALA", "RAMBUT", "MATA", "HIDUNG", "MULUT", "TELINGA", "LEHER", "BAHU", "TANGAN", "JARI",
    "DADA", "PERUT", "PUNGGUNG", "PINGGANG", "PAHA", "LUTUT", "KAKI", "TUMIT", "LIDAH", "GIGI",
    
    // --- PROFESI ---
    "GURU", "DOSEN", "DOKTER", "PERAWAT", "PILOT", "POLISI", "TENTARA", "PETANI", "NELAYAN", "SOPIR",
    "KOKI", "PELAYAN", "ATLET", "PENYANYI", "PENARI", "PELUKIS", "PENULIS", "ARTIS", "MASINIS", "NAKHODA",
    
    // --- ALAM & CUACA ---
    "MATAHARI", "BULAN", "BINTANG", "LANGIT", "AWAN", "HUJAN", "ANGIN", "PETIR", "PELANGI", "GUNUNG",
    "LAUT", "SUNGAI", "DANAU", "PANTAI", "HUTAN", "LEMBAH", "GUA", "PASIR", "BATU", "TANAH",
    
    // --- KENDARAAN ---
    "MOBIL", "MOTOR", "SEPEDA", "BUS", "TRUK", "KERETA", "PESAWAT", "KAPAL", "PERAHU", "BECAK",
    
    // --- WARNA ---
    "MERAH", "BIRU", "KUNING", "HIJAU", "HITAM", "PUTIH", "COKELAT", "UNGU", "ORANYE", "ABUABU",
    
    // --- TEMPAT & BANGUNAN ---
    "RUMAH", "KANTOR", "SEKOLAH", "PASAR", "TOKO", "MASJID", "GEREJA", "PURA", "VIHARA", "HOTEL",
    "TAMAN", "HUTAN", "SAWAH", "KEBUN", "DAPUR", "KAMAR", "KAMPUS", "APOTEK", "GUDANG", "MUSEUM",
    
    // --- KOTA DI INDONESIA ---
    "JAKARTA", "SURABAYA", "BANDUNG", "MEDAN", "SEMARANG", "MAKASSAR", "PALEMBANG", "MALANG", "BALI", "JOGJA",
    "SOLO", "BOGOR", "BEKASI", "DEPOK", "TANGERANG", "BALIKPAPAN", "SAMARINDA", "PONTIANAK", "MANADO", "AMBON",
    
    // --- KATA SIFAT ---
    "BESAR", "KECIL", "TINGGI", "PENDEK", "PANJANG", "LEBAR", "SEMPIT", "BERSIH", "KOTOR", "WANGI",
    "BAU", "CEPAT", "LAMBAT", "KUAT", "LEMAH", "PINTAR", "BODOH", "RAJIN", "MALAS", "BERANI",
    "TAKUT", "SENANG", "SEDIH", "MARAH", "MALU", "LUCU", "KERAS", "LEMBUT", "PANAS", "DINGIN",
    "MANIS", "ASIN", "PAHIT", "ASAM", "PEDAS", "MURAH", "MAHAL", "KAYA", "MISKIN", "MUDA",
    
    // --- KATA TAMBAHAN (ACAK UMUM) ---
    "DUNIA", "NEGARA", "BANGSA", "RAKYAT", "HUKUM", "ADIL", "DAMAI", "MERDEKA", "SEJARAH", "BUDAYA",
    "BAHASA", "ILMU", "SENI", "MUSIK", "LAGU", "PUISI", "CERITA", "BERITA", "KABAR", "PESAN",
    "WAKTU", "DETIK", "MENIT", "JAM", "HARI", "MINGGU", "BULAN", "TAHUN", "PAGI", "SIANG",
    "SORE", "MALAM", "KEMARIN", "BESOK", "LUSA", "DULU", "NANTI", "PERNAH", "SELALU", "JARANG",
    "MUNGKIN", "PASTI", "HARUS", "BISA", "BOLEH", "SAMA", "BEDA", "BARU", "LAMA", "TUA",
    "HIDUP", "MATI", "SEHAT", "SAKIT", "LAPAR", "HAUS", "KENYANG", "LULUS", "GAGAL", "MENANG",
    "KALAH", "HADIAH", "JUARA", "NOMOR", "ANGKA", "HURUF", "TANDA", "RUANG", "JARAK", "BERAT",
    "RINGAN", "MUDAH", "SULIT", "GAMPANG", "SUSAH", "PENTING", "BAHAYA", "AMAN", "TENANG", "RAMAI",
    "SEPI", " INDAH", "JELEK", "BAGUS", "NYAMAN", "TEPAT", "COCOK", "SALAH", "BENAR", "JUJUR",
    
    // --- KATEGORI DAPUR & MAKANAN ---
    "NASI", "ROTI", "SOTO", "SATE", "BAKSO", "MIE", "TELUR", "TEMPE", "TAHU", "GULAI",
    "SAYUR", "GARAM", "GULA", "KOPI", "TEH", "SUSU", "MADU", "SIRUP", "COKELAT", "MENTEGA",
    "KEJU", "MINYAK", "SANTAN", "CABAI", "BAWANG", "JAHE", "KUNYIT", "MERICA", "KECAP", "SAUS",

    // --- TEKNOLOGI & INTERNET ---
    "DATA", "SISTEM", "SINYAL", "WEBSITE", "APLIKASI", "SANDI", "AKUN", "PROFIL", "FOTO", "VIDEO",
    "SUARA", "TEKS", "FILE", "FOLDER", "MEMORI", "BATERAI", "LISTRIK", "MESIN", "ALAT", "ROBOT",

    // --- OLAHRAGA & HOBI ---
    "BOLA", "RENANG", "SENAM", "SILAT", "CATUR", "LARI", "GOLF", "TENIS", "MUSIK", "PIANO",
    "GITAR", "BIOLA", "SULING", "DRUM", "DANGDUT", "POKER", "SULAP", "PIKNIK", "KEMAH", "DAKI"
];

let ws_grid = [];
let ws_foundWords = [];
let ws_foundLines = []; 
let ws_current_words = [];
let isDragging = false;
let startCell = null;
let currentCell = null;
let ws_canvas, ws_ctx;
let ws_gameActive = true;

window.startWordSearchGame = function() {
    ws_gameActive = true;
    ws_foundWords = [];
    ws_foundLines = [];
    
    const wrapper = document.getElementById('game-canvas-wrapper');
    const width = WS_GRID_SIZE * WS_CELL_SIZE;
    const height = WS_GRID_SIZE * WS_CELL_SIZE;

    wrapper.innerHTML = `
        <div style="text-align:center; padding: 15px; font-family: sans-serif; background:#f8fafc; border-radius:20px;">
            <h2 style="margin:0 0 10px 0; color:#1e293b;">🔍 Word Search</h2>
            
            <div style="position:relative; display:inline-block; margin-bottom:15px;">
                <canvas id="ws-canvas" width="${width}" height="${height}" 
                    style="border:4px solid #334155; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); cursor:crosshair; touch-action:none; max-width:100%; height:auto; background:white;">
                </canvas>
            </div>

            <div style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;">
                <button onclick="startWordSearchGame()" style="padding:10px 15px; background:#6366f1; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">🔄 Acak Baru</button>
                <button onclick="surrenderWordSearch()" style="padding:10px 15px; background:#ef4444; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">🏳️ Selesai</button>
            </div>

            <div style="margin-top: 15px; padding: 10px; background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; max-width: 320px; margin-left: auto; margin-right: auto;">
                <p style="margin:0 0 5px 0; font-size:0.8rem; color:#94a3b8; font-weight:bold;">CARI KATA INI:</p>
                <div id="ws-word-list" style="font-size: 0.85rem; color:#475569; line-height: 1.6; font-weight: 500;"></div>
            </div>
            
            <p style="color: #64748b; font-size: 0.9rem; margin-top: 10px;">
                Skor: <span id="ws-score-display" style="font-weight:bold; color:#1e293b;">0</span>
            </p>
        </div>
    `;

    ws_canvas = document.getElementById('ws-canvas');
    ws_ctx = ws_canvas.getContext('2d');

    setupWSGrid();
    updateWordListUI();
    drawWSGrid();

    // Event Listeners
    ws_canvas.onmousedown = ws_handleStart;
    ws_canvas.onmousemove = ws_handleMove;
    window.onmouseup = ws_handleEnd;

    ws_canvas.addEventListener('touchstart', (e) => { e.preventDefault(); ws_handleStart(e.touches[0]); }, {passive: false});
    ws_canvas.addEventListener('touchmove', (e) => { e.preventDefault(); ws_handleMove(e.touches[0]); }, {passive: false});
    window.addEventListener('touchend', ws_handleEnd);
};

function setupWSGrid() {
    ws_grid = Array.from({ length: WS_GRID_SIZE }, () => Array(WS_GRID_SIZE).fill(''));
    ws_current_words = WS_WORDS_LIBRARY.sort(() => 0.5 - Math.random()).slice(0, 8);

    ws_current_words.forEach(word => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            const dir = Math.random() > 0.5 ? {r:0, c:1} : {r:1, c:0}; 
            const r = Math.floor(Math.random() * (WS_GRID_SIZE - (dir.r * word.length)));
            const c = Math.floor(Math.random() * (WS_GRID_SIZE - (dir.c * word.length)));

            let canPlace = true;
            for(let i=0; i<word.length; i++) {
                let char = ws_grid[r + i*dir.r][c + i*dir.c];
                if(char !== '' && char !== word[i]) {
                    canPlace = false; break;
                }
            }

            if(canPlace) {
                for(let i=0; i<word.length; i++) ws_grid[r + i*dir.r][c + i*dir.c] = word[i];
                placed = true;
            }
            attempts++;
        }
    });

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let r=0; r<WS_GRID_SIZE; r++) {
        for(let c=0; c<WS_GRID_SIZE; c++) {
            if(ws_grid[r][c] === '') ws_grid[r][c] = chars[Math.floor(Math.random()*chars.length)];
        }
    }
}

function updateWordListUI() {
    const listEl = document.getElementById('ws-word-list');
    listEl.innerHTML = ws_current_words.map(w => {
        const isFound = ws_foundWords.includes(w);
        return `<span style="text-decoration: ${isFound ? 'line-through' : 'none'}; color: ${isFound ? '#94a3b8' : '#6366f1'}; margin: 0 5px;">${w}</span>`;
    }).join(" • ");
}

function getWSMousePos(e) {
    const rect = ws_canvas.getBoundingClientRect();
    const scaleX = ws_canvas.width / rect.width;
    const scaleY = ws_canvas.height / rect.height;
    return {
        x: Math.floor(((e.clientX - rect.left) * scaleX) / WS_CELL_SIZE),
        y: Math.floor(((e.clientY - rect.top) * scaleY) / WS_CELL_SIZE)
    };
}

function ws_handleStart(e) {
    if(!ws_gameActive) return;
    isDragging = true;
    startCell = getWSMousePos(e);
    currentCell = startCell;
}

function ws_handleMove(e) {
    if (!isDragging || !ws_gameActive) return;
    const pos = getWSMousePos(e);
    if (pos.x >= 0 && pos.x < WS_GRID_SIZE && pos.y >= 0 && pos.y < WS_GRID_SIZE) {
        currentCell = pos;
        drawWSGrid();
        drawWSSelection(startCell, currentCell, "rgba(99, 102, 241, 0.3)"); // Biru saat ditarik
    }
}

function ws_handleEnd() {
    if (!isDragging || !ws_gameActive) return;
    isDragging = false;

    const selected = getWSText(startCell, currentCell);
    const reversed = selected.split('').reverse().join('');
    
    let found = null;
    if (ws_current_words.includes(selected)) found = selected;
    else if (ws_current_words.includes(reversed)) found = reversed;

    if (found && !ws_foundWords.includes(found)) {
        ws_foundWords.push(found);
        ws_foundLines.push({ start: {...startCell}, end: {...currentCell} });
        document.getElementById('ws-score-display').innerText = ws_foundWords.length * 100;
        updateWordListUI();
    }
    
    drawWSGrid();
    if (ws_foundWords.length === ws_current_words.length) {
        setTimeout(() => { alert("🏆 Mantap Dhimaz! Semua kata ketemu!"); surrenderWordSearch(); }, 300);
    }
}

function getWSText(s, e) {
    let text = "";
    if (s.y === e.y) { // Horiz
        const min = Math.min(s.x, e.x), max = Math.max(s.x, e.x);
        for (let i = min; i <= max; i++) text += ws_grid[s.y][i];
    } else if (s.x === e.x) { // Vert
        const min = Math.min(s.y, e.y), max = Math.max(s.y, e.y);
        for (let i = min; i <= max; i++) text += ws_grid[i][s.x];
    }
    return text;
}

function drawWSGrid() {
    ws_ctx.clearRect(0, 0, ws_canvas.width, ws_canvas.height);
    
    // Gambar highlight permanen (Hijau)
    ws_foundLines.forEach(line => drawWSSelection(line.start, line.end, "rgba(34, 197, 94, 0.4)"));

    ws_ctx.textAlign = "center";
    ws_ctx.textBaseline = "middle";
    ws_ctx.font = "bold 16px sans-serif";

    for (let r = 0; r < WS_GRID_SIZE; r++) {
        for (let c = 0; c < WS_GRID_SIZE; c++) {
            const x = c * WS_CELL_SIZE + WS_CELL_SIZE / 2;
            const y = r * WS_CELL_SIZE + WS_CELL_SIZE / 2;
            ws_ctx.fillStyle = "#1e293b";
            ws_ctx.fillText(ws_grid[r][c], x, y);
        }
    }
}

function drawWSSelection(s, e, color) {
    ws_ctx.beginPath();
    ws_ctx.lineWidth = WS_CELL_SIZE * 0.7;
    ws_ctx.lineCap = "round";
    ws_ctx.strokeStyle = color;
    ws_ctx.moveTo(s.x * WS_CELL_SIZE + WS_CELL_SIZE/2, s.y * WS_CELL_SIZE + WS_CELL_SIZE/2);
    ws_ctx.lineTo(e.x * WS_CELL_SIZE + WS_CELL_SIZE/2, e.y * WS_CELL_SIZE + WS_CELL_SIZE/2);
    ws_ctx.stroke();
}

window.surrenderWordSearch = function() {
    ws_gameActive = false;
    const finalScore = ws_foundWords.length * 100;
    if(window.saveToSpreadsheet) saveToSpreadsheet('word_search', finalScore);
    if(window.showLeaderboard) showLeaderboard('word_search');
};