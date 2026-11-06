
(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  $$(".project-template-card").forEach((card) => {
    const g = document.createElement("div");
    g.className = "pj-glare";
    card.appendChild(g);
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = card.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      card.classList.add("is-tilting");
      card.style.setProperty("--ry", ((x - 0.5) * 14).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 14).toFixed(2) + "deg");
      card.style.setProperty("--mx", x * 100 + "%");
      card.style.setProperty("--my", y * 100 + "%");
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    });
  });
})();

(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  $$(".ab-tile[data-tilt]").forEach((tile) => {
    const g = document.createElement("div");
    g.className = "ab-glare";
    tile.appendChild(g);
    const still = tile.classList.contains("ab-certs");
    tile.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = tile.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      const max = still ? 0 : r.width > 700 ? 2.2 : 6;
      tile.classList.add("is-tilting");
      tile.style.setProperty("--ry", ((x - 0.5) * max).toFixed(2) + "deg");
      tile.style.setProperty("--rx", ((0.5 - y) * max).toFixed(2) + "deg");
      tile.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      tile.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    tile.addEventListener("pointerleave", () => {
      tile.classList.remove("is-tilting");
      tile.style.removeProperty("--rx");
      tile.style.removeProperty("--ry");
    });
  });
})();
