document.addEventListener("DOMContentLoaded", function(){
  const subjectNames = {

"SSR":"SSR – Special Service Request",
"SPML":"SPML – Special Meals",
"PAXDOC":"PAX & DOCS – Passengers & Travel Docs",
"TKT":"TKT – Ticket Status",
"OPS":"OPS – Flight Operations",
"BAG":"BAG – Baggage",
"CAB":"CAB – Cabin & Safety",
"PICTO":"PICTO – Airport Symbols",
"PICTOPLUS":"PICTO+ – Advanced Airport Symbols",
"MASTER":"MASTER – Challenge"

}
  const lessonNames = {

"AIRIMP":[
"SSR",
"SPML",
"PAXDOC",
"TKT",
"OPS",
"BAG",
"CAB",
"PICTO",
"PICTOPLUS",
"MASTER"
]

}

const moduleFiles = {

"AIRIMP":[
"airimp_services.json",
"airimp_meals.json",
"airimp_passengers.json",
"airimp_ticketstatus.json",
"airimp_operations.json",
"airimp_baggage.json",
"airimp_cabin_safety.json",
"airport_symbols.json",
"airport_symbols_advanced.json",
"airimp_master.json"
]

}
const modeSelect = document.getElementById("modeSelect")
const lessonSelect = document.getElementById("lessonSelect")
const startBtn = document.getElementById("startBtn")

// LESSONS VULLEN
function populateLessons(){

lessonSelect.innerHTML = ""

const files = moduleFiles["AIRIMP"]

if(!files){
console.error("AIRIMP files not found")
return
}

files.forEach((file,index)=>{

const option = document.createElement("option")

option.value = file

const key = lessonNames["AIRIMP"][index]

option.textContent =
(index + 1) + ". " + subjectNames[key]

lessonSelect.appendChild(option)

})
  
}

populateLessons()

// eerste keer laden
populateLessons()

// START BUTTON
startBtn.addEventListener("click", function(){

const mode = modeSelect.value
const lesson = lessonSelect.value
  const gameType = document.getElementById("gameType").value

console.log("MODE:", mode)
console.log("LESSON FILE:", lesson)

// TRAINING (1 LESSON)
if(mode === "training"){

window.location.href =
"game.html?data=" + lesson + "&type=" + gameType

}

// MODULE EXAM
if(mode === "module"){

window.location.href =
"game.html?final=true"

}

// FINAL EXAM
if(mode === "final"){

window.location.href = "game.html?final=true"

}

})

})
