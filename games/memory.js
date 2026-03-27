function startMemoryGame() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // Inisialisasi tampilan awal
    stats.innerText = `Skor: 0 | ⏳ ${timeLeft}s`;

    wrapper.innerHTML = `
        <div id="mem-grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; max-width:400px; margin:0 auto;"></div>
    `;
    
    const grid = document.getElementById('mem-grid');
    // Ikon yang lebih familiar untuk anak-anak (Hewan & Buah)
    const icons = ['🐶','🐶','🐱','🐱','🐭','🐭','🐹','🐹','🐰','🐰','🦊','🦊','🐻','🐻','🐼','🐼']
                   .sort(() => Math.random() - 0.5);
    
    let flipped = [];
    let score = 0;
    let matchedPairs = 0;

    icons.forEach((icon) => {
        const card = document.createElement('div');
        // Style kartu: warna biru saat tertutup, teks transparan
        card.style = "height:80px; background:#2563eb; display:flex; align-items:center; justify-content:center; font-size:2.5rem; cursor:pointer; border-radius:12px; color:transparent; transition: 0.3s; box-shadow: 0 4px 0 #1e40af;";
        card.innerText = icon;
        
        card.onclick = function() {
            // Hanya bisa klik jika kartu belum terbuka dan belum ada 2 kartu yang dicek
            if(flipped.length < 2 && this.style.color === 'transparent') {
                this.style.color = 'white';
                this.style.background = '#94a3b8'; // Warna saat terbuka
                this.style.boxShadow = "none";
                this.style.transform = "translateY(4px)";
                flipped.push(this);
                
                if(flipped.length === 2) {
                    setTimeout(checkMatch, 500);
                }
            }
        };
        grid.appendChild(card);
    });

    function checkMatch() {
        const [card1, card2] = flipped;
        
        if(card1.innerText === card2.innerText) {
            // Jika Cocok
            score += 10;
            matchedPairs++;
            card1.style.background = "#22c55e"; // Hijau jika benar
            card2.style.background = "#22c55e";
            
            // Update stats dengan timer global
            stats.innerText = `Skor: ${score} | ⏳ ${timeLeft}s`;
            
            flipped = [];
            
            // Jika semua pasangan (8 pasang) ketemu
            if(matchedPairs === 8) {
                alert("Hebat! Semua pasangan ketemu!");
                goHome();
            }
        } else {
            // Jika Salah, tutup lagi
            card1.style.color = 'transparent';
            card1.style.background = '#2563eb';
            card1.style.boxShadow = "0 4px 0 #1e40af";
            card1.style.transform = "translateY(0)";
            
            card2.style.color = 'transparent';
            card2.style.background = '#2563eb';
            card2.style.boxShadow = "0 4px 0 #1e40af";
            card2.style.transform = "translateY(0)";
            
            flipped = [];
        }
    }
}