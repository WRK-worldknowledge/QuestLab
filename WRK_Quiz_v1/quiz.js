let data = [];
let questions = [];
let current = 0;
let score = 0;

// ================= LOAD DATA =================
fetch("/QuestLab/WRK_Quiz_v1/data/wrk-data.json?v=3")
  .then(r => r.json())
  .then(json => {
    data = json;
    populateModules();
  });

// ================= SELECTORS =================
function populateModules() {
  const moduleSelect = document.getElementById("moduleSelect");
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
  const lessonSelect = document.getElementById("lessonSelect");
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
function startQuiz() {

  const module = moduleSelect.value.trim().toLowerCase();
  const lesson = lessonSelect.value.trim().toLowerCase();
  const type = typeSelect.value.trim().toLowerCase();

  questions = data.filter(d =>
    d.module?.trim().toLowerCase() === module &&
    d.lesson?.trim().toLowerCase() === lesson &&
    d.type?.trim().toLowerCase() === type
  );

  console.log("Found questions:", questions.length);

  if (questions.length === 0) {
    alert("No questions found — check type/module/lesson naming");
    return;
  }

  if (questions.length > 20)
    questions = questions.sort(() => Math.random() - 0.5).slice(0,20);

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
  question.textContent = q.question;

  // image
  if (q.image) {
    mapImage.src = "images/" + q.image;
    mapImage.style.display = "block";
  } else mapImage.style.display = "none";

  options.innerHTML = "";

  const mode = modeSelect.value;

  // MULTIPLE CHOICE
  if (mode === "mc") {

    q.options.forEach(opt => {
      const b = document.createElement("button");
      b.textContent = opt;
      b.onclick = () => answer(opt, q.answer);
      options.appendChild(b);
      options.appendChild(document.createElement("br"));
    });

  }

  // TYPING
  else {

    const input = document.createElement("input");
    input.placeholder = "Type your answer...";
    input.id = "typed";

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

  if (correct.map(a=>a.toLowerCase()).includes(given.toLowerCase()))
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
  scoreEl = document.getElementById("score");
  scoreEl.textContent = `Score: ${score} / ${questions.length}`;

  }
