// games/math_story.js

// Database 35 Soal (5 Awal + 30 Baru)
const masterMathStories = [
    { s: "Budi punya 5 apel, lalu terjatuh 3 apel.", q: "Berapa sisa apel Budi?", a: 2 },
    { s: "Ibu membeli 3 kotak donat. Tiap kotak isi 6 donat.", q: "Berapa total donat Ibu?", a: 18 },
    { s: "Budi membawa 10 kelereng, lalu menang 5 kelereng lagi saat main.", q: "Berapa total kelereng Budi?", a: 15 },
    { s: "Ada 4 tenda pramuka. Setiap tenda butuh 5 pasak besi.", q: "Berapa total pasak yang dibutuhkan?", a: 20 },
    { s: "Budi membeli es krim seharga 7.000. Ia membayar dengan uang 10.000.", q: "Berapa kembalian uang Budi?", a: 3000 },
    
    // --- 30 SOAL TAMBAHAN ---
    { s: "Budi naik angkot dari Terminal Purabaya. Penumpang awal 12 orang. Di Wonokromo turun 4 orang dan naik 7 orang.", q: "Berapa penumpang di angkot sekarang?", a: 15 },
    { s: "Budi membeli 4 bungkus nasi bungkus. Harga satu bungkusnya 5.000 rupiah.", q: "Berapa total uang yang harus dibayar Budi?", a: 20000 },
    { s: "Di rak buku Budi ada 5 baris. Setiap baris berisi 12 buku koding.", q: "Berapa total buku koding milik Budi?", a: 60 },
    { s: "Budi ingin membagikan 40 permen kepada 8 orang temannya secara adil.", q: "Berapa permen yang didapat setiap teman?", a: 5 },
    { s: "Budi bersepeda sejauh 15 km di pagi hari dan 12 km di sore hari.", q: "Berapa total jarak yang ditempuh Budi hari ini?", a: 27 },
    { s: "Ibu memasak 24 potong ayam goreng. Anggota keluarga memakan 18 potong.", q: "Berapa sisa ayam goreng yang ada di meja?", a: 6 },
    { s: "Budi punya uang 50.000. Ia membeli mouse seharga 35.000.", q: "Berapa sisa uang Budi?", a: 15000 },
    { s: "Sebuah bus Trans Semanggi berisi 30 kursi. Jika 22 kursi sudah terisi, berapa kursi yang kosong?", a: 8 },
    { s: "Budi menanam 6 baris pohon cabai. Setiap baris ada 9 pohon.", q: "Berapa jumlah seluruh pohon cabai Budi?", a: 54 },
    { s: "Di sebuah taman ada 14 burung gereja. Kemudian datang lagi 16 burung gereja.", q: "Berapa jumlah burung di taman sekarang?", a: 30 },
    { s: "Budi punya tali sepanjang 100 cm. Ia memotongnya menjadi 4 bagian sama panjang.", q: "Berapa cm panjang setiap potongan tali?", a: 25 },
    { s: "Ibu membeli 2 kg telur. 1 kg telur berisi 16 butir.", q: "Berapa total butir telur yang dibeli Ibu?", a: 32 },
    { s: "Budi bermain game selama 45 menit, lalu belajar koding selama 60 menit.", q: "Berapa total menit aktivitas Budi?", a: 105 },
    { s: "Dalam satu kelas ada 36 siswa. Jika 19 di antaranya adalah laki-laki, berapa jumlah siswa perempuan?", a: 17 },
    { s: "Budi membeli 3 botol minuman seharga 4.000 per botol. Ia membayar dengan uang 20.000.", q: "Berapa uang kembaliannya?", a: 8000 },
    { s: "Sebuah pizza dipotong menjadi 8 bagian. Budi memakan 2 bagian dan adiknya memakan 3 bagian.", q: "Berapa sisa potongan pizza?", a: 3 },
    { s: "Budi lari pagi di lapangan. Satu putaran adalah 400 meter. Budi berlari 5 putaran.", q: "Berapa total meter yang ditempuh Budi?", a: 2000 },
    { s: "Ibu mempunyai 48 buah jeruk. Jeruk itu dimasukkan ke dalam 6 kantong plastik sama banyak.", q: "Berapa isi jeruk di setiap kantong?", a: 8 },
    { s: "Budi menabung 2.000 rupiah setiap hari. Setelah 2 minggu, berapa total tabungan Budi?", a: 28000 },
    { s: "Di parkiran Mall ada 45 motor. Lalu 17 motor keluar parkir.", q: "Berapa sisa motor di parkiran?", a: 28 },
    { s: "Budi membeli 5 buah pensil. Harga totalnya 15.000.", q: "Berapa harga satu buah pensil?", a: 3000 },
    { s: "Ibu membuat 50 kue lumpur. Budi membagikan 35 kue ke tetangga.", q: "Berapa sisa kue lumpur Ibu?", a: 15 },
    { s: "Budi punya 3 flashdisk. Kapasitas tiap flashdisk adalah 16 GB.", q: "Berapa total kapasitas memori Budi?", a: 48 },
    { s: "Sebuah lampu LED butuh 9 watt. Budi menyalakan 5 lampu sekaligus di rumahnya.", q: "Berapa total watt yang digunakan?", a: 45 },
    { s: "Budi mengetik 40 kata per menit. Jika ia mengetik selama 10 menit, berapa total kata yang dihasilkan?", a: 400 },
    { s: "Di akuarium Budi ada 25 ikan mas. Sayangnya 7 ikan mati.", q: "Berapa ikan mas yang masih hidup?", a: 18 },
    { s: "Budi membeli 2 pack kartu. Satu pack berisi 52 kartu.", q: "Berapa jumlah seluruh kartu Budi?", a: 104 },
    { s: "Ibu membeli 5 kg beras. Harga per kg adalah 13.000.", q: "Berapa total harga beras tersebut?", a: 65000 },
    { s: "Budi punya 12 pasang kaos kaki.", q: "Berapa jumlah satuan (bukan pasang) kaos kaki Budi?", a: 24 },
    { s: "Budi memotong semangka menjadi 12 bagian. Ia membagikan 9 bagian kepada temannya.", q: "Berapa sisa bagian semangka Budi?", a: 3 }
];

let mathStories = []; // Akan diisi hasil kocokan
let msCurrentLevel = 0;
let msScore = 0;

// Fungsi Mengacak Soal (Fisher-Yates Shuffle)
function shuffleStories(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startMathStory() {
    // Acak soal setiap kali game dimulai
    mathStories = shuffleStories([...masterMathStories]);
    msCurrentLevel = 0;
    msScore = 0;
    
    const wrapper = document.getElementById('game-canvas-wrapper');
    wrapper.innerHTML = `
        <div id="math-story-ui" style="text-align:center; color:white; padding:20px; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <div id="ms-story" style="margin-bottom:20px; font-size:1.1rem; background:rgba(0,0,0,0.5); padding:20px; border-radius:15px; border-left: 6px solid #3498db; text-align: left; box-shadow: 0 10px 20px rgba(0,0,0,0.4); min-height: 80px;">
                Memuat cerita...
            </div>

            <div style="background: #2c3e50; padding: 15px; border-radius: 12px; margin-bottom: 25px; border: 2px dashed #f1c40f;">
                <div id="ms-question" style="font-size:1.6rem; font-weight:900; color:#f1c40f; text-shadow: 2px 2px 0px #000; letter-spacing: 1px;">
                    LOADING...
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <input type="number" id="ms-input" placeholder="???" 
                    style="padding:15px; width:140px; border-radius:10px; border:4px solid #f1c40f; font-size:1.8rem; text-align:center; background:#1a1a1a; color:#2ecc71; font-weight:bold; outline:none;">
            </div>

            <button onclick="checkMathStory()" 
                style="padding:15px 45px; cursor:pointer; background: linear-gradient(180deg, #2ecc71, #27ae60); color:white; border:none; border-radius:10px; font-weight:bold; font-size:1.2rem; box-shadow: 0 6px #1e8449;">
                KIRIM JAWABAN
            </button>
        </div>
    `;
    
    document.getElementById('ms-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') checkMathStory();
    });

    loadMsLevel();
}

function loadMsLevel() {
    if (msCurrentLevel < mathStories.length) {
        const level = mathStories[msCurrentLevel];
        document.getElementById('ms-story').innerText = level.s;
        document.getElementById('ms-question').innerText = level.q;
        
        const input = document.getElementById('ms-input');
        input.value = '';
        input.focus();
    } else {
        alert("Luar Biasa! Kamu berhasil menyelesaikan semua Quest Matematika!");
        goHome();
    }
}

function checkMathStory() {
    const inputElement = document.getElementById('ms-input');
    const val = parseInt(inputElement.value);
    
    if (isNaN(val)) return;

    // Cek jawaban (mendukung properti 'a' atau 'answer' agar aman)
    const correctAnswer = mathStories[msCurrentLevel].a || mathStories[msCurrentLevel].answer;

    if (val === correctAnswer) {
        msScore += 10;
        msCurrentLevel++;
        
        const stats = document.getElementById('game-stats');
        if (stats) stats.innerText = `Skor: ${msScore} | 🛡️ Mode Santai`;
        
        loadMsLevel();
    } else {
        inputElement.style.borderColor = "#e74c3c";
        setTimeout(() => inputElement.style.borderColor = "#f1c40f", 500);
        alert("Jawaban salah! Coba hitung teliti lagi ya.");
    }
}