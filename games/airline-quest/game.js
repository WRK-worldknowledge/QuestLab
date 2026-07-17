startHelp("airlinequest")
let lastTap = 0
    let firstPick=null
let secondPick=null

let matchesLeft=0   // ⭐ NIEUW

let time=600

let timerInterval

const params = new URLSearchParams(location.search)
const gameType =
    params.get("type") ||
    "iata-airline"

const file = params.get("data")

console.log("DATA FILE:", file)


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
time = 60

let tiles=[]

const selectedPairs =
    shuffle([...data])
    .slice(0,7)

selectedPairs.forEach(pair=>{
if(gameType==="iata-airline"){

    tiles.push({
        type:"airline",
        value:pair.airline,
        match:pair.iata
    })

    tiles.push({
        type:"iata",
        value:pair.iata,
        match:pair.iata
    })

}
    }) 

matchesLeft = selectedPairs.length


tiles = shuffle(tiles)

const grid=document.getElementById("grid")
grid.innerHTML=""

tiles.forEach((tile,index)=>{

const div=document.createElement("div")
div.className="tile"
    if(index === 1){

    const timer =
        document.createElement("div");

    timer.className =
        "qTimerContainer";

    timer.innerHTML = `
        <img
            src="../../q.png"
            class="qTimer">

        <div id="qTime">
            01:00
        </div>
    `;

    grid.appendChild(timer);
}
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
