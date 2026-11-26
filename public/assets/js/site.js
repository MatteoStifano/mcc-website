/* ============================================================
   DEVICE DETECTION
   ============================================================ */
const isTouch = window.matchMedia('(hover: none)').matches;
const isMobile = isTouch || window.innerWidth < 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   GLOBAL THEME STATE
   ============================================================ */
window.MCC = window.MCC || {};
window.MCC.themeTarget = document.documentElement.classList.contains('light') ? 1 : 0;
window.MCC.themeCurrent = window.MCC.themeTarget;

/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function bindThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isLight = document.documentElement.classList.toggle('light');
    window.MCC.themeTarget = isLight ? 1 : 0;
    try {
      localStorage.setItem('mcc-theme', isLight ? 'light' : 'dark');
    } catch (err) {}
  });
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
if (!isTouch) {
  (function cursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;

    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('click'));

    // Delegated so elements rendered later (event, blog posts) get the hover ring too
    const HOVERABLE = 'a, button, .workshop-item, .lightbox-close';
    document.addEventListener('mouseover', (e) => {
      ring.classList.toggle('hover', !!e.target.closest(HOVERABLE));
    }, { passive: true });

    function loop() {
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();
  })();
}

/* ============================================================
   HELPERS — dynamic sections
   ============================================================ */
// The page is rendered per language (/ and /en/); <html lang> says which
const LANG = document.documentElement.lang === 'en' ? 'en' : 'it';

let strings = {};
try {
  strings = JSON.parse(document.getElementById('event-strings').textContent);
} catch (err) {}
const t = (key) => strings[key] || '';

// Data fields can be a plain string or { it: '...', en: '...' }
const pick = (value) => {
  if (value == null || typeof value === 'string') return value || '';
  return value[LANG] || value.it || value.en || '';
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function cmdLink(text, { href, onClick, extraClass } = {}) {
  const link = el(href ? 'a' : 'button', 'cmd-link' + (extraClass ? ' ' + extraClass : ''));
  if (href) {
    link.href = href;
    if (/^https?:/.test(href)) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
  } else {
    link.type = 'button';
    link.addEventListener('click', onClick);
  }
  link.append(
    el('span', 'cmd-link-prompt', '>'),
    el('span', 'cmd-link-text', text),
    el('span', 'cmd-link-arrow', href ? '↗' : '↓')
  );
  link.lastChild.setAttribute('aria-hidden', 'true');
  return link;
}

const WHATSAPP_URL = 'https://chat.whatsapp.com/DDgCFzmLZrmKuDu7k1RoE4';
const TIME_ZONE = 'Europe/Rome';
const locale = () => (LANG === 'en' ? 'en-GB' : 'it-IT');

/* ============================================================
   NEXT EVENT — reads src/data/events.json, embedded in the page at build time
   ============================================================ */
(function nextEvent() {
  const body = document.getElementById('event-body');
  if (!body) return;

  const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000;
  let next = null;

  const endOf = (ev) => ev.end ? new Date(ev.end) : new Date(new Date(ev.date).getTime() + DEFAULT_DURATION_MS);

  // Calendar-day difference in Rome time, so "domani" flips at local midnight
  function daysUntil(date) {
    const ymd = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(d);
    return Math.round((Date.parse(ymd(date)) - Date.parse(ymd(new Date()))) / 86400000);
  }

  function icsDate(d) {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function downloadIcs(ev) {
    const esc = (s) => String(s).replace(/[\\,;]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Monopoli Coders Club//IT',
      'BEGIN:VEVENT',
      'UID:' + icsDate(new Date(ev.date)) + '@monopoli-coders-club.com',
      'DTSTAMP:' + icsDate(new Date()),
      'DTSTART:' + icsDate(new Date(ev.date)),
      'DTEND:' + icsDate(endOf(ev)),
      'SUMMARY:' + esc(pick(ev.title)),
      'DESCRIPTION:' + esc(pick(ev.description) + (ev.signupUrl ? '\n' + ev.signupUrl : '')),
      'LOCATION:' + esc([ev.location, ev.address].filter(Boolean).join(', ')),
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const a = el('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mcc-evento.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function render() {
    body.replaceChildren();

    if (!next) {
      const p = el('p', null, t('eventNone'));
      body.append(p, cmdLink(t('eventNoneCta'), { href: WHATSAPP_URL, extraClass: 'wa' }));
      return;
    }

    const start = new Date(next.date);
    const fmt = (opts) => new Intl.DateTimeFormat(locale(), { timeZone: TIME_ZONE, ...opts }).format(start);

    const dateBox = el('div', 'event-date');
    dateBox.append(
      el('span', 'event-day', fmt({ day: 'numeric' })),
      el('span', 'event-month', fmt({ month: 'short' }).replace('.', '')),
      el('span', 'event-weekday', fmt({ weekday: 'short' }).replace('.', ''))
    );

    const info = el('div');
    const title = el('h3', 'event-title', pick(next.title));
    const days = daysUntil(start);
    if (days >= 0 && days <= 14) {
      const label = days === 0 ? t('eventToday') : days === 1 ? t('eventTomorrow') : t('eventInDays').replace('{n}', days);
      title.append(el('span', 'event-countdown', label));
    }
    info.append(title);

    const meta = el('div', 'event-meta');
    meta.append(el('span', null, fmt({ hour: '2-digit', minute: '2-digit' })));
    if (next.location) meta.append(el('span', null, next.location));
    if (next.speaker) meta.append(el('span', null, next.speaker));
    info.append(meta);

    if (next.description) info.append(el('p', null, pick(next.description)));

    const actions = el('div', 'event-actions');
    if (next.signupUrl) actions.append(cmdLink(t('eventSignup'), { href: next.signupUrl }));
    actions.append(cmdLink(t('eventCalendar'), { onClick: () => downloadIcs(next) }));
    info.append(actions);

    const wrap = el('div', 'event');
    wrap.append(dateBox, info);
    body.append(wrap);
  }

  let events = [];
  try {
    events = JSON.parse(document.getElementById('events-data').textContent);
  } catch (err) {}

  const now = new Date();
  next = (Array.isArray(events) ? events : [])
    .filter(ev => ev && ev.date && !isNaN(new Date(ev.date)) && endOf(ev) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
  render();

})();

/* ============================================================
   SECTION REVEAL
   ============================================================ */
(function revealSections() {
  const sections = document.querySelectorAll('.section-wrap');
  if (!sections.length) return;

  if (!('IntersectionObserver' in window)) {
    sections.forEach(s => s.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  sections.forEach(s => io.observe(s));
})();

/* ============================================================
   SHADER
   ============================================================ */
(function initShader() {
  try {
    if (typeof THREE === 'undefined') {
      console.warn('[MCC] Three.js not loaded — shader disabled');
      return;
    }

    const canvas = document.getElementById('shader-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance'
    });

    const targetDpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(targetDpr);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      u_time:       { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse:      { value: new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5) },
      u_light:      { value: window.MCC.themeCurrent }
    };

    const vertexShader = /* glsl */`
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = /* glsl */`
      precision highp float;

      uniform float u_time;
      uniform vec2  u_resolution;
      uniform vec2  u_mouse;
      uniform float u_light;
      varying vec2  vUv;

      // Aurora strength: 0 = flat background, 1 = full effect
      const float DARK_STRENGTH  = 0.22;
      const float LIGHT_STRENGTH = 0.5;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float vnoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i + vec2(0.0, 0.0));
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
        for (int i = 0; i < 4; i++) {
          v += a * vnoise(p);
          p = rot * p * 2.03 + 11.7;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv - 0.5;
        p.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.03;

        vec2 m = (u_mouse / u_resolution) - 0.5;
        m.x *= u_resolution.x / u_resolution.y;
        float md = length(p - m);
        vec2 dir = (p - m) / max(md, 0.0001);
        p -= dir * 0.08 * exp(-md * 2.6);

        // Large, gently warped noise field: broad soft shapes, no fine swirls
        vec2 q = vec2(
          fbm(p * 0.9 + t),
          fbm(p * 0.9 + vec2(5.2, 1.3) - t * 0.7)
        );
        float f = fbm(p * 0.9 + 1.5 * q + vec2(1.7, 9.2) + 0.1 * t);

        float glow = smoothstep(0.4, 0.85, f);
        float hueMix = smoothstep(0.35, 0.75, q.y);
        float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv - 0.5) * 1.4);

        // Brand-only tints: logo blue and a muted violet
        vec3 darkBg   = vec3(0.016, 0.024, 0.043);
        vec3 darkTint = mix(vec3(0.38, 0.68, 0.90), vec3(0.52, 0.45, 0.82), hueMix);
        vec3 darkCol  = darkBg + darkTint * glow * vignette * DARK_STRENGTH;

        vec3 lightBg   = vec3(0.955, 0.945, 0.985);
        vec3 lightTint = mix(vec3(0.80, 0.88, 0.98), vec3(0.88, 0.85, 0.98), hueMix);
        vec3 lightCol  = mix(lightBg, lightTint, glow * LIGHT_STRENGTH);

        vec3 col = mix(darkCol, lightCol, u_light);

        // Static grain (no per-frame flicker) to avoid gradient banding
        col += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    let tx = window.innerWidth * 0.5;
    let ty = window.innerHeight * 0.5;
    let sx = tx, sy = ty;

    if (!isTouch) {
      window.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
      }, { passive: true });
    } else {
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          tx = e.touches[0].clientX;
          ty = e.touches[0].clientY;
        }
      }, { passive: true });
    }

    const clock = new THREE.Clock();

    const targetFps = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    let lastFrame = 0;

    function animate(now) {
      requestAnimationFrame(animate);
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;

      uniforms.u_time.value = clock.getElapsedTime();

      sx += (tx - sx) * 0.08;
      sy += (ty - sy) * 0.08;
      uniforms.u_mouse.value.set(sx, sy);

      window.MCC.themeCurrent += (window.MCC.themeTarget - window.MCC.themeCurrent) * 0.06;
      uniforms.u_light.value = window.MCC.themeCurrent;

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);

    const onResize = () => {
      const newDpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(newDpr);
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

  } catch (err) {
    console.warn('[MCC] Shader init failed:', err);
  }
})();

/* ============================================================
   PER-CARD 3D TILT — desktop only
   ============================================================ */
if (!isTouch) {
  (function cardTilt() {
    const cards = Array.from(document.querySelectorAll('.card')).map(el => ({
      el, targetRx: 0, targetRy: 0, curRx: 0, curRy: 0, hovering: false
    }));
    if (!cards.length) return;

    const MAX_TILT = 8;
    const LERP = 0.12;

    cards.forEach(c => {
      c.el.addEventListener('mousemove', (e) => {
        c.hovering = true;
        const rect = c.el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        c.targetRy =  ((e.clientX - cx) / rect.width)  * MAX_TILT;
        c.targetRx = -((e.clientY - cy) / rect.height) * MAX_TILT;
        c.el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        c.el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
      c.el.addEventListener('mouseleave', () => {
        c.hovering = false;
        c.targetRx = 0;
        c.targetRy = 0;
      });
    });

    function loop() {
      cards.forEach(c => {
        if (!c.hovering && Math.abs(c.curRx) < 0.01 && Math.abs(c.curRy) < 0.01) return;
        c.curRx += (c.targetRx - c.curRx) * LERP;
        c.curRy += (c.targetRy - c.curRy) * LERP;
        c.el.style.setProperty('--rx', c.curRx.toFixed(3) + 'deg');
        c.el.style.setProperty('--ry', c.curRy.toFixed(3) + 'deg');
      });
      requestAnimationFrame(loop);
    }
    loop();
  })();
}

/* ============================================================
   LIGHTBOX — iOS-safe scroll lock
   ============================================================ */
(function lightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const items = document.querySelectorAll('.workshop-item');
  if (!lb || !lbImg || !items.length) return;
  const lbClose = lb.querySelector('.lightbox-close');

  let scrollY = 0;

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');

    scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);

    setTimeout(() => {
      if (!lb.classList.contains('open')) lbImg.src = '';
    }, 450);
  }

  items.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    const trigger = () => open(img.src, img.alt);
    item.addEventListener('click', trigger);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        trigger();
      }
    });
  });

  lbClose.addEventListener('click', (e) => {
    e.stopPropagation();
    close();
  });

  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();
