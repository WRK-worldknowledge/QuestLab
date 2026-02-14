let data = [];
let questions = [];
let current = 0;
let score = 0;

// ================= LOAD DATA =================
fetch("/QuestLab/WRK_Quiz_v1/data/wrk-data.json?v=16")
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

  // ===== City vraag: airportnaam verbergen =====
  let questionText = q.question;
  if (q.type === "city") {
    questionText = questionText
      .replace(/airport/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  document.getElementById("question").textContent = questionText;

  // afbeelding
  const img = document.getElementById("mapImage");
  if (q.image) {
    img.src = "images/" + q.image;
    img.style.display = "block";
  } else {
    img.style.display = "none";
  }

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const mode = document.getElementById("modeSelect").value;

  // ================= MULTIPLE CHOICE =================
  if (mode === "mc") {

    // kandidaten uit zelfde module
    let candidates = data.filter(d =>
      d.type === q.type &&
      d.module === q.module
    );

    // IATA: verwijder luchthavens uit dezelfde stad
    // IATA: verwijder luchthavens uit dezelfde stad
if (q.type === "iata") {

  // pak eerste woord na "for" = stadsnaam
  const match = q.question.match(/for (.*?) is/i);
  const city = match ? match[1].split(" ")[0].toLowerCase() : "";

  candidates = candidates.filter(d => {
    const m = d.question.match(/for (.*?) is/i);
    const otherCity = m ? m[1].split(" ")[0].toLowerCase() : "";
    return otherCity !== city;
  });
}

    // antwoorden verzamelen
    let pool = candidates.flatMap(d => d.answer);

    // failsafe
    if (pool.length < 4) {
      pool = data
        .filter(d => d.type === q.type)
        .flatMap(d => d.answer);
    }

    // uniek maken
    pool = [...new Set(pool)];

    // juiste antwoord verwijderen
    pool = pool.filter(a =>
      !q.answer.map(x=>x.toLowerCase().trim())
        .includes(a.toLowerCase().trim())
    );

    // 3 foute
    const wrong = pool.sort(() => Math.random()-0.5).slice(0,3);

    // mix
    const choices = [...wrong, ...q.answer].sort(() => Math.random()-0.5);

    // knoppen
    choices.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => answer(opt, q.answer);
      optionsDiv.appendChild(btn);
      optionsDiv.appendChild(document.createElement("br"));
    });
  }

  // ================= TYPING =================
  else {

    const input = document.createElement("input");
    input.placeholder = "Type your answer...";

    const btn = document.createElement("button");
    btn.textContent = "Submit";
    btn.onclick = () => answer(input.value, q.answer);

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") btn.click();
    });

    optionsDiv.appendChild(input);
    optionsDiv.appendChild(document.createElement("br"));
    optionsDiv.appendChild(btn);
  }
}
// ================= FINISH =================
function finishQuiz() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score").textContent =
    `Score: ${score} / ${questions.length}`;
}
// ================= ANSWER =================
function answer(given, correct) {

  if (!given) return;

  const normalizedGiven = given.toLowerCase().trim();
  const normalizedCorrect = correct.map(a => a.toLowerCase().trim());

  if (normalizedCorrect.includes(normalizedGiven)) {
    score++;
  }

  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}
