// Shared nav HTML
const KORU_SVG = `<svg class="koru-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M20 36C20 36 8 30 8 18C8 11.373 13.373 6 20 6C26.627 6 32 11.373 32 18C32 22.418 29.627 25.373 26 27C22.373 28.627 20 27 20 23C20 19 22.627 17.373 25 18C27.373 18.627 28 21 26 22C24 23 22 22 22 20" stroke="#1D9E75" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="20" cy="20" r="2" fill="#1D9E75" opacity="0.35"/>
</svg>`;

const NAV_HTML = `
<nav>
  <a href="/index.html" class="nav-logo">${KORU_SVG}hire a <span>techie</span></a>
  <ul class="nav-links" id="nav-links">
    <li><a href="/pages/services.html">Services</a></li>
    <li><a href="/pages/how-it-works.html">How it works</a></li>
    <li><a href="/pages/about.html">About</a></li>
    <li><a href="/pages/register.html">Join as a techie</a></li>
  </ul>
  <div class="nav-cta">
    <a href="/pages/register.html" class="btn btn-outline">Join as a techie</a>
    <a href="/pages/contact.html" class="btn btn-primary">Get a quote</a>
  </div>
  <button class="hamburger" id="hamburger" aria-label="Toggle menu">
    <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
      <line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="12" x2="19" y2="12"/><line x1="3" y1="18" x2="19" y2="18"/>
    </svg>
  </button>
</nav>`;

const KORU_SM = `<svg class="koru-mark-sm" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M20 36C20 36 8 30 8 18C8 11.373 13.373 6 20 6C26.627 6 32 11.373 32 18C32 22.418 29.627 25.373 26 27C22.373 28.627 20 27 20 23C20 19 22.627 17.373 25 18C27.373 18.627 28 21 26 22C24 23 22 22 22 20" stroke="#9FE1CB" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// Shared footer HTML
const FOOTER_HTML = `
<footer>
  <div class="footer-logo">${KORU_SM}hire a <span>techie</span></div>
  <ul class="footer-links">
    <li><a href="/pages/services.html">Services</a></li>
    <li><a href="/pages/how-it-works.html">How it works</a></li>
    <li><a href="/pages/register.html">Join as a techie</a></li>
    <li><a href="/pages/contact.html">Contact</a></li>
  </ul>
  <p class="footer-copy">&copy; 2026 Hire a Techie. New Zealand &amp; Australia.</p>
  <p class="footer-nz">Made in Aotearoa</p>
</footer>`;

// Inject nav and footer
document.getElementById('nav-placeholder').innerHTML = NAV_HTML;
document.getElementById('footer-placeholder').innerHTML = FOOTER_HTML;

// Hamburger toggle
document.addEventListener('click', function(e) {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (btn && btn.contains(e.target)) {
    links.classList.toggle('open');
  } else if (links && !links.contains(e.target)) {
    links.classList.remove('open');
  }
});

// Highlight active nav link
const path = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') && path.includes(a.getAttribute('href').replace('/pages/',''))) {
    a.style.color = 'var(--green)';
    a.style.fontWeight = '500';
  }
});
