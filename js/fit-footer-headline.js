const MAX_FONT_SIZE = 192;
const MIN_FONT_SIZE = 32;
const PROBE_FONT_SIZE = 100;

export function initFitFooterHeadline(headline) {
  if (!headline) return;

  const footer = headline.closest("footer");
  if (!footer) return;

  const getAvailableWidth = () => {
    const footerStyles = getComputedStyle(footer);
    const headlineStyles = getComputedStyle(headline);
    const footerPadding =
      parseFloat(footerStyles.paddingLeft) + parseFloat(footerStyles.paddingRight);
    const headlinePadding =
      parseFloat(headlineStyles.paddingLeft) + parseFloat(headlineStyles.paddingRight);
    const width = footer.clientWidth - footerPadding - headlinePadding - 4;
    return Math.max(0, width);
  };

  const getTextWidth = () => {
    const range = document.createRange();
    range.selectNodeContents(headline);
    return range.getBoundingClientRect().width;
  };

  const fit = () => {
    const maxWidth = getAvailableWidth();
    if (maxWidth <= 0) return;

    headline.style.fontSize = "";

    headline.style.fontSize = `${PROBE_FONT_SIZE}px`;
    const probeWidth = getTextWidth();
    if (probeWidth <= 0) return;

    let size = PROBE_FONT_SIZE * (maxWidth / probeWidth);
    size = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
    headline.style.fontSize = `${size}px`;

    while (getTextWidth() > maxWidth + 0.5 && size > MIN_FONT_SIZE) {
      size -= 0.5;
      headline.style.fontSize = `${size}px`;
    }
  };

  const scheduleFit = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(fit);
    });
  };

  scheduleFit();

  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleFit);
  }

  window.addEventListener("resize", scheduleFit, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleFit);
    observer.observe(footer);
  }
}
