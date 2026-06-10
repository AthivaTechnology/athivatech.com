// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navMenu = document.getElementById("navMenu");

mobileMenuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  // Animate hamburger icon
  const spans = mobileMenuToggle.querySelectorAll("span");
  if (navMenu.classList.contains("active")) {
    spans[0].style.transform = "rotate(45deg) translateY(10px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translateY(-10px)";
  } else {
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const spans = mobileMenuToggle.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  }

  lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animations
const animateElements = document.querySelectorAll(
  ".service-card, .case-study-card, .stat, .tech-item"
);
animateElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// ── reCAPTCHA Configuration ──────────────────────────────────
const V3_SITE_KEY = "6LdhFQstAAAAAAHKtwXRO2f2_bhnXC6fkxH1yiz0";
const V2_SITE_KEY = "6LfdFQstAAAAAAGA4jQ-2gEFTdZV1do_08ycUk1U";
const SCRIPT_URL  = "https://script.google.com/macros/s/AKfycbxMF3h0O8CLqEyh7xLMxtdRqsQYMCWxu88jjXGzasBlJ2D_AfUPzkykZnYEICxFqv0/exec";

// ── Contact Form with reCAPTCHA v3 + v2 Fallback ─────────────
const contactForm = document.getElementById("contactForm");
let v2WidgetId  = null;
let v2Required  = false;

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData  = new FormData(contactForm);
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const origText  = submitBtn.textContent;

  submitBtn.disabled    = true;
  submitBtn.textContent = "Sending...";
  submitBtn.style.opacity = "0.6";

  try {
    let recaptchaToken, recaptchaVersion;

    if (v2Required) {
      // v2 path: read completed checkbox token
      recaptchaToken   = grecaptcha.getResponse(v2WidgetId);
      recaptchaVersion = "v2";
      if (!recaptchaToken) {
        document.getElementById("recaptchaV2Error").style.display = "block";
        return;
      }
    } else {
      // v3 path: execute silently in background
      recaptchaToken = await new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
          grecaptcha.execute(V3_SITE_KEY, { action: "contact" })
            .then(resolve)
            .catch(reject);
        });
      });
      recaptchaVersion = "v3";
    }

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        name:             formData.get("name"),
        email:            formData.get("email"),
        subject:          formData.get("subject"),
        message:          formData.get("message"),
        date:             new Date().toISOString(),
        recaptchaToken,
        recaptchaVersion,
      }),
    });

    const result = await response.json();

    if (result.result === "success") {
      showNotification("Thank you for your message! We will get back to you soon.", "success");
      contactForm.reset();
      if (v2Required) {
        grecaptcha.reset(v2WidgetId);
        v2Required = false;
        v2WidgetId = null;
        document.getElementById("recaptchaV2Container").style.display = "none";
        document.getElementById("recaptchaV2Error").style.display     = "none";
      }
    } else if (result.result === "low_score") {
      showV2Challenge();
    } else {
      throw new Error(result.error || "Something went wrong");
    }

  } catch (error) {
    console.error("Error:", error);
    showNotification(
      "Oops! Something went wrong. Please try again or email us directly at admin@athivatech.com",
      "error"
    );
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = origText;
    submitBtn.style.opacity = "1";
  }
});

function showV2Challenge() {
  const container = document.getElementById("recaptchaV2Container");
  container.style.display = "block";
  if (v2WidgetId === null) {
    v2WidgetId = grecaptcha.render("recaptchaV2Widget", {
      sitekey: V2_SITE_KEY,
      theme:   "light",
    });
  } else {
    grecaptcha.reset(v2WidgetId);
  }
  v2Required = true;
  showNotification("One more step — complete the security check below, then click Send Message again.", "info");
  container.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Notification function to show messages to users
function showNotification(message, type = "info") {
  // Remove any existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;

  // Set colors based on type
  if (type === "success") {
    notification.style.background = "#10b981";
    notification.style.color = "white";
  } else if (type === "error") {
    notification.style.background = "#ef4444";
    notification.style.color = "white";
  } else {
    notification.style.background = "#3b82f6";
    notification.style.color = "white";
  }

  // Add animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Add to page
  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add active class to current nav link based on scroll position
window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section[id]");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Parallax effect for hero background
window.addEventListener("scroll", () => {
  const heroBackground = document.querySelector(".hero-background");
  if (heroBackground) {
    const scrolled = window.pageYOffset;
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Counter animation for stats
const stats = document.querySelectorAll(".stat-value");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
        entry.target.classList.add("counted");
        const target = entry.target.textContent;
        const isNumber = /^\d+\+?$/.test(target);

        if (isNumber) {
          const finalValue = parseInt(target);
          let currentValue = 0;
          const increment = finalValue / 50;
          const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
              entry.target.textContent = target;
              clearInterval(timer);
            } else {
              entry.target.textContent =
                Math.floor(currentValue) + (target.includes("+") ? "+" : "");
            }
          }, 30);
        }
      }
    });
  },
  { threshold: 0.5 }
);

stats.forEach((stat) => statObserver.observe(stat));

console.log("Athiva Technology website loaded successfully!");