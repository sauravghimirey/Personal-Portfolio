

window.PF = window.PF || {};
window.PF.$ = (s, r = document) => r.querySelector(s);
window.PF.$$ = (s, r = document) => [...r.querySelectorAll(s)];

window.PF.$$(".year").forEach((el) => (el.textContent = new Date().getFullYear()));
