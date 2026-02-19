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

    function updateRank(player){

    const oldRank = player.rank;

    let newRank = ranks[0];

    ranks.forEach(r=>{
        if(player.xp >= r.xp){
            newRank = r;
        }
    });

    player.rank = newRank.name;
    player.badge = newRank.badge;

    localStorage.setItem("questlab_player", JSON.stringify(player));

    // ===== PROMOTION DETECT =====
    if(oldRank !== newRank.name){
        showPromotion(newRank);
    }
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
        <img src="${player.badge}" style="width:48px;margin:6px 0">
        <div class="playerRank">${player.rank}</div>
        <div class="playerXP">XP: ${player.xp}</div>
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
  function showPromotion(rank){

    // overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.75)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    overlay.style.animation = "fadeIn 0.3s ease";

    // card
    const card = document.createElement("div");
    card.style.background = "#0B1222";
    card.style.border = "3px solid #F5CA51";
    card.style.borderRadius = "18px";
    card.style.padding = "28px";
    card.style.textAlign = "center";
    card.style.color = "white";
    card.style.boxShadow = "0 20px 60px rgba(0,0,0,0.6)";
    card.style.maxWidth = "340px";

    card.innerHTML = `
        <div style="font-size:14px;opacity:.7">PROMOTION</div>
        <div style="font-size:28px;font-weight:800;margin:8px 0">✦ ${rank.name} ✦</div>
        <img src="${location.pathname.includes('WRK_Quiz_v1') ? '../' : ''}${rank.badge}"> style="width:120px;margin:12px 0">
        <div style="opacity:.8;margin-top:10px">You have been promoted</div>
        <button style="
            margin-top:18px;
            padding:12px 18px;
            background:#F5CA51;
            color:#0F172A;
            border:none;
            border-radius:12px;
            font-weight:700;
            cursor:pointer;
        ">Continue</button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    card.querySelector("button").onclick = () => overlay.remove();
}
