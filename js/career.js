export function initCareer() {
  const outer = document.querySelector(".career-outer");
  const track = document.querySelector(".career-track");

  if (!outer || !track) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  let animId = null;
  let pos = 0;
  const speed = 1.2;
  let loopWidth = 0;

  const calculateLoopWidth = () => {
    const cards = track.children;
    const halfCount = cards.length / 2;

    if (!halfCount || cards.length <= halfCount) {
      loopWidth = track.scrollWidth / 2;
      return;
    }

    loopWidth = cards[halfCount].offsetLeft - cards[0].offsetLeft;
  };

  const startScroll = () => {
    if (animId !== null) return;

    calculateLoopWidth();

    if (loopWidth <= 0) return;

    const tick = () => {
      pos += speed;

      while (pos >= loopWidth) {
        pos -= loopWidth;
      }

      track.style.transform = `translate3d(-${pos}px, 0, 0)`;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
  };

  const stopScroll = () => {
    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startScroll();
        } else {
          stopScroll();
        }
      });
    },
    { threshold: 0.2 }
  );

  const observe = () => {
    calculateLoopWidth();
    observer.observe(outer);
  };

  const onLayoutChange = () => {
    calculateLoopWidth();

    if (loopWidth > 0) {
      while (pos >= loopWidth) {
        pos -= loopWidth;
      }
    }
  };

  if (document.readyState === "complete") {
    observe();
  } else {
    window.addEventListener("load", observe);
  }

  window.addEventListener("resize", onLayoutChange, { passive: true });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(onLayoutChange);
    resizeObserver.observe(track);
  }
}
