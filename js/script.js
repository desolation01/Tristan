const STORAGE_KEY = "portfolio_theme";

// --- SECURITY & CSRF ---
let csrfToken = null;

async function fetchCsrfToken() {
  if (csrfToken) return csrfToken;
  try {
    const r = await fetch("/api/api?action=token&t=" + Date.now());
    const data = await r.json();
    if (data.token) csrfToken = data.token;
    return csrfToken;
  } catch (e) {
    console.error("Failed to fetch CSRF token", e);
    return null;
  }
}

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  const btn = document.querySelector(".theme-toggle");
  if (btn) btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
}

function initThemeToggle() {
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const originalText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = "Sending...";
    status.style.display = "none";

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const token = await fetchCsrfToken();
      const res = await fetch("/api/api?action=contact", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();

      if (result.ok) {
        status.textContent = result.message || "Message sent successfully!";
        status.className = "contact-status is-success";
        form.reset();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (err) {
      status.textContent = err.message || "Something went wrong. Please try again.";
      status.className = "contact-status is-error";
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

function initMarquee() {
  const track = document.querySelector(".marquee-track");
  const groups = Array.from(document.querySelectorAll(".marquee-track > .marquee-group"));
  if (!track || groups.length < 2) return;

  const group = groups[0];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Build a seamless, viewport-filling loop:
  // 1. Drop the hardcoded duplicate (JS owns the copies now).
  groups.slice(1).forEach(g => g.remove());

  // 2. Clone the group until the track comfortably exceeds the viewport.
  const template = group;
  while (track.scrollWidth < window.innerWidth * 2) {
    const clone = template.cloneNode(true);
    clone.removeAttribute("aria-hidden");
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }

  // 3. Animate by exactly one group's width for a seamless loop.
  const distance = -group.offsetWidth;
  track.style.setProperty("--marquee-distance", distance + "px");

  if (reduceMotion) {
    track.style.animation = "none";
  }
}

window.addEventListener("resize", () => {
  initMarquee();
});

function initPhotoLightbox() {
  const triggers = document.querySelectorAll(".avatar, .brand-mark");
  if (!triggers.length) return;

  const body = document.body;

  // Build the lightbox once.
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "false");
  lightbox.setAttribute("aria-label", "Profile photo preview");
  lightbox.innerHTML =
    '<div class="lightbox-backdrop"></div><div class="lightbox-stage"><img src="./assets/profile.png" alt="" /></div>';
  body.appendChild(lightbox);

  const backdrop = lightbox.querySelector(".lightbox-backdrop");
  const stage = lightbox.querySelector(".lightbox-stage");
  const img = lightbox.querySelector("img");

  let closeTimer = null;

  const open = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    lightbox.classList.add("is-open");
  };
  const close = () => lightbox.classList.remove("is-open");
  const scheduleClose = () => {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(close, 250);
  };

  // Hover the small photo → open; moving away closes it again.
  triggers.forEach(t => {
    t.addEventListener("mouseenter", open);
    t.addEventListener("mouseleave", scheduleClose);
    t.addEventListener("focus", open);
    t.addEventListener("blur", scheduleClose);
  });

  // Keep it open while the cursor is actually over the popup.
  lightbox.addEventListener("mouseenter", open);
  lightbox.addEventListener("mouseleave", close);

  backdrop.addEventListener("click", close);
  stage.addEventListener("click", close);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
}

applyTheme(getInitialTheme());
initThemeToggle();
initMobileNav();
initYear();
initContactForm();
initMarquee();
initPhotoLightbox();
