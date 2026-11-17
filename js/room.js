// Habitación estilo Habbo dibujada con código (pixel art, sin imágenes externas).
// Los sprites (personaje, escritorio, cofre, plantas) son <canvas> independientes
// encima de la habitación, para poder animarlos con CSS en la fase 3.

const W = 160, H = 104;   // resolución interna; el CSS la escala sin suavizar
const N = 6;              // tiles por lado del suelo
const OX = 80, OY = 48;   // vértice superior del suelo
const WALL_H = 36;        // alto de las paredes

const COLORS = {
  floorA: "#d9b57a", floorB: "#c9a266",
  rugA: "#b0404f", rugB: "#93323f",
  slabL: "#8a6a3a", slabR: "#6e5430",
  wallL: "#5b6fa0", wallR: "#7186b8",
  skirtL: "#46587f", skirtR: "#5a6e9c",
  trim: "#e8ecf7"
};

// ---------- Amigos: cuerpo común + cabeza propia de cada uno ----------
const BODY = [
  "..ttttttttt..",
  ".ttttttttttt.",
  ".ttttttttttt.",
  ".sttttttttts.",
  "..ttttttttt..",
  "..ppppppppp..",
  "..pppp.pppp..",
  "..pppp.pppp..",
  "..pppp.pppp..",
  "..bbbb.bbbb.."
];

// hair = lista de [fila del cuerpo, columnas] donde el pelo cae sobre los hombros
function person(head, pal, hair = []) {
  const body = BODY.map((r) => r.split(""));
  hair.forEach(([row, cols]) => cols.forEach((c) => { body[row][c] = "h"; }));
  return { pal: { b: "#1a1a22", ...pal }, rows: [...head, ...body.map((r) => r.join(""))] };
}

const SPRITES = {
  // Anonymous: sudadera negra y máscara blanca (bigote, mejillas rojas, perilla)
  avatar: {
    pal: { k: "#1b1b22", K: "#34344a", m: "#f1ede4", b: "#111111", e: "#111111", r: "#d9534f" },
    rows: [
      "...kkkkkkk...",
      "..kkkkkkkkk..",
      ".kkkmmmmmkkk.",
      ".kkmmmmmmmkk.",
      ".kkmbbmbbmkk.",
      ".kkmemmmemkk.",
      ".kkmrmmmrmkk.",
      ".kkmbbbbbmkk.",
      "..kmmmbmmmk..",
      "..kkmmmmmkk..",
      "...kkkkkkk...",
      "..kkkkkkkkk..",
      ".kkkkkkkkkkk.",
      "kKkkkkkkkkkKk",
      "kkkkkkkkkkkkk"
    ]
  },
  // Escritorio visto de frente con un portátil de espaldas (logo brillante)
  desk: {
    pal: { S: "#6b7380", s: "#9aa3b0", g: "#ffffff", l: "#b8793a", w: "#8a5a2b", d: "#4a2c12" },
    rows: [
      ".".repeat(7) + "SSSSSSSSSSSS" + ".".repeat(7),
      ".".repeat(7) + "SssssssssssS" + ".".repeat(7),
      ".".repeat(7) + "SssssggssssS" + ".".repeat(7),
      ".".repeat(7) + "SssssggssssS" + ".".repeat(7),
      ".".repeat(7) + "SssssssssssS" + ".".repeat(7),
      ".".repeat(7) + "SssssssssssS" + ".".repeat(7),
      ".".repeat(7) + "SSSSSSSSSSSS" + ".".repeat(7),
      "l".repeat(26),
      "w".repeat(26),
      ".d" + "w".repeat(22) + "d.",
      ".d" + "w".repeat(22) + "d.",
      ".d" + "w".repeat(22) + "d.",
      ".dd" + ".".repeat(20) + "dd.",
      ".dd" + ".".repeat(20) + "dd."
    ]
  },
  chest: {
    pal: { d: "#4a2c12", l: "#b8793a", w: "#8a5a2b", g: "#f5c542" },
    rows: [
      "..dddddddddd..",
      ".dlllllllllld.",
      ".dlllllllllld.",
      ".dddddddddddd.",
      ".dwwwwggwwwwd.",
      ".dwwwwggwwwwd.",
      ".dwwwwwwwwwwd.",
      ".dwwwwwwwwwwd.",
      ".dddddddddddd."
    ]
  },
  plant: {
    pal: { g: "#3f9e4a", d: "#2a6b32", p: "#b5651d" },
    rows: [
      "...g.g...",
      ".g.ggg.g.",
      "..ggggg..",
      ".ggggggg.",
      "..ggdgg..",
      "....d....",
      "....d....",
      "..ppppp..",
      "..ppppp..",
      "...ppp..."
    ]
  }
};

Object.assign(SPRITES, {
  // Claudia: piel morena, ojos negros, pelo rizado negro y voluminoso
  claudia: person([
    "..hh.hhh.hh..",
    ".hhhhhhhhhhh.",
    "hhhhhhhhhhhhh",
    "hhh" + "hsssssh" + "hhh",
    "hhh" + "sessses" + "hhh",
    "hhh" + "sssssss" + "hhh",
    "hhh" + "sssmsss" + "hhh",
    ".hhh" + "sssss" + "hhh.",
    ".hh" + "..sss.." + "hh."
  ], { h: "#17110f", s: "#b9784a", e: "#0d0d0d", m: "#8c3b3b", t: "#e8c13a", p: "#2f3f6b" }),

  // María: pelo largo castaño muy claro, piel blanca con pecas, ojos azules
  maria: person([
    "...hhhhhhh...",
    "..hhhhhhhhh..",
    ".hhhhhhhhhhh.",
    ".hh" + "hsssssh" + "hh.",
    ".hh" + "sessses" + "hh.",
    ".hh" + "sfsssfs" + "hh.",
    ".hh" + "sfsmsfs" + "hh.",
    ".hhh" + "sssss" + "hhh.",
    ".hhh" + ".sss." + "hhh."
  ], { h: "#cfa779", s: "#f7e0d2", f: "#c98e6a", e: "#3b7fd6", m: "#c4585f", t: "#7fb2e5", p: "#d8d0c0" },
  [[0, [2, 10]], [1, [2, 10]], [2, [2, 10]]]),

  // Nuria: pelo castaño con mechas rubias, ojos castaños
  nuria: person([
    "...hhhhhhh...",
    "..hhHhhhHhh..",
    ".hhHhhhhhHhh.",
    ".hh" + "hsssssh" + "hh.",
    ".hh" + "sessses" + "hh.",
    ".hh" + "sssssss" + "hh.",
    ".hh" + "sssmsss" + "hh.",
    ".hhh" + "sssss" + "hhh.",
    ".hHh" + ".sss." + "hHh."
  ], { h: "#7a4a2a", H: "#d9b36a", s: "#f0c8a0", e: "#7b4a24", m: "#b5454e", t: "#58a46a", p: "#3b3b4f" },
  [[0, [2, 10]], [1, [2, 10]]]),

  // Paula: pelo negro largo y frondoso, piel pálida, ojos negros
  paula: person([
    ".hhhhhhhhhhh.",
    "hhhhhhhhhhhhh",
    "hhhhhhhhhhhhh",
    "hhh" + "hsssssh" + "hhh",
    "hhh" + "sessses" + "hhh",
    "hhh" + "sssssss" + "hhh",
    "hhh" + "sssmsss" + "hhh",
    "hhhh" + "sssss" + "hhhh",
    "hhhh" + ".sss." + "hhhh"
  ], { h: "#14121a", s: "#f4e2d8", e: "#0d0d0d", m: "#b5454e", t: "#8a5cc2", p: "#1f1f2b" },
  [[0, [2, 3, 9, 10]], [1, [2, 3, 9, 10]], [2, [2, 10]], [3, [2, 10]]]),

  // Sergio: pelo castaño claro, un poco largo y de punta, ojos castaños, nariz picuda
  sergio: person([
    ".h.h..h..h.h.",
    ".hhhhhhhhhhh.",
    ".hhhhhhhhhhh.",
    ".hh" + "hsssssh" + "hh.",
    ".hh" + "sessses" + "hh.",
    "..h" + "sssnsss" + "h..",
    "..s" + "sssNsss" + "s..",
    "..." + "sssmsss" + "...",
    "..." + "sssssss" + "...",
    "....." + "sss" + "....."
  ], { h: "#b88a5a", s: "#f0c8a0", n: "#d9a273", N: "#c4895c", e: "#5a3a1e", m: "#b5454e", t: "#e07b39", p: "#2f3f6b" })
});

const stage = document.getElementById("stage");
const room = document.getElementById("room");
const ctx = room.getContext("2d");

function diamond(c, x, y, color) {
  c.fillStyle = color;
  for (let r = 0; r < 8; r++) {
    const half = (r < 4 ? r + 1 : 8 - r) * 2;
    c.fillRect(x - half, y + r, half * 2, 1);
  }
}

// centro de un tile (i hacia abajo-derecha, j hacia abajo-izquierda)
function tile(i, j) {
  return { x: OX + (i - j) * 8, y: OY + (i + j) * 4 + 4 };
}

function drawFloor() {
  // grosor del suelo
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      diamond(ctx, OX + (i - j) * 8, OY + (i + j) * 4 + 4, i >= j ? COLORS.slabR : COLORS.slabL);
    }
  }
  // baldosas y alfombra
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const rug = i >= 2 && i <= 4 && j >= 2 && j <= 4;
      const even = (i + j) % 2 === 0;
      const color = rug ? (even ? COLORS.rugA : COLORS.rugB) : (even ? COLORS.floorA : COLORS.floorB);
      diamond(ctx, OX + (i - j) * 8, OY + (i + j) * 4, color);
    }
  }
}

function drawWalls() {
  const len = N * 8;
  for (let dx = 0; dx < len; dx++) {
    const by = OY + (dx >> 1);   // y de la base de la pared en esta columna
    const xl = OX - 1 - dx;      // pared izquierda
    const xr = OX + dx;          // pared derecha

    ctx.fillStyle = COLORS.wallL;
    ctx.fillRect(xl, by - WALL_H, 1, WALL_H);
    ctx.fillStyle = COLORS.skirtL;
    ctx.fillRect(xl, by - 3, 1, 3);
    ctx.fillStyle = COLORS.trim;
    ctx.fillRect(xl, by - WALL_H, 1, 2);

    ctx.fillStyle = COLORS.wallR;
    ctx.fillRect(xr, by - WALL_H, 1, WALL_H);
    ctx.fillStyle = COLORS.skirtR;
    ctx.fillRect(xr, by - 3, 1, 3);
    ctx.fillStyle = COLORS.trim;
    ctx.fillRect(xr, by - WALL_H, 1, 2);
  }

  // cuadro en la pared izquierda
  for (let dx = 16; dx < 30; dx++) {
    const x = OX - 1 - dx, by = OY + (dx >> 1);
    ctx.fillStyle = "#2d2d44";
    ctx.fillRect(x, by - 31, 1, 17);
    if (dx > 16 && dx < 29) {
      ctx.fillStyle = "#f2d16b";
      ctx.fillRect(x, by - 29, 1, 13);
      ctx.fillStyle = "#e2574c";
      ctx.fillRect(x, by - 24, 1, 3);
    }
  }
}

// Pantalla de ordenador en la pared derecha: líneas de "código" que suben solas.
// screenMode "denied" la pone en rojo (cuando se pierde).
let screenFrame = 0;
let screenMode = "ok";

function drawScreen() {
  const bad = screenMode === "denied";
  for (let dx = 12; dx < 38; dx++) {
    const x = OX + dx, by = OY + (dx >> 1);
    ctx.fillStyle = "#1a1a24";
    ctx.fillRect(x, by - 34, 1, 22);
    if (dx === 12 || dx === 37) continue;   // bordes del marco
    ctx.fillStyle = bad ? "#1a0505" : "#04130a";
    ctx.fillRect(x, by - 32, 1, 18);
    ctx.fillStyle = bad ? "#ff4d4d" : "#3dff7a";
    for (let r = 0; r < 6; r++) {
      const s = r + screenFrame;              // cada paso las líneas suben una fila
      const len = 6 + ((s * 37) % 17);        // largo de cada línea
      const k = dx - 13;
      if (k < len && (k + s * 3) % 7 !== 6) ctx.fillRect(x, by - 30 + r * 3, 1, 1);
    }
  }
}

function makeSprite(def) {
  const rows = def.rows;
  const c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const g = c.getContext("2d");
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (def.pal[ch]) {
        g.fillStyle = def.pal[ch];
        g.fillRect(x, y, 1, 1);
      }
    });
  });
  return c;
}

function shadow(cx, cy, w) {
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(Math.round(cx - w / 2), cy, w, 2);
  ctx.fillRect(Math.round(cx - w / 2) + 1, cy - 1, w - 2, 1);
  ctx.fillRect(Math.round(cx - w / 2) + 1, cy + 2, w - 2, 1);
}

// coloca un sprite con los pies en (cx, bottom), en coordenadas del lienzo
function putSprite(name, id, cx, bottom) {
  const c = makeSprite(SPRITES[name]);
  c.id = id;
  c.className = "sprite";
  // 1 píxel del lienzo en % del propio sprite, para mover los sprites de píxel en píxel desde el CSS
  c.style.setProperty("--px", (100 / c.width) + "%");
  c.style.setProperty("--py", (100 / c.height) + "%");
  c.style.width = (c.width / W * 100) + "%";
  c.style.left = (Math.round(cx - c.width / 2) / W * 100) + "%";
  c.style.top = ((bottom - c.height) / H * 100) + "%";
  stage.appendChild(c);
  return c;
}

// coloca un sprite en el centro de un tile, con sombra
function place(name, id, i, j) {
  const t = tile(i, j);
  const bottom = t.y + 2;
  shadow(t.x, bottom - 1, SPRITES[name].rows[0].length);
  return putSprite(name, id, t.x, bottom);
}

const REDUCED = typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

drawFloor();
drawWalls();
drawScreen();
if (!REDUCED) {
  setInterval(() => { screenFrame++; drawScreen(); }, 450);
}

// el orden de creación es el orden de capas: lo último queda por delante
let chestEl = place("chest", "chest", 2, 0);
place("plant", "plant-left", 0, 5);
place("plant", "plant-right", 5, 0);

// Anonymous sentado tras el escritorio: se crea antes para quedar detrás del portátil
const d = tile(3, 3);
const deskBottom = d.y + 2;
const deskTop = deskBottom - SPRITES.desk.rows.length;
shadow(d.x, deskBottom - 1, SPRITES.desk.rows[0].length);
const avatarEl = putSprite("avatar", "avatar", d.x, deskTop + 2);
avatarEl.classList.add("bob");
putSprite("desk", "desk", d.x, deskBottom);

// ---------- Amigo de la pregunta actual ----------
let friendEl = null;

function hideFriend() {
  if (friendEl) {
    friendEl.remove();
    friendEl = null;
  }
}

// muestra al amigo de pie a la izquierda de la habitación (sustituye al anterior)
function showFriend(name) {
  hideFriend();
  const def = SPRITES[name];
  if (!def) return;

  const base = makeSprite(def);
  const c = document.createElement("canvas");
  c.width = base.width;
  c.height = base.height + 2;   // 2 filas extra para la sombra
  const g = c.getContext("2d");
  g.fillStyle = "rgba(0,0,0,0.18)";
  g.fillRect(2, base.height, c.width - 4, 1);
  g.fillRect(3, base.height + 1, c.width - 6, 1);
  g.drawImage(base, 0, 0);

  const t = tile(1, 4);
  const bottom = t.y + 3;
  c.id = "friend";
  c.className = "sprite friend-enter";
  c.style.setProperty("--px", (100 / c.width) + "%");
  c.style.setProperty("--py", (100 / c.height) + "%");
  c.style.width = (c.width / W * 100) + "%";
  c.style.left = (Math.round(t.x - c.width / 2) / W * 100) + "%";
  c.style.top = ((bottom - c.height) / H * 100) + "%";
  stage.appendChild(c);
  friendEl = c;
}

// ---------- Animaciones y reacciones ----------

// cofre abierto, con el tesoro brillando (i = madera interior, G = brillo)
SPRITES.chestOpen = {
  pal: { d: "#4a2c12", i: "#3a2310", w: "#8a5a2b", g: "#f5c542", G: "#fff3b0" },
  rows: [
    "..dddddddddd..",
    ".diiiiiiiiiid.",
    ".diiiiiiiiiid.",
    ".diiiiiiiiiid.",
    ".dddddddddddd.",
    ".dggggggggggd.",
    ".dgGgGgggGgGd.",
    ".dddddddddddd.",
    ".dwwwwggwwwwd.",
    ".dwwwwggwwwwd.",
    ".dwwwwwwwwwwd.",
    ".dwwwwwwwwwwd.",
    ".dddddddddddd."
  ]
};

// reproduce una animación una vez y luego vuelve al balanceo de reposo
function playOnce(el, name) {
  if (!el || REDUCED) return;
  el.classList.remove("bob", "friend-enter", "hop", "nod", "shake");
  void el.offsetWidth;   // reinicia la animación aunque se repita
  el.classList.add(name);
  el.addEventListener("animationend", function done(e) {
    if (e.animationName !== name) return;
    el.removeEventListener("animationend", done);
    el.classList.remove(name);
    el.classList.add("bob");
  });
}

// chispas cuadradas que salen en círculo desde (cx, cy), en coordenadas del lienzo
function burst(cx, cy, count, colors) {
  if (REDUCED) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    const ang = (i / count) * Math.PI * 2;
    s.className = "spark";
    s.style.left = (cx / W * 100) + "%";
    s.style.top = (cy / H * 100) + "%";
    s.style.background = colors[i % colors.length];
    s.style.setProperty("--dx", Math.round(Math.cos(ang) * 4));
    s.style.setProperty("--dy", Math.round(Math.sin(ang) * 4));
    s.addEventListener("animationend", () => s.remove());
    stage.appendChild(s);
  }
}

function confetti() {
  if (REDUCED) return;
  const colors = ["#f5c542", "#e2574c", "#5bb83b", "#4d9be6", "#ffffff", "#c06be6"];
  for (let i = 0; i < 32; i++) {
    const p = document.createElement("div");
    p.className = "confetti";
    p.style.left = (Math.random() * 96 + 2) + "%";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.8) + "s";
    p.style.setProperty("--sx", Math.round(Math.random() * 6 - 3));
    p.addEventListener("animationend", () => p.remove());
    stage.appendChild(p);
  }
}

function flashStage() {
  if (REDUCED) return;
  stage.classList.remove("flash-wrong");
  void stage.offsetWidth;
  stage.classList.add("flash-wrong");
  setTimeout(() => stage.classList.remove("flash-wrong"), 600);
}

// respuesta correcta: el amigo salta con chispas y Anonymous asiente
function reactCorrect() {
  playOnce(friendEl, "hop");
  playOnce(avatarEl, "nod");
  const t = tile(1, 4);
  burst(t.x, t.y - 17, 10, ["#f5c542", "#ffffff", "#ffe27a"]);
}

// respuesta incorrecta: el amigo niega con la cabeza y la sala parpadea en rojo
function reactWrong() {
  playOnce(friendEl, "shake");
  playOnce(avatarEl, "shake");
  flashStage();
}

// las 5 correctas: se abre el cofre, chispas y confeti
function celebrate() {
  hideFriend();
  const t = tile(2, 0);
  chestEl.remove();
  chestEl = putSprite("chestOpen", "chest", t.x, t.y + 2);
  chestEl.classList.add("chest-open");
  burst(t.x, t.y - 8, 14, ["#f5c542", "#ffffff", "#ffe27a"]);
  confetti();
  playOnce(avatarEl, "hop");
}

// has fallado: la pantalla de la pared se pone en rojo
function defeat() {
  hideFriend();
  screenMode = "denied";
  drawScreen();
  flashStage();
}