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
    "React Developer",
    "UI/UX Designer",
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

/**
 * Interactive 3D tilt for the Hero Project Stack.
 */
function initHeroStack() {
  const stack = document.getElementById("hero-stack");
  const wrapper = stack?.parentElement;
  if (!stack || !wrapper) return;

  let isDragging = false;
  let startX, startY;
  let currentRotateX = 0;
  let currentRotateY = 0;

  // Mouse Interaction (Desktop)
  wrapper.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 992) return; // Use touch for mobile
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    stack.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  wrapper.addEventListener("mouseleave", () => {
    if (window.innerWidth < 992) return;
    stack.style.transform = "rotateX(0) rotateY(0)";
  });

  // Touch Interaction (Mobile)
  wrapper.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    stack.style.transition = "none"; // Disable transition for direct response
  }, { passive: true });

  wrapper.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    const deltaX = x - startX;
    const deltaY = y - startY;

    // Map drag to rotation (inverted Y for natural feel)
    currentRotateY = deltaX / 5;
    currentRotateX = -deltaY / 5;

    // Limit rotation to avoid flipping
    currentRotateX = Math.max(-30, Math.min(30, currentRotateX));
    currentRotateY = Math.max(-30, Math.min(30, currentRotateY));

    stack.style.transform = `rotateX(${currentRotateX + 10}deg) rotateY(${currentRotateY - 10}deg)`;
  }, { passive: true });

  wrapper.addEventListener("touchend", () => {
    isDragging = false;
    stack.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    stack.style.transform = "rotateX(10deg) rotateY(-10deg)"; // Return to attractive mobile angle
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project-card-v3");

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
 * Handles copying email to clipboard and showing a toast.
 */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll(".btn-copy-email");
  const toast = document.getElementById("toast-container");
  const toastMsg = document.getElementById("toast-message");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-email");
      if (!email) return;

      navigator.clipboard.writeText(email).then(() => {
        // Show toast
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      });
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
      initHeroStack();
    }),
    loadTemplate("expertise-container", "resources/templates/expertise.html"),
    loadTemplate("projects-container", "resources/templates/projects.html").then(
      initProjectFilters
    ),
    loadTemplate("about-container", "resources/templates/about.html").then(() => {
      initAboutCarousel();
    }),
    loadTemplate("contact-container", "resources/templates/contact.html"),
    loadTemplate("footer-container", "resources/templates/footer.html").then(
      setCurrentYear
    ),
  ];

  Promise.all(promises).then(() => {
    initScrollReveal();
    initEmailCopy();
    initSkillRadar();
    initUnderTheHood();
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

/**
 * Renders the interactive Skill Radar chart using Chart.js.
 */
function initSkillRadar() {
  const ctx = document.getElementById("skillRadar");
  if (!ctx) return;

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Backend', 'AI/LLM', 'DevOps', 'Next.js', 'React/TS'],
      datasets: [{
        label: 'Proficiency',
        data: [95, 88, 82, 90, 75],
        fill: true,
        backgroundColor: 'rgba(147, 197, 253, 0.2)',
        borderColor: '#93c5fd',
        pointBackgroundColor: '#93c5fd',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#93c5fd'
      }]
    },
    options: {
      elements: { line: { borderWidth: 2 } },
      scales: {
        r: {
          angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
          grid: { color: 'rgba(148, 163, 184, 0.2)' },
          pointLabels: { color: '#94a3b8', font: { size: 10 } },
          ticks: { display: false },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

/**
 * Handles the 'Under the Hood' technical overlays.
 */
function initUnderTheHood() {
  const btns = document.querySelectorAll(".under-the-hood-btn");
  const overlay = document.getElementById("technical-overlay");
  const closeBtn = document.querySelector(".overlay-close");
  const codeEl = document.getElementById("overlay-code");
  const titleEl = document.getElementById("overlay-title");
  const descEl = document.getElementById("overlay-description");

  if (!overlay || !closeBtn) return;

  const data = {
    expertise: {
      title: "Skills Architecture",
      code: "const techStack = {\n  frontend: ['React', 'Next.js', 'TypeScript'],\n  backend: ['PHP 8+', 'Python', 'Node.js']\n};",
      desc: "This section uses Chart.js to visualize technical balance. My core focus has shifted towards modern type-safe development with React and Next.js while maintaining deep expertise in backend automation."
    },
    joulery: {
      title: "Joulery Architecture",
      code: "export const SITE_CONFIG = {\n  name: 'JOULERY',\n  title: 'JOULERY | Creative Handcrafted Items',\n  keywords: ['handcrafted', 'jewelry', 'nextjs']\n};",
      desc: "Joulery is a modern e-commerce platform built with Next.js 14, leveraging App Router for optimal performance and Tailwind CSS for a refined, responsive UI."
    }
    // Add more sections as needed
  };

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section");
      const info = data[section];
      if (!info) return;

      titleEl.textContent = info.title;
      codeEl.textContent = info.code;
      descEl.textContent = info.desc;
      overlay.classList.add("show");
    });
  });

  closeBtn.addEventListener("click", () => overlay.classList.remove("show"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("show");
  });
}

