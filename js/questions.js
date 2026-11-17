// Todo lo que hay que personalizar está en este archivo.

const CONFIG = {
  introTitle: "¡Hola Belen! Aquí tu amigo invisible ¿Quieres jugar a un juego?",
  introText: "Si quieres conseguir el código del candado de tu regalo, vas atener que responder correctamente a 5 preguntas sobre tus amigos no invisbles",
  giftCode: "1996", // <-- CHANGE IT 
  loseText: "Si adivinas quién es tu amigo invisible (que ha montado este juego chachifantástico) decidirá si te revela el código, o no..."
};

// answer = posición de la respuesta correcta (empieza en 0)
// who = amigo que hace la pregunta: claudia, maria, nuria, paula o sergio
const QUESTIONS = [
  { who: "claudia", q: "¿En qué día se celebró la boda de Claudia?", options: ["26/06/2026", "26/07/2026", "27/06/2026", "27/07/2026"], answer: 2 },
  { who: "maria",   q: "Maria", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 1 },
  { who: "nuria",   q: "Nuria", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 2 },
  { who: "paula",   q: "Paula", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 3 },
  { who: "sergio",  q: "Sergio", options: ["Opción A", "Opción B", "Opción C", "Opción D"], answer: 0 }
];