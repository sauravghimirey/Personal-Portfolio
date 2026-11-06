
(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  $$(".reveal-up, .reveal-left, .reveal-right, .reveal-scale, .ab-tile").forEach((el) => io.observe(el));
})();
