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

/**
 * Builds the markup for one project row from a PROJECTS entry
 * (see resources/js/projects-data.js).
 */
function renderProjectRow(project) {
  const { category, categoryLabel, title, media, description, highlights, tech, links } = project;

  let mediaHtml = "";
  if (media.type === "video") {
    mediaHtml = `
        <button type="button" class="project-row-thumb-wrap project-row-video-wrap" aria-label="View video showcase of ${title}">
          <video
            class="project-row-thumb project-row-video"
            src="${media.src}"
            ${media.poster ? `poster="${media.poster}"` : ""}
            muted
            loop
            playsinline
            webkit-playsinline
            preload="metadata"
          ></video>
        </button>`;
  } else if (media.type === "image") {
    mediaHtml = `
        <button type="button" class="project-row-thumb-wrap" aria-label="View screenshot of ${title}">
          <img class="project-row-thumb" src="${media.src}" alt="${media.alt || title}">
          <span class="project-row-thumb-zoom"><i class="bi bi-zoom-in"></i></span>
        </button>`;
  }

  const highlightsHtml = highlights && highlights.length
    ? `
          <ul class="project-row-highlights">
            ${highlights.map((h) => `<li><strong>${h.label}:</strong> ${h.text}</li>`).join("\n            ")}
          </ul>`
    : "";

  const linksHtml = links
    .map((link) => {
      const icon = link.icon ? ` <i class="bi bi-arrow-up-right"></i>` : "";
      return `<a href="${link.href}" target="_blank" rel="noopener">${link.label}${icon}</a>`;
    })
    .join("\n              ");

  return `
      <article class="project-row reveal" data-category="${category}">${mediaHtml}
        <div class="project-row-body">
          <div class="project-row-head">
            <span class="project-row-category">${categoryLabel}</span>
            <h4 class="project-row-title">${title}</h4>
          </div>
          <p class="project-row-desc">
            ${description}
          </p>${highlightsHtml}
          <div class="project-row-meta">
            <span class="project-row-tech">${tech.join(" &middot; ")}</span>
            <div class="project-row-links">
              ${linksHtml}
            </div>
          </div>
        </div>
      </article>`;
}

/**
 * Renders the PROJECTS array (resources/js/projects-data.js) into the
 * project list. To reorder, edit or move entries in that array — this
 * just reflects whatever order they're in.
 */
function renderProjects() {
  const container = document.getElementById("project-list");
  if (!container || typeof PROJECTS === "undefined") return;
  container.innerHTML = PROJECTS.map(renderProjectRow).join("\n");
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
 * Opens project thumbnails in a full-size modal on click.
 */
function initImageModal() {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("image-modal-img");
  const closeBtn = modal?.querySelector(".image-modal-close");
  const thumbs = document.querySelectorAll(".project-row-thumb-wrap");

  if (!modal || !modalImg || !closeBtn || !thumbs.length) return;

  const openModal = (src, alt) => {
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add("show");
  };

  const closeModal = () => {
    modal.classList.remove("show");
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const img = thumb.querySelector("img");
      if (img) openModal(img.src, img.alt);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/**
 * Opens the resume PDF in a modal from the navbar button.
 */
function initResumeModal() {
  const btn = document.getElementById("resume-btn");
  const modal = document.getElementById("resume-modal");
  const closeBtn = modal?.querySelector(".resume-modal-close");

  if (!btn || !modal || !closeBtn) return;

  const openModal = () => modal.classList.add("show");
  const closeModal = () => modal.classList.remove("show");

  btn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/**
 * Plays project showcase videos only while they're crossing a band through
 * the vertical center of the screen (so they don't burn bandwidth/CPU
 * off-screen), and auto-enlarges the thumbnail while it's in that band
 * instead of requiring a mouse hover. rootMargin shrinks the detection
 * zone down to that center band rather than the full viewport, so it
 * compresses as soon as it drifts off-center — not only once fully hidden.
 */
function initProjectVideos() {
  const videos = document.querySelectorAll(".project-row-video");
  if (!videos.length) return;

  // iOS Safari/Arc are far more reliable about honoring the `autoplay`
  // attribute on a muted video than a bare, gesture-less video.play() call —
  // and merely flipping the `preload` property doesn't make the browser
  // actually start fetching; only load() does. So the first time a video
  // scrolls into view we set `autoplay`, force a load(), and only then
  // call play() as a backup for the (rare) engine that still needs it.
  const attemptPlay = (video) => {
    video.muted = true;
    if (!video.hasAttribute("autoplay")) {
      video.setAttribute("autoplay", "");
      video.load();
    }
    video.play().catch(() => {});
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        const wrap = video.closest(".project-row-video-wrap");
        if (entry.isIntersecting) {
          attemptPlay(video);
          wrap?.classList.add("in-view");
        } else {
          video.pause();
          wrap?.classList.remove("in-view");
        }
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
  );

  videos.forEach((video) => observer.observe(video));
}

/**
 * Opens project showcase videos full-size in a modal on click.
 */
function initVideoModal() {
  const modal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("video-modal-video");
  const closeBtn = modal?.querySelector(".image-modal-close");
  const triggers = document.querySelectorAll(".project-row-video-wrap");

  if (!modal || !modalVideo || !closeBtn || !triggers.length) return;

  const openModal = (src) => {
    modalVideo.src = src;
    modal.classList.add("show");
    modalVideo.play().catch(() => {});
  };

  const closeModal = () => {
    modal.classList.remove("show");
    modalVideo.pause();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const video = trigger.querySelector("video");
      if (video) openModal(video.currentSrc || video.src);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
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
    loadTemplate("navbar-container", "resources/templates/navbar.html").then(
      initResumeModal
    ),
    loadTemplate("hero-container", "resources/templates/hero.html").then(() => {
      initHeroTyping();
    }),
    loadTemplate("projects-container", "resources/templates/projects.html").then(() => {
      renderProjects();
      initProjectFilters();
      initImageModal();
      initProjectVideos();
      initVideoModal();
    }),
    loadTemplate("expertise-container", "resources/templates/expertise.html"),
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


