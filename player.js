/* ================= PLAYER PROFILE ENGINE ================= */

const PLAYER_KEY = "wrk_player_profile";

/* ophalen of maken */
function getPlayer(){
    let player = localStorage.getItem(PLAYER_KEY);

    if(!player){
        createPlayer();
        return getPlayer();
    }

    return JSON.parse(player);
}

/* eerste keer: naam vragen */
function createPlayer(){
    let name = prompt("Enter your name (callsign):");

    if(!name || name.trim()===""){
        name = "Student";
    }

    const player = {
        name: name,
        xp: 0,
        rank: "Service Agent",
        badges: []
    };

    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

/* opslaan */
function savePlayer(player){
    localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

/* tonen op scherm */
function renderPlayerCard(){

    const player = getPlayer();

    const el = document.getElementById("playerCard");
    if(!el) return;

    el.innerHTML = `
        <div class="playerName">${player.name}</div>
        <div class="playerRank">${player.rank}</div>
        <div class="playerXP">XP: ${player.xp}</div>
    `;
}

/* reset (voor docenten handig) */
function resetPlayer(){
    localStorage.removeItem(PLAYER_KEY);
    location.reload();
}

/* automatisch tonen */
window.addEventListener("load", () => {
    getPlayer();        // zorgt dat speler wordt aangemaakt
    renderPlayerCard(); // daarna tonen
});
