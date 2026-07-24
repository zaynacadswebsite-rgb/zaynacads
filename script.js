// ============================================================
// Navigation: smooth-scroll shortcuts to each section
// ============================================================
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section.page[id]');

function goTo(id, e){
  if (e) e.preventDefault();
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.page));
});

// ============================================================
// Mobile nav toggle — hamburger opens/closes the dropdown menu,
// and picking a link (or tapping outside) closes it again
// ============================================================
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav){
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target)){
      siteNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Scroll-spy: highlight the nav button for whichever section is in view
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      navBtns.forEach(b => b.classList.toggle('active', b.dataset.page === entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => spyObserver.observe(sec));


// ============================================================
// Skills tab content (with staggered icon pop-in)
// ============================================================
const skillsData = {
  writing: [
    { label: 'Chapter 1–3 Writing', bg: '#2c3e50', text: '1-3' },
    { label: 'Chapter 4–5 Writing', bg: '#34495e', text: '4-5' },
    { label: 'Research Design', bg: '#0f172a', text: 'RD' },
    { label: 'Literature Review', bg: '#8b5cf6', text: 'LR' },
    { label: 'Title Defense Prep', bg: '#111827', text: 'TD' },
    { label: 'Concept Papers', bg: '#0ea5e9', text: 'CP' },
  ],
  stats: [
    { label: 'SPSS', bg: '#2c3e50', text: 'S' },
    { label: 'Jamovi', bg: '#3c873a', text: 'J' },
    { label: 'Excel Data Analysis', bg: '#1d6f42', text: 'X' },
    { label: 'Survey Design', bg: '#336791', text: 'SD' },
    { label: 'Hypothesis Testing', bg: '#c53030', text: 'HT' },
    { label: 'Results Interpretation', bg: '#111827', text: 'RI' },
  ],
  support: [
    { label: 'Grammar & Proofreading', bg: '#f05033', text: 'GP' },
    { label: 'APA / MLA Formatting', bg: '#111827', text: 'APA' },
    { label: 'Plagiarism Checking', bg: '#2496ed', text: 'PC' },
    { label: 'Slide Deck Prep', bg: '#a259ff', text: 'PPT' },
    { label: 'Mock Defense Coaching', bg: '#007acc', text: '{Q}' },
    { label: 'Reference Management', bg: '#0d1117', text: 'Ref' },
  ]
};

const skillsGrid = document.getElementById('skillsGrid');
const skillTabs = document.querySelectorAll('.skill-tab');

function renderSkills(tab){
  skillsGrid.innerHTML = skillsData[tab].map((s, i) => `
    <div class="skill-item pop-in" style="animation-delay:${i * 45}ms">
      <div class="icon-box" style="background:${s.bg}; color:${s.dark ? '#1a2332' : '#fff'};">${s.text}</div>
      <span>${s.label}</span>
    </div>
  `).join('');
}

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderSkills(tab.dataset.tab);
  });
});

renderSkills('writing');


// ============================================================
// Contact form — submits to Formspree via fetch so the page
// doesn't reload; shows inline success/error feedback
// ============================================================
function handleSubmit(e){
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalLabel = btn.textContent;

  btn.disabled = true;
  btn.textContent = 'Sending...';

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok){
        btn.textContent = 'Message Sent ✓';
        form.reset();
      } else {
        return response.json().then(data => {
          throw new Error((data && data.errors) ? data.errors.map(err => err.message).join(', ') : 'Something went wrong.');
        });
      }
    })
    .catch(err => {
      alert('Could not send your message: ' + err.message + ' Please try again or email directly.');
      btn.textContent = originalLabel;
    })
    .finally(() => {
      setTimeout(() => {
        btn.disabled = false;
        if (btn.textContent === 'Message Sent ✓') btn.textContent = originalLabel;
      }, 3000);
    });

  return false;
}


// ============================================================
// Scroll reveal animation
// ============================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => revealObserver.observe(el));


// ============================================================
// Animated stat counters
// ============================================================
function animateCounter(el, target, duration = 1400){
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1){
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(tick);
}

const statEls = document.querySelectorAll('.stat-number');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const target = parseInt(entry.target.dataset.target, 10);
      animateCounter(entry.target, target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

statEls.forEach(el => statObserver.observe(el));


// ============================================================
// Card tilt effect (highlight cards, teaser cards, project cards)
// Tracks the mouse position and tilts the card in 3D toward the cursor
// ============================================================
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
  let frame = null;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max ~6deg
    const rotateY = ((x - centerX) / centerX) * 6;

    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.015)`;
    });
  });

  card.addEventListener('mouseleave', () => {
    if (frame) cancelAnimationFrame(frame);
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  });
});


// ============================================================
// Button ripple effect (buttons, nav links, project/CTA links)
// ============================================================
const rippleTargets = document.querySelectorAll(
  '.btn-pill, .btn-outline, .btn-triangle, .go-project, .contact-form button, .nav-btn, .skill-tab'
);

rippleTargets.forEach(btn => {
  btn.classList.add('ripple-host');

  btn.addEventListener('click', function(e){
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});


// ============================================================
// Background music (auto-plays on first user interaction —
// browsers block audible autoplay before that, on every browser)
// ============================================================
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let musicStarted = false;
let musicMuted = false;

function startMusicOnce(){
  if (musicStarted) return;
  bgMusic.volume = 0.5;
  bgMusic.play().then(() => {
    musicStarted = true;
    musicToggle.classList.add('playing');
    document.removeEventListener('click', startMusicOnce);
    document.removeEventListener('keydown', startMusicOnce);
    document.removeEventListener('touchstart', startMusicOnce);
  }).catch(() => {
    // Autoplay still blocked — leave listeners active so the next
    // interaction (including tapping the CD button itself) retries
    musicToggle.classList.remove('playing');
  });
}

// Any first interaction anywhere on the page starts the music.
// NOTE: scroll/wheel are intentionally NOT used here — Chromium browsers
// (Chrome, Brave, Edge) don't count them as a "user gesture," so audio
// would silently fail to start on those. Click/tap/key are the only
// triggers guaranteed to work across all major browsers.
document.addEventListener('click', startMusicOnce);
document.addEventListener('keydown', startMusicOnce);
document.addEventListener('touchstart', startMusicOnce);

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!musicStarted || bgMusic.paused){
    musicMuted = false;
    bgMusic.muted = false;
    startMusicOnce();
    return;
  }
  musicMuted = !musicMuted;
  bgMusic.muted = musicMuted;
  musicToggle.classList.toggle('playing', !musicMuted);
});


// ============================================================
// Cursor glow — a soft light that follows the pointer, glass-style
// (skipped on touch devices, where there's no real cursor)
// ============================================================
const supportsHover = window.matchMedia('(hover: hover)').matches;

if (supportsHover){
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursorGlow';
  document.body.appendChild(cursorGlow);

  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animateGlow(){
    // ease toward the real cursor position for a soft trailing feel
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(animateGlow);
  }
  requestAnimationFrame(animateGlow);
}


// ============================================================
// Hero heading typewriter effect (runs once on page load)
// ============================================================
const heroHeading = document.querySelector('.hero h1');

if (heroHeading){
  const fullText = heroHeading.textContent;
  heroHeading.textContent = '';
  heroHeading.style.borderRight = '3px solid var(--cyan)';

  let charIndex = 0;
  function typeNextChar(){
    if (charIndex <= fullText.length){
      heroHeading.textContent = fullText.slice(0, charIndex);
      charIndex++;
      setTimeout(typeNextChar, 55);
    } else {
      // blink the cursor a few times, then remove it
      let blinks = 0;
      const blinkInterval = setInterval(() => {
        heroHeading.style.borderRightColor =
          heroHeading.style.borderRightColor === 'transparent' ? 'var(--cyan)' : 'transparent';
        blinks++;
        if (blinks > 5){
          clearInterval(blinkInterval);
          heroHeading.style.borderRight = 'none';
        }
      }, 400);
    }
  }
  // start after the existing fade-in delay for that element (0.15s)
  setTimeout(typeNextChar, 400);
}


// ============================================================
// Magnetic hover — buttons drift slightly toward the cursor
// ============================================================
const magneticEls = document.querySelectorAll('.btn-pill, .btn-outline, .btn-triangle');

magneticEls.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.35}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});


// ============================================================
// Sliding active-nav indicator — a small bar that glides
// beneath whichever nav button is currently active
// ============================================================
const navList = document.querySelector('nav ul');

if (navList){
  const navIndicator = document.createElement('div');
  navIndicator.id = 'navIndicator';
  navList.appendChild(navIndicator);

  function moveNavIndicator(){
    const activeBtn = document.querySelector('.nav-btn.active');
    if (!activeBtn) return;
    navIndicator.style.width = `${activeBtn.offsetWidth}px`;
    navIndicator.style.left = `${activeBtn.offsetLeft}px`;
  }

  // move on load, on resize, and whenever scroll-spy swaps the active button
  window.addEventListener('resize', moveNavIndicator);
  navBtns.forEach(btn => btn.addEventListener('click', () => setTimeout(moveNavIndicator, 50)));
  const navObserver = new MutationObserver(moveNavIndicator);
  navBtns.forEach(btn => navObserver.observe(btn, { attributes: true, attributeFilter: ['class'] }));
  setTimeout(moveNavIndicator, 300);
}


// ============================================================
// Hero parallax — content drifts and fades as you scroll past it,
// giving the hero a sense of depth (inspired by portfolio-style
// parallax scrolling)
// ============================================================
const heroEl = document.querySelector('.hero');
const heroContentEl = document.querySelector('.hero-content');

if (heroEl && heroContentEl){
  // Cache the height instead of reading offsetHeight on every scroll event
  // (that read forces a synchronous layout recalculation — expensive when
  // it happens dozens of times per second during a scroll).
  let heroHeight = heroEl.offsetHeight;
  window.addEventListener('resize', () => { heroHeight = heroEl.offsetHeight; }, { passive: true });

  let ticking = false;
  function updateHeroParallax(){
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / heroHeight, 1);

    heroContentEl.style.transform = `translateY(${progress * 80}px)`;
    heroContentEl.style.opacity = String(1 - progress * 1.1);
    ticking = false;
  }

  // Batch to one update per animation frame instead of running on every
  // raw scroll event (which can fire faster than the screen can redraw).
  document.addEventListener('scroll', () => {
    if (!ticking){
      requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  }, { passive: true });

  updateHeroParallax();
}


// ============================================================
// Reveal direction variety — cards in a 3-column row slide in
// from alternating directions instead of all rising the same way
// ============================================================
function assignRevealDirections(gridSelector){
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  const items = grid.querySelectorAll(':scope > .reveal');
  items.forEach((item, i) => {
    const mod = i % 3;
    if (mod === 0) item.classList.add('reveal-left');
    else if (mod === 2) item.classList.add('reveal-right');
    // mod === 1 keeps the default rise-up reveal
  });
}
['.highlight-grid', '.teaser-grid', '.projects-grid'].forEach(assignRevealDirections);


// ============================================================
// AI Humanizing demo — loops: flagged 90% AI -> humanizing sweep
// -> rechecked 0% AI, approved
// ============================================================
(function initHumanizeDemo(){
  const stage = document.getElementById('humanizeStage');
  if (!stage) return;

  const sampleText = document.getElementById('humanizeSampleText');
  const scoreFill = document.getElementById('turnitinScoreFill');
  const scoreNumber = document.getElementById('turnitinScoreNumber');
  const statusPill = document.getElementById('turnitinStatusPill');
  const statusNote = document.getElementById('turnitinStatusNote');
  const checkLabel = document.getElementById('turnitinCheckLabel');
  const step1 = document.getElementById('humStep1');
  const step2 = document.getElementById('humStep2');
  const step3 = document.getElementById('humStep3');

  const AI_TEXT = "In contemporary academic discourse, it is imperative to recognize that the utilization of quantitative methodologies significantly facilitates the comprehensive understanding of multifaceted research phenomena within diverse educational contexts.";
  const HUMANIZED_TEXT = "In today's academic research, using quantitative methods helps researchers better understand complex issues across different educational settings — and that's exactly why the numbers matter.";

  const CIRCUMFERENCE = 264; // 2 * PI * 42, rounded to match CSS

  function setScore(percent, color){
    const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percent / 100);
    scoreFill.style.strokeDashoffset = offset;
    scoreFill.style.stroke = color;
    scoreNumber.textContent = percent + '%';
  }

  function setActiveStep(step){
    [step1, step2, step3].forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  }

  function resetToFlagged(){
    stage.classList.remove('scanning');
    sampleText.textContent = AI_TEXT;
    sampleText.style.color = '';
    setScore(90, '#e0473e');
    statusPill.textContent = '⚠ Likely AI-Generated';
    statusPill.classList.remove('approved');
    statusNote.textContent = 'Flagged incorrectly — original human draft';
    checkLabel.textContent = 'Similarity & AI Check';
    setActiveStep(step1);
  }

  function runCycle(){
    resetToFlagged();

    // Step 2: begin humanizing sweep after a pause on step 1
    setTimeout(() => {
      setActiveStep(step2);
      checkLabel.textContent = 'Humanizing in progress…';
      stage.classList.add('scanning');
      sampleText.style.color = 'transparent';

      // swap text content partway through the sweep so it appears
      // "rewritten" as the scanline passes over it
      setTimeout(() => {
        sampleText.textContent = HUMANIZED_TEXT;
      }, 1300);

      setTimeout(() => {
        sampleText.style.color = '';
      }, 2000);
    }, 2200);

    // Step 3: recheck -> 0% AI, approved
    setTimeout(() => {
      stage.classList.remove('scanning');
      setActiveStep(step3);
      checkLabel.textContent = 'Similarity & AI Check';
      setScore(0, '#4fe0c9');
      statusPill.textContent = '✓ 0% AI — Approved';
      statusPill.classList.add('approved');
      statusNote.textContent = 'Rechecked and cleared for submission';
    }, 5300);
  }

  // Only run the animation loop while the widget is on screen
  let cycleInterval = null;
  const CYCLE_LENGTH = 8800;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        if (!cycleInterval){
          runCycle();
          cycleInterval = setInterval(runCycle, CYCLE_LENGTH);
        }
      } else {
        if (cycleInterval){
          clearInterval(cycleInterval);
          cycleInterval = null;
        }
      }
    });
  }, { threshold: 0.3 });

  observer.observe(stage);
})();


// ============================================================
// Turnitin similarity-check demo — loops: doc sent -> scanning
// sweep + progress bar -> report/score revealed
// ============================================================
(function initScanDemo(){
  const stage = document.getElementById('scanStage');
  if (!stage) return;

  const doc = document.getElementById('scanDoc');
  const checkLabel = document.getElementById('scanCheckLabel');
  const progressFill = document.getElementById('scanProgressFill');
  const scoreFill = document.getElementById('scanScoreFill');
  const scoreNumber = document.getElementById('scanScoreNumber');
  const statusPill = document.getElementById('scanStatusPill');
  const statusNote = document.getElementById('scanStatusNote');
  const step1 = document.getElementById('scanStep1');
  const step2 = document.getElementById('scanStep2');
  const step3 = document.getElementById('scanStep3');

  const CIRCUMFERENCE = 264;
  const FINAL_SCORE = 8;

  function setScore(percent, color){
    const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percent / 100);
    scoreFill.style.strokeDashoffset = offset;
    scoreFill.style.stroke = color;
    scoreNumber.textContent = percent + '%';
  }

  function setActiveStep(step){
    [step1, step2, step3].forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  }

  function resetToStart(){
    doc.classList.remove('sweeping');
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    void progressFill.offsetWidth; // force reflow so next transition applies
    progressFill.style.transition = '';
    scoreFill.style.transition = 'none';
    setScore(0, 'rgba(255,255,255,0.15)');
    void scoreFill.offsetWidth;
    scoreFill.style.transition = '';
    scoreNumber.textContent = '--';
    checkLabel.textContent = 'Waiting to scan…';
    statusPill.textContent = 'Ready to check';
    statusPill.classList.remove('approved');
    statusNote.textContent = 'Report sent straight to you after scanning';
    setActiveStep(step1);
  }

  function runCycle(){
    resetToStart();

    // Step 2: scanning begins
    setTimeout(() => {
      setActiveStep(step2);
      checkLabel.textContent = 'Scanning document…';
      doc.classList.add('sweeping');
      progressFill.style.width = '100%';
      statusPill.textContent = 'Checking…';
    }, 1400);

    // Step 3: report revealed
    setTimeout(() => {
      doc.classList.remove('sweeping');
      setActiveStep(step3);
      checkLabel.textContent = 'Similarity & AI Check';
      setScore(FINAL_SCORE, '#4fe0c9');
      statusPill.textContent = '✓ ' + FINAL_SCORE + '% Similarity — Cleared';
      statusPill.classList.add('approved');
      statusNote.textContent = 'Full report sent to you within the day';
    }, 4200);
  }

  let cycleInterval = null;
  const CYCLE_LENGTH = 8000;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        if (!cycleInterval){
          runCycle();
          cycleInterval = setInterval(runCycle, CYCLE_LENGTH);
        }
      } else {
        if (cycleInterval){
          clearInterval(cycleInterval);
          cycleInterval = null;
        }
      }
    });
  }, { threshold: 0.3 });

  observer.observe(stage);
})();
