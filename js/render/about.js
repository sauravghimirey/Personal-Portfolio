
(function () {
  const PF = window.PF,
    P = PF.P,
    A = PF.A,
    C = PF.C;
  const { esc, set, text, heading, svg } = PF;
  const $ = window.PF.$;
  
  const skills = (A.technicalFocus && A.technicalFocus.skills) || [];
  const chip = (s) => {
    const slug = s.icon,
      variant = s.variant || "original";
    const ic = slug
      ? `<img class="ab-chip-ic" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${esc(slug)}/${esc(slug)}-${esc(variant)}.svg" alt="" loading="lazy" onerror="this.remove()">`
      : "";
    return `<span class="ab-chip">${ic}${esc(s.name)}</span>`;
  };
  const row = (list, cls) =>
    `<div class="ab-marquee ${cls}" aria-hidden="false"><div class="ab-track">${list.map(chip).join("")}${list.map(chip).join("")}</div></div>`;
  const half = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, half),
    rowB = skills.slice(half);
  const showTile = (t) =>
    `<span class="ab-tile-mini"><span class="tm-ic">${
      t.src
        ? `<img src="${esc(t.src)}" alt="" loading="lazy" onerror="this.remove()">`
        : t.icon
          ? `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${esc(t.icon)}/${esc(t.icon)}-${esc(t.variant || "original")}.svg" alt="" loading="lazy" onerror="this.remove()">`
          : `<b class="tm-txt">${esc(t.text || "")}</b>`
    }</span><span class="tm-label">${esc(t.name)}</span></span>`;
  const showAll = (A.technicalFocus || {}).showcase || [];
  const showHalf = Math.ceil(showAll.length / 2);
  const showMarq = (list, cls) => {
    const h = list.map(showTile).join("");
    return h
      ? `<div class="ab-marquee tiles ${cls}" aria-hidden="true"><div class="ab-track">${h}${h}</div></div>`
      : "";
  };
  const showRow = showMarq(showAll.slice(0, showHalf), "") + showMarq(showAll.slice(showHalf), "rev");

  const certs = (A.certifications && A.certifications.items) || [];
  const edu = A.education || {},
    tf = A.technicalFocus || {},
    edge = A.edge || {};

  const tile = (cls, inner, i) =>
    `<article class="ab-tile glass ${cls}" data-tilt style="--d:${i * 0.08}s">${inner}</article>`;

  const profile = tile(
    "ab-profile",
    `
    <span class="ab-deco" aria-hidden="true">${svg("user", 150)}</span>
    <div class="ab-profile-main">
      <div class="ab-profile-top"><p class="ab-eyebrow">Profile</p><span class="ab-sign" aria-hidden="true"><b>${esc(A.signature || P.name)}</b><svg viewBox="0 0 140 14" preserveAspectRatio="none"><path d="M3 9 C 28 2, 52 13, 78 6 S 120 3, 137 8"/></svg></span></div>
      <h3 class="ab-name">${esc(P.name)}</h3>
      <p class="ab-sub">${esc(A.title)}</p>
      <div class="ab-pills">${A.location ? `<span class="ab-pill">${esc(A.location)}</span>` : ""}${A.status ? `<span class="ab-pill ab-pill-live"><i></i>${esc(A.status)}</span>` : ""}</div>
    </div>
    <div class="ab-profile-bio">${(A.bio || []).map((p) => `<p>${esc(p)}</p>`).join("")}</div>`,
    0,
  );

  const craft = tile(
    "ab-craft",
    `
    <h3 class="ab-heading">${esc(tf.title || "Skills")}</h3>
    <span class="ab-deco" aria-hidden="true">${svg("code", 150)}</span>
    ${tf.text ? `<p class="ab-text">${esc(tf.text)}</p>` : ""}
    ${(tf.groups || []).length ? `<div class="ab-focus-wrap"><div class="ab-focus"><dl class="ab-focus-grid">${tf.groups.map((g) => `<div><dt>${esc(g.label)}</dt><dd>${esc(g.text)}</dd></div>`).join("")}</dl>${tf.note ? `<p class="ab-focus-note"><i aria-hidden="true"></i>${esc(tf.note)}</p>` : ""}</div></div>` : ""}
    <div class="ab-marquees">${showRow}</div>`,
    1,
  );

  const certTile = certs.length
    ? tile(
        "ab-certs",
        `
    <div class="ab-head"><h3 class="ab-heading">${esc((A.certifications && A.certifications.title) || "Certifications")}</h3></div>
    <div class="cx" role="region" aria-roledescription="carousel" aria-label="Certifications"><div class="cx-viewport" aria-live="polite"></div><div class="cx-swipe-hint" aria-hidden="true">↔ <span>Swipe to move and see</span></div></div>
    <div class="cx-ui">
      <button type="button" class="cx-btn" data-cx="prev" aria-label="Previous certificate">${svg("left", 20)}</button>
      <div class="cx-mid"><div class="cx-dots"></div><span class="cx-count"></span></div>
      <button type="button" class="cx-btn" data-cx="next" aria-label="Next certificate">${svg("right", 20)}</button></div>`,
        2,
      )
    : "";

  const photo = A.photo
    ? `<article class="ab-tile ab-photo" data-tilt style="--d:.24s"><img src="${esc(A.photo)}" alt="${esc(A.photoAlt || P.name)}"></article>`
    : "";

  const eduTile = (edu.items || []).length
    ? tile(
        "ab-edu",
        `
    <h3 class="ab-heading">${esc(edu.title || "Education")}</h3>
    <span class="ab-deco" aria-hidden="true">${svg("cap", 150)}</span><ul class="ab-edu-list">${edu.items.map((e) => `<li><span class="ab-edu-title">${esc(e.title)}</span><span class="ab-edu-place">${esc(e.place)}</span>${e.years ? `<span class="ab-edu-years">${esc(e.years)}</span>` : ""}${e.status ? `<span class="ab-badge">${esc(e.status)}</span>` : ""}</li>`).join("")}</ul>`,
        3,
      )
    : "";

  const edgeTile = (edge.items || []).length
    ? tile(
        "ab-edge",
        `
    <div class="ab-edge-head"><span class="ab-eyebrow">${esc(edge.eyebrow || "")}</span><h3 class="ab-heading">${esc(edge.title || "My Edge")}</h3></div>
    <ul class="ab-edge-list">${edge.items.map((e, i) => `<li><span class="ab-edge-no">${String(i + 1).padStart(2, "0")}</span><strong>${esc(e.title)}</strong><small>${esc(e.text)}</small></li>`).join("")}</ul>`,
        4,
      )
    : "";

  set("#about-grid", [profile, craft, certTile, photo, eduTile, edgeTile].join(""));
})();
