import { DEFAULT_WORD, WORDS } from "./hello-word.js";

const MAX_FONT_SIZE = 288;
const MIN_FONT_SIZE = 48;
const MOBILE_MIN_FONT_SIZE = 32;
const PROBE_FONT_SIZE = 100;
const TABLET_QUERY = "(max-width: 768px)";

export function initFitHeroTitle(title) {
  if (!title) return;

  const nameLine = title.querySelector(".intro__title-line--name");
  const greetingLine = title.querySelector(".intro__title-line--greeting");
  const helloEl = greetingLine?.querySelector(".hello-word");
  const intro = title.closest(".intro");
  if (!nameLine || !greetingLine || !helloEl || !intro) return;

  const tabletMq = window.matchMedia(TABLET_QUERY);

  const clearFontSizes = () => {
    title.style.fontSize = "";
    nameLine.style.fontSize = "";
    greetingLine.style.fontSize = "";
  };

  const getAvailableWidth = () => {
    const viewportWidth = document.documentElement.clientWidth;
    const containerWidth = Math.min(intro.clientWidth, viewportWidth);
    if (containerWidth <= 0) return 0;

    if (tabletMq.matches) {
      const titleWidth = title.clientWidth;
      if (titleWidth > 0) return titleWidth - 2;

      const introStyles = getComputedStyle(intro);
      const padding =
        parseFloat(introStyles.paddingLeft) + parseFloat(introStyles.paddingRight);
      return containerWidth - padding - 4;
    }

    const styles = getComputedStyle(title);
    const padding =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    return containerWidth - padding;
  };

  const getTextWidth = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().width;
  };

  const getTitleContentWidth = () => {
    const nameWidth = getTextWidth(nameLine);
    const savedWord = helloEl.textContent;
    let maxGreetingWidth = 0;

    for (const word of [DEFAULT_WORD, ...WORDS]) {
      helloEl.textContent = word;
      maxGreetingWidth = Math.max(maxGreetingWidth, getTextWidth(helloEl));
    }

    helloEl.textContent = savedWord;
    return Math.max(nameWidth, maxGreetingWidth);
  };

  const applyTitleSize = (size) => {
    title.style.fontSize = `${size}px`;
  };

  const fit = () => {
    const maxWidth = getAvailableWidth();
    if (maxWidth <= 0) return;

    const isMobile = tabletMq.matches;
    const minSize = isMobile ? MOBILE_MIN_FONT_SIZE : MIN_FONT_SIZE;
    const maxSize = MAX_FONT_SIZE;

    clearFontSizes();

    applyTitleSize(PROBE_FONT_SIZE);
    const probeWidth = getTitleContentWidth();
    if (probeWidth <= 0) return;

    let size = PROBE_FONT_SIZE * (maxWidth / probeWidth);
    size = Math.max(minSize, Math.min(maxSize, size));
    applyTitleSize(size);

    while (getTitleContentWidth() > maxWidth + 0.5 && size > minSize) {
      size -= 0.5;
      applyTitleSize(size);
    }

    while (getTitleContentWidth() < maxWidth - 1 && size < maxSize) {
      size += 0.5;
      applyTitleSize(size);
      if (getTitleContentWidth() > maxWidth + 0.5) {
        size -= 0.5;
        applyTitleSize(size);
        break;
      }
    }

    if (getTitleContentWidth() > maxWidth) {
      applyTitleSize(Math.max(minSize, size - 1));
    }

    title.classList.add("is-fitted");
  };

  const scheduleFit = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(fit);
    });
  };

  const run = async () => {
    scheduleFit();

    if (document.fonts?.ready) {
      await document.fonts.ready;
      scheduleFit();
    }
  };

  run();

  window.addEventListener("resize", scheduleFit, { passive: true });
  tabletMq.addEventListener("change", scheduleFit);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleFit);
    observer.observe(intro);
    observer.observe(title);
  }
}
