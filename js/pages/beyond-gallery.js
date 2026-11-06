
(function () {
  const PF = window.PF,
    $ = PF.$,
    $$ = PF.$$;
  const B = (PF.P && PF.P.beyond) || {};
  const items = (B.items || []).slice(0, 6);
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = $$(".bv-item");
  const frames = $$(".bv-frame");
  const grid = $(".bv-grid");
  if (!frames.length) return;

  
  function measureFromCentre() {
    if (!grid) return;
    const halfW = grid.clientWidth / 2,
      halfH = grid.clientHeight / 2;
    cards.forEach((el) => {
      el.style.setProperty("--cx", halfW - (el.offsetLeft + el.offsetWidth / 2) + "px");
      el.style.setProperty("--cy", halfH - (el.offsetTop + el.offsetHeight / 2) + "px");
    });
  }
  measureFromCentre();
  window.addEventListener("resize", measureFromCentre);

  
  const DEAL = [0, 330, 660, 990, 1320, 1650];
  cards.forEach((el, i) => el.style.setProperty("--d", (DEAL[i] || 0) + "ms"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.classList.add("is-visible");
          io.unobserve(el);
          
          const delay = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
          setTimeout(() => el.style.setProperty("--d", "0ms"), 1900 + delay);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    cards.forEach((el) => io.observe(el));
  } else {
    cards.forEach((el) => el.classList.add("is-visible"));
  }

  
  const layers = frames.map((f) => ({ f, m: f.querySelector(".bv-media") }));
  let ticking = false;
  function parallax() {
    ticking = false;
    if (reduce) return;
    const vh = window.innerHeight;
    layers.forEach(({ f, m }) => {
      if (!m) return;
      const r = f.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const c = Math.max(-1, Math.min(1, p));
      m.style.transform = `translate3d(0, ${(-c * r.height * 0.07).toFixed(1)}px, 0)`;
    });
  }
  const requestParallax = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(parallax);
    }
  };
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
  parallax();

  
  const viewerItems = items.map((it, i) => ({
    src: it.src,
    alt: it.alt || it.caption || "",
    title: it.caption || `Photo ${String(i + 1).padStart(2, "0")}`,
    place: it.place || "",
    note: "Sample · add photo",
  }));
  frames.forEach((f, i) => f.addEventListener("click", () => PF.viewer.open(viewerItems, i)));
})();
