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
]

}

const moduleSelect = document.getElementById("moduleSelect")
const lessonSelect = document.getElementById("lessonSelect")

// modules vullen
Object.keys(moduleFiles).forEach(m=>{
const opt=document.createElement("option")
opt.value=m
opt.textContent=m
moduleSelect.appendChild(opt)
})

// lessons vullen
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

moduleSelect.addEventListener("change",populateLessons)

populateLessons()

// ⭐ start knop
document.getElementById("startBtn").onclick=function(){

const mode=document.getElementById("modeSelect").value
const module=moduleSelect.value
const lesson=lessonSelect.value

if(mode==="training"){

window.location.href="index.html?data="+lesson

}

if(mode==="module"){

window.location.href="index.html?module="+module

}

if(mode==="final"){

window.location.href="index.html?final=true"

}

}
