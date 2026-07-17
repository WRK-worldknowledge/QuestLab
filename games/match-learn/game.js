startHelp("matchlearn")
let lastTap = 0
    let firstPick=null
let secondPick=null

let matchesLeft=0   // ⭐ NIEUW

let time=600

let timerInterval

const params = new URLSearchParams(location.search)
const gameType = params.get("type") || "code-city"

const file = params.get("data")
const module = params.get("module")
const final = params.get("final")
console.log("DATA FILE:", file)
console.log("MODULE:", module)
console.log("FINAL:", final)
const moduleNames = {
    "EURW": "1. Western Europe",
    "EURO": "2. Eastern Europe",
    "AMOC": "3. America & Oceania",
    "AFR": "4. Africa",
    "ASIA": "5. Asia"
};

const lessonOrder = {

    "EURW": [
        "Countries and capital cities",
        "UK, Ireland & France",
        "Scandinavia, Germany & BeNeLux",
        "Switzerland & Italy",
        "Spain & Portugal"
    ],

    "EURO": [
        "Finland, Baltics, Russia, Belarus, Poland, Czech Republic, Slovakia & Ukraine",
        "Austria, Hungary, Romania, Moldova & the Balkan",
        "Greece",
        "Turkey & Cyprus"
    ],

    "AMOC": [
        "Countries and capitals North America & Caribbean",
        "Cities North America",
        "Countries and cities South America",
        "Oceania"
    ],

    "AFR": [
        "Northern Africa - Sahara countries",
        "Northern Africa - Sahel countries",
        "Central Africa",
        "Southern Africa"
    ],

    "ASIA": [
        "Middle East & EurAsia",
        "Central Asia",
        "Far East"
    ]
};

// TRAINING (1 lesson)
if(file){

fetch("data/" + file)
.then(res=>{
if(!res.ok){
throw new Error("Dataset not found: " + file)
}
return res.json()
})
.then(data=>{
console.log("DATA LOADED:", data)
startGame(data)
})
.catch(err=>{
console.error(err)
alert("Dataset failed to load")
})

}

// MODULE EXAM
if(module){

fetch("data/dataset.json")
.then(res=>res.json())
.then(data=>{

const datasets = data.dataset

const moduleFiles=datasets.filter(d=>d.module===module)

Promise.all(
moduleFiles.map(d=>fetch("data/"+d.file).then(r=>r.json()))
)
.then(allData=>{

let combined={pairs:[]}

allData.forEach(d=>{
combined.pairs.push(...d.pairs)
})

startGame(combined)

})

})

}

// FINAL EXAM
if(final){

fetch("data/dataset.json")
.then(res=>res.json())
.then(data=>{

const datasets = data.dataset

Promise.all(
datasets.map(d=>fetch("data/"+d.file).then(r=>r.json()))
)
.then(allData=>{

let combined={pairs:[]}

allData.forEach(d=>{
combined.pairs.push(...d.pairs)
})

startGame(combined)

})

})

}
function shuffle(array){

for(let i = array.length - 1; i > 0; i--){

let j = Math.floor(Math.random() * (i + 1))

let temp = array[i]
array[i] = array[j]
array[j] = temp

}

return array

}
function startGame(data){
  clearInterval(timerInterval)
time = 120

let tiles=[]

const selectedPairs = shuffle([...data.pairs]).slice(0,7)

selectedPairs.forEach(pair=>{
if(gameType==="code-city"){

tiles.push({type:"city",value:pair.city,match:pair.code})
tiles.push({type:"code",value:pair.code,match:pair.code})

}

if(gameType==="code-image"){

tiles.push({type:"image",value:pair.image,match:pair.code})
tiles.push({type:"code",value:pair.code,match:pair.code})

}

if(gameType==="city-image"){

tiles.push({type:"city",value:pair.city,match:pair.code})
tiles.push({type:"image",value:pair.image,match:pair.code})

}
    }) 

matchesLeft = selectedPairs.length


tiles = shuffle(tiles)

const grid=document.getElementById("grid")
grid.innerHTML=""

tiles.forEach((tile,index)=>{

const div=document.createElement("div")
div.className="tile"
if(tile.type==="image"){

const img=document.createElement("img")
img.src="images/"+tile.value

img.onerror=function(){
console.log("Missing image:", tile.value)
this.src="images/fallback.jpg"
}

img.style.maxWidth="90%"
img.style.maxHeight="90%"
img.style.objectFit="contain"

    // klik op afbeelding = vergroten
let pressTimer

img.addEventListener("touchstart", function(e){

pressTimer = setTimeout(()=>{
openImage(img.src)
},500)

})

img.addEventListener("touchend", function(e){
clearTimeout(pressTimer)
})

img.addEventListener("touchmove", function(e){
clearTimeout(pressTimer)
})

img.addEventListener("mousedown", function(e){

pressTimer = setTimeout(()=>{
openImage(img.src)
},500)

})

img.addEventListener("mouseup", function(e){
clearTimeout(pressTimer)
})

img.addEventListener("mouseleave", function(e){
clearTimeout(pressTimer)
})

div.appendChild(img)

}else{

div.innerText=tile.value

}

// tile zelf blijft klikbaar
div.onclick=()=>selectTile(div,tile)

grid.appendChild(div)

})
 timerInterval = setInterval(() => {

    time--;

    if(time <= 0){

        clearInterval(timerInterval);

        document.getElementById("qTime").innerText =
            "00:00";

        timeUp();

        return;
    }

    let min = Math.floor(time / 60);
    let sec = time % 60;

    document.getElementById("qTime").innerText =
        min + ":" +
        sec.toString().padStart(2,"0");

},1000);
}
function selectTile(div,tile){

if(firstPick && firstPick.div === div) return

if(firstPick==null){

firstPick={div,tile}
div.classList.add("selected")

return
}

secondPick={div,tile}

checkMatch()

}

function checkMatch(){

if(firstPick.tile.match===secondPick.tile.match
&& firstPick.tile.type!==secondPick.tile.type){

firstPick.div.classList.add("flip","correct")
secondPick.div.classList.add("flip","correct")

setTimeout(()=>{

firstPick.div.style.visibility="hidden"
secondPick.div.style.visibility="hidden"

matchesLeft--   // ⭐ nieuwe match

if(matchesLeft===0){
finishGame()
  clearInterval(timerInterval)
}

reset()
},500)

}else{

firstPick.div.classList.add("wrong")
secondPick.div.classList.add("wrong")

setTimeout(()=>{
firstPick.div.classList.remove("wrong")
secondPick.div.classList.remove("wrong")
reset()
},600)

}
}

function reset(){

if(firstPick) firstPick.div.classList.remove("selected")
if(secondPick) secondPick.div.classList.remove("selected")

firstPick=null
secondPick=null

}
function finishGame(){

clearInterval(timerInterval)

// XP berekenen
const timeBonus = Math.max(0, Math.floor(time/20))
const xp = 20 + timeBonus

// QuestLab XP systeem
addXP(xp)

const grid = document.getElementById("grid")
const finish = document.getElementById("finishScreen")

grid.innerHTML = ""

finish.style.display = "block"

document.getElementById("finishScreen").querySelector("h2").innerText =
"Mission Complete ✈️ +" + xp + " XP"

}
const overlay = document.getElementById("imageOverlay")
const overlayImg = document.getElementById("overlayImage")

function openImage(src){

if(!overlay || !overlayImg) return

// reset tile zooms
document.querySelectorAll(".zoomed").forEach(el=>{
el.classList.remove("zoomed")
})

overlayImg.src = src
overlay.style.display = "flex"

}

// klik op overlay sluit fullscreen
if(overlay){

overlay.onclick = () => {

overlay.style.display = "none"

// reset zoom
document.querySelectorAll(".zoomed").forEach(el=>{
el.classList.remove("zoomed")
})

}

}
    function timeUp(){

const choice = confirm(
"Time's up!\n\nOK = Restart mission\nCancel = Back to Game Console"
)

if(choice){

location.reload()

}else{

window.location.href="index.html"

}

}
window.addEventListener("DOMContentLoaded", () => {

const newBtn = document.getElementById("newSessionBtn")
const backBtn = document.getElementById("backBtn")

if(newBtn){
newBtn.onclick = () => location.reload()
}

if(backBtn){
backBtn.onclick = () => window.history.back()
}

})
