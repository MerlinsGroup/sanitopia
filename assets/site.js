// ============== SANITOPIA — shared site JS ==============
// Injects header/nav/mobile-menu/footer/lightbox into placeholder elements,
// sets the active nav link, and wires up interactions (mobile menu, fade-up
// observer, lightbox, hero carousel, hero-aware nav, donation tiers).

(function () {
  const LOGO = "https://sanitopiaprojects.org/wp-content/uploads/2020/04/Sanitopia-Logo-black-png-1.png";

  // Each nav item declares its match — used for active-state highlighting.
  // `match` is an array of pathname tail strings; first one is the canonical href.
  const NAV = [
    { label: "About", children: [
      { href: "about",    label: "About Sanitopia" },
      { href: "founder",  label: "Learn About Richard" },
      { href: "team",     label: "Our Team" },
      { href: "purpose",  label: "Our Purpose" },
      { href: "impact",   label: "Our Impact" },
      { href: "values",   label: "Our Values" },
      { href: "book",     label: "Crushed But Not Destroyed" },
    ] },
    { label: "Our Projects", children: [
      { href: "projects", label: "All Projects" },
      { href: "nkonya",   label: "Nkonya SHS" },
    ] },
    { href: "gallery", label: "Gallery" },
    { href: "news",    label: "News" },
    { href: "partner-ghana", label: "Partner in Ghana" },
  ];

  const SOCIALS = {
    facebook:  "https://www.facebook.com/profile.php?id=61575746451301",
    instagram: "https://www.instagram.com/sanitopiaprojects/",
    linkedin:  "https://www.linkedin.com/company/sanitopia-projects/",
    tiktok:    "https://www.tiktok.com/@sanitopiaprojects",
  };

  // Currently active page (just the file name).
  function currentPage() {
    let p = (location.pathname.split("/").pop() || "index").toLowerCase();
    p = p.replace(/\.html$/, "");           // tolerate old .html URLs
    if (p === "" || p === "/") p = "index";  // domain root = home
    return p;
  }

  // ------- HTML builders -------
  function topbarHTML() {
    return `
      <div class="topbar-inner">
        <span>UK Community Interest Company · Registered non-profit in Ghana</span>
      </div>`;
  }

  function navHTML() {
    const active = currentPage();
    const linksHTML = NAV.map(item => {
      if (item.children) {
        const childActive = item.children.some(c => c.href === active);
        const sub = item.children.map(c =>
          `<a href="${c.href}"${c.href === active ? ' class="active"' : ''}>${c.label}</a>`
        ).join("");
        return `
          <li>
            <button class="menu-trigger${childActive ? ' active' : ''}">${item.label} <span class="caret">▾</span></button>
            <div class="dropdown">${sub}</div>
          </li>`;
      }
      return `<li><a href="${item.href}"${item.href === active ? ' class="active"' : ''}>${item.label}</a></li>`;
    }).join("");

    return `
      <div class="nav-inner">
        <a href="/" class="brand" aria-label="Sanitopia — home">
          <img class="brand-logo" src="${LOGO}" alt="Sanitopia" />
        </a>
        <nav><ul class="nav-links">${linksHTML}</ul></nav>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <a href="contact" class="btn-ghost" style="text-decoration: none; color: var(--ink); padding: 0.5rem 1rem;">Contact</a>
          <a href="donate" class="btn-donate">Donate</a>
        </div>
        <button class="menu-toggle" aria-label="Open menu"><span></span></button>
      </div>`;
  }

  function mobileMenuHTML() {
    const active = currentPage();
    const groups = NAV.map(item => {
      if (item.children) {
        const childActive = item.children.some(c => c.href === active);
        const sub = item.children.map(c =>
          `<a href="${c.href}"${c.href === active ? ' class="active"' : ''}>${c.label}</a>`
        ).join("");
        return `
          <div class="group${childActive ? ' open' : ''}">
            <button class="acc">${item.label} <span>${childActive ? '−' : '+'}</span></button>
            <div class="sub">${sub}</div>
          </div>`;
      }
      return `<div class="group"><a href="${item.href}"${item.href === active ? ' class="active"' : ''}>${item.label} <span>→</span></a></div>`;
    }).join("");
    return `
      ${groups}
      <a href="contact" class="donate-mobile" style="background: var(--paper); color: var(--ink); margin-bottom: 1rem;">Contact →</a>
      <a href="donate" class="donate-mobile">Donate →</a>`;
  }

  function footerHTML() {
    return `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="brand" style="color: var(--paper)">
              <img class="brand-logo" src="${LOGO}" alt="Sanitopia" />
            </a>
            <p>A Community Interest Company building safe, dignified sanitation across Africa. Our mission: 20,000 modern sanitation facilities across the continent.</p>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="about">About Sanitopia</a></li>
              <li><a href="founder">Learn About Richard</a></li>
              <li><a href="team">Our Team</a></li>
              <li><a href="purpose">Our Purpose</a></li>
              <li><a href="impact">Our Impact</a></li>
              <li><a href="values">Our Values</a></li>
            </ul>
          </div>
          <div>
            <h4>Our Work</h4>
            <ul>
              <li><a href="projects">Our Projects</a></li>
              <li><a href="nkonya">Nkonya SHS</a></li>
              <li><a href="gallery">Gallery</a></li>
              <li><a href="news">News</a></li>
              <li><a href="donate">Donate</a></li>
              <li><a href="partner-ghana">Partner With Us</a></li>
              <li><a href="book">Crushed But Not Destroyed</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:info@sanitopiaprojects.org">info@sanitopiaprojects.org</a></li>
              <li><a href="tel:+447386454673">+44 7386 454673</a></li>
            </ul>
            <h4 style="margin-top: 2rem">Follow</h4>
            <div class="footer-socials">
              <a href="${SOCIALS.facebook}"  target="_blank" rel="noopener" aria-label="Facebook">f</a>
              <a href="${SOCIALS.instagram}" target="_blank" rel="noopener" aria-label="Instagram">ig</a>
              <a href="${SOCIALS.linkedin}"  target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
              <a href="${SOCIALS.tiktok}"    target="_blank" rel="noopener" aria-label="TikTok">tt</a>
            </div>
          </div>
        </div>
        <div class="footer-bar">
          <div>© 2026 Sanitopia. All rights reserved.</div>
          <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
            <a href="privacy">Privacy</a>
            <a href="terms">Terms</a>
            <a href="cookies">Cookies</a>
            <a href="slavery">Anti-Modern Slavery</a>
          </div>
        </div>
      </div>`;
  }

  function lightboxHTML() {
    return `
      <button class="lightbox-close" aria-label="Close">×</button>
      <img id="lightbox-img" alt="" />`;
  }

  // ------- Inject chrome -------
  function inject(id, classes, html) {
    const el = document.getElementById(id);
    if (!el) return null;
    classes.forEach(c => el.classList.add(c));
    el.innerHTML = html;
    return el;
  }

  function bootChrome() {
    inject("site-topbar", ["topbar"], topbarHTML());
    inject("site-nav",    ["nav"],    navHTML());
    inject("site-mobile", ["mobile-menu"], mobileMenuHTML());
    const nav = document.getElementById("site-nav");
    if (nav) nav.tagName.toLowerCase() === "header" ? null : null; // already <header> per template
    inject("site-footer", ["site-footer"], footerHTML());
    inject("site-lightbox", ["lightbox"], lightboxHTML());
  }

  // ------- Mobile menu toggle -------
  function bootMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const mobile = document.getElementById("site-mobile");
    if (!toggle || !mobile) return;
    toggle.addEventListener("click", () => {
      const open = !mobile.classList.contains("open");
      mobile.classList.toggle("open", open);
      toggle.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobile.addEventListener("click", (e) => {
      const acc = e.target.closest(".acc");
      if (acc) {
        acc.parentElement.classList.toggle("open");
        const sign = acc.querySelector("span");
        if (sign) sign.textContent = acc.parentElement.classList.contains("open") ? "−" : "+";
      }
    });
  }

  // ------- Fade-up reveal observer -------
  function bootFadeObserver() {
    const els = document.querySelectorAll(".fade-up:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
  }

  // ------- Lightbox -------
  function bootLightbox() {
    const lb = document.getElementById("site-lightbox");
    if (!lb) return;
    const lbImg = lb.querySelector("#lightbox-img");
    document.querySelectorAll("[data-lb]").forEach(el => {
      el.addEventListener("click", () => {
        lbImg.src = el.getAttribute("data-lb");
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lb.addEventListener("click", () => {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lb.classList.contains("open")) {
        lb.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  // ------- Hero-aware nav (transparent when over hero) -------
  function bootHeroChrome() {
    const nav = document.querySelector("header.nav");
    const hero = document.querySelector("[data-hero]");
    if (!nav || !hero) return;
    if (!("IntersectionObserver" in window)) {
      nav.classList.add("is-over-hero");
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en =>
        nav.classList.toggle("is-over-hero", en.isIntersecting && en.intersectionRatio > 0.15)
      );
    }, { threshold: [0, 0.15, 0.5, 1] });
    io.observe(hero);
  }

  // ------- Hero carousel (auto-advancing slide flipper) -------
  function bootCarousel() {
    const root = document.querySelector("[data-hero-carousel]");
    if (!root) return;
    const slides = Array.from(root.querySelectorAll(".hero-slide"));
    const dots   = Array.from(root.querySelectorAll(".hero-dot"));
    const counterCur = root.querySelector("[data-counter-current]");
    const counterTot = root.querySelector("[data-counter-total]");
    if (slides.length < 2) {
      slides[0]?.classList.add("active");
      return;
    }

    const INTERVAL = 7000; // matches the .hero-dot.active::after dotProgress animation
    let idx = 0;
    let timer = null;
    let paused = false;

    if (counterTot) counterTot.textContent = String(slides.length).padStart(2, "0");

    function applyActive(prev, next) {
      slides[prev]?.classList.remove("active");
      dots[prev]?.classList.remove("active");
      slides[next].classList.add("active");
      dots[next]?.classList.add("active");
      if (counterCur) counterCur.textContent = String(next + 1).padStart(2, "0");
    }

    function go(target) {
      const next = ((target % slides.length) + slides.length) % slides.length;
      if (next === idx) return;
      const prev = idx;
      idx = next;
      applyActive(prev, idx);
      reset();
    }

    function tick() {
      if (paused) return;
      go(idx + 1);
    }

    function reset() {
      clearTimeout(timer);
      if (paused) return;
      timer = setTimeout(tick, INTERVAL);
    }

    // initialise first slide
    slides[0].classList.add("active");
    dots[0]?.classList.add("active");
    if (counterCur) counterCur.textContent = "01";
    reset();

    // controls
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    root.querySelector(".hero-arrow.prev")?.addEventListener("click", () => go(idx - 1));
    root.querySelector(".hero-arrow.next")?.addEventListener("click", () => go(idx + 1));

    // pause on hover
    const pause = () => {
      paused = true;
      clearTimeout(timer);
      dots[idx]?.classList.add("paused");
    };
    const resume = () => {
      paused = false;
      dots[idx]?.classList.remove("paused");
      // restart the dot progress animation by toggling the active class
      const cur = dots[idx];
      if (cur) {
        cur.classList.remove("active");
        // force reflow so the animation restarts
        // eslint-disable-next-line no-unused-expressions
        cur.offsetWidth;
        cur.classList.add("active");
      }
      reset();
    };
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);
    document.addEventListener("visibilitychange", () => document.hidden ? pause() : resume());

    // keyboard
    root.tabIndex = 0;
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(idx - 1);
      else if (e.key === "ArrowRight") go(idx + 1);
    });

    // touch swipe
    let touchStartX = 0;
    root.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  // ------- Donation tier interaction -------
  function bootDonationTiers() {
    document.addEventListener("click", (e) => {
      const tier = e.target.closest(".tier");
      if (tier) {
        document.querySelectorAll(".tier").forEach(t => t.classList.remove("featured"));
        tier.classList.add("featured");
      }
    });
  }

  // ------- Boot sequence -------
  function boot() {
    bootChrome();
    bootMobileMenu();
    bootFadeObserver();
    bootLightbox();
    bootHeroChrome();
    bootCarousel();
    bootDonationTiers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
