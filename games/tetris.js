window.startTetrisGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    // 1. Setup UI & Tombol
    wrapper.innerHTML = `
        <div style="text-align:center; user-select:none;">
            <canvas id="tetrisCanvas" width="240" height="400" style="background:#000; border:4px solid #334155; border-radius:8px; display:block; margin:auto;"></canvas>
            <div id="controls" style="margin-top:15px; display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; max-width:240px; margin:auto;">
                <button id="btnLeft" style="padding:15px; background:#475569; color:white; border:none; border-radius:8px; cursor:pointer;">◀</button>
                <button id="btnRotate" style="padding:15px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer;">↻</button>
                <button id="btnRight" style="padding:15px; background:#475569; color:white; border:none; border-radius:8px; cursor:pointer;">▶</button>
                <div></div>
                <button id="btnDrop" style="padding:15px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">▼</button>
            </div>
        </div>
    `;

    const cvs = document.getElementById('tetrisCanvas');
    const ctx = cvs.getContext('2d');
    const SQ = 20; 
    const ROW = 20;
    const COL = 12;
    const VACANT = "#000"; 

    let score = 0;
    let isGameOver = false;
    let board = [];
    for(let r=0; r<ROW; r++) {
        board[r] = Array(COL).fill(VACANT);
    }

    const PIECES = [
        [[[1,1,1,1]],[[1],[1],[1],[1]],[[1,1,1,1]],[[1],[1],[1],[1]]], // I
        [[[1,1,1],[0,1,0]],[[0,1],[1,1],[0,1]],[[0,1,0],[1,1,1]],[[1,0],[1,1],[1,0]]], // T
        [[[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]],[[1,1],[1,1]]], // O
        [[[0,1,1],[1,1,0]],[[1,0],[1,1],[0,1]],[[0,1,1],[1,1,0]],[[1,0],[1,1],[0,1]]], // S
        [[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]],[[1,1,0],[0,1,1]],[[0,1],[1,1],[1,0]]]  // Z
    ];

    function Piece(tetromino, color) {
        this.tetromino = tetromino;
        this.color = color;
        this.n = 0; 
        this.active = this.tetromino[this.n];
        this.x = 4;
        this.y = -2;
    }

    Piece.prototype.draw = function() {
        for(let r=0; r<this.active.length; r++){
            for(let c=0; c<this.active[r].length; c++){
                if(this.active[r][c]){
                    ctx.fillStyle = this.color;
                    ctx.fillRect((this.x+c)*SQ, (this.y+r)*SQ, SQ-1, SQ-1);
                }
            }
        }
    };

    Piece.prototype.collision = function(x, y, piece) {
        for(let r=0; r<piece.length; r++){
            for(let c=0; c<piece[r].length; c++){
                if(!piece[r][c]) continue;
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                if(newX < 0 || newX >= COL || newY >= ROW) return true;
                if(newY < 0) continue;
                if(board[newY][newX] !== VACANT) return true;
            }
        }
        return false;
    };

    Piece.prototype.lock = function() {
        for(let r=0; r<this.active.length; r++){
            for(let c=0; c<this.active[r].length; c++){
                if(!this.active[r][c]) continue;
                if(this.y + r < 0) {
                    isGameOver = true;
                    alert("Game Over! Skor: " + score);
                    goHome();
                    return;
                }
                board[this.y+r][this.x+c] = this.color;
            }
        }
        for(let r=0; r<ROW; r++) {
            if(board[r].every(cell => cell !== VACANT)) {
                board.splice(r, 1);
                board.unshift(Array(COL).fill(VACANT));
                score += 10;
            }
        }
        stats.innerText = `Skor: ${score} | 🧱 Tetris`;
        p = randomPiece();
    };

    function randomPiece(){
        let r = Math.floor(Math.random() * PIECES.length);
        let color = `hsl(${Math.random()*360}, 70%, 50%)`;
        return new Piece(PIECES[r], color);
    }

    let p = randomPiece();
    let dropStart = Date.now();

    // 2. Fungsi Kontrol (Didefinisikan ulang agar aman)
    const moveLeft = () => { if(!p.collision(-1, 0, p.active)) p.x--; };
    const moveRight = () => { if(!p.collision(1, 0, p.active)) p.x++; };
    const rotate = () => {
        let next = p.tetromino[(p.n + 1) % p.tetromino.length];
        if(!p.collision(0, 0, next)) {
            p.n = (p.n + 1) % p.tetromino.length;
            p.active = next;
        }
    };
    const moveDown = () => {
        if(!p.collision(0, 1, p.active)) p.y++;
        else p.lock();
    };

    // Event Listeners Tombol
    document.getElementById('btnLeft').onclick = moveLeft;
    document.getElementById('btnRight').onclick = moveRight;
    document.getElementById('btnRotate').onclick = rotate;
    document.getElementById('btnDrop').onclick = moveDown;

    // Keyboard Support
    window.onkeydown = (e) => {
        if(e.key === "ArrowLeft") moveLeft();
        if(e.key === "ArrowRight") moveRight();
        if(e.key === "ArrowUp") rotate();
        if(e.key === "ArrowDown") moveDown();
    };

    function drop(){
        if(isGameOver) return;
        let now = Date.now();
        if(now - dropStart > 1000) {
            moveDown();
            dropStart = Date.now();
        }
        
        // Render
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,cvs.width,cvs.height);
        for(let r=0; r<ROW; r++){
            for(let c=0; c<COL; c++){
                if(board[r][c] !== VACANT){
                    ctx.fillStyle = board[r][c];
                    ctx.fillRect(c*SQ, r*SQ, SQ-1, SQ-1);
                }
            }
        }
        p.draw();
        requestAnimationFrame(drop);
    }

    drop();
};