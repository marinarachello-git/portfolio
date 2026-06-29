const MOBILE_QUERY = "(max-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function initSnapshots(root) {
  if (!root || root.dataset.snapshotsInit === "true") return;
  root.dataset.snapshotsInit = "true";

  const sticky = root.querySelector(".snapshots-sticky");
  const track = root.querySelector("[data-snapshots-track]");
  const wrapper = root.querySelector(".snapshots-track-wrapper");

  if (!sticky || !track || !wrapper) return;

  const mobileMq = window.matchMedia(MOBILE_QUERY);
  const reducedMq = window.matchMedia(REDUCED_MOTION_QUERY);

  let rafId = null;
  let mobileCarousel = null;

  const shouldUseScrollHijack = () =>
    !mobileMq.matches && !reducedMq.matches;

  const shouldUseMobileCarousel = () => mobileMq.matches;

  const getSampleImage = () => track.querySelector(".snapshots-card__image");

  const getOriginalCards = () =>
    [...track.querySelectorAll(".snapshots-card")].filter(
      (card) => !card.hasAttribute("data-snapshot-clone")
    );

  const teardownMobileCarousel = () => {
    track.querySelectorAll("[data-snapshot-clone]").forEach((clone) => {
      clone.remove();
    });

    if (!mobileCarousel) return;

    getMobileScroller().removeEventListener("scroll", mobileCarousel.onScroll);
    getMobileScroller().scrollLeft = 0;
    mobileCarousel = null;
  };

  const getMobileScroller = () => wrapper;

  const centerCard = (card) => {
    if (!card) return;
    const scroller = getMobileScroller();
    const cardOffset = track.offsetLeft + card.offsetLeft;
    scroller.scrollLeft =
      cardOffset + card.offsetWidth / 2 - scroller.clientWidth / 2;
  };

  const getCarouselSetWidth = (originals) => {
    const first = originals[0];
    const last = originals[originals.length - 1];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return last.offsetLeft + last.offsetWidth + gap - first.offsetLeft;
  };

  const setupMobileCarousel = () => {
    teardownMobileCarousel();

    const originals = getOriginalCards();
    if (originals.length === 0) return;

    const makeClone = (card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("data-snapshot-clone", "true");
      clone.querySelectorAll("img").forEach((img) => {
        img.removeAttribute("id");
      });
      return clone;
    };

    originals.forEach((card, index) => {
      const clone = makeClone(originals[originals.length - 1 - index]);
      track.insertBefore(clone, track.firstChild);
    });

    originals.forEach((card) => {
      track.appendChild(makeClone(card));
    });

    let jumping = false;

    const onScroll = () => {
      if (jumping) return;

      const scroller = getMobileScroller();
      const setWidth = getCarouselSetWidth(originals);
      const loopStart = originals[0].offsetLeft;
      const buffer = setWidth * 0.15;

      if (scroller.scrollLeft < loopStart - buffer) {
        jumping = true;
        scroller.scrollLeft += setWidth;
        jumping = false;
      } else if (scroller.scrollLeft > loopStart + setWidth - buffer) {
        jumping = true;
        scroller.scrollLeft -= setWidth;
        jumping = false;
      }
    };

    getMobileScroller().addEventListener("scroll", onScroll, { passive: true });

    mobileCarousel = { onScroll, originals };

    const queueCenter = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          centerCard(originals[0]);
        });
      });
    };

    queueCenter();
    window.addEventListener("load", queueCenter, { once: true });
  };

  const applyCardSizing = () => {
    const sample = getSampleImage();
    if (!sample?.naturalWidth) return;

    if (mobileMq.matches) return;

    const DESKTOP_TARGET = 900;
    const desktopCap = Math.min(DESKTOP_TARGET, wrapper.clientWidth * 0.92);
    const desktopWidth = Math.round(
      Math.min(desktopCap, sample.naturalWidth)
    );

    root.style.setProperty("--snapshots-card-width", `${desktopWidth}px`);
  };

  const getMaxTranslate = () => {
    const trackWidth = track.scrollWidth;
    const viewportWidth = wrapper.clientWidth;
    return Math.max(0, trackWidth - viewportWidth);
  };

  const setOuterHeight = () => {
    if (!shouldUseScrollHijack()) {
      root.style.height = "";
      return;
    }

    const scrollDistance = getMaxTranslate();
    const styles = getComputedStyle(root);
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;

    root.style.height = `${window.innerHeight + scrollDistance + paddingTop + paddingBottom}px`;
  };

  const updateScrollPosition = () => {
    if (!shouldUseScrollHijack()) {
      if (!shouldUseMobileCarousel()) {
        wrapper.scrollLeft = 0;
      }
      return;
    }

    const outerTop = root.offsetTop;
    const scrollStart = outerTop;
    const scrollEnd = outerTop + root.offsetHeight - window.innerHeight;
    const range = scrollEnd - scrollStart;

    if (range <= 0) {
      wrapper.scrollLeft = 0;
      return;
    }

    const progress = (window.scrollY - scrollStart) / range;
    const clamped = Math.max(0, Math.min(1, progress));
    const offset = Math.round(clamped * getMaxTranslate());

    wrapper.scrollLeft = offset;
  };

  const syncCarouselMode = () => {
    track.style.transform = "";

    if (shouldUseMobileCarousel()) {
      setupMobileCarousel();
    } else {
      teardownMobileCarousel();
    }
  };

  const scheduleUpdate = () => {
    if (rafId) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      applyCardSizing();
      setOuterHeight();
      updateScrollPosition();
    });
  };

  const onScroll = () => scheduleUpdate();

  const onMqChange = () => {
    syncCarouselMode();
    applyCardSizing();
    setOuterHeight();
    updateScrollPosition();
  };

  track.querySelectorAll(".snapshots-card__image").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", scheduleUpdate, { once: true });
    }
  });

  applyCardSizing();
  syncCarouselMode();
  setOuterHeight();
  updateScrollPosition();

  window.addEventListener("load", scheduleUpdate, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });

  mobileMq.addEventListener("change", onMqChange);
  reducedMq.addEventListener("change", onMqChange);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(track);
    observer.observe(wrapper);
  }
}
