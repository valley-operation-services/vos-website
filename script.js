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
  ".svc-include, .svc-signs, .schedule-panel"
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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const service = form.dataset.service || "General";
    const subject = `Meeting request: ${service}`;
    const body = [
      `Service: ${service}`,
      `Name: ${d.get("name")}`,
      `Company: ${d.get("company") || ""}`,
      `Email: ${d.get("email")}`,
      `Phone: ${d.get("phone") || ""}`,
      `Preferred date: ${d.get("date")}`,
      `Preferred time: ${d.get("time")}`,
      `Meeting type: ${d.get("format")}`,
      "",
      "What I'd like to talk about:",
      d.get("notes") || "",
    ].join("\n");
    window.location.href =
      `mailto:${VOS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
