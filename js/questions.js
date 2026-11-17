// Todo lo que hay que personalizar está en este archivo.

const CONFIG = {
  introTitle: "¡Hola Belen! ¿Quieres jugar a un juego?",
  introText: "Responde correctamente a 5 preguntas sobre tus amigos no invisbles para conseguir el código del candado de tu regalo",
  giftCode: "1234", // <-- cambia esto por el código real de la caja
  loseText: "Si adivinas quién es tu amigo invisible que ha montado este juego chachifantástico, este decidirá ahora si te revela el código, o no..."
};

// answer = posición de la respuesta correcta (empieza en 0)
// who = amigo que hace la pregunta: claudia, maria, nuria, paula o sergio
const QUESTIONS = [
  { who: "claudia", q: "Pregunta 1", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 0 },
  { who: "maria",   q: "Pregunta 2", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 1 },
  { who: "nuria",   q: "Pregunta 3", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 2 },
  { who: "paula",   q: "Pregunta 4", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 3 },
  { who: "sergio",  q: "Pregunta 5", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 0 }
];