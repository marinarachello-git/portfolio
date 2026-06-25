export function initFooterReveal() {
  const footer = document.querySelector("footer");
  const spacer = document.querySelector(".footer-spacer");
  if (!footer || !spacer) return;

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

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setRevealed(entry.isIntersecting || isNearPageBottom());
      },
      { threshold: 0 }
    );
    observer.observe(spacer);
  }

  updateRevealed();
  window.addEventListener("scroll", updateRevealed, { passive: true });
  window.addEventListener("resize", updateRevealed, { passive: true });
}
