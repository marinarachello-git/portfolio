export function initFooterReveal() {
  const footer = document.querySelector("footer");
  const spacer = document.querySelector(".footer-spacer");
  if (!footer || !spacer) return;

  const syncSpacerHeight = () => {
    const height = footer.offsetHeight;
    spacer.style.height = `${height}px`;
    spacer.style.minHeight = `${height}px`;
  };

  const setRevealed = (revealed) => {
    footer.classList.toggle("is-revealed", revealed);
  };

  const isNearPageBottom = () => {
    const scrollBottom = window.scrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight;
    return scrollBottom >= pageBottom - 2;
  };

  const updateRevealed = () => {
    setRevealed(isNearPageBottom());
  };

  const scheduleSync = () => {
    window.requestAnimationFrame(() => {
      syncSpacerHeight();
      updateRevealed();
    });
  };

  scheduleSync();

  window.addEventListener("resize", scheduleSync, { passive: true });
  window.addEventListener("load", scheduleSync, { once: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(scheduleSync);
  }

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(footer);
  }

  updateRevealed();
  window.addEventListener("scroll", updateRevealed, { passive: true });
}
