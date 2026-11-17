// Todo lo que hay que personalizar está en este archivo.

const CONFIG = {
  introTitle: "¡Hola Belen! Soy tu amigo invisible je je je... ¿Quieres jugar a un juego?",
  introText: "Si quieres conseguir el código del candado de tu regalo, vas atener que responder correctamente a 5 preguntas sobre tus amigos NO invisbles",
  giftCode: "1996", // <-- CHANGE IT 
  loseText: "Si adivinas quién es tu amigo invisible (que ha montado este juego chachifantástico) decidirá si te revela el código, o no..."
};

// answer = posición de la respuesta correcta (empieza en 0)
// who = amigo que hace la pregunta: claudia, maria, nuria, paula o sergio
const QUESTIONS = [
  { who: "claudia", q: "¿En qué día se celebró la boda de Claudia?", options: ["26/06/2026", "26/07/2026", "27/06/2026", "27/07/2026"], answer: 2 },
  { who: "maria",   q: "¿Cual es el animal marino preferido de Maria?", options: ["Manatí", "Delfín", "Pingüino", "Foca"], answer: 0 },
  { who: "nuria",   q: "¿Qué famosa obra de arte hay en casa de Nuria?", options: ["El Guernica", "La Mona Lisa", "Las Meninas", "El grito"], answer: 1 },
  { who: "paula",   q: "¿Dónde ha estado de viaje Paula estas Navidades?", options: ["Korea", "Tailandia", "Sri Lanka", "Vietnam"], answer: 3 },
  { who: "sergio",  q: "¿Cuál es la saga de películas preferida de Sergio?", options: ["Star Trek", "El Señor de los Anillos", "Star Wars", "Dune"], answer: 2 }
];