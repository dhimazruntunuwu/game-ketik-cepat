window.startWordScrambleGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    const words = [
        "MAKAN", "MINUM", "BELAJAR", "PROGRAMMER", "INDONESIA", "SURABAYA", "KODING", "GADGET", "KOMPUTER", "LAPTOP",
        "APLIKASI", "ALGORITMA", "DATABASE", "JARINGAN", "SERVER", "KEAMANAN", "SANDI", "SINTAKSIS", "VARIABEL", "FUNGSI",
        "LOGIKA", "DATA", "INFORMASI", "SISTEM", "PROSESOR", "MEMORI", "STORAGE", "INPUT", "OUTPUT", "INTERFACE",
        "INTERNET", "WEBSITE", "MOBILE", "DESKTOP", "CLOUD", "VIRTUAL", "DIGITAL", "ANALOG", "BINER", "TEKNOLOGI",
        "PENDIDIKAN", "SEKOLAH", "KAMPUS", "GURU", "DOSEN", "MAHASISWA", "SISWA", "BUKU", "JURNAL", "RISET",
        "ILMU", "SAINS", "MATEMATIKA", "FISIKA", "KIMIA", "BIOLOGI", "SEJARAH", "EKONOMI", "SOSIAL", "BUDAYA",
        "BAHASA", "SASTRA", "ARTIKEL", "SKRIPSI", "TESIS", "DISERTASI", "GELAR", "UJIAN", "NILAI", "CERDAS",
        "BISNIS", "KANTOR", "PERUSAHAAN", "KERJA", "KARIR", "GAJI", "BONUS", "INVESTASI", "SAHAM", "MODAL",
        "PASAR", "KONSUMEN", "PRODUK", "JASA", "MEREK", "PROMOSI", "PENJUALAN", "UNTUNG", "LABA", "RUGI",
        "KOTA", "DESA", "NEGARA", "PROVINSI", "PULAU", "LAUT", "GUNUNG", "SUNGAI", "DANAU", "HUTAN",
        "UDARA", "CUACA", "IKLIM", "ALAM", "LINGKUNGAN", "ENERGI", "LISTRIK", "SURYA", "ANGIN", "AIR",
        "RUMAH", "KELUARGA", "TEMAN", "SAHABAT", "CINTA", "KASIH", "SAYANG", "BAHAGIA", "SEDIH", "MARAH",
        "TAKUT", "BERANI", "JUJUR", "ADIL", "SOPAN", "RAMAH", "PINTAR", "MALAS", "RAJIN", "SEHAT",
        "SAKIT", "OBAT", "DOKTER", "PERAWAT", "RUMAHSAKIT", "APOTEK", "GIZI", "VITAMIN", "OLAHRAGA", "LARI",
        "RENANG", "SEPEDA", "BOLA", "MUSIK", "LAGU", "GITAR", "PIANO", "SENI", "LUKIS", "TARI",
        "FILM", "BIOSKOP", "HIBURAN", "LIBURAN", "WISATA", "HOTEL", "PESAWAT", "KERETA", "MOBIL", "MOTOR",
        "JALAN", "JEMBATAN", "GEDUNG", "PASAR", "MALL", "RESTURAN", "CAFE", "KOPI", "TEH", "SUSU",
        "NASI", "ROTI", "BUAH", "SAYUR", "DAGING", "IKAN", "TELUR", "SAMBAL", "GARAM", "GULA",
        "PAGI", "SIANG", "SORE", "MALAM", "WAKTU", "JAM", "MENIT", "DETIK", "HARI", "MINGGU",
        "BULAN", "TAHUN", "ABAD", "ZAMAN", "MASALALU", "MASADEPAN", "SEKARANG", "CITA-CITA", "MIMPI", "HARAPAN",
        "KOMUNIKASI", "TELEPON", "PESAN", "SUREL", "DISKUSI", "RAPAT", "PRESENTASI", "IDE", "INOVASI", "KREATIF",
        "SOLUSI", "MASALAH", "TANTANGAN", "PELUANG", "KEBERHASILAN", "GAGAL", "BANGKIT", "USAHA", "DOA", "TAWAKAL",
        "STRATEGI", "TAKTIK", "METODE", "TEKNIK", "GAYA", "TREN", "POPULER", "MODERN", "TRADISIONAL", "WARISAN",
        "PAHLAWAN", "MERDEKA", "POLITIK", "HUKUM", "ADIL", "DEMOKRASI", "RAKYAT", "PEMIMPIN", "PRESIDEN", "MENTERI",
        "ANGGARAN", "PAJAK", "SUBSIDI", "EKSPOR", "IMPOR", "TRANSAKSI", "PEMBAYARAN", "DOMPET", "TABUNGAN", "BANK",
        "ATM", "KARTU", "DIGITALPAYMENT", "BLOCKCHAIN", "CRYPTO", "MINING", "HARDWARE", "SOFTWARE", "FIRMWARE", "MALWARE",
        "VIRUS", "ANTIVIRUS", "FIREWALL", "ROUTER", "SWITCH", "KABEL", "SIGNAL", "KUOTA", "PULSA", "BATERAI",
        "LAYAR", "KEYBOARD", "MOUSE", "SPEAKER", "HEADSET", "KAMERA", "SENSOR", "ROBOT", "OTOMASI", "AI",
        "MACHINELEARNING", "BIGDATA", "ANALYTICS", "CLOUDCOMPUTING", "CYBER", "WEB3", "METAVERSE", "GAMING", "ESPORTS", "STREAMING",
        "YOUTUBE", "SOCIALMEDIA", "KONTEN", "INFLUENCER", "FOLLOWER", "LIKE", "SHARE", "COMMENT", "VIRAL", "TAG",
        "LOGISTIK", "KURIR", "PAKET", "PENGIRIMAN", "ALAMAT", "KODEPOS", "NAVIGASI", "PETA", "GPS", "TRACKING",
        "KUALITAS", "KUANTITAS", "STANDAR", "PROSEDUR", "MANUAL", "PANDUAN", "TUTORIAL", "DOKUMENTASI", "ARSIP", "DATASET",
        "PROYEK", "TIM", "KOLABORASI", "KOMUNITAS", "FORUM", "KONTRIBUSI", "DONASI", "RELAWAN", "SOSIAL", "KEMANUSIAAN",
        "MORAL", "ETIKA", "NORMA", "AGAMA", "IBADAH", "MASJID", "GEREJA", "PURA", "VIHARA", "KLENTENG",
        "TOLERANSI", "HARMONI", "DAMAI", "KONFLIK", "KRITIK", "SARAN", "MASUKAN", "TESTIMONI", "ULASAN", "RATING",
        "POPULASI", "WARGA", "PENDUDUK", "KTP", "PASPOR", "VISA", "IMIGRASI", "WISATAWAN", "TURIS", "KOPER",
        "RANSEL", "TIKET", "BOOKING", "RESERVASI", "CHECKIN", "CHECKOUT", "BANDARA", "STASIUN", "TERMINAL", "HALTE",
        "TRUK", "KAPAL", "SELAM", "ROKET", "ANTARIKSA", "BINTANG", "BULAN", "MATAHARI", "PLANET", "GALAKSI",
        "ASTROLOGI", "ASTRONOMI", "FISIKA", "GRAVITASI", "ENERGI", "NUKLIR", "RADIASI", "CAHAYA", "BUNYI", "GETARAN",
        "SUHU", "TEKANAN", "VOLUME", "MASSA", "BERAT", "PANJANG", "LEBAR", "LUAS", "TINGGI", "DALAM",
        "CEPAT", "LAMBAT", "STABIL", "DINAMIS", "FLEKSIBEL", "KAKU", "KUAT", "RAPUH", "KERAS", "LUNAK",
        "CAIR", "GAS", "PADAT", "PLASMA", "ATOM", "MOLEKUL", "SEL", "JARINGAN", "ORGAN", "SISTEM",
        "TUBUH", "KEPALA", "RAMBUT", "MATA", "TELINGA", "HIDUNG", "MULUT", "TANGAN", "KAKI", "JANTUNG",
        "PARU-PARU", "OTAK", "DARAH", "OKSIGEN", "MAKANAN", "MINUMAN", "GIZI", "DIET", "PUASA", "LAPAR",
        "HAUS", "KENYANG", "LEZAT", "ENAK", "PAHIT", "MANIS", "ASAM", "ASIN", "PEDAS", "GURIH",
        "BAHAN", "BUMBU", "RESEP", "DAPUR", "KOMPOR", "WAJAN", "PANCI", "PISAU", "TALENAN", "OVEN",
        "KULKAS", "BLENDER", "MEJA", "KURSI", "LEMARI", "TEMPAT-TIDUR", "SOFA", "KARPET", "DINDING", "ATAP",
        "LANTAI", "PINTU", "JENDELA", "HALAMAN", "TAMAN", "BUNGA", "POHON", "DAUN", "AKAR", "BATANG",
        "BUAH", "BIJI", "RUMPUT", "TANAH", "PASIR", "BATU", "LOGAM", "BESI", "EMAS", "PERAK",
        "TEMBAGA", "PLASTIK", "KERTAS", "KAYU", "KACA", "KAIN", "BENANG", "JARUM", "GUNTING", "LEM",
        "CAT", "WARNA", "MERAH", "BIRU", "KUNING", "HIJAU", "HITAM", "PUTIH", "ABU-ABU", "COKELAT",
        "OREN", "UNGU", "MERAH-MUDA", "EMAS", "PERAK", "CERAH", "GELAP", "TERANG", "REDUP", "WARNA-WARNI"
        ];
    

    let currentWord = "";
    let scrambled = "";
    let score = 0;

    wrapper.innerHTML = `
        <div style="text-align:center; font-family:sans-serif; padding:20px; background:#f0fdf4; border-radius:20px;">
            <h2 style="color:#16a34a;">🔤 Susun Kata</h2>
            <div style="background:white; padding:30px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <p style="font-size:0.9rem; color:#64748b;">Susun huruf acak ini:</p>
                <h1 id="scrambled-word" style="letter-spacing:8px; color:#16a34a; margin:15px 0;">-----</h1>
                <input type="text" id="word-input" placeholder="Ketik jawaban..." style="padding:12px; width:80%; border:2px solid #bbf7d0; border-radius:10px; font-size:1.1rem; text-align:center; outline:none;">
                <br><br>
                <button id="check-word" style="padding:12px 30px; background:#16a34a; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">TEBAK!</button>
            </div>
            <p id="word-msg" style="margin-top:15px; font-weight:bold;"></p>
        </div>
    `;

    function nextWord() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        scrambled = currentWord.split('').sort(() => Math.random() - 0.5).join('');
        document.getElementById('scrambled-word').innerText = scrambled;
        document.getElementById('word-input').value = "";
        document.getElementById('word-input').focus();
    }

    document.getElementById('check-word').onclick = function() {
        const input = document.getElementById('word-input').value.toUpperCase();
        const msg = document.getElementById('word-msg');
        if(input === currentWord) {
            score++;
            msg.innerText = "BENAR! 🌟"; msg.style.color = "#16a34a";
            stats.innerText = `Skor: ${score} | 🔤 Word Scramble`;
            setTimeout(nextWord, 1000);
        } else {
            msg.innerText = "SALAH! Coba lagi."; msg.style.color = "#dc2626";
        }
    };

    nextWord();
};