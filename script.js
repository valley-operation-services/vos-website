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
  ".section-heading, .statement-grid, .about-intro, .contact-panel, .hero-proof > div"
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
