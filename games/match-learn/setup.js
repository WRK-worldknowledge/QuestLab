document.addEventListener("DOMContentLoaded", function(){

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

// modules vullen
Object.keys(moduleFiles).forEach(m => {

const opt = document.createElement("option")
opt.value = m
opt.textContent = m

moduleSelect.appendChild(opt)

})

// lessons vullen
function populateLessons(){

lessonSelect.innerHTML = ""

const module = moduleSelect.value
const files = moduleFiles[module]

files.forEach((file,i)=>{

const opt = document.createElement("option")
opt.value = file
opt.textContent = "Lesson " + (i+1)

lessonSelect.appendChild(opt)

})

}

moduleSelect.addEventListener("change", populateLessons)

populateLessons()

// start knop
startBtn.addEventListener("click", function(){

const mode = modeSelect.value
const module = moduleSelect.value
const lesson = lessonSelect.value

console.log("Start clicked")

if(mode==="training"){
window.location.href = "game.html?data=" + lesson
}

if(mode==="module"){
window.location.href = "game.html?module=" + module
}

if(mode==="final"){
window.location.href = "game.html?final=true"
}

})

})
