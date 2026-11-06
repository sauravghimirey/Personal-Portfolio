
(function () {
  const PF = window.PF,
    P = PF.P,
    A = PF.A,
    C = PF.C;
  const { esc, set, text, heading, svg } = PF;
  const $ = window.PF.$;
  
  if (C.title) set(".contact-template-header .section-heading", heading(C.title));
  text(".contact-template-eyebrow", C.eyebrow || "");
  text(".contact-template-subtitle", C.subtitle || "");
  const card = (o) => {
    const inner = `<div class="contact-icon-wrapper ${o.color}">${svg(o.icon, 24)}</div><div><h3 class="contact-card-title">${esc(o.title)}</h3><p class="contact-card-text">${esc(o.text)}</p></div>`;
    return o.href
      ? `<a href="${esc(o.href)}" ${o.external ? 'target="_blank"' : ""} rel="noreferrer" class="glass contact-card card-3d">${inner}</a>`
      : `<div class="glass contact-card card-3d">${inner}</div>`;
  };
  set(
    ".contact-template-info",
    [
      C.linkedin &&
        card({
          href: C.linkedin.url,
          external: 1,
          color: "cyan",
          icon: "linkedin",
          title: "LinkedIn",
          text: C.linkedin.label,
        }),
      C.email &&
        card({ href: "mailto:" + C.email, color: "cyan", icon: "mail", title: "Email Me", text: C.email }),
      C.phone &&
        card({
          href: "tel:" + C.phone.replace(/[^+\d]/g, ""),
          color: "purple",
          icon: "call",
          title: "Call Me",
          text: C.phone,
        }),
      C.location && card({ color: "pink", icon: "pin", title: "Location", text: C.location }),
    ]
      .filter(Boolean)
      .join(""),
  );
})();
