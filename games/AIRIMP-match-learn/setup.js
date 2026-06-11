document.addEventListener("DOMContentLoaded", function(){
const airimpSubjects = [
{
name:"SSR – Special Service Request",
file:"airimp_services.json"
},
{
name:"SPML – Special Meals",
file:"airimp_meals.json"
},
{
name:"PAX & DOCS – Passengers & Travel Docs",
file:"airimp_passengers.json"
},
{
name:"TKT – Ticket Status",
file:"airimp_ticketstatus.json"
},
{
name:"OPS – Flight Operations",
file:"airimp_operations.json"
},
{
name:"BAG – Baggage",
file:"airimp_baggage.json"
},
{
name:"CAB – Cabin & Safety",
file:"airimp_cabin_safety.json"
},
{
name:"MASTER – Challenge",
file:"airimp_master.json"
}
]

const pictoSubjects = [
{
name:"PICTO – Airport Symbols",
file:"airport_symbols.json"
},
{
name:"PICTO+ – Airport Symbols Advanced",
file:"airport_symbols_advanced.json"
}
]

const modeSelect = document.getElementById("modeSelect")
const lessonSelect = document.getElementById("lessonSelect")
const startBtn = document.getElementById("startBtn")
  const gameTypeSelect = document.getElementById("gameType")
const subjectContainer = document.getElementById("subjectContainer")

// LESSONS VULLEN
function populateSubjects(){

lessonSelect.innerHTML = ""

const gameType = gameTypeSelect.value

if(!gameType){

subjectContainer.style.display = "none"
return

}

subjectContainer.style.display = "block"

const subjects =
gameType === "code-description"
? airimpSubjects
: pictoSubjects

  const subjects =
gameType === "picto-description"
? pictoSubjects
: airimpSubjects

subjects.forEach(subject => {

const option = document.createElement("option")

option.value = subject.file
option.textContent = subject.name

lessonSelect.appendChild(option)

})

}
  gameTypeSelect.addEventListener(
"change",
populateSubjects
)

// eerste keer laden
populateSubjects()

// START BUTTON
startBtn.addEventListener("click", function(){

const mode = modeSelect.value
const lesson = lessonSelect.value
  const gameType = document.getElementById("gameType").value
  
  if(!gameType){

alert("Please select a game type")
return

}

if(!lesson){

alert("Please select a subject")
return

}
// update
  
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
