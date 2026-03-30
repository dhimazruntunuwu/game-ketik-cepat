window.startSuitGame = function() {
    const wrapper = document.getElementById('game-canvas-wrapper');
    const stats = document.getElementById('game-stats');
    
    wrapper.innerHTML = `
        <div style="text-align:center; font-family:sans-serif; padding:20px; background:#fef2f2; border-radius:20px;">
            <h2 style="color:#b91c1c;">✊✌️✋ Suit Jepang</h2>
            
            <div style="display:flex; justify-content:space-around; align-items:center; margin:30px 0; font-size:4rem;">
                <div id="player-hand" style="transition:0.3s;">👤</div>
                <div style="font-size:1.5rem; color:#7f1d1d; font-weight:bold;">VS</div>
                <div id="com-hand" style="transition:0.3s;">🤖</div>
            </div>

            <div id="suit-controls" style="background:white; padding:20px; border-radius:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                <p style="margin-bottom:15px; font-weight:bold; color:#991b1b;">Pilih Senjata Anda:</p>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button onclick="playSuit('✊')" style="padding:15px; font-size:2rem; background:#fee2e2; border:none; border-radius:12px; cursor:pointer; flex:1;">✊</button>
                    <button onclick="playSuit('✌️')" style="padding:15px; font-size:2rem; background:#fee2e2; border:none; border-radius:12px; cursor:pointer; flex:1;">✌️</button>
                    <button onclick="playSuit('✋')" style="padding:15px; font-size:2rem; background:#fee2e2; border:none; border-radius:12px; cursor:pointer; flex:1;">✋</button>
                </div>
            </div>

            <div id="suit-result" style="margin-top:25px; min-height:60px;">
                <p id="suit-status" style="font-size:1.3rem; font-weight:bold; color:#b91c1c;">Siap?</p>
            </div>
        </div>
    `;

    let win = 0, draw = 0, lose = 0;
    const hands = ['✊', '✌️', '✋'];
    let isPlaying = false;

    window.playSuit = function(playerChoice) {
        if (isPlaying) return;
        isPlaying = true;

        const playerHand = document.getElementById('player-hand');
        const comHand = document.getElementById('com-hand');
        const status = document.getElementById('suit-status');

        // Animasi Shake (Mengayunkan tangan)
        playerHand.style.transform = "translateY(-20px)";
        comHand.style.transform = "translateY(-20px)";
        status.innerText = "Jan-Ken-Pon!";

        setTimeout(() => {
            const comChoice = hands[Math.floor(Math.random() * 3)];
            
            playerHand.innerText = playerChoice;
            comHand.innerText = comChoice;
            playerHand.style.transform = "translateY(0)";
            comHand.style.transform = "translateY(0)";

            let result = "";
            if (playerChoice === comChoice) {
                result = "SERI! 🤝";
                draw++;
            } else if (
                (playerChoice === '✊' && comChoice === '✌️') ||
                (playerChoice === '✌️' && comChoice === '✋') ||
                (playerChoice === '✋' && comChoice === '✊')
            ) {
                result = "ANDA MENANG! 🎉";
                win++;
            } else {
                result = "ANDA KALAH! 💀";
                lose++;
            }

            status.innerText = result;
            stats.innerText = `W: ${win} | D: ${draw} | L: ${lose} | ✊✌️✋ Suit`;
            isPlaying = false;
        }, 500);
    };
};