let data = [];
let questions = [];
let current = 0;
let score = 0;

// ================= LOAD DATA =================
fetch("data/wrk-data.json")
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
document.getElementById("startBtn").onclick = () => {

  const module = moduleSelect.value;
  const lesson = lessonSelect.value;
  const type = typeSelect.value;

  questions = data.filter(d =>
    d.module === module &&
    d.lesson === lesson &&
    d.type === type
  );

  if (questions.length > 20)
    questions = questions.sort(() => Math.random() - 0.5).slice(0,20);

  current = 0;
  score = 0;

  setup.style.display = "none";
  quiz.style.display = "block";

  showQuestion();
};

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
}  lessons.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    lessonSelect.appendChild(opt);
  });
}

function startQuiz() {
  const module = document.getElementById("moduleSelect").value;
const lesson = document.getElementById("lessonSelect").value;
const type = document.getElementById("typeSelect").value;

  questions = data.filter(d =>
  d.module?.toLowerCase() === module?.toLowerCase() &&
  d.lesson?.toLowerCase() === lesson?.toLowerCase() &&
  d.type?.toLowerCase() === type?.toLowerCase()
);

// max 20 vragen per sessie
if (questions.length > 20) {
  questions = questions.sort(() => Math.random() - 0.5).slice(0, 20);
}

  current = 0;
  score = 0;

  document.getElementById("setup").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  showQuestion();
}

function showQuestion() {
  const q = questions[current];

  document.getElementById("progress").textContent =
    `Question ${current + 1} of ${questions.length}`;

  document.getElementById("question").textContent = q.question;

  // afbeelding
  let img = document.getElementById("mapImage");
  if (!img) {
    img = document.createElement("img");
    img.id = "mapImage";
    img.style.maxWidth = "450px";
    img.style.marginBottom = "15px";
    document.getElementById("question").before(img);
  }

  if (q.image) {
    img.src = "images/" + q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const mode = document.getElementById("modeSelect").value;

  // =========================
  // MULTIPLE CHOICE MODE
  // =========================
  if (mode === "mc") {

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(opt, q.answer);
      optionsDiv.appendChild(btn);
      optionsDiv.appendChild(document.createElement("br"));
    });

  }

  // =========================
  // TYPING MODE
  // =========================
  else {

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your answer...";
    input.id = "typedAnswer";

    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") submitTyped();
    });

    const btn = document.createElement("button");
    btn.textContent = "Submit";
    btn.onclick = submitTyped;

    optionsDiv.appendChild(input);
    optionsDiv.appendChild(document.createElement("br"));
    optionsDiv.appendChild(btn);
  }
}

    // ENTER = submit
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") btn.click();
    });

    optionsDiv.appendChild(input);
    optionsDiv.appendChild(document.createElement("br"));
    optionsDiv.appendChild(btn);
  }
}

function checkAnswer(selected, correct) {
  if (correct.includes(selected)) score++;

  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score").textContent =
    `Score: ${score} / ${questions.length}`;
}
