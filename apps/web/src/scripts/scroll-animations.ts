import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initTextFillAnimations() {
  document.querySelectorAll<HTMLElement>('[data-animate="text-fill"]').forEach((el) => {
    gsap.fromTo(
      el,
      { backgroundSize: "0% 100%" },
      {
        backgroundSize: "100% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          end: "top 40%",
          scrub: 1,
        },
      }
    );
  });
}

function initTextFillWords() {
  document.querySelectorAll<HTMLElement>('[data-animate="text-fill-words"]').forEach((el) => {
    const text = el.textContent || "";
    el.textContent = "";
    const words = text.split(/\s+/).filter(Boolean);

    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "text-fill-reveal";
      span.textContent = word + (i < words.length - 1 ? " " : "");
      span.style.display = "inline-block";
      el.appendChild(span);
    });

    const wordEls = el.querySelectorAll<HTMLElement>(".text-fill-reveal");

    gsap.fromTo(
      wordEls,
      { backgroundSize: "0% 100%" },
      {
        backgroundSize: "100% 100%",
        ease: "none",
        stagger: 0.25,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom 20%",
          scrub: 1,
        },
      }
    );
  });
}

function initSlideUpAnimations() {
  document.querySelectorAll<HTMLElement>('[data-animate="slide-up"]').forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  });
}

function initServicesHeader() {
  const headers = document.querySelectorAll<HTMLElement>('[data-animate="services-header"]');
  if (!headers.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: headers[0],
      start: "top 88%",
      toggleActions: "play reverse play reverse",
    },
  });

  headers.forEach((el, i) => {
    tl.fromTo(el,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      i * 0.15
    );
  });
}

function initStaggerGroup(selector: string, staggerDelay: number) {
  const els = document.querySelectorAll<HTMLElement>(selector);
  if (!els.length) return;
  els.forEach((el, i) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * staggerDelay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
  });
}

function initTeamsTitleScale() {
  const title = document.querySelector<HTMLElement>('[data-animate="scale-down"]');
  if (!title) return;

  gsap.from(title, {
    scale: 2.2,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: title,
      start: "top 90%",
      end: "top 30%",
      scrub: 1.5,
    },
  });
}

function initPillDepthAnimations() {
  document.querySelectorAll<HTMLElement>('[data-animate="pill-large"]').forEach((el) => {
    gsap.from(el, {
      scale: 1.8,
      filter: "blur(10px)",
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 95%",
        end: "top 35%",
        scrub: 1.5,
      },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-animate="pill-small"]').forEach((el) => {
    gsap.from(el, {
      scale: 0.4,
      filter: "blur(6px)",
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 95%",
        end: "top 35%",
        scrub: 1.5,
      },
    });
  });
}

function initCollabScaleBlur() {
  const card = document.querySelector<HTMLElement>('[data-animate="scale-down-blur"]');
  if (!card) return;

  gsap.from(card, {
    scale: 1.25,
    filter: "blur(8px)",
    opacity: 0.3,
    ease: "none",
    scrollTrigger: {
      trigger: card,
      start: "top 90%",
      end: "top 35%",
      scrub: 1.5,
    },
  });
}

function initTechEntrance() {
  const left = document.querySelector<HTMLElement>('[data-animate="slide-right"]');
  const right = document.querySelector<HTMLElement>('[data-animate="slide-left"]');

  if (left) {
    gsap.from(left, {
      x: -80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: left,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });
  }

  if (right) {
    gsap.from(right, {
      x: 80,
      opacity: 0,
      duration: 1,
      delay: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: right,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });
  }
}

function initHeroEntrance() {
  const navbar = document.querySelector<HTMLElement>("#navbar");
  const heroLabel = document.querySelector<HTMLElement>('[data-animate="hero-label"]');
  const heroTitle = document.querySelector<HTMLElement>('[data-animate="hero-title"]');
  const heroSubtitle = document.querySelector<HTMLElement>('[data-animate="hero-subtitle"]');
  const heroFooter = document.querySelector<HTMLElement>('[data-animate="hero-footer"]');

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (navbar) {
    tl.fromTo(navbar,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0
    );
  }

  if (heroLabel) {
    tl.fromTo(heroLabel,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.3
    );
  }

  if (heroTitle) {
    tl.fromTo(heroTitle,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      0.5
    );
  }

  if (heroSubtitle) {
    tl.fromTo(heroSubtitle,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.8
    );
  }

  if (heroFooter) {
    tl.fromTo(heroFooter,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      1.0
    );
  }
}

export function initScrollAnimations() {
  if (prefersReducedMotion()) return;

  initHeroEntrance();
  initTextFillAnimations();
  initTextFillWords();
  initServicesHeader();
  initSlideUpAnimations();
  initStaggerGroup('[data-animate="stagger-in"]', 0.15);
  initTeamsTitleScale();
  initPillDepthAnimations();
  initCollabScaleBlur();
  initTechEntrance();
}
