let data = [];
let questions = [];
let current = 0;
let score = 0;

// ================= LOAD DATA =================
fetch("/QuestLab/WRK_Quiz_v1/data/wrk-data.json?v=10")
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

  const modules = [...new Set(data.map(d => d.module))];

  modules.forEach(m => {
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

  const lessons = [...new Set(
    data.filter(d => d.module === module).map(d => d.lesson)
  )];

  lessons.forEach(l => {
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

  if (questions.length === 0) {
    alert("No questions found for this selection");
    return;
  }

  if (questions.length > 20)
    questions = questions.sort(() => Math.random() - 0.5).slice(0,20);

  current = 0;
  score = 0;

  document.getElementById("setup").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  showQuestion();
}

// ================= SHOW QUESTION =================
function showQuestion() {

  const q = questions[current];

  document.getElementById("progress").textContent =
    `Question ${current+1} of ${questions.length}`;

  document.getElementById("question").textContent = q.question;

  const img = document.getElementById("mapImage");
  if (q.image) {
    img.src = "images/" + q.image;
    img.style.display = "block";
  } else img.style.display = "none";

  const options = document.getElementById("options");
  options.innerHTML = "";

  const mode = document.getElementById("modeSelect").value;

  // ===== MULTIPLE CHOICE =====
  if (mode === "mc") {

    let choices = [];

    // gebruik bestaande options als ze bestaan
    if (q.options && q.options.length >= 2) {
      choices = q.options;
    }

    // anders automatisch genereren
    else {
      const sameType = data.filter(d => d.type === q.type);
      const wrong = sameType
        .map(d => d.answer[0])
        .filter(a => !q.answer.includes(a))
        .sort(() => Math.random() - 0.5)
        .slice(0,3);

      choices = [...q.answer, ...wrong].sort(() => Math.random() - 0.5);
    }

    choices.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => answer(opt, q.answer);
      options.appendChild(btn);
      options.appendChild(document.createElement("br"));
    });

  }

  // ===== TYPING =====
  else {

    const input = document.createElement("input");
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
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score").textContent =
    `Score: ${score} / ${questions.length}`;
}
