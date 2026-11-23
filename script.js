
/* =====================================
   PORTFOLIO INTERACTIONS
===================================== */

// DARK / LIGHT MODE

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  if (themeToggle) {
    themeToggle.textContent =
      theme === "dark" ? "☀️" : "🌙";

    themeToggle.setAttribute(
      "aria-label",
      theme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
  }

  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }
}

// Load saved theme

let savedTheme = "light";

try {
  savedTheme =
    localStorage.getItem("portfolio-theme") || "light";
} catch (error) {
  console.warn("Theme storage unavailable.");
}

applyTheme(savedTheme);

// Toggle theme

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    applyTheme(
      currentTheme === "dark" ? "light" : "dark"
    );
  });
}


// SCROLL REVEAL ANIMATIONS

const revealElements = document.querySelectorAll(
  "section, .project-card, .contact-side, .sent"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach(element => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}
