// Kita simpan skor di luar agar tidak reset saat fungsi dipanggil ulang
let colorScore = 0;

function startColorGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Tampilkan skor dan timer global di awal
    stats.innerText = `Skor: ${colorScore} | ⏳ ${timeLeft}s`;

    const colors = ['red', 'blue', 'green', 'yellow'];
    const targetColor = colors[Math.floor(Math.random() * 4)];
    
    // Warna teks dibuat acak agar menjebak (Stroop Effect sederhana)
    const randomTextColor = colors[Math.floor(Math.random() * 4)];

    wrapper.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="font-size: 1.2rem; color: #64748b;">Pilih warna yang tertulis:</p>
            <h2 style="color:${randomTextColor}; font-size: 3.5rem; margin: 10px 0; text-shadow: 2px 2px #ddd;">
                ${targetColor.toUpperCase()}
            </h2>
            <div id="color-btns" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; margin-top: 20px;"></div>
        </div>
    `;

    colors.forEach(c => {
        const btn = document.createElement('button');
        // Nama warna dalam Bahasa Indonesia untuk anak-anak
        const colorNameIndo = {
            'red': 'Merah',
            'blue': 'Biru',
            'green': 'Hijau',
            'yellow': 'Kuning'
        };

        btn.style = `width:120px; height:120px; background:${c}; border:none; border-radius:20px; cursor:pointer; 
                     box-shadow: 0 6px 0 #bbb; transition: 0.1s;`;
        
        btn.onmousedown = () => btn.style.transform = "translateY(4px)";
        btn.onmouseup = () => btn.style.transform = "translateY(0)";

        btn.onclick = () => {
            if (c === targetColor) {
                colorScore++;
                // Update stats dengan timer global
                stats.innerText = `Skor: ${colorScore} | ⏳ ${timeLeft}s`;
                
                // Efek sukses singkat sebelum lanjut
                wrapper.style.backgroundColor = "#dcfce7";
                setTimeout(() => {
                    wrapper.style.backgroundColor = "transparent";
                    startColorGame(); // Lanjut ke warna berikutnya
                }, 200);
            } else {
                // Jika salah, hanya beri feedback visual/getar (opsional)
                btn.style.animation = "shake 0.3s";
                setTimeout(() => btn.style.animation = "", 300);
            }
        };
        document.getElementById('color-btns').appendChild(btn);
    });
}

// Tambahkan animasi shake sedikit di style.css kamu jika ingin lebih keren