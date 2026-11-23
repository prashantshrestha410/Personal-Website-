// PROJECT PDF VIEWER

function openProjectPDF(file) {
  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("projectPDFFrame");

  frame.src = file;
  modal.classList.add("active");

  document.body.style.overflow = "hidden";
}

function closeProjectPDF() {
  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("projectPDFFrame");

  modal.classList.remove("active");
  frame.src = "";

  document.body.style.overflow = "";
}

// Close modal when clicking outside
document.getElementById("pdfModal").addEventListener(
  "click",
  function(event) {
    if (event.target === this) {
      closeProjectPDF();
    }
  }
);

// Close using Escape key
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeProjectPDF();
  }
});
    // Presentation viewer
const presentationEmbedURL = "PASTE_YOUR_GOOGLE_SLIDES_EMBED_URL";

function openPresentation() {
  document.getElementById("presentationFrame").src =
    presentationEmbedURL;

  document.getElementById("presentationModal")
    .classList.add("active");
}

function closePresentation() {
  document.getElementById("presentationModal")
    .classList.remove("active");

  document.getElementById("presentationFrame").src = "";
    }
    
