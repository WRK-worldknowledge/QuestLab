console.log("quiz.js loaded");
let data = [];
let questions = [];
let current = 0;
let currentLesson = "";
let score = 0;

let userAnswers = [];
let results = [];
let currentChoice = null;

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
fetch("data/wrk-data.json?v=18")
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

[...new Set(data.map(d=>d.module))].forEach(m=>{
    const opt=document.createElement("option");
    opt.value=m;
    opt.textContent=m;
    moduleSelect.appendChild(opt);
});

moduleSelect.addEventListener("change",populateLessons);
populateLessons();

}

// ================= LESSONS =================
function populateLessons(){
const module=document.getElementById("moduleSelect").value;
const lessonSelect=document.getElementById("lessonSelect");
lessonSelect.innerHTML="";

const all=document.createElement("option");
all.value="all";
all.textContent="All lessons (module test)";
lessonSelect.appendChild(all);

[...new Set(data.filter(d=>d.module===module).map(d=>d.lesson))]
.forEach(l=>{
    const opt=document.createElement("option");
    opt.value=l;
    opt.textContent=l;
    lessonSelect.appendChild(opt);
});

}

// ================= START QUIZ =================
function startQuiz(){

const module=document.getElementById("moduleSelect").value;
const lesson=document.getElementById("lessonSelect").value;
const type=document.getElementById("typeSelect").value;

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

document.getElementById("progress").textContent =
    currentLesson==="all"
    ? "Module test - Question " + (current+1) + " of " + questions.length
    : "Question " + (current+1) + " of " + questions.length;

let questionText="";
switch(q.type){
    case "city":
        questionText="What city is this?";
        break;

    case "country":
        questionText="Which country is this in?";
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

let candidates=data.filter(d=>d.type===q.type && d.module===q.module);

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

    const correct =
        q.type==="city" ? [q.city] :
        q.type==="country" ? [q.country] :
        q.type==="capital" ? [q.capital] :
        q.answer;

    const given=userAnswers[i]||"";

    const ok=correct.map(a=>a.toLowerCase()).includes(given.toLowerCase());

    if(ok) score++;

    results.push({
    question:q.question,
    given:given||"(no answer)",
    correct:correct.join(" / "),
    ok:ok,
    image:q.image || null
});
});

finishQuiz();

}

// ================= FINISH =================
function finishQuiz(){

document.getElementById("quiz").style.display="none";
document.getElementById("result").style.display="block";

document.getElementById("score").textContent =
"Score: " + score + " / " + questions.length;

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
