const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll("[data-reveal]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp]");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const brandLogo = document.querySelector(".brand img");
const galleryImages = document.querySelectorAll(".gallery-grid img");

const whatsappNumbers = {
  geral: "5521972674780",
  aluguel: "5521972002292",
  venda: "5521971486886",
  manutencao: "5521971486886"
};

const defaultMessages = {
  geral: "Olá, vim pelo site da Garra Geradores e quero atendimento.",
  aluguel: "Olá, vim pelo site da Garra Geradores e quero falar sobre aluguel de gerador.",
  venda: "Olá, vim pelo site da Garra Geradores e quero falar sobre venda de gerador.",
  manutencao: "Olá, vim pelo site da Garra Geradores e quero falar sobre manutenção de gerador."
};

function buildWhatsappUrl(type = "geral", message = defaultMessages[type] || defaultMessages.geral) {
  const number = whatsappNumbers[type] || whatsappNumbers.geral;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function syncWhatsappLinks() {
  whatsappLinks.forEach((link) => {
    const type = link.dataset.whatsapp || "geral";
    link.href = buildWhatsappUrl(type);
    link.target = "_blank";
    link.rel = "noreferrer";
  });
}

brandLogo?.addEventListener("error", () => {
  brandLogo.closest(".brand")?.classList.add("logo-missing");
});

galleryImages.forEach((image) => {
  image.addEventListener("error", () => {
    image.closest("figure")?.classList.add("image-missing");
  });
});

if (brandLogo?.complete && brandLogo.naturalWidth === 0) {
  brandLogo.closest(".brand")?.classList.add("logo-missing");
}

galleryImages.forEach((image) => {
  if (image.complete && image.naturalWidth === 0) {
    image.closest("figure")?.classList.add("image-missing");
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

menuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const type = data.get("tipo")?.toString() || "geral";
  const name = data.get("nome")?.toString().trim();
  const phone = data.get("telefone")?.toString().trim();
  const place = data.get("local")?.toString().trim();
  const details = data.get("mensagem")?.toString().trim();
  const typeLabel = {
    aluguel: "Aluguel de gerador",
    venda: "Venda de gerador",
    manutencao: "Manutenção preventiva/corretiva"
  }[type] || "Atendimento";

  const message = [
    "Olá, vim pelo site da Garra Geradores.",
    `Tipo de atendimento: ${typeLabel}`,
    name ? `Nome: ${name}` : "",
    phone ? `Telefone: ${phone}` : "",
    place ? `Local: ${place}` : "",
    details ? `Mensagem: ${details}` : ""
  ].filter(Boolean).join("\n");

  if (formNote) formNote.textContent = "Abrindo WhatsApp com as informações do formulário.";
  window.open(buildWhatsappUrl(type, message), "_blank", "noopener,noreferrer");
});

window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;
  header.style.background = "#e46a18";
}, { passive: true });

syncWhatsappLinks();
