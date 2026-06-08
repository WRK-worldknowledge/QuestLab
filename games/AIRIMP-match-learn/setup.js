document.addEventListener("DOMContentLoaded", function(){
  const lessonNames = {

"AIRIMP":[
"Special Services",
"Meals",
"Passenger & Ticketing",
"Operations",
"Baggage",
"Master Challenge"
]

}

const moduleFiles = {

const moduleFiles = {

"AIRIMP":[
"airimp_services.json",
"airimp_meals.json",
"airimp_passenger.json",
"airimp_operations.json",
"airimp_baggage.json",
"airimp_master.json"
]

}
const modeSelect = document.getElementById("modeSelect")
const moduleSelect = document.getElementById("moduleSelect")
const lessonSelect = document.getElementById("lessonSelect")
const startBtn = document.getElementById("startBtn")

// MODULES VULLEN
Object.keys(moduleFiles).forEach(moduleName => {

const option = document.createElement("option")
option.value = moduleName
option.textContent = moduleName

moduleSelect.appendChild(option)

})

// LESSONS VULLEN
function populateLessons(){

lessonSelect.innerHTML = ""

const module = moduleSelect.value
const files = moduleFiles[module]

if(!files){
console.error("Module not found:", module)
return
}

files.forEach((file,index)=>{

const option = document.createElement("option")

option.value = file

const name = lessonNames[module][index]

option.textContent = "Lesson " + (index + 1) + " – " + name

lessonSelect.appendChild(option)

})
  
}

moduleSelect.addEventListener("change", populateLessons)
populateLessons()

// eerste keer laden
populateLessons()

// START BUTTON
startBtn.addEventListener("click", function(){

const mode = modeSelect.value
const module = moduleSelect.value
const lesson = lessonSelect.value
  const gameType = document.getElementById("gameType").value

console.log("MODE:", mode)
console.log("MODULE:", module)
console.log("LESSON FILE:", lesson)

// TRAINING (1 LESSON)
if(mode === "training"){

window.location.href =
"game.html?data=" + lesson + "&type=" + gameType

}

// MODULE EXAM
if(mode === "module"){

window.location.href = "game.html?module=" + encodeURIComponent(module)

}

// FINAL EXAM
if(mode === "final"){

window.location.href = "game.html?final=true"

}

})

})
