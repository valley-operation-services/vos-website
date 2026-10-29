/* =========================
   GOOGLE ADS TRACKING
   The Google tag itself is loaded in each page's <head>.
   To count an event as a Google Ads conversion, paste that conversion
   action's label (the part after the "/" in send_to: 'AW-18516647561/...')
   into the matching slot below. Events still send without a label.
========================= */

const VOS_ADS_ID = "AW-18516647561";
const VOS_CONVERSION_LABELS = {
  contact_form_submit: "kECcCMOPwa4dEIm9tv1E",
  phone_click: "",
  email_click: "",
};

function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return; // tag blocked or not loaded
  window.gtag("event", name, params);
  const label = VOS_CONVERSION_LABELS[name];
  if (label) window.gtag("event", "conversion", { send_to: `${VOS_ADS_ID}/${label}` });
}

// Delegated so it also catches links Cloudflare's email obfuscation rewrites.
document.addEventListener("click", (e) => {
  const link = e.target.closest(
    'a[href^="tel:"], a[href^="mailto:"], a[href*="/cdn-cgi/l/email-protection"]'
  );
  if (!link) return;
  trackEvent(link.getAttribute("href").startsWith("tel:") ? "phone_click" : "email_click");
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   SCROLL-TRIGGERED REVEALS
========================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealTargets = document.querySelectorAll(
  ".service-card, .process-step, .team-card, .industry-tags span, " +
  ".section-heading, .statement-grid, .about-intro, .contact-panel, .hero-proof > div, " +
  ".svc-include, .svc-signs, .schedule-panel, .ww-card"
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

/* =========================
   SUBTLE HERO PARALLAX
========================= */

const heroContent = document.querySelector(".hero-content");

if (heroContent && !prefersReducedMotion) {
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offset = Math.min(window.scrollY, 400);
          heroContent.style.transform = `translateY(${offset * 0.08}px)`;
          heroContent.style.opacity = String(Math.max(1 - offset / 500, 0.4));
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* =========================
   SCHEDULE A MEETING
   Paste a Calendly / Cal.com / Google booking link here to
   show a "Pick a time on our calendar" button on every service page.
========================= */

const VOS_BOOKING_URL = "";
const VOS_EMAIL = "contact@valleyoperationservices.com";

document.querySelectorAll(".booking-link").forEach((link) => {
  if (VOS_BOOKING_URL) {
    link.href = VOS_BOOKING_URL;
    link.hidden = false;
  }
});

document.querySelectorAll(".schedule-form").forEach((form) => {
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    if (d.get("_honey")) return; // spam bot

    const service = form.dataset.service || "General";
    const payload = {
      _subject: `Meeting request: ${service}`,
      _template: "table",
      _replyto: d.get("email"),
      Service: service,
      Name: d.get("name"),
      Company: d.get("company") || "",
      Email: d.get("email"),
      Phone: d.get("phone") || "",
      "Preferred date": d.get("date"),
      "Preferred time": d.get("time"),
      "Meeting type": d.get("format"),
      Notes: d.get("notes") || "",
    };

    button.disabled = true;
    button.firstChild.textContent = "Sending... ";
    status.textContent = "";
    status.className = "form-status";

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${VOS_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === "false") throw new Error(json.message || "Send failed");

      form.reset();
      trackEvent("contact_form_submit", { form_service: service });
      status.textContent = "Thanks! Your meeting request was sent. We will reach out shortly to confirm.";
      status.classList.add("is-success");
    } catch (err) {
      status.textContent = `Something went wrong. Please try again or email us at ${VOS_EMAIL}.`;
      status.classList.add("is-error");
    } finally {
      button.disabled = false;
      button.firstChild.textContent = "Request meeting ";
    }
  });
});
