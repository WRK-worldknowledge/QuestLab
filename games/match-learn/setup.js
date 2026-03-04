const moduleFiles = {

"Africa":[
"africa_northern_africa_sahara_countries.json",
"africa_northern_africa_sahel_countries.json",
"africa_central_africa.json",
"africa_southern_africa.json"
],

"Asia":[
"asia_middle_east_and_eurasia.json",
"asia_central_asia.json",
"asia_far_east.json"
],

"America & Oceania":[
"amoc_countries_and_capitals_north_america_and_caribbean.json",
"amoc_cities_north_america.json",
"amoc_countries_and_cities_south_america.json",
"amoc_oceania.json"
],

"Western Europe":[
"eurw_countries_and_capital_cities.json",
"eurw_uk_ireland_and_france.json",
"eurw_scandinavia_germany_and_benelux.json",
"eurw_switzerland_and_italy.json",
"eurw_spain_and_portugal.json"
],

"Eastern Europe":[
"euro_finland_baltics_russia_belarus_poland_czech_republic_slovakia_and_ukraine.json",
"euro_austria_hungary_romania_moldova_and_the_balkan.json",
"euro_greece.json",
"euro_turkey_and_cyprus.json"
]

}

const moduleSelect = document.getElementById("moduleSelect")
const lessonSelect = document.getElementById("lessonSelect")

Object.keys(moduleFiles).forEach(m=>{
const opt=document.createElement("option")
opt.value=m
opt.textContent=m
moduleSelect.appendChild(opt)
})

moduleSelect.addEventListener("change",populateLessons)

function populateLessons(){

lessonSelect.innerHTML=""

const module=moduleSelect.value

const files=moduleFiles[module]

files.forEach((file,i)=>{

const opt=document.createElement("option")
opt.value=file
opt.textContent="Lesson "+(i+1)

lessonSelect.appendChild(opt)

})

}

populateLessons()

document.getElementById("startBtn").onclick=function(){

const file=lessonSelect.value

location.href="game.html?data="+file

}
