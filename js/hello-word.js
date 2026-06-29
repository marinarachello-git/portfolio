const DESKTOP_QUERY = "(min-width: 769px)";
const ROTATION_MS = 140;
const DEFAULT_WORD = "hello!";

const WORDS = [
  "ciao!",
  "hola!",
  "bonjour!",
  "salut!",
  "hallo!",
  "olá!",
  "Привет!",
  "Merhaba!",
  "Salam!",
  "Namaste!",
  "Konnichiwa!",
  "Ni hao!",
  "Annyeong!",
  "Sawadee!",
  "Shalom!",
  "Jambo!",
  "Ahoj!",
  "Yassas!",
  "Aloha!",
  "Dia dhuit!",
  "Zdravo!",
  "Kamusta!",
  "Habari!",
  "Xin chào!",
  "Tere!",
  "Sveiki!",
  "Labas!",
  "Dobrý den!",
  "Üdvözlöm!",
  "Buna!",
  "Dzień dobry!",
  "Გამარჯობა!",
  "Barev!",
  "Marhaba!",
  "Hujambo!",
];

export function initHelloWord(titleEl) {
  if (!titleEl) return;

  const helloEl = titleEl.querySelector(".hello-word");
  if (!helloEl) return;

  const desktopMq = window.matchMedia(DESKTOP_QUERY);
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  let interval = null;
  let index = 0;

  const clearRotation = () => {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
    helloEl.textContent = DEFAULT_WORD;
  };

  const onMouseEnter = () => {
    if (!desktopMq.matches || reducedMq.matches) return;

    index = 0;
    interval = setInterval(() => {
      helloEl.textContent = WORDS[index % WORDS.length];
      index += 1;
    }, ROTATION_MS);
  };

  const onMouseLeave = () => {
    clearRotation();
  };

  titleEl.addEventListener("mouseenter", onMouseEnter);
  titleEl.addEventListener("mouseleave", onMouseLeave);

  const onMqChange = () => {
    if (!desktopMq.matches || reducedMq.matches) {
      clearRotation();
    }
  };

  desktopMq.addEventListener("change", onMqChange);
  reducedMq.addEventListener("change", onMqChange);
}
