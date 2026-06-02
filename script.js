const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const yearSpan = document.getElementById("year");
const preloader = document.getElementById("preloader");

window.addEventListener("load", () => {
  if (preloader) {
    preloader.classList.add("hidden");
  }
});

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const animatedCards = document.querySelectorAll(".tilt-card");
animatedCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const cardRect = card.getBoundingClientRect();
    const x = event.clientX - cardRect.left;
    const y = event.clientY - cardRect.top;
    const rotateY = ((x / cardRect.width) - 0.5) * 8;
    const rotateX = ((y / cardRect.height) - 0.5) * -8;
    card.style.transform = `translateY(-8px) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
}
);

document.querySelectorAll(".page-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) {
      return;
    }
    event.preventDefault();
    document.body.style.opacity = "0";
    document.body.style.transform = "translateY(6px)";
    setTimeout(() => {
      window.location.href = href;
    }, 220);
  });
});

const EMAILJS_PUBLIC_KEY = "FH-GJzuU9gi_8iJb6";
const EMAILJS_SERVICE_ID = "service_gp20swy";
const EMAILJS_TEMPLATE_ID = "template_960lwvw";

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const emailJsReady = typeof window.emailjs !== "undefined";

if (emailJsReady && EMAILJS_PUBLIC_KEY !== "REPLACE_WITH_YOUR_PUBLIC_KEY") {
  window.emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!formStatus) {
      return;
    }

    if (!emailJsReady) {
      formStatus.textContent = "Email service not loaded. Please check internet and refresh.";
      return;
    }

    if (
      EMAILJS_PUBLIC_KEY === "REPLACE_WITH_YOUR_PUBLIC_KEY" ||
      EMAILJS_SERVICE_ID === "REPLACE_WITH_YOUR_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "REPLACE_WITH_YOUR_TEMPLATE_ID"
    ) {
      formStatus.textContent = "Add EmailJS keys in script.js to activate the form.";
      return;
    }

    formStatus.textContent = "Sending message...";
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = true;
    }

    const formData = new FormData(contactForm);
    const templateParams = {
      from_name: formData.get("from_name"),
      from_email: formData.get("from_email"),
      subject: formData.get("subject"),
      message: formData.get("message")
    };

    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      formStatus.textContent = "Message sent successfully. Thank you!";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = "Failed to send. Please try again.";
    } finally {
      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = false;
      }
    }
  });
}
