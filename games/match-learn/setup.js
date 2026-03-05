document.addEventListener("DOMContentLoaded", function(){
  const lessonNames = {

"Africa":[
"Northern Africa - Sahara countries",
"Northern Africa - Sahel countries",
"Central Africa",
"Southern Africa"
],

"Asia":[
"Middle East & EurAsia",
"Central Asia",
"Far East"
],

"America & Oceania":[
"Countries and capitals North America & Caribbean",
"Cities North America",
"Countries and cities South America",
"Oceania"
],

"Eastern Europe":[
"Austria, Hungary, Romania, Moldova & the Balkan",
"Finland, Baltics, Russia, Belarus, Poland, Czech Republic, Slovakia & Ukraine",
"Greece",
"Turkey & Cyprus"
],

"Western Europe":[
"Countries and capital cities",
"Scandinavia, Germany & BeNeLux",
"Spain & Portugal",
"Switzerland & Italy",
"UK, Ireland & France"
]

}

const moduleFiles = {

Africa:[
"africa_northern_africa_-_sahara_countries.json",
"africa_northern_africa_-_sahel_countries.json",
"africa_central_africa.json",
"africa_southern_africa.json"
],

Asia:[
"asia_middle_east_eurasia.json",
"asia_central_asia.json",
"asia_far_east.json"
],

"America & Oceania":[
"amoc_countries_and_capitals_north_america_caribbean.json",
"amoc_cities_north_america.json",
"amoc_countries_and_cities_south_america.json",
"amoc_oceania.json"
],

"Eastern Europe":[
"euro_austria_hungary_romania_moldova_the_balkan.json",
"euro_finland_baltics_russia_belarus_poland_czech_republic_slovakia_ukraine.json",
"euro_greece.json",
"euro_turkey_cyprus.json"
],

"Western Europe":[
"eurw_countries_and_capital_cities.json",
"eurw_scandinavia_germany_benelux.json",
"eurw_spain_portugal.json",
"eurw_switzerland_italy.json",
"eurw_uk_ireland_france.json"
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
