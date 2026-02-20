// ===== CLOUD SAVE CONFIG =====
const GITHUB_USER = "WRK-worldknowledge";
const GITHUB_REPO = "QuestLab";
const GITHUB_FILE = "players.json";

// ===== LOAD FROM CLOUD =====
async function loadPlayerFromCloud(name){

    try{
        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

        const res = await fetch(url);
        if(!res.ok) return;

        const data = await res.json();
        if(!data.content) return;

        const content = JSON.parse(atob(data.content));

        if(content[name]){
            localStorage.setItem("questlab_player", JSON.stringify(content[name]));
            console.log("☁️ Cloud profile loaded");
        }

    }catch(e){
        console.log("No cloud save found");
    }
}

// ===== SAVE TO CLOUD =====
async function savePlayerToCloud(){

    const player = getPlayer();

    await fetch("https://api.github.com/repos/WRK-worldknowledge/QuestLab/dispatches",{
        method:"POST",
        headers:{
            "Accept":"application/vnd.github+json",
            "Authorization":"Bearer " + QUESTLAB_TOKEN_RUNTIME
        },
        body:JSON.stringify({
            event_type:"save_player",
            client_payload:{
                name:player.name,
                player:player
            }
        })
    });

    console.log("Cloud save requested");
}

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
    modules:{},
    masteredModules:0,
    rank:"Service Agent",
    badge:"badges/service_agent.png"
};
     
        localStorage.setItem("questlab_player", JSON.stringify(player));
    }
    return player;
}
function updateRank(player){

    const m = player.masteredModules;

    if(m >= 5) setRank(player,"Senior Purser","badges/senior_purser.png");
    else if(m === 4) setRank(player,"Purser","badges/purser.png");
    else if(m === 3) setRank(player,"Assistant Purser","badges/assistant_purser.png");
    else if(m === 2) setRank(player,"Senior Flight Attendant","badges/senior_fa.png");
    else if(m === 1) setRank(player,"Flight Attendant","badges/fa.png");
    else setRank(player,"Service Agent","badges/service_agent.png");

    localStorage.setItem("questlab_player", JSON.stringify(player));
}

function setRank(player,name,badge){

    if(player.rank === name) return;

    player.rank = name;
    player.badge = badge;

    showPromotion({
        name:name,
        badge:badge
    });
}

function addXP(amount){
    const player = getPlayer();
    player.xp += amount;

    updateRank(player);
    localStorage.setItem("questlab_player", JSON.stringify(player));

    savePlayerToCloud(); // ⭐ elke XP wijziging meteen syncen
}

function registerModuleScore(module, percentage){

    if(percentage < 70) return;

    const player = getPlayer();

    if(!player.modules[module])
        player.modules[module] = 0;

    player.modules[module]++;

    // mastery bereikt
    if(player.modules[module] === 10){

        player.masteredModules++;

        alert("🎓 Module mastery achieved: " + module);

        updateRank(player);
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
// ===== FIRST TIME PLAYER NAME =====
function ensurePlayer(){

    let player = getPlayer();

    // eerste keer → naam vragen
    if(player.name === "Cadet"){
        const name = prompt("Enter your callsign:");

        if(name && name.trim() !== ""){
            player.name = name.trim();
            localStorage.setItem("questlab_player", JSON.stringify(player));
        }
    }
}

// eerste keer speler naam vragen
window.addEventListener("load", async () => {

    // 1️⃣ eerst zorgen dat speler naam heeft
    ensurePlayer();

    // 2️⃣ daarna opnieuw ophalen (nu mét juiste naam)
    let player = getPlayer();

    // 3️⃣ cloud profiel laden
    await loadPlayerFromCloud(player.name);

    // 4️⃣ opnieuw ophalen want cloud kan hem overschreven hebben
    player = getPlayer();

    // 5️⃣ kaart tekenen
    renderPlayerCard();
});
 function showPromotion(rank){

    const pathFix = location.pathname.includes('WRK_Quiz_v1') ? '../' : '';

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.75)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

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
        <img src="${pathFix + rank.badge}" style="width:120px;margin:12px 0">
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
async function savePlayerToCloud(){

    const player = getPlayer();

    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

    const res = await fetch(url);
    const data = await res.json();

    let content = {};
    try{
        content = JSON.parse(atob(data.content));
    }catch{
        content = {};
    }

    content[player.name] = player;

    await fetch(url,{
        method:"PUT",
        headers:{
            "Authorization":"token " + GITHUB_TOKEN,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            message:"QuestLab autosave",
            content:btoa(JSON.stringify(content,null,2)),
            sha:data.sha
        })
    });

    console.log("Cloud saved");
}
