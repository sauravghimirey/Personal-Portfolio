
(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  const menu = $("#mobile-menu"),
    overlay = $("#mobile-overlay"),
    burger = $("#hamburger");
  function toggleMenu(open) {
    menu.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  }
  burger.addEventListener("click", () => toggleMenu(!menu.classList.contains("open")));
  overlay.addEventListener("click", () => toggleMenu(false));
  $("#close-menu").addEventListener("click", () => toggleMenu(false));
  $$(".mobile-nav-link").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
})();
