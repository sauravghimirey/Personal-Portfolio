const EMAILJS = (window.PORTFOLIO && window.PORTFOLIO.emailjs) || {
  serviceId: "",
  templateId: "",
  publicKey: ""
};

(function () {
  const $ = window.PF.$;
  const form = $("#contact-form");
  if (!form) return;

  const statusEl = $("#form-status");
  const btn = $("#submit-btn");
  const btnText = btn ? (btn.querySelector("span") || btn) : null;
  let statusTimer = null;
  let hideTimer = null;

  function hideStatus() {
    if (!statusEl) return;
    if (statusTimer) window.clearTimeout(statusTimer);
    if (hideTimer) window.clearTimeout(hideTimer);

    statusEl.classList.remove("is-visible");
    statusEl.style.opacity = "0";
    hideTimer = window.setTimeout(function () {
      statusEl.hidden = true;
      statusEl.textContent = "";
      statusEl.className = "form-status";
      statusEl.style.display = "none";
      statusEl.style.opacity = "";
    }, 300);
  }

  function say(kind, message) {
    if (!statusEl) return;
    if (statusTimer) window.clearTimeout(statusTimer);
    if (hideTimer) window.clearTimeout(hideTimer);

    statusEl.hidden = false;
    statusEl.style.display = "block";
    statusEl.className = "form-status " + kind;
    statusEl.textContent = message;
    statusEl.style.opacity = "0";

    window.requestAnimationFrame(function () {
      statusEl.style.opacity = "1";
      statusEl.classList.add("is-visible");
    });

    // Success stays visible for 3 seconds; errors stay for 5 seconds.
    statusTimer = window.setTimeout(hideStatus, kind === "success" ? 3000 : 5000);
  }

  // Ensure the status starts hidden on page load.
  if (statusEl) {
    statusEl.hidden = true;
    statusEl.style.display = "none";
    statusEl.style.opacity = "";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = form.elements.from_name.value.trim();
    const email = form.elements.from_email.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !email || !message) {
      say("error", "Please fill in all fields.");
      return;
    }

    if (
      !window.emailjs ||
      !EMAILJS.publicKey ||
      !EMAILJS.serviceId ||
      !EMAILJS.templateId ||
      /YOUR_|PASTE_/i.test(EMAILJS.publicKey + EMAILJS.serviceId + EMAILJS.templateId)
    ) {
      say("error", "Email delivery needs a one-time EmailJS setup. Check the IDs in js/config.js.");
      return;
    }

    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = "Sending...";
    if (statusTimer) window.clearTimeout(statusTimer);
    if (hideTimer) window.clearTimeout(hideTimer);
    if (statusEl) {
      statusEl.hidden = true;
      statusEl.style.display = "none";
    }

    try {
      window.emailjs.init({ publicKey: EMAILJS.publicKey });
      await window.emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        name: name,
        email: email,
        subject: "Portfolio Contact Message",
        message: message
      });

      say("success", "Thanks! Your message was sent successfully.");
      form.reset();
    } catch (error) {
      console.error("EmailJS contact form error:", error);
      say("error", "Message could not be sent. Check the EmailJS service/template settings and try again.");
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = "Send Message";
    }
  });
})();
