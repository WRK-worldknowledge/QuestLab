// ===== CLOUD SAVE CONFIG =====
const GITHUB_USER = "WRK-worldknowledge";
const GITHUB_REPO = "QuestLab";
const GITHUB_FILE = "players.json";
let cloudSaveTimer = null
function generateFAID(){

const time = Date.now().toString(36)
const rand = Math.random().toString(36).substring(2,6)

return "FA-" + time + rand

}
function upgradeOldPlayer(player){

// oude spelers hebben nog geen FA-ID
if(!player.id){

player.id = generateFAID()
player.firstName = player.firstName || ""
player.lastName = player.lastName || ""
player.lastSave = Date.now()

console.log("Player upgraded to FA-ID system")

localStorage.setItem("questlab_player", JSON.stringify(player))

alert(
"Your profile has been upgraded.\n\n" +
"Your new Flight Attendant ID:\n" +
player.id +
"\n\nSave this ID to restore your progress."
)

}

}

// ===== LOAD FROM CLOUD =====
async function loadPlayerFromCloud(id){

    try{

        const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

        const res = await fetch(url);
        if(!res.ok) return;

        const data = await res.json();
        if(!data.content) return;

        const content = JSON.parse(atob(data.content));

        if(content[id]){

            const local = getPlayer();
            const cloud = content[id];

            // voorkom dat oude save nieuwe overschrijft
            if(!local.lastSave || cloud.lastSave > local.lastSave){

                localStorage.setItem("questlab_player", JSON.stringify(cloud));
                console.log("☁️ Cloud profile loaded");

            }

        }

    }catch(e){

        console.log("No cloud save found");

    }

}
function scheduleCloudSave(){

if(cloudSaveTimer) return

cloudSaveTimer = setTimeout(()=>{

savePlayerToCloud()

cloudSaveTimer = null

},10000)

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
id:player.id,
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
    id:null,
    firstName:"",
    lastName:"",
    name:"Cadet",
    xp:0,
    modules:{},
    masteredModules:0,
    rank:"Service Agent",
    badge:"badges/service_agent.png",
    lastSave:0
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

if(amount > 500){
amount = 500
}

const player = getPlayer()

player.xp += amount
player.lastSave = Date.now()

updateRank(player)

localStorage.setItem("questlab_player", JSON.stringify(player))

scheduleCloudSave()

renderPlayerCard()

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
        <div class="playerRow">

            <div class="badgeCol">
                <img src="${player.badge}" class="badge">
            </div>

            <div class="rankCol">
                <div class="rankText">${player.rank}</div>
<div class="xpText">XP: ${player.xp}</div>
<div class="xpText">FA-ID: ${player.id || ""}</div>
            </div>

            <div class="nameCol">
                ${player.name}
            </div>

        </div>
    `;
}
// ===== FIRST TIME PLAYER NAME =====
function ensurePlayer(){

let player = getPlayer()
    function upgradeOldPlayer(player){

// oude spelers hebben nog geen FA-ID
if(!player.id){

player.id = generateFAID()
player.firstName = player.firstName || ""
player.lastName = player.lastName || ""
player.lastSave = Date.now()

console.log("Player upgraded to FA-ID system")

localStorage.setItem("questlab_player", JSON.stringify(player))

alert(
"Your profile has been upgraded.\n\n" +
"Your new Flight Attendant ID:\n" +
player.id +
"\n\nSave this ID to restore your progress."
)

}

}

if(player.name === "Cadet"){

const first = prompt("First name:")
const last = prompt("Last name:")
const call = prompt("Choose your callsign:")

if(!first || !last || !call){
alert("Please complete all fields")
return
}

player.firstName = first.trim()
player.lastName = last.trim()
player.name = call.trim()

player.id = generateFAID()
player.lastSave = Date.now()

localStorage.setItem("questlab_player", JSON.stringify(player))

alert(
"Welcome " + player.name + "!\n\n" +
"Your Flight Attendant ID:\n" +
player.id +
"\n\nSave this ID to restore your progress."
)

}

}
// eerste keer speler naam vragen
window.addEventListener("load", async () => {

    // 1️⃣ eerst zorgen dat speler naam heeft
    ensurePlayer();

    // 2️⃣ daarna opnieuw ophalen (nu mét juiste naam)
    let player = getPlayer();

    // 3️⃣ cloud profiel laden
    await loadPlayerFromCloud(player.id);

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
window.addEventListener("beforeunload", () => {

savePlayerToCloud()

})


