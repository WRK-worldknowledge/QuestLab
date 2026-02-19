// ===== RANKS / BADGES =====
const ranks = [
  { name:"Service Agent",          xp:0,     badge:"badges/service_agent.png" },
  { name:"Junior Flight Attendant",xp:200,   badge:"badges/junior_fa.png" },
  { name:"Flight Attendant",       xp:600,   badge:"badges/fa.png" },
  { name:"Senior Flight Attendant",xp:1200,  badge:"badges/senior_fa.png" },
  { name:"Assistant Purser",       xp:2000,  badge:"badges/assistant_purser.png" },
  { name:"Purser",                 xp:3200,  badge:"badges/purser.png" },
  { name:"Senior Purser",          xp:5000,  badge:"badges/senior_purser.png" }
];
function getPlayer(){
    let player = JSON.parse(localStorage.getItem("questlab_player"));

    if(!player){
        player = {
            name:"Cadet",
            xp:0,
            modules:{},   // per module scores
            rank:"Service Agent"
        };
        localStorage.setItem("questlab_player", JSON.stringify(player));
    }
    return player;
}
function updateRank(player){
    let newRank = ranks[0];

    ranks.forEach(r=>{
        if(player.xp >= r.xp){
            newRank = r;
        }
    });

    player.rank = newRank.name;
    player.badge = newRank.badge;

    localStorage.setItem("questlab_player", JSON.stringify(player));
}

function addXP(amount){
    const player = getPlayer();
    player.xp += amount;

    updateRank(player);
    localStorage.setItem("questlab_player", JSON.stringify(player));
}

function registerModuleScore(module, percentage){

    if(percentage < 70) return;

    const player = getPlayer();

    if(!player.modules[module])
        player.modules[module] = 0;

    player.modules[module]++;

    // bonus XP voor mastery
    if(player.modules[module] === 10){
        addXP(500); // grote promotie XP
        alert("🎓 Module mastery achieved: " + module);
    }

    localStorage.setItem("questlab_player", JSON.stringify(player));
}

// ===== PLAYER CARD =====
function renderPlayerCard(){

    const player = getPlayer();
    const el = document.getElementById("playerCard");
    if(!el) return;

    el.innerHTML = `
        <div class="playerName">${player.name}</div>
        <div class="playerRank">${player.rank}</div>
        <div class="playerXP">XP: ${player.xp}</div>
        ${player.badge ? `<img src="${player.badge}" style="width:42px;margin-top:6px">` : ""}
    `;
}

// eerste keer speler naam vragen
function ensurePlayer(){
    let player = getPlayer();

    if(player.name === "Cadet"){
        const name = prompt("Enter your callsign:");
        if(name && name.trim() !== ""){
            player.name = name;
            localStorage.setItem("questlab_player", JSON.stringify(player));
        }
    }
}

// automatisch tonen
window.addEventListener("load", () => {
    ensurePlayer();
    renderPlayerCard();
});
