let data = [];
let questions = [];
let current = 0;
let score = 0;

// ================= LOAD DATA =================
fetch("/QuestLab/WRK_Quiz_v1/data/wrk-data.json?v=20")
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

    const module = moduleSelect.value;
    const lesson = lessonSelect.value;
    const type = typeSelect.value;

    questions = data.filter(d =>
        d.module === module &&
        d.lesson === lesson &&
        d.type === type
    );

    if (!questions.length) {
        alert("No questions found");
        return;
    }

    if (questions.length > 20)
        questions = questions.sort(()=>Math.random()-0.5).slice(0,20);

    current = 0;
    score = 0;

    setup.style.display = "none";
    quiz.style.display = "block";

    showQuestion();
}

// ================= SHOW QUESTION =================
function showQuestion() {

    const q = questions[current];

    progress.textContent = `Question ${current+1} of ${questions.length}`;

    // city: airport naam verbergen
    let questionText = q.question;
    if (q.type === "city")
        questionText = questionText.replace(/airport/gi,"").replace(/\s+/g," ").trim();

    question.textContent = questionText;

    // image
    if (q.image) {
        mapImage.src = "images/" + q.image;
        mapImage.style.display = "block";
    } else mapImage.style.display = "none";

    options.innerHTML = "";

    const mode = modeSelect.value;

    // ================= MULTIPLE CHOICE =================
    if (mode === "mc") {

        // hele continent
        let candidates = data.filter(d =>
            d.type === q.type &&
            d.module === q.module
        );

        // voorkom meerdere airports uit zelfde stad
        if (q.type === "iata") {

            const correctEntry = data.find(d =>
                d.type === "iata" &&
                d.answer[0].toLowerCase() === q.answer[0].toLowerCase()
            );

            if (correctEntry) {
                const m = correctEntry.question.match(/for (.*?) is/i);
                const correctCity = m ? m[1].split(" ")[0].toLowerCase() : "";

                candidates = candidates.filter(d => {
                    const mm = d.question.match(/for (.*?) is/i);
                    const otherCity = mm ? mm[1].split(" ")[0].toLowerCase() : "";
                    return otherCity !== correctCity;
                });
            }
        }

        let pool = [...new Set(candidates.flatMap(d=>d.answer))];

        pool = pool.filter(a =>
            !q.answer.map(x=>x.toLowerCase()).includes(a.toLowerCase())
        );

        const wrong = pool.sort(()=>Math.random()-0.5).slice(0,3);
        const choices = [...wrong,...q.answer].sort(()=>Math.random()-0.5);

        choices.forEach(opt=>{
            const b=document.createElement("button");
            b.textContent=opt;
            b.onclick=()=>answer(opt,q.answer);
            options.appendChild(b);
            options.appendChild(document.createElement("br"));
        });
    }

    // ================= TYPING =================
    else {
        const input=document.createElement("input");
        input.placeholder="Type your answer...";

        const btn=document.createElement("button");
        btn.textContent="Submit";
        btn.onclick=()=>answer(input.value,q.answer);

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

    if(correct.map(a=>a.toLowerCase()).includes(given.toLowerCase().trim()))
        score++;

    current++;

    if(current<questions.length) showQuestion();
    else finishQuiz();
}

// ================= FINISH =================
function finishQuiz(){
    quiz.style.display="none";
    result.style.display="block";
    scoreEl.textContent=`Score: ${score} / ${questions.length}`;
}
