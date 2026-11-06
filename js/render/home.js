
(function () {
  const PF = window.PF,
    P = PF.P,
    A = PF.A,
    C = PF.C;
  const { esc, set, text, heading, svg } = PF;
  const $ = window.PF.$;
  
  const H = P.hero || {};
  text(".hero-eyebrow", P.role || "");
  text(".hero-name", P.name || "");
  const tw = $("#tw");
  if (tw && H.typewriter && H.typewriter.length) {
    tw.dataset.words = H.typewriter.join("|");
    tw.textContent = H.typewriter[0];
  }
  const ht = $(".hero-title");
  if (ht) ht.setAttribute("aria-label", `${P.name}${H.typewriter ? ", " + H.typewriter[0] : ""}`);
  text(".hero-subtitle", H.subtitle || "");
  set(".hero-panel-list", (H.highlights || []).map((h) => `<li>${esc(h)}</li>`).join(""));
  if (H.slogan) {
    text(".hs-sa", H.slogan.sa || "");
    text(".hs-en", H.slogan.en || "");
  } else {
    const hs = $(".hero-slogan");
    if (hs) hs.remove();
  }
})();
