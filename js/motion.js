(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  const STAGGER_MS = isMobile ? 50 : 80;
  const COUNT_DURATION = isMobile ? 900 : 1200;

  function markVisible(elements) {
    elements.forEach((el) => el.classList.add('is-visible'));
  }

  function finishAll() {
    document.querySelectorAll('.reveal, [data-motion], .motion-line, .motion-stagger > *, .timeline__item, .contact__field, .eng-profile__stack > *, .leetcode-stat[data-count-up]').forEach((el) => {
      el.classList.add('is-visible', 'motion-done');
    });
    document.querySelectorAll('.timeline').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('[data-count-up]').forEach((el) => {
      if (el.dataset.countUp) el.textContent = el.dataset.countUp;
    });
    document.querySelectorAll('.leetcode-heatmap').forEach((el) => el.classList.add('is-visible'));
  }

  if (prefersReduced) {
    document.documentElement.classList.add('motion-reduced');
    finishAll();
    return;
  }

  /* Hero — line reveal on load */
  (function initHero() {
    const hero = document.querySelector('[data-motion-hero]');
    if (!hero) return;

    const lines = hero.querySelectorAll('.motion-line');
    const delayBase = isMobile ? 60 : 90;

    lines.forEach((line, index) => {
      const extra = Number(line.dataset.motionDelay || 0);
      window.setTimeout(() => {
        line.classList.add('is-visible');
      }, delayBase * index + extra);
    });

    window.setTimeout(() => hero.classList.add('is-ready'), delayBase * lines.length + 200);
  })();

  /* Generic fade-up reveal */
  (function initReveals() {
    const targets = document.querySelectorAll('.reveal, [data-motion="fade-up"]');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  })();

  /* Stagger groups — projects, eng profile, contact */
  (function initStaggerGroups() {
    document.querySelectorAll('[data-motion-stagger]').forEach((group) => {
      const children = group.matches('.motion-stagger')
        ? group.children
        : group.querySelectorAll(':scope > *');

      Array.from(children).forEach((child, index) => {
        child.style.setProperty('--motion-stagger', `${index * STAGGER_MS}ms`);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
      );

      observer.observe(group);
    });
  })();

  /* Timeline — line draw + item slide */
  (function initTimeline() {
    const timeline = document.querySelector('[data-motion-timeline]');
    if (!timeline) return;

    const items = timeline.querySelectorAll('.timeline__item');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          timeline.classList.add('is-visible');
          items.forEach((item, index) => {
            window.setTimeout(() => item.classList.add('is-visible'), index * (STAGGER_MS + 40));
          });
          observer.unobserve(timeline);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(timeline);
  })();

  /* LeetCode count-up + heatmap fade */
  (function initEngProfileMotion() {
    const panel = document.getElementById('leetcodePanel');
    const heatmap = document.querySelector('.leetcode-heatmap');
    if (!panel) return;

    let panelVisible = false;
    let statsReady = false;
    let counted = false;

    function easeOutCubic(t) {
      return 1 - (1 - t) ** 3;
    }

    function animateCount(el, target, formatter) {
      el.classList.remove('leetcode-stat__value--loading');
      const start = performance.now();

      function frame(now) {
        const progress = Math.min((now - start) / COUNT_DURATION, 1);
        const value = Math.round(target * easeOutCubic(progress));
        el.textContent = formatter ? formatter(value) : String(value);
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }

    function runCountUp() {
      if (counted || !panelVisible || !statsReady) return;
      counted = true;

      panel.querySelectorAll('[data-count-up]').forEach((el) => {
        const target = Number(el.dataset.countUp);
        if (!Number.isFinite(target)) return;
        if (el.dataset.countFormat === 'streak') {
          animateCount(el, target, (v) => `${v} day${v === 1 ? '' : 's'}`);
        } else {
          animateCount(el, target);
        }
      });

      if (heatmap) heatmap.classList.add('is-visible');
    }

    document.addEventListener('leetcode:stats-ready', () => {
      statsReady = true;
      runCountUp();
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          panelVisible = true;
          runCountUp();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(panel);
  })();

  /* Hero background — subtle gradient shift via RAF */
  (function initHeroGradient() {
    if (isMobile) return;

    const bg = document.querySelector('.hero__bg-gradient');
    if (!bg) return;

    let start = performance.now();
    let ticking = false;

    function update() {
      const t = (performance.now() - start) / 20000;
      const x = 50 + Math.sin(t * Math.PI * 2) * 8;
      const y = 40 + Math.cos(t * Math.PI * 2) * 6;
      bg.style.setProperty('--hero-gx', `${x}%`);
      bg.style.setProperty('--hero-gy', `${y}%`);
      ticking = false;
    }

    function onFrame() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
    window.setInterval(onFrame, 100);
  })();
})();
