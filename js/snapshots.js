const MOBILE_QUERY = "(max-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function initSnapshots(root) {
  if (!root) return;

  const sticky = root.querySelector(".snapshots-sticky");
  const track = root.querySelector("[data-snapshots-track]");
  const wrapper = root.querySelector(".snapshots-track-wrapper");

  if (!sticky || !track || !wrapper) return;

  const mobileMq = window.matchMedia(MOBILE_QUERY);
  const reducedMq = window.matchMedia(REDUCED_MOTION_QUERY);

  let rafId = null;

  const shouldUseScrollHijack = () =>
    !mobileMq.matches && !reducedMq.matches;

  const getSampleImage = () => track.querySelector(".snapshots-card__image");

  const getMobileCardCap = () => {
    const trackStyles = getComputedStyle(track);
    const padding =
      parseFloat(trackStyles.paddingLeft) + parseFloat(trackStyles.paddingRight);
    const trackWidth = track.clientWidth || wrapper.clientWidth || window.innerWidth;
    return Math.max(0, (trackWidth - padding) * 0.85);
  };

  const applyCardSizing = () => {
    const sample = getSampleImage();
    if (!sample?.naturalWidth) return;

    const dpr = window.devicePixelRatio || 1;
    const nativeWidth = sample.naturalWidth;
    const crispCap = nativeWidth / dpr;
    const desktopCap = Math.min(1024, wrapper.clientWidth * 0.92);
    const mobileCap = getMobileCardCap();
    const desktopWidth = Math.round(Math.min(desktopCap, crispCap));
    const mobileWidth = Math.round(Math.min(mobileCap, crispCap));

    root.style.setProperty("--snapshots-card-width", `${desktopWidth}px`);
    root.style.setProperty("--snapshots-card-width-mobile", `${mobileWidth}px`);
  };

  const getMaxTranslate = () => {
    const trackWidth = track.scrollWidth;
    const viewportWidth = wrapper.clientWidth;
    return Math.max(0, trackWidth - viewportWidth);
  };

  const setOuterHeight = () => {
    if (!shouldUseScrollHijack()) {
      root.style.height = "";
      wrapper.scrollLeft = 0;
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
      wrapper.scrollLeft = 0;
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
