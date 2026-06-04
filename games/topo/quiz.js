startHelp("wrkquiz")
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
    "Africa": "4. Africa",
    "ASIA": "5. Asia"
};

const moduleOrder = [
    "EURW",
    "EURO",
    "AMOC",
    "Africa",
    "ASIA"
];

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

    "Africa": [
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
const assessmentModules = {

    "1":["EURW"],

    "2":["EURW","EURO"],

    "3":["EURW","EURO","AMOC"],

    "4":["EURW","EURO","AMOC","Africa"],

    "5":["EURW","EURO","AMOC","Africa","ASIA"],

    "final":["EURW","EURO","AMOC","Africa","ASIA"]

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
fetch(`./data/wrk-data.json?v=${Date.now()}`)
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
    setupModeSelector();

    document.getElementById("startBtn")
        .addEventListener("click",startQuiz);

})
.catch(err=>{
    console.error("FETCH FAILED:", err);
});

// ================= MODE SELECTOR =================
function setupModeSelector(){

const mode =
document.getElementById("quizMode");

const assessmentSelect =
document.getElementById("assessmentSelect");

mode.addEventListener("change",()=>{

    const practice =
    document.getElementById("practiceOptions");

    const assessment =
    document.getElementById("assessmentOptions");

    if(mode.value==="practice"){

        practice.style.display="block";
        assessment.style.display="none";

        populateLessons();

    }else{

        practice.style.display="none";
        assessment.style.display="block";

        populateAssessmentLessons();

    }

});

assessmentSelect.addEventListener(
    "change",
    populateAssessmentLessons
);

}

// ================= MODULES =================
function populateModules(){

const moduleSelect =
document.getElementById("moduleSelect");

moduleSelect.innerHTML="";

// alleen modules tonen die echt in data zitten
const available =
new Set(data.map(d=>d.module));

// vaste volgorde afdwingen
moduleOrder.forEach(m=>{

    if(!available.has(m)) return;

    const opt=document.createElement("option");

    opt.value=m;
    opt.textContent =
    moduleNames[m] || m;

    moduleSelect.appendChild(opt);

});

moduleSelect.addEventListener(
    "change",
    populateLessons
);

populateLessons();

}

// ================= ASSESSMENT LESSONS =================
function populateAssessmentLessons(){

const assessment =
document.getElementById("assessmentSelect").value;

const lessonSelect =
document.getElementById("assessmentLessonSelect");

lessonSelect.innerHTML="";

const all=document.createElement("option");

all.value="all";
all.textContent="All lessons";

lessonSelect.appendChild(all);

const modules =
assessmentModules[assessment];

const lessons = new Set();

modules.forEach(m=>{

    data
    .filter(d=>d.module===m)
    .forEach(d=>lessons.add(d.lesson));

});

[...lessons]
.sort()
.forEach(l=>{

    const opt=document.createElement("option");

    opt.value=l;
    opt.textContent=l;

    lessonSelect.appendChild(opt);

});

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

const quizMode =
document.getElementById("quizMode").value;

const type =
document.getElementById("typeSelect").value;

let lesson;
let selectedModules;

if(quizMode==="practice"){

    const module =
    document.getElementById("moduleSelect").value;

    lesson =
    document.getElementById("lessonSelect").value;

    selectedModules = [module];

}else{

    const assessment =
    document.getElementById("assessmentSelect").value;

    lesson =
    document.getElementById("assessmentLessonSelect").value;

    selectedModules =
    assessmentModules[assessment];

}

console.log("TYPE =", type);
console.log("MODULES =", selectedModules);

quizActive = true;

currentLesson = lesson;

if(type==="capital"){

    if(lesson==="all"){
        questions=data.filter(d =>
    selectedModules.includes(d.module) &&
    d.type==="city" &&
    d.isCapital===true
);
    }else{
        questions=data.filter(d =>
    selectedModules.includes(d.module) &&
    d.lesson===lesson &&
    d.type==="city" &&
    d.isCapital===true
);
    }
    questions = questions.map(q => ({
    ...q,
    type: "capital"
}));

}else{

    if(lesson==="all"){
        questions=data.filter(d =>
    selectedModules.includes(d.module) &&
    d.type===type
);
    }else{
        questions=data.filter(d =>
    selectedModules.includes(d.module) &&
    d.lesson===lesson &&
    d.type===type
);
    }

}
    // HIER KOMT HET NIEUWE BLOK

if(
    quizMode==="assessment" &&
    (type==="country" || type==="capital")
){

    questions = questions.filter(
        (q,index,self) =>
        index === self.findIndex(
            x => x.country === q.country
        )
    );

}
    if(type==="city"){

    questions = questions.filter(
        (q,index,self) =>
        index === self.findIndex(
            x => x.city === q.city
        )
    );

}

if(type==="country" || type==="capital"){

    questions = questions.filter(
        (q,index,self) =>
        index === self.findIndex(
            x => x.country === q.country
        )
    );

}

if(!questions.length){
    alert("No questions found");
    return;
}

const amount=lesson==="all"?30:20;
questions=shuffle([...questions]).slice(0,amount);
    console.log("QUESTIONS SAMPLE:", questions.slice(0,3));

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
    questionText = "What is the capital of " + q.country + "?";
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
    img.src="./images/"+q.image;
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

let candidates;

if(q.type === "capital"){

    candidates = data.filter(d =>
        d.type === "city" &&
        d.isCapital === true
    );

}else{

    candidates = data.filter(d =>
        d.type === q.type &&
        d.module === q.module
    );

}

if(q.type==="iata"){
    const correctCity=getIATACity(q.question);
    if(correctCity){
        candidates=candidates.filter(d=>getIATACity(d.question)!==correctCity);
    }
}
let pool=candidates.flatMap(d=>{
    if(q.type==="city") return [d.city];
if(q.type==="country") return [d.country];
if(q.type==="capital") return [d.city];
if(q.type==="iata") return [d.iata];
return [];
});

pool=[...new Set(pool)];

const correctAnswers =
q.type==="city" ? [q.city] :
q.type==="country" ? [q.country] :
q.type==="capital" ? [q.city] :
q.type==="iata" ? [q.iata] :
[];

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

// ===== XP & PROGRESS (FINAL) =====
// ===== BASE XP (klein — alleen motivatie) =====
const percent = Math.round((score/questions.length)*100);

// max ±40 XP per quiz
const xpEarned = Math.round(percent * 0.4);
addXP(xpEarned);

// alleen module test telt voor badges
if(currentLesson === "all"){
    registerModuleScore(
        document.getElementById("moduleSelect").value,
        percent
    );
}

// kaart vernieuwen
if(typeof renderPlayerCard === "function")
    renderPlayerCard();
    // cloud save
if(typeof savePlayerToCloud === "function"){
    savePlayerToCloud();
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
