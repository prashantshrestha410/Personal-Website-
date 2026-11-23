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
    // Contact form: Supabase email OTP verification + secure Edge Function submission.
    // Replace these two public project values with your own Supabase project details.
    const SUPABASE_URL = "https://arvaqzwhxrpzcwzfplnw.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_yypuUhsWdcD-2swJunwCeg_eKivDb6a";

    const form = document.getElementById("contactForm");
    const grid = document.getElementById("contactGrid");
    const note = document.getElementById("formNote");
    const btn = document.getElementById("sendBtn");
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    const verifyCodeBtn = document.getElementById("verifyCodeBtn");
    const verifyStatus = document.getElementById("verifyStatus");
    const otpField = document.getElementById("otpField");
    const emailInput = form.elements.email;
    let verifiedEmail = "";
    let supabaseClient = null;

    if (window.supabase && !SUPABASE_URL.startsWith("YOUR_") &&
        !SUPABASE_PUBLISHABLE_KEY.startsWith("YOUR_")) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    }

    const validators = {
      name: (v) => v.trim().length >= 2 || "Please tell me your name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "That email doesn't look right.",
      message: (v) => v.trim().length >= 10 || "A sentence or two is plenty.",
    };

    function check(input) {
      const rule = validators[input.name];
      if (!rule) return true;
      const result = rule(input.value);
      const field = input.closest(".field");
      const err = field.querySelector(".err");
      if (result === true) {
        field.classList.remove("invalid");
        err.textContent = "";
        input.removeAttribute("aria-invalid");
        return true;
      }
      field.classList.add("invalid");
      err.textContent = result;
      input.setAttribute("aria-invalid", "true");
      return false;
    }

    function setVerifyStatus(message, state = "") {
      verifyStatus.textContent = message;
      verifyStatus.className = "verify-status" + (state ? " " + state : "");
    }

    function resetEmailVerification() {
      verifiedEmail = "";
      btn.disabled = true;
      otpField.classList.remove("show");
      document.getElementById("otp").value = "";
      setVerifyStatus("Verify your email before sending a message.");
    }

    Object.keys(validators).forEach((n) => {
      const input = form.elements[n];
      input.addEventListener("blur", () => input.value && check(input));
      input.addEventListener("input", () => {
        if (input.closest(".field").classList.contains("invalid")) check(input);
        if (n === "email" && verifiedEmail && input.value.trim().toLowerCase() !== verifiedEmail) {
          resetEmailVerification();
        }
      });
    });

    sendCodeBtn.addEventListener("click", async () => {
      if (!check(emailInput)) {
        emailInput.focus();
        return;
      }
      if (!supabaseClient) {
        setVerifyStatus("Supabase is not configured yet. Add your project URL and publishable key.", "bad");
        return;
      }

      sendCodeBtn.disabled = true;
      setVerifyStatus("Sending verification code…");
      try {
        const { error } = await supabaseClient.auth.signInWithOtp({
          email: emailInput.value.trim(),
          options: { shouldCreateUser: true }
        });
        if (error) throw error;
        otpField.classList.add("show");
        setVerifyStatus("Code sent. Check your inbox (and spam folder).", "ok");
        document.getElementById("otp").focus();
      } catch (error) {
        setVerifyStatus(error.message || "Could not send the code. Please try again.", "bad");
      } finally {
        sendCodeBtn.disabled = false;
      }
    });

    verifyCodeBtn.addEventListener("click", async () => {
      const token = document.getElementById("otp").value.trim();
      if (!/^\d{6}$/.test(token)) {
        setVerifyStatus("Enter the 6-digit code from your email.", "bad");
        return;
      }
      if (!supabaseClient) {
        setVerifyStatus("Supabase is not configured yet.", "bad");
        return;
      }

      verifyCodeBtn.disabled = true;
      setVerifyStatus("Verifying email…");
      try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
          email: emailInput.value.trim(),
          token,
          type: "email"
        });
        if (error) throw error;
        if (!data.session) throw new Error("Verification succeeded, but no session was created. Check Supabase email OTP settings.");
        verifiedEmail = emailInput.value.trim().toLowerCase();
        btn.disabled = false;
        setVerifyStatus("Email verified. You can now send your message.", "ok");
        note.textContent = "Your email is verified. Complete the form and send your message.";
        note.className = "form-note ok";
      } catch (error) {
        setVerifyStatus(error.message || "That code could not be verified. Try again.", "bad");
      } finally {
        verifyCodeBtn.disabled = false;
        }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = Object.keys(validators).map((n) => form.elements[n]);
      const results = fields.map(check);
      if (results.includes(false)) {
        fields[results.indexOf(false)].focus();
        return;
      }
      if (!verifiedEmail || emailInput.value.trim().toLowerCase() !== verifiedEmail) {
        setVerifyStatus("Please verify this email address before sending.", "bad");
        emailInput.focus();
        return;
      }
      if (form.elements.website.value.trim()) return;
      if (!supabaseClient) {
        note.className = "form-note bad";
        note.textContent = "Supabase is not configured yet. Please try again later.";
        return;
      }

      btn.disabled = true;
      sendCodeBtn.disabled = true;
      note.className = "form-note";
      note.textContent = "Sending your message…";

      try {
        const payload = {
          name: form.elements.name.value.trim(),
          email: emailInput.value.trim(),
          projectType: form.elements["project-type"].value,
          message: form.elements.message.value.trim(),
          website: form.elements.website.value
        };
        const { data, error } = await supabaseClient.functions.invoke("send-contact", { body: payload });
        if (error) throw error;
        if (data && data.error) throw new Error(data.error);

        form.reset();
        verifiedEmail = "";
        otpField.classList.remove("show");
        setVerifyStatus("Verify your email before sending a message.");
        note.textContent = "All fields except project type are required.";
        note.className = "form-note";
        btn.disabled = true;
        grid.classList.add("done");
      } catch (error) {
  let message = "Something went wrong sending your message. Please try again.";

  // Read the actual response from the Edge Function.
  try {
    const response = error?.context;

    if (response && typeof response.clone === "function") {
      const details = await response.clone().json();

      if (response.status === 429 && details?.error) {
        message = details.error;
      } else if (details?.error) {
        message = details.error;
      }
    }
  } catch (_) {
    // Keep the default message if the response cannot be read.
  }

  note.className = "form-note bad";
  note.textContent = message;
} finally {
        btn.disabled = !verifiedEmail;
        sendCodeBtn.disabled = false;
      }
    });

    document.getElementById("againBtn").addEventListener("click", () => {
      grid.classList.remove("done");
      resetEmailVerification();
      note.className = "form-note";
      note.textContent = "Verify your email before sending your message.";
      form.elements.name.focus();
    });
    // Dark and Light Mode
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";

  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );

  localStorage.setItem("portfolio-theme", theme);
}

// Load saved theme
const savedTheme = localStorage.getItem("portfolio-theme") || "light";
applyTheme(savedTheme);

// Toggle theme
themeToggle.addEventListener("click", () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";

  applyTheme(currentTheme === "light" ? "dark" : "light");
});

          
    
