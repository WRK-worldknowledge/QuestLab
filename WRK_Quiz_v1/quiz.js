let data = [];
let questions = [];
let current = 0;
let score = 0;

fetch("data/wrk-data.json") 
  .then(res => res.json())
.then(json => {
  data = json;
  populateSelectors();
});

function populateSelectors() {
  const modules = [...new Set(data.map(d => d.module))];
  const moduleSelect = document.getElementById("moduleSelect");

  modules.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    moduleSelect.appendChild(opt);
  });

  moduleSelect.onchange = updateLessons;
  updateLessons();
}

function updateLessons() {
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

function startQuiz() {
  const module = moduleSelect.value;
  const lesson = lessonSelect.value;
  const type = typeSelect.value;

  questions = data.filter(d => d.type === type);

if (questions.length > 20) {
  questions = questions.sort(() => 0.5 - Math.random()).slice(0, 20);
}

  if (questions.length > 20) {
    questions = questions.sort(() => 0.5 - Math.random()).slice(0, 20);
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

// ↓ HIER PLAATSEN
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

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt, q.answer);
    optionsDiv.appendChild(btn);
    optionsDiv.appendChild(document.createElement("br"));
  });
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
