(() => {
  const loader = document.getElementById('signature-loader');
  if (!loader) return;

  const progress = document.getElementById('loader-progress');
  const percent = document.getElementById('loader-percent');
  const quote = document.getElementById('loader-quote');

  // Sparse, slow-moving dust keeps the paper background alive without looking flashy.
  for (let i = 0; i < 13; i++) {
    const particle = document.createElement('span');
    particle.className = 'ld-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = `${7 + ((i * 31) % 86)}%`;
    particle.style.top = `${9 + ((i * 23) % 82)}%`;
    particle.style.setProperty('--duration', `${9 + (i % 5) * 1.8}s`);
    particle.style.setProperty('--delay', `${-((i * 5) % 17)}s`);
    particle.style.setProperty('--drift', `${(i % 2 ? 1 : -1) * (8 + (i % 4) * 4)}px`);
    loader.appendChild(particle);
  }

  const quotes = [
    'Curiosity never stops.',
    'Every day is a chance to learn.',
    'Small steps, meaningful progress.',
    'Always learning, always growing.',
    'Progress over perfection.',
    'Turning curiosity into knowledge.',
    'Every challenge brings growth.',
    'Stay curious. Keep exploring.',
    'Building a little better every day.'
  ];

  const duration = 1600;
  const start = performance.now();
  let lastQuote = -1;

  function tick(now) {
    const ratio = Math.min((now - start) / duration, 1);
    const value = Math.round(ratio * 100);

    if (progress) progress.style.width = `${value}%`;
    if (percent) percent.textContent = `${value}%`;

    const quoteIndex = Math.min(Math.floor(ratio * quotes.length), quotes.length - 1);
    if (quote && quoteIndex !== lastQuote) {
      quote.style.animation = 'none';
      void quote.offsetWidth;
      quote.style.animation = '';
      quote.textContent = quotes[quoteIndex];
      lastQuote = quoteIndex;
    }

    if (ratio < 1) {
      requestAnimationFrame(tick);
    } else {
      loader.classList.add('loading-complete');
      window.setTimeout(() => loader.classList.add('is-hidden'), 420);
    }
  }

  requestAnimationFrame(tick);

  window.addEventListener('pageshow', () => {
    if (loader.classList.contains('is-hidden')) return;
    if (performance.now() - start > duration + 1000) loader.classList.add('is-hidden');
  }, { once: true });
})();
