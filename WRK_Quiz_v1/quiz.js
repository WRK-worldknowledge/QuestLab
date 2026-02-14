let data = [];
let questions = [];
let current = 0;
let score = 0;

// ================= DOM =================
const setup = document.getElementById("setup");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const moduleSelect = document.getElementById("moduleSelect");
const lessonSelect = document.getElementById("lessonSelect");
const typeSelect = document.getElementById("typeSelect");
const modeSelect = document.getElementById("modeSelect");

const progress = document.getElementById("progress");
const questionEl = document.getElementById("question");
const options = document.getElementById("options");
const scoreEl = document.getElementById("score");

// afbeelding element
let mapImage = document.createElement("img");
mapImage.style.maxWidth = "450px";
mapImage.style.display = "block";
mapImage.style.marginBottom = "15px";
questionEl.before(mapImage);


// ================= LOAD DATA =================
fetch("data/wrk-data.json?v=5")
  .then(r => r.json())
  .then(json => {
    data = json;
    populateModules();
  });


// ================= SELECTORS =================
function populateModules() {
  moduleSelect.innerHTML = "";

  const modules = [...new Set(data.map(d => d.module))];

  modules.forEach(m => {
    const o = document.createElement("option");
    o.value = m;
    o.textContent = m;
    moduleSelect.appendChild(o);
  });

  moduleSelect.onchange = populateLessons;
  populateLessons();
}

function populateLessons() {
  const module = moduleSelect.value;
  lessonSelect.innerHTML = "";

  const lessons = [...new Set(
    data.filter(d => d.module === module).map(d => d.lesson)
  )];

  lessons.forEach(l => {
    const o = document.createElement("option");
    o.value = l;
    o.textContent = l;
    lessonSelect.appendChild(o);
  });
}


// ================= START QUIZ =================
window.startQuiz = function() {

  const module = moduleSelect.value;
  const lesson = lessonSelect.value;
  const type = typeSelect.value;

  questions = data.filter(d =>
    d.module === module &&
    d.lesson === lesson &&
    d.type === type
  );

  if (questions.length === 0) {
    alert("No questions found for this selection");
    return;
  }

  if (questions.length > 20)
    questions = questions.sort(() => Math.random() - 0.5).slice(0,20);

  current = 0;
  score = 0;

  setup.style.display = "none";
  result.style.display = "none";
  quiz.style.display = "block";

  showQuestion();
}


// ================= SHOW QUESTION =================
function showQuestion() {

  const q = questions[current];

  progress.textContent = `Question ${current+1} of ${questions.length}`;
  questionEl.textContent = q.question;

  // image
  if (q.image) {
    mapImage.src = "images/" + q.image;
    mapImage.style.display = "block";
  } else {
    mapImage.style.display = "none";
  }

  options.innerHTML = "";

  const mode = modeSelect.value;

  // ---------- MULTIPLE CHOICE ----------
  if (mode === "mc") {

    q.options.forEach(opt => {
      const b = document.createElement("button");
      b.textContent = opt;
      b.onclick = () => answer(opt, q.answer);
      options.appendChild(b);
      options.appendChild(document.createElement("br"));
    });

  }

  // ---------- TYPING ----------
  else {

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your answer...";

    const btn = document.createElement("button");
    btn.textContent = "Submit";

    btn.onclick = () => answer(input.value, q.answer);

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") btn.click();
    });

    options.appendChild(input);
    options.appendChild(document.createElement("br"));
    options.appendChild(btn);
  }
}


// ================= ANSWER =================
function answer(given, correct) {

  if (correct.map(a => a.toLowerCase()).includes(given.toLowerCase()))
    score++;

  current++;

  if (current < questions.length)
    showQuestion();
  else
    finishQuiz();
}


// ================= FINISH =================
function finishQuiz() {
  quiz.style.display = "none";
  result.style.display = "block";
  scoreEl.textContent = `Score: ${score} / ${questions.length}`;
}
