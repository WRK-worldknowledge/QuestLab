
let firstPick=null
let secondPick=null

let matchesLeft=0   // ⭐ NIEUW

let time=480

let timerInterval

timerInterval=setInterval(()=>{
time--
let min=Math.floor(time/60)
let sec=time%60
document.getElementById("timer").innerText=min+":"+( "0"+sec).slice(-2)
},1000)

fetch("data/iata_data.json")
.then(res=>res.json())
.then(data=>startGame(data))

function startGame(data){

let tiles=[]

data.pairs.forEach(pair=>{
tiles.push({type:"city",value:pair.city,match:pair.code})
tiles.push({type:"code",value:pair.code,match:pair.code})
})
  
matchesLeft = data.pairs.length

tiles=tiles.sort(()=>Math.random()-0.5)

const grid=document.getElementById("grid")

tiles.forEach(tile=>{

const div=document.createElement("div")
div.className="tile"
div.innerText=tile.value

div.onclick=()=>selectTile(div,tile)

grid.appendChild(div)

})
}

function selectTile(div,tile){

if(firstPick && firstPick.div === div) return

if(firstPick==null){
firstPick={div,tile}
div.style.border="3px solid white"
return
}

secondPick={div,tile}
checkMatch()

}
function checkMatch(){

if(firstPick.tile.match===secondPick.tile.match
&& firstPick.tile.type!==secondPick.tile.type){

firstPick.div.classList.add("correct")
secondPick.div.classList.add("correct")

setTimeout(()=>{
firstPick.div.remove()
secondPick.div.remove()

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

if(firstPick) firstPick.div.style.border=""
if(secondPick) secondPick.div.style.border=""

firstPick=null
secondPick=null

}
function finishGame(){

alert("Mission complete!")

// XP berekenen
const timeBonus = Math.max(0, Math.floor(time/20))
const xp = 20 + timeBonus

// QuestLab XP systeem
addXP(xp)

alert("+" + xp + " XP earned")

}

