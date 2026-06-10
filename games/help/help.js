const helpData = {

wrkquiz:[
{
title:"WRK Quiz",
text:"Test your knowledge of worldwide destinations using multiple choice questions."
},
{
title:"Game modes",
text:"Play per lesson, per module or challenge yourself with the full exam."
}
],

wrkcharades:[
{
title:"WRK Charades",
text:"Test your knowledge of worldwide destinations and IATA codes."
},
{
title:"How to play",
text:"Hold your phone against your forehead. Your classmates give clues so you can guess the destination or IATA code. Tilt LEFT if correct. Tilt RIGHT to skip."
}
],

airimp:[
{
title:"AIRIMP Codes",
text:"AIRIMP codes are aviation abbreviations used worldwide in reservations and ticketing systems. Test your knowledge of these abbreviations and their meaning."
},
{
title:"How to play",
text:"Hold the phone to your forehead. Your classmates give clues so you can guess the AIRIMP code or meaning. Tilt LEFT if correct, RIGHT to skip."
}
],

matchlearn:[
{
title:"Match & Learn",
text:"Match destinations with their three-letter IATA airport code or location on the map."
},
{
title:"Goal",
text:"Long press maps to enlarge and clear all tiles before the timer runs out."
}
],

  airimpmatchlearn:[
{
title:"AIRIMP Match & Learn",
text:"Match AIRIMP codes with their correct meaning and learn the abbreviations used in airline operations."
},
{
title:"Goal",
text:"Match all pairs before the timer runs out. Complete the Master Challenge to test your overall AIRIMP knowledge."
}
]

}

let helpSlides=[]
let helpIndex=0
let helpGame=""

let touchStartX=0
let touchEndX=0

function startHelp(game){

if(localStorage.getItem(game+"_help")==="hide") return

helpGame=game
helpSlides=helpData[game]

if(!helpSlides) return

helpIndex=0

createModal()
updateSlide()

}

function createModal(){

const modal=document.createElement("div")
modal.className="modalHelp"
modal.id="helpModal"

modal.innerHTML=`

<div class="helpCard" id="helpCard">

<div class="helpTitle" id="helpTitle"></div>
<div class="helpText" id="helpText"></div>

<div class="helpDots" id="helpDots"></div>

<div class="helpNav">
<button class="helpBtn" onclick="prevHelp()">PREV</button>
<button class="helpBtn" id="nextBtn" onclick="nextHelp()">NEXT</button>
</div>

<label style="margin-top:20px;display:block;">
<input type="checkbox" id="hideHelp"> Don't show again
</label>

</div>

`

document.body.appendChild(modal)

createDots()
addSwipe()

}

function createDots(){

const dots=document.getElementById("helpDots")
dots.innerHTML=""

helpSlides.forEach((s,i)=>{

const dot=document.createElement("div")
dot.className="helpDot"
dot.id="dot"+i

dots.appendChild(dot)

})

}

function updateSlide(){

const slide=helpSlides[helpIndex]

document.getElementById("helpTitle").innerText=slide.title
document.getElementById("helpText").innerText=slide.text

document.querySelectorAll(".helpDot").forEach(d=>d.classList.remove("active"))
document.getElementById("dot"+helpIndex).classList.add("active")

const nextBtn=document.getElementById("nextBtn")

if(helpIndex===helpSlides.length-1){
nextBtn.innerText="DONE"
}else{
nextBtn.innerText="NEXT"
}

}

function nextHelp(){

helpIndex++

if(helpIndex>=helpSlides.length){

if(document.getElementById("hideHelp").checked){
localStorage.setItem(helpGame+"_help","hide")
}

document.getElementById("helpModal").remove()
return

}

updateSlide()

}

function prevHelp(){

if(helpIndex===0) return

helpIndex--

updateSlide()

}

function addSwipe(){

const card=document.getElementById("helpCard")

card.addEventListener("touchstart",e=>{
touchStartX=e.changedTouches[0].screenX
})

card.addEventListener("touchend",e=>{

touchEndX=e.changedTouches[0].screenX
handleSwipe()

})

}

function handleSwipe(){

if(touchEndX < touchStartX - 50){
nextHelp()
}

if(touchEndX > touchStartX + 50){
prevHelp()
}

}
