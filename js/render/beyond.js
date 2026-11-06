
(function () {
  const PF = window.PF,
    P = PF.P;
  if (!P) return;
  const { esc, set, text, heading } = PF;
  const B = P.beyond || {};
  const items = (B.items || []).slice(0, 6);

  if (B.title) set(".bv-title", heading(B.title));
  text(".bv-eyebrow", B.eyebrow || "");
  text(".bv-subtitle", B.subtitle || "");

  set(
    ".bv-grid",
    items
      .map((it, i) => {
        const n = String(i + 1).padStart(2, "0");
        const caption = it.caption || `Photo ${n}`;
        return (
          `<li class="bv-item"><button type="button" class="bv-frame" aria-label="View photo ${n}: ${esc(caption)}">` +
          `<span class="bv-media"><img class="bv-blur" src="${esc(it.src)}" alt="" aria-hidden="true" loading="lazy" decoding="async" onerror="this.remove()"><img src="${esc(it.src)}" alt="${esc(it.alt || caption)}" loading="lazy" decoding="async" onerror="this.closest('.bv-frame').classList.add('is-empty')"></span>` +
          `<span class="bv-empty" aria-hidden="true"></span>` +
          `<span class="bv-cap"><span class="bv-mask"><span class="bv-num">${n}</span></span>` +
          `<span class="bv-txt"><span class="bv-mask"><span class="bv-title-txt">${esc(caption)}</span></span>` +
          (it.place ? `<span class="bv-mask"><span class="bv-place">${esc(it.place)}</span></span>` : "") +
          `</span></span>` +
          `</button></li>`
        );
      })
      .join(""),
  );
})();
