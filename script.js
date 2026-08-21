// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ============ Live GitHub repos, via the Python API at /api/repos ============
const GITHUB_USERNAME = 'muzo-sh';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

async function loadRepos() {
  const grid = document.getElementById('github-projects');
  if (!grid) return;

  try {
    const res = await fetch(`/api/repos?user=${encodeURIComponent(GITHUB_USERNAME)}`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();

    if (!data.repos || data.repos.length === 0) {
      grid.innerHTML = '<p class="repo-card__error">No public repos found yet — go build something.</p>';
      return;
    }

    grid.innerHTML = data.repos.map((r) => `
      <a class="repo-card" href="${r.url}" target="_blank" rel="noopener">
        <div class="repo-card__top">
          <h4>${escapeHtml(r.name)}</h4>
          <span class="repo-card__stars">★ ${r.stars}</span>
        </div>
        <p>${escapeHtml(r.description)}</p>
        ${r.language ? `<span class="repo-card__lang">${escapeHtml(r.language)}</span>` : ''}
      </a>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p class="repo-card__error">Couldn\'t load repos right now — the API might still be deploying. Check back shortly.</p>';
  }
}

loadRepos();

// Subtle cursor accent on devices with a real mouse (skip on touch)
const cursor = document.querySelector('.cursor-dot');
const canHover = window.matchMedia('(hover: hover)').matches;

if (canHover && cursor) {
  window.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  window.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
}
