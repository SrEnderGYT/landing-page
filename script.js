// ── ELEMENTOS ──
const menuToggle = document.querySelector("#menuToggle");
const primaryMenu = document.querySelector("#primaryMenu");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const navLinks = document.querySelectorAll(".navbar__links a");
const siteHeader = document.querySelector(".site-header");
const downloadModal = document.querySelector("#downloadModal");

// ── MODAL ──
function openModal() { downloadModal.classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal() { downloadModal.classList.remove("open"); document.body.style.overflow = ""; }

document.querySelector("#openModal")?.addEventListener("click", openModal);
document.querySelector("#openModal2")?.addEventListener("click", openModal);
document.querySelector("#modalClose")?.addEventListener("click", closeModal);
downloadModal?.addEventListener("click", (e) => { if (e.target === downloadModal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ── HEADER SCROLL SHADOW ──
window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// ── NAVBAR ACTIVO POR SCROLL ──
const sections = document.querySelectorAll("section[id]");

function onScroll() {
  let current = "hero";
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach(link => {
    const isActive = link.getAttribute("href") === `#${current}`;
    link.classList.toggle("is-active", isActive);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

// ── MENÚ HAMBURGUESA ──
menuToggle.addEventListener("click", () => {
  const isOpen = primaryMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

// ── SCROLL SUAVE ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (primaryMenu.classList.contains("is-open")) {
      primaryMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }
  });
});

// ── REVEAL ON SCROLL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ── CONTADOR ANIMADO EN STATS ──
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".stat-num").forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector(".stats-bar");
if (statsBar) statsObserver.observe(statsBar);

// ── VALIDACIÓN FORMULARIO ──
function showFieldError(field, msg) {
  const error = document.querySelector(`#${field.id}Error`);
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", error.id);
  error.textContent = msg;
}
function clearFieldError(field) {
  const error = document.querySelector(`#${field.id}Error`);
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
  error.textContent = "";
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  const fields = [name, email, message];
  let isValid = true;

  fields.forEach(clearFieldError);
  formStatus.textContent = "";

  if (name.value.trim().length < 2) { showFieldError(name, "Ingresa tu nombre para contactarte."); isValid = false; }
  if (!isValidEmail(email.value.trim())) { showFieldError(email, "Ingresa un correo válido, ej. nombre@correo.com."); isValid = false; }
  if (message.value.trim().length < 10) { showFieldError(message, "Escribe al menos 10 caracteres."); isValid = false; }

  if (!isValid) {
    fields.find(f => f.getAttribute("aria-invalid") === "true")?.focus();
    return;
  }

  const btn = contactForm.querySelector("button[type=submit]");
  btn.textContent = "Enviando...";
  btn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    formStatus.textContent = "✅ Mensaje enviado. Gracias por contactar a Agrosoft.";
    btn.textContent = "Enviar mensaje →";
    btn.disabled = false;
  }, 1200);
});
