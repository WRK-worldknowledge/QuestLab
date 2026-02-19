console.log("quiz.js loaded");
let data = [];
let questions = [];
let current = 0;
let currentLesson = "";
let score = 0;

let userAnswers = [];
let results = [];
let currentChoice = null;
let quizActive = false;

const moduleNames = {
    "EURW": "1. Western Europe",
    "EURO": "2. Eastern Europe",
    "AMOC": "3. America & Oceania",
    "Africa":  "4. Africa",
    "ASIA": "5. Asia"
};
const moduleOrder = ["EURW","EURO","AMOC","Africa","ASIA"];
const lessonOrder = {

    "EURW": [
        "Countries and capital cities",
        "UK, Ireland & France",
        "Scandinavia, Germany & BeNeLux",
        "Switzerland & Italy",
        "Spain & Portugal"
    ],

    "EURO": [
        "Finland, Baltics, Russia, Belarus, Poland, Czech Republic, Slovakia & Ukraine",
        "Austria, Hungary, Romania, Moldova & the Balkan",
        "Greece",
        "Turkey & Cyprus"
    ],

    "AMOC": [
        "Countries and capitals North America & Caribbean",
        "Cities North America",
        "Countries and cities South America",
        "Oceania"
    ],

    "AFR": [
        "Northern Africa - Sahara countries",
        "Northern Africa - Sahel countries",
        "Central Africa",
        "Southern Africa"
    ],

    "ASIA": [
        "Middle East & EurAsia",
        "Central Asia",
        "Far East"
    ]

};

// ================= HELPERS =================
function normalizeCity(name){
return name
.replace(/airport/gi,"")
.replace(/international/gi,"")
.replace(/\s+/g," ")
.trim();
}

function cityOnly(name){
return normalizeCity(name);
}
function normalizeAnswer(text){
    if(!text) return "";

    return text
        .toString()
        .normalize("NFD")                 // split accents
        .replace(/[\u0300-\u036f]/g,"")   // remove accents
        .replace(/ß/g,"ss")
        .replace(/æ/g,"ae")
        .replace(/ø/g,"o")
        .replace(/å/g,"a")
        .replace(/-/g," ")
        .replace(/\s+/g," ")
        .replace(/\s/g,"")
        .trim()
        .toLowerCase();
}

function getIATACity(){
    return null;
}

function shuffle(array){
for(let i=array.length-1;i>0;i--){
const j=Math.floor(Math.random()*(i+1));
[array[i],array[j]]=[array[j],array[i]];
}
return array;
}

// ================= LOAD DATA =================
fetch("data/wrk-data.json?v=40")
.then(r=>{
    console.log("FETCH STATUS:", r.status);
    console.log("FETCH URL:", r.url);
    return r.text();
})
.then(text=>{
    console.log("RAW RESPONSE START:");
    console.log(text.substring(0,200));

    const json = JSON.parse(text);
    data=json;

    console.log("DATA LOADED:", data.length);

    populateModules();
    document.getElementById("startBtn").addEventListener("click",startQuiz);
})
.catch(err=>{
    console.error("FETCH FAILED:", err);
});

// ================= MODULES =================
function populateModules(){
const moduleSelect=document.getElementById("moduleSelect");
moduleSelect.innerHTML="";

// alleen modules tonen die echt in data zitten
const available = new Set(data.map(d=>d.module));

// vaste volgorde afdwingen
moduleOrder.forEach(m=>{
    if(!available.has(m)) return;

    const opt=document.createElement("option");
    opt.value=m;
    opt.textContent = moduleNames[m] || m;
    moduleSelect.appendChild(opt);
});

moduleSelect.addEventListener("change",populateLessons);
populateLessons();
}


// ================= LESSONS =================
function populateLessons(){

    const module = document.getElementById("moduleSelect").value;
    const lessonSelect = document.getElementById("lessonSelect");
    lessonSelect.innerHTML = "";

    // Module test optie
    const all = document.createElement("option");
    all.value = "all";
    all.textContent = "All lessons (module test)";
    lessonSelect.appendChild(all);

    // Welke lessen bestaan er in data?
    const availableLessons = new Set(
        data
        .filter(d => d.module === module)
        .map(d => d.lesson)
    );

    // Gebruik vaste volgorde als die bestaat
    if(lessonOrder[module]){

        lessonOrder[module].forEach(l => {

            if(!availableLessons.has(l)) return;

            const opt = document.createElement("option");
            opt.value = l;
            opt.textContent = l;
            lessonSelect.appendChild(opt);

        });

    } else {

        // fallback (voor veiligheid)
        [...availableLessons].forEach(l=>{
            const opt = document.createElement("option");
            opt.value = l;
            opt.textContent = l;
            lessonSelect.appendChild(opt);
        });

    }
}

// ================= START QUIZ =================
function startQuiz(){

const module=document.getElementById("moduleSelect").value;
const lesson=document.getElementById("lessonSelect").value;
const type=document.getElementById("typeSelect").value;

    quizActive = true;

currentLesson=lesson;

if(lesson==="all"){
    questions=data.filter(d=>d.module===module && d.type===type);
}else{
    questions=data.filter(d=>d.module===module && d.lesson===lesson && d.type===type);
}

if(!questions.length){
    alert("No questions found");
    return;
}

const amount=lesson==="all"?30:20;
questions=shuffle([...questions]).slice(0,amount);

current=0;
score=0;
userAnswers=new Array(questions.length).fill(null);
results=[];
currentChoice=null;

document.getElementById("setup").style.display="none";
document.getElementById("quiz").style.display="block";

showQuestion();

}

// ================= SELECT OPTION =================
function selectOption(button,value){
document.querySelectorAll("#options button").forEach(b=>b.classList.remove("selected"));
button.classList.add("selected");
currentChoice=value;
}

// ================= NEXT =================
function nextQuestion(){

if(currentChoice===null){
    alert("Choose an answer first");
    return;
}

userAnswers[current]=currentChoice;
currentChoice=null;

current++;

if(current<questions.length){
    showQuestion();
}else{
    confirmSubmit();
}

}

// ================= CONFIRM =================
function confirmSubmit(){
if(confirm("Submit test? You cannot change answers afterwards.")){
gradeQuiz();
}else{
current--;
showQuestion();
}
}

// ================= SHOW QUESTION =================
function showQuestion(){

const q=questions[current];
    const mode = document.getElementById("modeSelect").value;

document.getElementById("progress").textContent =
    currentLesson==="all"
    ? "Module test - Question " + (current+1) + " of " + questions.length
    : "Question " + (current+1) + " of " + questions.length;

let questionText="";
switch(q.type){
    case "city":
        questionText="Which city is this?";
        break;

    case "country":
        questionText="Which country is this?";
        break;

    case "capital":
        questionText="What is the capital of this country?";
        break;

    case "iata":
        questionText="What is the IATA code?";
        break;

    default:
        questionText=q.question;
}
document.getElementById("question").textContent=questionText;
const img=document.getElementById("mapImage");
if(q.image){
    img.src="images/"+q.image;
    img.style.display="block";
}else img.style.display="none";

const options=document.getElementById("options");
options.innerHTML="";

/* ================= TYPING MODE ================= */
if(mode==="type"){

    const input=document.createElement("input");
    input.type="text";
    input.placeholder="Type your answer...";
    input.className="typeInput";

    input.onkeydown=function(e){
        if(e.key==="Enter") nextQuestion();
    };

    options.appendChild(input);

    const nextBtn=document.createElement("button");
    nextBtn.textContent=current===questions.length-1?"Finish":"Next";
    nextBtn.className="nextBtn";
    nextBtn.onclick=function(){
        currentChoice=input.value;
        nextQuestion();
    };

    options.appendChild(nextBtn);
    return;
}

/* ================= MULTIPLE CHOICE ================= */

let candidates = data.filter(d =>
    d.type === q.type &&
    d.module === q.module
);

if(q.type==="iata"){
    const correctCity=getIATACity(q.question);
    if(correctCity){
        candidates=candidates.filter(d=>getIATACity(d.question)!==correctCity);
    }
}

let pool=candidates.flatMap(d=>{
    if(q.type==="city") return [d.city];
    if(q.type==="country") return [d.country];
    if(q.type==="capital") return [d.capital];
    return d.answer;
});
pool=[...new Set(pool)];

const correctAnswers =
q.type==="city" ? [q.city] :
q.type==="country" ? [q.country] :
q.type==="capital" ? [q.capital] :
q.answer;

pool=pool.filter(a=>!correctAnswers.map(x=>x.toLowerCase()).includes(a.toLowerCase()));

while(pool.length<3) pool.push("—");

const choices=shuffle([...shuffle(pool).slice(0,3),...correctAnswers]);

choices.forEach(opt=>{
    const btn=document.createElement("button");
    btn.textContent=opt;

    if(opt==="—"){
        btn.disabled=true;
    }else{
        btn.onclick=()=>selectOption(btn,opt);
    }

    options.appendChild(btn);
    options.appendChild(document.createElement("br"));
});

const nextBtn=document.createElement("button");
nextBtn.textContent=current===questions.length-1?"Finish":"Next";
nextBtn.className="nextBtn";
nextBtn.onclick=nextQuestion;

options.appendChild(document.createElement("br"));
options.appendChild(nextBtn);

}

// ================= GRADE =================
function gradeQuiz(){

score=0;
results=[];


questions.forEach((q,i)=>{

    const correctAnswers = [
        q.type==="city" ? q.city :
        q.type==="country" ? q.country :
        q.type==="capital" ? q.capital :
        (q.answer?.[0] || "")
    ].filter(Boolean);

    const given=userAnswers[i]||"";

    const ok = correctAnswers
        .map(a => normalizeAnswer(a))
        .includes(normalizeAnswer(given));

    if(ok) score++;

    let questionLabel =
        q.type==="city" ? "City" :
        q.type==="country" ? "Country" :
        q.type==="capital" ? "Capital" :
        q.type==="iata" ? "IATA code" :
        "Question";

    results.push({
        question:questionLabel,
        given:given||"(no answer)",
        correct:correctAnswers.join(" / "),   // ✅ FIX
        ok:ok,
        image:q.image || null
    });

});

finishQuiz();

}

// ================= FINISH =================
function finishQuiz(){

safeToLeave = true;
quizActive = false;

document.getElementById("quiz").style.display="none";
document.getElementById("result").style.display="block";

document.getElementById("score").textContent =
"Score: " + score + " / " + questions.length;

    // ===== XP & PROGRESS =====
const percentage = Math.round((score/questions.length)*100);

// kleine XP altijd
addXP(Math.floor(score*5));

// module mastery registratie
const module = document.getElementById("moduleSelect").value;
registerModuleScore(module, percentage);

// kaart updaten
if(typeof renderPlayerCard === "function")
    renderPlayerCard();
    
    // ===== XP + MODULE PROGRESS =====

const percent = Math.round((score/questions.length)*100);

// basis XP
let xpEarned = Math.round(percent * 2); // 0–200 XP
addXP(xpEarned);

// alleen voor module test (30 vragen)
if(currentLesson === "all"){
    registerModuleScore(
        document.getElementById("moduleSelect").value,
        percent
    );
}

// UI updaten
if(typeof renderPlayerCard === "function")
    renderPlayerCard();
    
const resultDiv=document.getElementById("result");

let html="<h3>Review</h3>";

results.forEach(function(r){

html += "<div style='background:white;color:black;padding:12px;margin:12px 0;border-radius:12px;text-align:left'>";

// afbeelding bovenaan
if(r.image){
html += "<img src='images/" + r.image + "' style='width:100%;max-width:420px;border-radius:10px;margin-bottom:8px'><br>";
}

html += "<b>" + r.question + "</b><br>";
html += "Your answer: <span style='color:" + (r.ok?"green":"red") + "'>" + r.given + "</span><br>";
html += "Correct: <b>" + r.correct + "</b>";

html += "</div>";

});


resultDiv.innerHTML+=html;

}
// ===== IMAGE ZOOM =====
const mapImage = document.getElementById("mapImage");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

mapImage.addEventListener("click", ()=>{
    if(!mapImage.src) return;
    lightbox.style.display="flex";
    lightboxImg.src = mapImage.src;
});

lightbox.addEventListener("click", ()=>{
    lightbox.style.display="none";
});
window.addEventListener("beforeunload", function (e) {
    if (!quizActive || safeToLeave) return;

    e.preventDefault();
    e.returnValue = "";
});
