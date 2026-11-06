
(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  const root = document.documentElement;
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    $("#icon-moon").hidden = t === "dark";
    $("#icon-sun").hidden = t !== "dark";
    const b = $("#theme-toggle");
    b.setAttribute("aria-pressed", t === "dark");
    b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    b.title = t === "dark" ? "Light mode" : "Dark mode";
  }
  setTheme("light");
  $("#theme-toggle").addEventListener("click", () =>
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"),
  );
})();

(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  (function () {
    const ACC = {
      olive: ["#293803", "#415B06", "#557210", "#6A8C1A", "65, 91, 6"],
      terracotta: ["#4a1d0f", "#a0462a", "#bb5a3a", "#d67a5a", "160, 70, 42"],
      teal: ["#0b3b3a", "#0f766e", "#14908a", "#2cb5ad", "15, 118, 110"],
      ink: ["#14264a", "#27498a", "#3a60a8", "#6288cf", "39, 73, 138"],
      plum: ["#3d1536", "#7a2f69", "#94427f", "#b567a0", "122, 47, 105"],
      ochre: ["#4a3303", "#a06f0a", "#b9840f", "#d6a43a", "160, 111, 10"],
    };
    const btn = $("#accent-toggle"),
      pop = $("#accent-pop");
    if (!btn || !pop) return;
    function apply(name) {
      const a = ACC[name] || ACC.olive,
        st = document.documentElement.style;
      st.setProperty("--olive-dark", a[0]);
      st.setProperty("--olive", a[1]);
      st.setProperty("--olive-mid", a[2]);
      st.setProperty("--olive-light", a[3]);
      st.setProperty("--olive-rgb", a[4]);
      const m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = a[1];
      $$(".accent-sw", pop).forEach((b) => b.classList.toggle("active", b.dataset.accent === name));
    }
    let saved = "olive";
    try {
      saved = localStorage.getItem("accent") || "olive";
    } catch (e) {}
    apply(saved);
    const toggle = (open) => {
      pop.hidden = !open;
      btn.setAttribute("aria-expanded", open);
    };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle(pop.hidden);
    });
    pop.addEventListener("click", (e) => {
      const b = e.target.closest(".accent-sw");
      if (!b) return;
      apply(b.dataset.accent);
      try {
        localStorage.setItem("accent", b.dataset.accent);
      } catch (err) {}
      toggle(false);
    });
    document.addEventListener("click", (e) => {
      if (!pop.hidden && !e.target.closest(".accent-wrap")) toggle(false);
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggle(false);
    });
  })();
})();
