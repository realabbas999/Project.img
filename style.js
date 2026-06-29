/* ============================================
   SCRIPT.JS — Abbas Ibrahim Aliyu Portfolio
   ============================================ */

/* ----------------------------------------
   1. NAVBAR — scroll state + active links
   ---------------------------------------- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page[id]');

function updateNav() {
  // Sticky style
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlight based on current section in viewport
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNav);
updateNav(); // run once on load


/* ----------------------------------------
   2. HAMBURGER MENU — mobile toggle
   ---------------------------------------- */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on any link click
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* ----------------------------------------
   3. SCROLL REVEAL — fade-up on scroll
   ---------------------------------------- */
const revealTargets = [
  '.skill-card',
  '.project-card',
  '.tool-card',
  '.value-card',
  '.test-card',
  '.edu-item',
  '.cert-card',
  '.about-grid',
  '.contact-grid',
  '.section-eyebrow',
  '.section-title',
];

function addRevealClass() {
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger delay for grids
      const siblings = entry.target.parentElement?.querySelectorAll('.reveal') || [];
      let delay = 0;
      siblings.forEach((sib, i) => {
        if (sib === entry.target) delay = i * 80;
      });

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px',
});

function observeRevealTargets() {
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

addRevealClass();
observeRevealTargets();


/* ----------------------------------------
   4. SKILL BARS — animate when in view
   ---------------------------------------- */
const skillBars = document.querySelectorAll('.skill-bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

skillBars.forEach(bar => skillObserver.observe(bar));


/* ----------------------------------------
   5. CONTACT FORM — validation + feedback
   ---------------------------------------- */
const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');
const submitBtn = document.getElementById('form-submit');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNote(msg, isError = false) {
  formNote.textContent = msg;
  formNote.style.color = isError ? '#ff6b6b' : '#6C63FF';
}

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name) {
      showNote('Please enter your name.', true);
      form.name.focus();
      return;
    }

    if (!email || !validateEmail(email)) {
      showNote('Please enter a valid email address.', true);
      form.email.focus();
      return;
    }

    if (message.length < 10) {
      showNote('Your message is a bit short — say a little more.', true);
      form.message.focus();
      return;
    }

    // Simulate send
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Message Sent ✓';
      showNote("Thanks for reaching out! I'll reply as soon as I can.");
      form.reset();

      setTimeout(() => {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        formNote.textContent = '';
      }, 5000);
    }, 1400);
  });
}


/* ----------------------------------------
   6. SMOOTH SCROLL for anchor links
   ---------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - (navbar ? navbar.offsetHeight : 0);
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});


/* ----------------------------------------
   7. TYPING EFFECT — hero tagline
   ---------------------------------------- */
const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
  const phrases = [
    'Software Engineering Student',
    'Web Developer',
    'Problem Solver',
    'Always Learning',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  // Keep the static text fallback initially, then replace on first tick
  taglineEl.textContent = '';

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    taglineEl.textContent = currentPhrase.slice(0, charIndex);

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    typingTimeout = setTimeout(type, delay);
  }

  // Start typing after hero animation settles
  setTimeout(type, 1200);
}


/* ----------------------------------------
   8. SCROLL PROGRESS indicator (thin bar)
   ---------------------------------------- */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #6C63FF, #a29bfe);
  z-index: 9999;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
});


/* ----------------------------------------
   9. CURSOR GLOW (desktop only)
   ---------------------------------------- */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}


/* ----------------------------------------
   10. SECTION TRANSITION — page entrance
   ---------------------------------------- */
const pageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('page-entered');
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.page').forEach(page => {
  pageObserver.observe(page);
});
