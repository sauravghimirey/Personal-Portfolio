
(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  const CERTS = (((window.PORTFOLIO || {}).about || {}).certifications || {}).items || [];
  const root = $(".cx");
  if (!root || !CERTS.length) return;

  const escHtml = (v) =>
    String(v == null ? "" : v).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const icon = window.PF_ICON || (() => "");

  
  const VIEW = CERTS.map((c) => ({
    src: c.image || c.thumb || "",
    
    embed: c.embed && !/^https?:/i.test(c.embed) ? c.embed : "",
    alt: c.title + " certificate",
    title: c.title,
    place: c.issuer || "",
    note: "This certificate can’t be previewed here.",
  }));

  const vp = $(".cx-viewport", root),
    tileEl = root.closest(".ab-tile");
  const dotsEl = $(".cx-dots", tileEl),
    countEl = $(".cx-count", tileEl);
  const n = CERTS.length;
  let idx = 0,
    down = null;

  const cards = CERTS.map((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cert-card";
    b.dataset.i = i;
    b.innerHTML =
      '<span class="cert-img"><span class="cert-ph">' +
      icon("award", 44) +
      "<b>" +
      escHtml(c.badge || "") +
      "</b></span></span>" +
      '<span class="cert-info"><span class="cert-title">' +
      escHtml(c.title) +
      '</span><span class="cert-sub">' +
      escHtml(c.issuer || "") +
      "</span></span>" +
      '<span class="cert-view">View certificate <i>→</i></span>';
    const src = c.image || c.thumb;
    if (src) {
      const img = new Image();
      img.alt = c.title + " certificate";
      img.decoding = "async";
      img.draggable = false;
      let triedThumb = !c.image;
      img.onload = () => img.classList.add("ok");
      img.onerror = () => {
        if (!triedThumb && c.thumb) {
          triedThumb = true;
          img.src = c.thumb;
        } else img.remove();
      };
      img.src = src;
      $(".cert-img", b).appendChild(img);
    }
    vp.appendChild(b);
    return b;
  });

  const dots = CERTS.map((c, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "cx-dot";
    d.setAttribute("aria-label", "Show " + c.title);
    d.addEventListener("click", () => show(i));
    dotsEl.appendChild(d);
    return d;
  });

  function show(i) {
    idx = ((i % n) + n) % n;
    cards.forEach((c, k) => {
      const off = (k - idx + n) % n;
      const st = off === 0 ? "is-active" : off === n - 1 && n > 2 ? "is-prev" : "is-next";
      c.classList.remove("is-active", "is-prev", "is-next");
      c.classList.add(st);
      c.tabIndex = off === 0 ? 0 : -1;
      c.setAttribute("aria-hidden", off === 0 ? "false" : "true");
    });
    dots.forEach((d, k) => d.classList.toggle("on", k === idx));
    countEl.textContent = idx + 1 + " / " + n;
  }

  const uiEl = $(".cx-ui", tileEl);
  const swipeHint = $(".cx-swipe-hint", root);
  const nudge = (btn, dir) => {
    btn.classList.remove("nudge-l", "nudge-r");
    void btn.offsetWidth;
    btn.classList.add(dir < 0 ? "nudge-l" : "nudge-r");
  };
  const dismissSwipeHint = () => { if (swipeHint) { swipeHint.classList.remove("is-visible"); swipeHint.classList.add("is-dismissed"); } };
  const go = (d, btn) => {
    dismissSwipeHint();
    if (uiEl) uiEl.classList.remove("hint");
    if (btn) nudge(btn, d);
    show(idx + d);
  };
  const nextBtn = $('[data-cx="next"]', tileEl),
    prevBtn = $('[data-cx="prev"]', tileEl);
  nextBtn.addEventListener("click", () => go(1, nextBtn));
  prevBtn.addEventListener("click", () => go(-1, prevBtn));
  tileEl.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(1, nextBtn);
    if (e.key === "ArrowLeft") go(-1, prevBtn);
  });

  
  let sx = 0,
    sy = 0,
    dx = 0,
    t0 = 0,
    pid = null,
    dragging = false,
    lastDrag = 0;
  const W = () => vp.clientWidth || 300;
  const clearInline = () =>
    cards.forEach((c) => {
      c.style.transform = "";
      c.style.opacity = "";
    });
  function paint(x) {
    const w = W(),
      p = Math.min(1, Math.abs(x) / w),
      dir = x < 0 ? 1 : -1;
    const a = cards[idx],
      nb = cards[(idx + dir + n) % n];
    cards.forEach((c) => {
      if (c !== a && c !== nb) {
        c.style.transform = "";
        c.style.opacity = "";
      }
    });
    a.style.transform =
      "translateX(" +
      x +
      "px) rotate(" +
      ((x / w) * 5).toFixed(2) +
      "deg) scale(" +
      (1 - p * 0.06).toFixed(3) +
      ")";
    a.style.opacity = String((1 - p * 0.55).toFixed(3));
    if (nb !== a) {
      nb.style.transform =
        "translateX(" + (x + dir * 1.06 * w).toFixed(1) + "px) scale(" + (0.92 + 0.08 * p).toFixed(3) + ")";
      nb.style.opacity = String((0.25 + 0.75 * p).toFixed(3));
    }
  }
  vp.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    down = { x: e.clientX };
    sx = e.clientX;
    sy = e.clientY;
    dx = 0;
    pid = e.pointerId;
    t0 = performance.now();
    dragging = false;
  });
  vp.addEventListener("pointermove", (e) => {
    if (!down) return;
    const mx = e.clientX - sx,
      my = e.clientY - sy;
    if (!dragging) {
      if (Math.abs(mx) < 8 || Math.abs(mx) < Math.abs(my) * 1.2) return;
      dragging = true;
      vp.classList.add("drag");
      try {
        vp.setPointerCapture(pid);
      } catch (err) {}
      if (uiEl) uiEl.classList.remove("hint");
    }
    dx = mx;
    paint(dx);
  });
  function endDrag(cancel) {
    if (!down) return;
    down = null;
    if (!dragging) return;
    dragging = false;
    lastDrag = performance.now();
    try {
      vp.releasePointerCapture(pid);
    } catch (err) {}
    const v = dx / Math.max(1, performance.now() - t0);
    const commit = !cancel && (Math.abs(dx) > W() * 0.15 || Math.abs(v) > 0.25) && n > 1;
    const dir = dx < 0 ? 1 : -1;
    vp.classList.remove("drag");
    clearInline();
    if (commit) {
      dismissSwipeHint();
      nudge(dir > 0 ? nextBtn : prevBtn, dir);
      show(idx + dir);
    } else show(idx);
  }
  vp.addEventListener("pointerup", () => endDrag(false));
  vp.addEventListener("pointercancel", () => endDrag(true));
  vp.addEventListener("lostpointercapture", (e) => {
    if (e.target === vp) endDrag(true);
  });
  vp.addEventListener("click", (e) => {
    if (performance.now() - lastDrag < 350) {
      e.preventDefault();
      return;
    }
    const b = e.target.closest(".cert-card.is-active");
    if (b) window.PF.viewer.open(VIEW, +b.dataset.i);
  });
  if (uiEl) {
    uiEl.classList.add("hint");
    setTimeout(() => uiEl.classList.remove("hint"), 2800);
  }
  if (swipeHint) {
    swipeHint.innerHTML = "<span>Swipe to see more certificates</span>";
    const revealHint = () => {
      if (swipeHint.classList.contains("is-dismissed")) return;
      swipeHint.classList.add("is-visible");
    };
    if ("IntersectionObserver" in window) {
      const hintObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealHint();
          hintObserver.disconnect();
        }
      }, { threshold: 0.35 });
      hintObserver.observe(tileEl);
    } else {
      revealHint();
    }
  }
  show(0);
})();
