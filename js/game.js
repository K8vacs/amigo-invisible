const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let current = 0;
let locked = false;   // true mientras corre una animación: ignora los clics

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

function renderQuestion() {
  const item = QUESTIONS[current];
  locked = false;
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

// Empezar: la ventana crece, entra el primer amigo y vuelve a su tamaño
async function startGame() {
  if (locked) return;
  locked = true;
  current = 0;
  showFriend(QUESTIONS[0].who);
  await cameraTo("friend");
  await sleep(700);
  await cameraOut();
  renderQuestion();
  showScreen("screen-question");
}

// Responder: plano cerrado con la reacción y, si acierta, entra el siguiente amigo
async function answer(index, btn) {
  if (locked) return;
  locked = true;

  const correct = index === QUESTIONS[current].answer;
  btn.classList.add(correct ? "correct" : "wrong");
  $("feedback").textContent = correct ? "¡Correcto!" : "Incorrecto…";

  await cameraTo("friend");
  correct ? reactCorrect() : reactWrong();
  await sleep(1000);

  if (!correct) {
    await cameraTo("screen");   // la cámara se va a la pantalla, que se pone en rojo
    defeat();
    await sleep(1200);
    await cameraOut();
    return lose();
  }

  if (current === QUESTIONS.length - 1) return win();

  current++;
  showFriend(QUESTIONS[current].who);
  await sleep(900);
  await cameraOut();
  renderQuestion();
}

async function win() {
  $("gift-code").textContent = CONFIG.giftCode;
  await cameraTo("chest");
  celebrate();
  await sleep(1800);
  await cameraOut();
  showScreen("screen-win");
}

function lose() {
  $("lose-text").textContent = CONFIG.loseText;
  showScreen("screen-lose");
}

$("intro-title").textContent = CONFIG.introTitle;
$("intro-text").textContent = CONFIG.introText;
$("btn-start").addEventListener("click", startGame);