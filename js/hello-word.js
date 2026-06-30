const DESKTOP_QUERY = "(min-width: 769px)";
const MOBILE_QUERY = "(max-width: 768px)";
const DESKTOP_ROTATION_MS = 140;
const MOBILE_HELLO_PAUSE_MS = 3000;
const MOBILE_WORD_MS = 150;
export const DEFAULT_WORD = "hello!";

export const WORDS = [
  "ciao!",
  "hola!",
  "bonjour!",
  "salut!",
  "hallo!",
  "olá!",
  "Привет!",
  "merhaba!",
  "salam!",
  "namaste!",
  "konnichiwa!",
  "ni hao!",
  "annyeong!",
  "sawadee!",
  "shalom!",
  "jambo!",
  "ahoj!",
  "yassas!",
  "aloha!",
  "dia dhuit!",
  "zdravo!",
  "kamusta!",
  "habari!",
  "xin chào!",
  "tere!",
  "sveiki!",
  "labas!",
  "üdvözlöm!",
  "buna!",
  "Გამარჯობა!",
  "barev!",
  "marhaba!",
  "hujambo!",
];

export function initHelloWord(titleEl) {
  if (!titleEl) return;

  const helloEl = titleEl.querySelector(".hello-word");
  if (!helloEl) return;

  const desktopMq = window.matchMedia(DESKTOP_QUERY);
  const mobileMq = window.matchMedia(MOBILE_QUERY);
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  let desktopInterval = null;
  let desktopIndex = 0;
  let mobilePauseTimeout = null;
  let mobileCycleInterval = null;

  const resetHello = () => {
    helloEl.textContent = DEFAULT_WORD;
  };

  const clearDesktopRotation = () => {
    if (desktopInterval !== null) {
      clearInterval(desktopInterval);
      desktopInterval = null;
    }
    desktopIndex = 0;
  };

  const clearMobileCycle = () => {
    if (mobilePauseTimeout !== null) {
      clearTimeout(mobilePauseTimeout);
      mobilePauseTimeout = null;
    }

    if (mobileCycleInterval !== null) {
      clearInterval(mobileCycleInterval);
      mobileCycleInterval = null;
    }
  };

  const clearAll = () => {
    clearDesktopRotation();
    clearMobileCycle();
    resetHello();
  };

  const startMobileCycle = () => {
    clearMobileCycle();
    resetHello();

    let index = 0;

    const cycleWords = () => {
      resetHello();

      mobilePauseTimeout = setTimeout(() => {
        mobilePauseTimeout = null;

        mobileCycleInterval = setInterval(() => {
          helloEl.textContent = WORDS[index % WORDS.length];
          index += 1;

          if (index >= WORDS.length) {
            clearInterval(mobileCycleInterval);
            mobileCycleInterval = null;
            index = 0;
            cycleWords();
          }
        }, MOBILE_WORD_MS);
      }, MOBILE_HELLO_PAUSE_MS);
    };

    cycleWords();
  };

  const onMouseEnter = () => {
    if (!desktopMq.matches || reducedMq.matches) return;

    desktopIndex = 0;
    desktopInterval = setInterval(() => {
      helloEl.textContent = WORDS[desktopIndex % WORDS.length];
      desktopIndex += 1;
    }, DESKTOP_ROTATION_MS);
  };

  const onMouseLeave = () => {
    clearDesktopRotation();
    resetHello();
  };

  const syncMode = () => {
    clearAll();

    if (reducedMq.matches) return;

    if (mobileMq.matches) {
      startMobileCycle();
    }
  };

  titleEl.addEventListener("mouseenter", onMouseEnter);
  titleEl.addEventListener("mouseleave", onMouseLeave);

  desktopMq.addEventListener("change", syncMode);
  mobileMq.addEventListener("change", syncMode);
  reducedMq.addEventListener("change", syncMode);

  syncMode();
}
