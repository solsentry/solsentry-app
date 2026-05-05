/**
 * SolSentry — i18n (Internationalization) Module
 * Shared across all pages for PT-BR / EN translations
 * 
 * Usage:
 * 1. Include in <head>: <script src="_i18n.js"></script>
 * 2. Initialize lang detection: see initLang() below
 * 3. Mark strings: <span data-pt="..." data-en="...">English text</span>
 * 4. Mark placeholders: <input data-pt-placeholder="..." data-en-placeholder="...">
 * 5. Mark aria-labels: <button data-pt-aria="..." data-en-aria="...">
 */

/**
 * Apply language to all elements with data-pt/data-en attributes
 */
function applyLang(lang) {
  // Update document lang attribute
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.documentElement.dataset.lang = lang;
  
  // Persist to localStorage
  localStorage.setItem('lang', lang);

  // Apply text content
  document.querySelectorAll('[data-pt]').forEach(el => {
    const key = lang === 'pt' ? 'pt' : 'en';
    const txt = el.dataset[key];
    if (txt !== undefined) {
      el.innerHTML = txt;
    }
  });

  // Apply placeholder attributes
  document.querySelectorAll('[data-pt-placeholder]').forEach(el => {
    const key = lang === 'pt' ? 'ptPlaceholder' : 'enPlaceholder';
    const placeholder = el.dataset[key];
    if (placeholder !== undefined) {
      el.placeholder = placeholder;
    }
  });

  // Apply aria-label attributes
  document.querySelectorAll('[data-pt-aria]').forEach(el => {
    const key = lang === 'pt' ? 'ptAria' : 'enAria';
    const label = el.dataset[key];
    if (label !== undefined) {
      el.setAttribute('aria-label', label);
    }
  });

  // Update lang toggle button text
  const langToggle = document.querySelector('.lang-toggle');
  if (langToggle) {
    langToggle.textContent = lang === 'pt' ? 'EN' : 'PT';
  }
}

/**
 * Get current language
 */
function getLang() {
  return document.documentElement.dataset.lang || 'en';
}

/**
 * Toggle between PT and EN
 */
function toggleLang() {
  const current = getLang();
  const next = current === 'pt' ? 'en' : 'pt';
  applyLang(next);
}

/**
 * Initialize language detection and setup
 * Call this in <head> before any render
 */
function initLang() {
  // Detect lang: ?lang=pt|en > localStorage > default 'en'
  const urlLang = new URLSearchParams(location.search).get('lang');
  const savedLang = localStorage.getItem('lang');
  const lang = urlLang || savedLang || 'en';
  
  // Set initial state
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.documentElement.dataset.lang = lang;
  
  // Save if from URL
  if (urlLang) {
    localStorage.setItem('lang', urlLang);
  }
}

/**
 * Setup lang toggle button click handlers
 * Call this in DOMContentLoaded or at end of <body>
 */
function setupLangToggle() {
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', toggleLang);
  });
}

/**
 * Auto-initialize on DOMContentLoaded
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    applyLang(getLang());
    setupLangToggle();
  });
} else {
  // Already loaded
  applyLang(getLang());
  setupLangToggle();
}
