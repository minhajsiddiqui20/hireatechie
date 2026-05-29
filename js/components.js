// Shared nav HTML
const NAV_HTML = `
<nav>
  <a href="/index.html" class="nav-logo">hire a <span>techie</span></a>
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

// Shared footer HTML
const FOOTER_HTML = `
<footer>
  <div class="footer-logo">hire a <span>techie</span></div>
  <ul class="footer-links">
    <li><a href="/pages/services.html">Services</a></li>
    <li><a href="/pages/how-it-works.html">How it works</a></li>
    <li><a href="/pages/register.html">Join as a techie</a></li>
    <li><a href="/pages/contact.html">Contact</a></li>
  </ul>
  <p class="footer-copy">&copy; 2026 Hire a Techie. New Zealand &amp; Australia.</p>
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
