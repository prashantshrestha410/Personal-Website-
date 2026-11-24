
// ========================================
// PORTFOLIO — MAIN JAVASCRIPT
// ========================================


// 1. DARK / LIGHT MODE
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  localStorage.setItem("portfolio-theme", theme);
}

const savedTheme = localStorage.getItem("portfolio-theme") || "light";
applyTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});


// 2. MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});


// 3. STICKY NAVBAR
const navbar = document.getElementById("nav");

function updateNavbar() {
  navbar?.classList.toggle("scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();


// 4. SCROLL REVEAL ANIMATIONS
const revealElements = document.querySelectorAll(
  ".section, .hero-content, .project-card, .service-card, .timeline-item"
);

revealElements.forEach(element => element.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("show"));
}


// 5. ACTIVE NAVIGATION INDICATOR
const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));
}


// 6. SMOOTH SCROLLING
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  
// ========================================
// PDF PROJECT VIEWER
// ========================================

function openProjectPDF(file) {
  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("projectPDFFrame");

  if (!modal || !frame) return;

  frame.src = file;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProjectPDF() {
  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("projectPDFFrame");

  modal?.classList.remove("active");

  if (frame) frame.src = "";

  document.body.style.overflow = "";
}


// Close PDF when clicking outside the viewer
document.getElementById("pdfModal")?.addEventListener("click", event => {
  if (event.target.id === "pdfModal") {
    closeProjectPDF();
  }
});
  
// ========================================
// PRESENTATION VIEWER
// ========================================

const presentationEmbedURL =
  "https://docs.google.com/presentation/d/1VsVQKVoqxlXggIb3kCIptmdnB9mfKMZ/embed";

function openPresentation() {
  const modal = document.getElementById("presentationModal");
  const frame = document.getElementById("presentationFrame");

  if (!modal || !frame) return;

  frame.src = presentationEmbedURL;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePresentation() {
  const modal = document.getElementById("presentationModal");
  const frame = document.getElementById("presentationFrame");

  modal?.classList.remove("active");

  if (frame) frame.src = "";

  document.body.style.overflow = "";
}


// Close presentation when clicking outside
document.getElementById("presentationModal")?.addEventListener(
  "click",
  event => {
    if (event.target.id === "presentationModal") {
      closePresentation();
    }
  }
);
  
// ========================================
// MODAL & KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProjectPDF();
    closePresentation();

    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});


// ========================================
// CLOSE BUTTONS
// ========================================

document.querySelectorAll("[data-close-pdf]").forEach(button => {
  button.addEventListener("click", closeProjectPDF);
});

document.querySelectorAll("[data-close-presentation]").forEach(button => {
  button.addEventListener("click", closePresentation);
});
  
// ========================================
// TOUCH MICRO-INTERACTIONS
// ========================================

document.querySelectorAll(
  ".project-card, .service-card, .stat-card"
).forEach(card => {
  card.addEventListener("touchstart", () => {
    card.classList.add("touch-active");
  }, { passive: true });

  card.addEventListener("touchend", () => {
    card.classList.remove("touch-active");
  }, { passive: true });

  card.addEventListener("touchcancel", () => {
    card.classList.remove("touch-active");
  }, { passive: true });
});
  
// ========================================
// ACCESSIBILITY: REDUCED MOTION
// ========================================

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if (reducedMotion.matches) {
  document.documentElement.classList.add("reduce-motion");
}
});


// 7. BACK TO TOP
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("visible", window.scrollY > 450);
}, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// 8. PAGE LOADER
window.addEventListener("load", () => {
  document.getElementById("pageLoader")?.classList.add("hide");
});


// 9. AUTOMATIC FOOTER YEAR
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
