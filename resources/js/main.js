async function loadTemplate(containerId, templatePath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${templatePath}: ${response.status}`);
    }
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(error);
    container.innerHTML =
      '<div class="container py-3 text-danger">Error loading section.</div>';
  }
}

function setCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function initHeroTyping() {
  const subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle) return;

  const textSpan = subtitle.querySelector(".hero-typing-text");
  const caret = subtitle.querySelector(".hero-caret");

  if (!textSpan || !caret) return;

  const titles = [
    "Full Stack Developer",
    "Next.js Specialist",
    "Payload CMS Developer",
    "React Developer",
    "Backend Automation",
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeSpeed = 60;
  const deleteSpeed = 35;
  const pauseAtEnd = 2200;
  const pauseAtStart = 500;

  function step() {
    const currentTitle = titles[titleIndex];

    if (!deleting) {
      textSpan.textContent = currentTitle.slice(0, charIndex + 1);
      charIndex += 1;

      if (charIndex === currentTitle.length) {
        deleting = true;
        setTimeout(step, pauseAtEnd);
        return;
      }

      setTimeout(step, typeSpeed);
    } else {
      textSpan.textContent = currentTitle.slice(0, charIndex - 1);
      charIndex -= 1;

      if (charIndex === 0) {
        deleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(step, pauseAtStart);
        return;
      }

      setTimeout(step, deleteSpeed);
    }
  }

  textSpan.textContent = "";
  setTimeout(step, pauseAtStart);
}



function initAboutCarousel() {
  const shell = document.querySelector('[data-carousel="about"]');
  if (!shell) return;

  const imgEl = shell.querySelector(".about-gallery-img");
  const counterEl = shell.querySelector(".about-gallery-counter");

  if (!imgEl || !counterEl) return;

  let images;
  try {
    const json = shell.getAttribute("data-images");
    images = json ? JSON.parse(json) : [];
  } catch {
    images = [];
  }

  if (!Array.isArray(images) || images.length === 0) {
    images = [imgEl.getAttribute("src")].filter(Boolean);
  }

  let index = 0;

  function render() {
    const total = images.length;
    const src = images[index];
    const show = () => {
      imgEl.src = src;
      imgEl.classList.add("is-active");
      if (counterEl) {
        counterEl.textContent = `${index + 1} / ${total}`;
      }
    };

    imgEl.classList.remove("is-active");
    window.setTimeout(show, 40);
  }

  function go(delta) {
    const total = images.length;
    index = (index + delta + total) % total;
    render();
  }

  const intervalMs = 3500;
  const autoplay = window.setInterval(() => go(1), intervalMs);
  shell.addEventListener("pointerenter", () => window.clearInterval(autoplay), {
    once: true,
  });

  render();
}

/**
 * Updates the scroll progress bar at the top of the page.
 */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });
}

/**
 * Initializes Intersection Observer to reveal elements on scroll.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Once revealed, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Trigger slightly before element is in view
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project-row");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projects.forEach((project) => {
        const category = project.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          project.classList.remove("hide-filter");
          // Re-trigger reveal animation if it was already active
          project.classList.add("active");
        } else {
          project.classList.add("hide-filter");
        }
      });
    });
  });
}

/**
 * Initializes the back-to-top button visibility and click behavior.
 */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}



/**
 * Shows the toast notification with the given message.
 */
function showToast(message) {
  const toast = document.getElementById("toast-container");
  const toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/**
 * Handles copying email to clipboard and showing a toast.
 */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll(".btn-copy-email");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email");
      if (!email) return;

      navigator.clipboard.writeText(email).then(() => {
        showToast("Copied to clipboard!");
      });
    });
  });
}

/**
 * Submits the contact form to Web3Forms via fetch, so the page
 * never navigates away, and reports the result via toast.
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    const submitLabel = submitBtn.querySelector("span");
    const originalLabel = submitLabel.textContent;

    submitBtn.disabled = true;
    submitLabel.textContent = "Sending...";

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showToast("Message sent — I'll get back to you soon!");
          form.reset();
        } else {
          showToast("Something went wrong. Please email me directly.");
        }
      })
      .catch(() => {
        showToast("Something went wrong. Please email me directly.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitLabel.textContent = originalLabel;
      });
  });
}

/**
 * Highlights the active navigation link based on scroll position.
 */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  window.addEventListener("scroll", () => {
    let current = "hero"; // Default to hero

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // If we've scrolled past the top of the section (with an offset)
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    // Handle special case for bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
      current = sections[sections.length - 1].getAttribute("id");
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === "#" + current || (current === "hero" && href === "#")) {
        link.classList.add("active");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initBackToTop();
  initScrollSpy();

  const promises = [
    loadTemplate("navbar-container", "resources/templates/navbar.html"),
    loadTemplate("hero-container", "resources/templates/hero.html").then(() => {
      initHeroTyping();
    }),
    loadTemplate("expertise-container", "resources/templates/expertise.html"),
    loadTemplate("projects-container", "resources/templates/projects.html").then(
      initProjectFilters
    ),
    loadTemplate("about-container", "resources/templates/about.html").then(() => {
      initAboutCarousel();
    }),
    loadTemplate("contact-container", "resources/templates/contact.html").then(
      initContactForm
    ),
    loadTemplate("footer-container", "resources/templates/footer.html").then(
      setCurrentYear
    ),
  ];

  Promise.all(promises).then(() => {
    initScrollReveal();
    initEmailCopy();
    initMobileMenu();
  });
});

/**
 * Handles mobile-specific navigation behaviors.
 */
function initMobileMenu() {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const menuCollapse = document.getElementById("navbarNav");
  const bsCollapse = menuCollapse ? new bootstrap.Collapse(menuCollapse, { toggle: false }) : null;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Auto-close menu on link click if it's currently shown (mobile)
      if (menuCollapse && menuCollapse.classList.contains("show")) {
        bsCollapse.hide();
      }
    });
  });
}


