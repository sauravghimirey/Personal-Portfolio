
(function () {
  const PF = window.PF,
    P = PF.P,
    A = PF.A,
    C = PF.C;
  const { esc, set, text, heading, svg } = PF;
  const $ = window.PF.$;
  
  const PR = P.projects || {};
  if (PR.title) set(".projects-template-title", heading(PR.title));
  text(".projects-template-eyebrow", PR.eyebrow || "");
  text(".projects-template-subtitle", PR.subtitle || "");
  set(
    ".projects-template-grid",
    (PR.items || [])
      .map(
        (p, i) => `
    <a href="${esc(p.url)}" target="_blank" rel="noreferrer" class="project-template-link"><article class="project-template-card accent-${esc(p.accent || "cyan")} card-3d reveal-up delay-${(i % 4) + 1}">
      <div class="project-template-top"><div class="project-template-icon">${svg(p.icon || "code", 22)}</div>${svg("external", 18, "project-template-external")}</div>
      <h3 class="project-template-title-text">${esc(p.title)}</h3><p class="project-template-desc">${esc(p.text)}</p>
      <div class="project-template-tags">${(p.tags || []).map((t) => `<span class="project-template-tag">${esc(t)}</span>`).join("")}</div></article></a>`,
      )
      .join(""),
  );
  set(
    ".projects-template-footer",
    PR.allLink
      ? `<a href="${esc(PR.allLink.url)}" target="_blank" rel="noreferrer" class="projects-template-linkout">${esc(PR.allLink.label)}</a>`
      : "",
  );
})();
