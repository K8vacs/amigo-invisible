const $ = (id) => document.getElementById(id);

let current = 0;
let locked = false;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

function renderQuestion() {
  const item = QUESTIONS[current];
  locked = false;
  showFriend(item.who);
  $("progress").textContent = `Pregunta ${current + 1} de ${QUESTIONS.length}`;
  $("question-text").textContent = item.q;
  $("feedback").textContent = "";

  const box = $("options");
  box.innerHTML = "";
  item.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", () => answer(i, btn));
    box.appendChild(btn);
  });
}

function answer(index, btn) {
  if (locked) return;
  locked = true;

  const correct = index === QUESTIONS[current].answer;
  btn.classList.add(correct ? "correct" : "wrong");
  $("feedback").textContent = correct ? "¡Correcto!" : "Incorrecto…";
  correct ? reactCorrect() : reactWrong();

  setTimeout(() => {
    if (!correct) return lose();
    current++;
    current < QUESTIONS.length ? renderQuestion() : win();
  }, 900);
}

function win() {
  $("gift-code").textContent = CONFIG.giftCode;
  celebrate();
  // pequeña pausa para que se vea abrirse el cofre antes de enseñar el código
  setTimeout(() => showScreen("screen-win"), 1600);
}

function lose() {
  defeat();
  $("lose-text").textContent = CONFIG.loseText;
  showScreen("screen-lose");
}

$("intro-title").textContent = CONFIG.introTitle;
$("intro-text").textContent = CONFIG.introText;
$("btn-start").addEventListener("click", () => {
  current = 0;
  renderQuestion();
  showScreen("screen-question");
});