
(function () {
  const $ = window.PF.$,
    $$ = window.PF.$$;
  
  (function () {
    const el = $("#tw");
    if (!el) return;
    const words = el.dataset.words.split("|");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0,
      i = words[0].length,
      del = false;
    (function loop() {
      const word = words[w];
      el.textContent = word.slice(0, i);
      let delay;
      if (!del) {
        if (i === word.length) {
          del = true;
          delay = 1600;
        } else {
          i++;
          delay = 95;
        }
      } else if (i === 0) {
        del = false;
        w = (w + 1) % words.length;
        delay = 350;
      } else {
        i--;
        delay = 45;
      }
      setTimeout(loop, delay);
    })();
  })();
})();
