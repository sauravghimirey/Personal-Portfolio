
(function () {
  const PF = window.PF;
  const pad = (n) => String(n).padStart(2, "0");
  const icon = (d) =>
    `<svg class="lucide" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  const lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Viewer");
  lb.setAttribute("aria-hidden", "true");
  lb.innerHTML =
    '<img class="lb-bg" alt="" aria-hidden="true">' +
    '<div class="lb-backdrop" data-close></div>' +
    '<p class="lb-count" aria-live="polite"></p>' +
    '<div class="lb-stage">' +
    '<div class="lb-frame">' +
    '<img class="lb-img" alt="">' +
    '<iframe class="lb-embed" allow="fullscreen" referrerpolicy="no-referrer"></iframe>' +
    '<p class="lb-empty"></p>' +
    "</div>" +
    '<p class="lb-cap"><span class="lb-title"></span><span class="lb-place"></span></p>' +
    "</div>" +
    `<button type="button" class="lb-btn lb-close" data-close aria-label="Close viewer">${icon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>')}</button>` +
    `<button type="button" class="lb-btn lb-prev" aria-label="Previous">${icon('<path d="m15 18-6-6 6-6"/>')}</button>` +
    `<button type="button" class="lb-btn lb-next" aria-label="Next">${icon('<path d="m9 18 6-6-6-6"/>')}</button>`;
  document.body.appendChild(lb);

  const $ = (sel) => lb.querySelector(sel);
  const img = $(".lb-img"),
    embed = $(".lb-embed"),
    empty = $(".lb-empty");
  const bg = $(".lb-bg");
  const count = $(".lb-count"),
    titleEl = $(".lb-title"),
    placeEl = $(".lb-place");

  let list = [],
    cur = 0,
    open = false,
    lastFocus = null;

  
  function showImage(src, alt, onFail) {
    lb.classList.remove("is-embed", "is-empty");
    img.alt = alt;
    
    bg.onerror = () => bg.removeAttribute("src");
    bg.src = src;
    img.onload = () => img.classList.remove("is-swap");
    img.onerror = () => {
      img.classList.remove("is-swap");
      onFail();
    };
    if (img.getAttribute("src") === src && img.complete) {
      
      if (img.naturalWidth > 0) img.classList.remove("is-swap");
      else onFail();
      return;
    }
    img.classList.add("is-swap");
    img.src = src;
  }

  function showEmbed(src, title) {
    bg.removeAttribute("src");
    lb.classList.remove("is-empty");
    lb.classList.add("is-embed");
    embed.title = title;
    embed.src = src;
  }

  function showEmpty(note) {
    bg.removeAttribute("src");
    lb.classList.remove("is-embed");
    lb.classList.add("is-empty");
    empty.textContent = note || "";
  }

  function show(i) {
    const n = list.length;
    cur = ((i % n) + n) % n;
    const it = list[cur];
    const title = it.title || "";
    if (it.src) {
      
      showImage(it.src, it.alt || title, () => (it.embed ? showEmbed(it.embed, title) : showEmpty(it.note)));
    } else if (it.embed) {
      showEmbed(it.embed, title);
    } else {
      showEmpty(it.note);
    }
    titleEl.textContent = title;
    placeEl.textContent = it.place || "";
    count.textContent = `${pad(cur + 1)} / ${pad(n)}`;
  }

  function openAt(items, i) {
    if (!items || !items.length) return;
    list = items;
    lastFocus = document.activeElement;
    show(i || 0);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("lb-lock");
    open = true;
    $(".lb-close").focus({ preventScroll: true });
  }

  function close() {
    if (!open) return;
    open = false;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("lb-lock");
    embed.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  const step = (d) => {
    if (open) show(cur + d);
  };

  lb.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) close();
  });
  $(".lb-prev").addEventListener("click", () => step(-1));
  $(".lb-next").addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") {
      
      const btns = [...lb.querySelectorAll("button")];
      const first = btns[0],
        last = btns[btns.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  
  let sx = null,
    sy = null;
  lb.addEventListener(
    "touchstart",
    (e) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    },
    { passive: true },
  );
  lb.addEventListener(
    "touchend",
    (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx,
        dy = e.changedTouches[0].clientY - sy;
      sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );

  PF.viewer = { open: openAt };
})();
