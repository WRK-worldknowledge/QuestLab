const helpData={

wrkquiz:[
{
title:"WRK Quiz",
text:"Test your knowledge of worldwide destinations. Answer multiple choice questions about cities and IATA codes."
},
{
title:"Game modes",
text:"Play per lesson, per module or take the final challenge with all destinations."
}
],

wrkcharades:[
{
title:"WRK Charades",
text:"Hold your phone against your forehead. Your classmates give clues so you can guess the destination."
},
{
title:"Tilt controls",
text:"Tilt LEFT if correct. Tilt RIGHT to skip."
}
],

airimp:[
{
title:"AIRIMP Codes",
text:"AIRIMP codes are aviation abbreviations used worldwide in reservations and ticketing systems."
},
{
title:"How to play",
text:"Hold the phone on your forehead. Tilt LEFT if correct, RIGHT to skip."
}
],

matchlearn:[
{
title:"Match & Learn",
text:"Match destinations with their three-letter IATA airport code."
},
{
title:"Goal",
text:"Clear all tiles before the timer runs out."
}
]

}

let slideIndex=0
let gameType=""

function startHelp(game){

if(localStorage.getItem(game+"_help")==="hide") return

gameType=game
slideIndex=0
createModal()

}

function createModal(){

const modal=document.createElement("div")
modal.className="modalHelp"
modal.id="helpModal"

modal.innerHTML=`
<div class="helpCard">

<div class="helpTitle" id="helpTitle"></div>
<div class="helpText" id="helpText"></div>

<div class="helpNav">
<button class="helpBtn" onclick="prevHelp()">PREV</button>
<button class="helpBtn" onclick="nextHelp()">NEXT</button>
</div>

<label style="margin-top:20px;display:block;">
<input type="checkbox" id="hideHelp"> Don't show again
</label>

</div>
`

document.body.appendChild(modal)

updateSlide()

}

function updateSlide(){

const slide=helpData[gameType][slideIndex]

document.getElementById("helpTitle").innerText=slide.title
document.getElementById("helpText").innerText=slide.text

}

function nextHelp(){

slideIndex++

if(slideIndex>=helpData[gameType].length){

if(document.getElementById("hideHelp").checked){
localStorage.setItem(gameType+"_help","hide")
}

document.getElementById("helpModal").remove()
return
}

updateSlide()

}

function prevHelp(){

if(slideIndex===0) return

slideIndex--

updateSlide()

}
