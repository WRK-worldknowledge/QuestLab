let data = [];
let questions = [];
let current = 0;
let currentType = "";
let score = 0;
function normalizeCity(name) {
    return name
        .replace(/airport/gi,"")
        .replace(/international/gi,"")
        .replace(/city/gi,"")
        .replace(/heathrow|gatwick|luton|stans?ted|schiphol|malpensa|linate|charles de gaulle|orly/gi,"")
        .replace(/\s+/g," ")
        .trim();
}
function shuffle(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
    return array;
}
// ================= LOAD DATA =================
fetch("data/wrk-data.json?v=4")
.then(r => r.json())
.then(json => {
    data = json;
    populateModules();
    document.getElementById("startBtn").addEventListener("click", startQuiz);
});

// ================= MODULES =================
function populateModules() {
    const moduleSelect = document.getElementById("moduleSelect");
    moduleSelect.innerHTML = "";

    [...new Set(data.map(d => d.module))].forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        moduleSelect.appendChild(opt);
    });

    moduleSelect.addEventListener("change", populateLessons);
    populateLessons();
}

// ================= LESSONS =================
function populateLessons() {
    const module = document.getElementById("moduleSelect").value;
    const lessonSelect = document.getElementById("lessonSelect");
    lessonSelect.innerHTML = "";

    [...new Set(data.filter(d => d.module === module).map(d => d.lesson))]
    .forEach(l => {
        const opt = document.createElement("option");
        opt.value = l;
        opt.textContent = l;
        lessonSelect.appendChild(opt);
    });
}

// ================= START QUIZ =================
function startQuiz() {

    const module = document.getElementById("moduleSelect").value;
    const lesson = document.getElementById("lessonSelect").value;
    const type = document.getElementById("typeSelect").value;

    questions = data.filter(d =>
        d.module === module &&
        d.lesson === lesson &&
        d.type === type
    );

    if (!questions.length) {
        alert("No questions found");
        return;
    }

    questions = shuffle([...questions]).slice(0,20);

    current = 0;
    score = 0;

    document.getElementById("setup").style.display = "none";
    document.getElementById("quiz").style.display = "block";

    showQuestion();
}

// ================= SHOW QUESTION =================
function showQuestion() {
const q = questions[current];
currentType = q.type;

    document.getElementById("progress").textContent =
        `Question ${current+1} of ${questions.length}`;

    // city vraag: verwijder airport naam
   let questionText = "";

switch(q.type){
    case "city":
        questionText = "What city is this airport in?";
        break;

    case "country":
        questionText = "Which country is this in?";
        break;

    case "capital":
        questionText = "What is the capital of this country?";
        break;

    case "iata":
        questionText = "What is the IATA code?";
        break;

    default:
        questionText = q.question;
}

document.getElementById("question").textContent = questionText;

    // image
    const img = document.getElementById("mapImage");
    if (q.image) {
        img.src = "images/" + q.image;
        img.style.display = "block";
    } else img.style.display = "none";

    const options = document.getElementById("options");
    options.innerHTML = "";

    const mode = document.getElementById("modeSelect").value;

    // ================= MULTIPLE CHOICE =================
    if (mode === "mc") {

        // antwoorden uit zelfde continent
        let candidates = data.filter(d =>
            d.type === q.type &&
            d.module === q.module
        );

        // voorkom meerdere airports uit zelfde stad (IATA)
if (q.type === "iata") {
    function extractCity(text){
        const m = text.match(/for (.*?) is/i);
        if(!m) return null;
        return normalizeCity(m[1]).toLowerCase();
    }

    const correctCity = extractCity(q.question);

    if(correctCity){
        candidates = candidates.filter(d =>
            extractCity(d.question) !== correctCity
        );
    }
} // ← HEEL BELANGRIJK (deze ontbrak)

// ↓ ALTIJD uitvoeren (voor alle vraagtypes!)
let pool = candidates.flatMap(d => 
    d.answer.map(a =>
        q.type === "city"
            ? normalizeCity(a)
            : a
));

// FAILSAFE → andere lessen binnen hetzelfde continent
if (pool.length < 4) {
    pool = data
        .filter(d =>
            d.type === q.type &&
            d.module === q.module &&
            d.lesson !== q.lesson
        )
        .flatMap(d => d.answer.map(a =>
    q.type === "city"
        ? normalizeCity(a).split(" ")[0]
        : a
));
}

pool = [...new Set(pool)];

// eerst correcte antwoorden bepalen
const normalizedCorrect = q.answer.map(a =>
    q.type === "city" ? normalizeCity(a).toLowerCase() : a.toLowerCase()
);

// daarna juiste antwoord verwijderen
pool = pool.filter(a =>
    !normalizedCorrect.includes(
        (q.type === "city" ? normalizeCity(a) : a).toLowerCase()
    )
);

while(pool.length < 3){
    pool.push("—");
}

        const wrong = shuffle(pool).slice(0,3);
       const correctAnswers = q.type === "city"
    ? q.answer.map(a => normalizeCity(a))
    : q.answer;

const choices = shuffle([...wrong,...correctAnswers]);
        choices.forEach(opt=>{
    const btn=document.createElement("button");
    btn.textContent=opt;
    if(opt === "—"){
    btn.disabled = true;
    btn.classList.add("emptyOption");
} else {
    btn.onclick=()=>answer(opt,correctAnswers);
}
            options.appendChild(btn);
            options.appendChild(document.createElement("br"));
        });
    }

    // ================= TYPING =================
    else {

        const input=document.createElement("input");
        input.placeholder="Type your answer...";

        const btn=document.createElement("button");
        btn.textContent="Submit";
        const correctAnswers = q.type === "city"
    ? q.answer.map(a => normalizeCity(a))
    : q.answer;

btn.onclick=()=>answer(input.value,correctAnswers);

        input.addEventListener("keydown",e=>{
            if(e.key==="Enter") btn.click();
        });

        options.appendChild(input);
        options.appendChild(document.createElement("br"));
        options.appendChild(btn);
    }
}

// ================= ANSWER =================
function answer(given, correct){

    if(!given) return;

   let normalizedGiven = given
    .toLowerCase()
    .replace(/\s+/g," ")
    .trim();

    let normalizedCorrect = correct.map(a =>
    a.toLowerCase().replace(/\s+/g," ").trim()
);

    if(normalizedCorrect.includes(normalizedGiven))
        score++;

    current++;

    if(current<questions.length) showQuestion();
    else finishQuiz();
}

// ================= FINISH =================
function finishQuiz(){
    document.getElementById("quiz").style.display="none";
    document.getElementById("result").style.display="block";
    document.getElementById("score").textContent=`Score: ${score} / ${questions.length}`;
}
