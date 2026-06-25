const MAX_FONT_SIZE = 288;
const MIN_FONT_SIZE = 48;
const PROBE_FONT_SIZE = 100;
const TABLET_QUERY = "(max-width: 768px)";

export function initFitHeroTitle(title) {
  if (!title) return;

  const nameLine = title.querySelector(".intro__title-line--name");
  const greetingLine = title.querySelector(".intro__title-line--greeting");
  const intro = title.closest(".intro");
  if (!nameLine || !greetingLine || !intro) return;

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

  const applyTitleSize = (size) => {
    title.style.fontSize = `${size}px`;
  };

  const fit = () => {
    if (tabletMq.matches) {
      clearFontSizes();
      title.classList.remove("is-fitted");
      return;
    }

    const maxWidth = getAvailableWidth();
    if (maxWidth <= 0) return;

    clearFontSizes();

    applyTitleSize(PROBE_FONT_SIZE);
    const probeWidth = getTextWidth(nameLine);
    if (probeWidth <= 0) return;

    let size = PROBE_FONT_SIZE * (maxWidth / probeWidth);
    size = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
    applyTitleSize(size);

    while (getTextWidth(nameLine) > maxWidth + 0.5 && size > MIN_FONT_SIZE) {
      size -= 0.5;
      applyTitleSize(size);
    }

    if (getTextWidth(nameLine) > maxWidth) {
      applyTitleSize(Math.max(MIN_FONT_SIZE, size - 1));
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
  }
}
