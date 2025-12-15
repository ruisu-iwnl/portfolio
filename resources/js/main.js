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
    "Full Stack PHP Developer",
    "Web Developer",
    "UI/UX Designer",
    "Front-end Developer",
    "Back-end Developer",
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

function initProjectsCarousel() {
  const shell = document.querySelector('[data-carousel="projects"]');
  if (!shell) return;

  const track = shell.querySelector(".projects-track");
  const prevBtn = shell.querySelector(".projects-nav-prev");
  const nextBtn = shell.querySelector(".projects-nav-next");

  if (!track || !prevBtn || !nextBtn) return;

  const scrollStep = () => {
    const card = track.querySelector(".project-card");
    const base = card ? card.getBoundingClientRect().width + 16 : 320;
    return Math.min(base, track.clientWidth * 0.85);
  };

  function updateDisabled() {
    prevBtn.disabled = track.scrollLeft <= 4;
    const maxScroll = track.scrollWidth - track.clientWidth;
    nextBtn.disabled = track.scrollLeft >= maxScroll - 4;
  }

  const animateScroll = (delta, duration = 450) => {
    const start = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = Math.min(Math.max(0, start + delta), maxScroll);
    const startTime = performance.now();

    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      track.scrollLeft = start + (target - start) * eased;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        updateDisabled();
      }
    }

    requestAnimationFrame(step);
  };

  prevBtn.addEventListener("click", () => {
    animateScroll(-scrollStep());
  });

  nextBtn.addEventListener("click", () => {
    animateScroll(scrollStep());
  });

  track.addEventListener("scroll", updateDisabled, { passive: true });
  updateDisabled();
}

function initAboutTyping() {
  const textSpan = document.querySelector(".about-typing-text");
  const caret = document.querySelector(".about-caret");

  if (!textSpan || !caret) return;

  const fullText = textSpan.getAttribute("data-text") || textSpan.textContent;
  let index = 0;
  const speed = 35;

  textSpan.textContent = "";

  function step() {
    if (index >= fullText.length) {
      return;
    }

    textSpan.textContent += fullText.charAt(index);
    index += 1;
    setTimeout(step, speed);
  }

  step();
}

document.addEventListener("DOMContentLoaded", () => {
  loadTemplate("navbar-container", "resources/templates/navbar.html");
  loadTemplate("hero-container", "resources/templates/hero.html").then(
    initHeroTyping
  );
  loadTemplate("about-container", "resources/templates/about.html").then(
    initAboutTyping
  );
  loadTemplate("projects-container", "resources/templates/projects.html").then(
    initProjectsCarousel
  );
  loadTemplate("contact-container", "resources/templates/contact.html");
  loadTemplate("footer-container", "resources/templates/footer.html").then(
    setCurrentYear
  );
});

