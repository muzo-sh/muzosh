// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ============ Live GitHub Repositories (Own + Starred Fallback) ============
const GITHUB_USERNAME = 'muzo-sh';

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

async function loadGitHubRepos() {
  const grid = document.getElementById('github-projects');
  if (!grid) return;

  try {
    const ownRes = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=pushed&per_page=12`);
    let repos = [];

    if (ownRes.ok) {
      const allOwn = await ownRes.json();
      repos = allOwn.filter((r) => !r.fork);
    }

    if (repos.length < 2) {
      const starredRes = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/starred?per_page=6`);
      if (starredRes.ok) {
        const starred = await starredRes.json();
        const existingIds = new Set(repos.map((r) => r.id));
        starred.forEach((sr) => {
          if (!existingIds.has(sr.id)) repos.push(sr);
        });
      }
    }

    if (!repos || repos.length === 0) {
      grid.innerHTML = '<p class="repo-card__error">No public repositories found yet on github.com/muzo-sh.</p>';
      return;
    }

    grid.innerHTML = repos.slice(0, 6).map((r) => {
      const updatedDate = r.pushed_at ? new Date(r.pushed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '';
      return `
        <a class="repo-card" href="${escapeHtml(r.html_url || r.url)}" target="_blank" rel="noopener">
          <div>
            <div class="repo-card__top">
              <h4>${escapeHtml(r.name)}</h4>
              <span class="repo-card__stars">${r.stargazers_count > 0 ? `★ ${r.stargazers_count}` : updatedDate}</span>
            </div>
            <p>${escapeHtml(r.description || 'Source code and project files on GitHub.')}</p>
          </div>
          <div class="repo-card__bottom">
            <span class="repo-card__lang">${escapeHtml(r.language || 'Repository')}</span>
            <span class="repo-card__arrow">↗</span>
          </div>
        </a>
      `;
    }).join('');
  } catch (err) {
    grid.innerHTML = '<p class="repo-card__error">Repositories available directly at github.com/muzo-sh ↗</p>';
  }
}

loadGitHubRepos();

// ============ Subtle 3D Tilt on Bento Cards ============
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
// Language switch: English (default), Polish, Turkish
// ============================================================
const TRANSLATIONS = {
  pl: {
    'nav.about': 'O mnie', 'nav.projects': 'Projekty', 'nav.visuals': 'Zdjęcia', 'nav.experience': 'Doświadczenie', 'nav.contact': 'Napisz do mnie',
    'badge.1': 'Tworzenie oprogramowania', 'badge.2': 'Sprzęt i diagnostyka', 'badge.3': 'Automatyka', 'badge.4': 'Fotografia',
    'hero.eyebrow': '> student programowania / Wrocław, Polska',
    'hero.lead': 'Dążę do zbudowania życia w równowadze. Wykorzystuję technologię, aby zwiększać możliwości — szukając mądrzejszych rozwiązań i miejsca, w którym zapiszę niezapomnianą historię.',
    'hero.work': 'Zobacz moje prace', 'hero.cv': 'Pobierz CV',
    'about.label': 'O mnie',
    'about.h2': 'Nie byłem szczególnie dobrym uczniem, dopóki jedna okazja tego nie zmieniła.',
    'about.p': 'W 11. klasie zostałem wybrany do mojego pierwszego projektu Erasmus+ i wszystko się odwróciło. Nauczyciele wybierali mnie do kolejnych międzynarodowych projektów, bo mogli polegać na moim angielskim i bo reagowałem wcześnie, gdy coś zaczynało iść źle.',
    'about.p2': 'Od tamtej pory aż do końca liceum byłem osobą, która spaja zespół i reprezentuje szkołę za granicą. Ta szansa dała mi wizję, która zaprowadziła mnie aż do Polski.',
    'facts.now': 'Obecnie', 'facts.nowTitle': 'Student 3. roku', 'facts.nowv': 'Informatyka / Programowanie, WSB Merito Wrocław',
    'facts.lang': 'Języki', 'facts.langTitle': '4 Języki', 'facts.cert': '✓ Certyfikat C1 ↗',
    'facts.langv': 'Turecki (ojczysty) · Angielski (C1) · Niemiecki (podstawowy) · Polski (początkujący)',
    'facts.grad': 'Ukończenie studiów', 'facts.gradv': 'Luty 2028', 'facts.gradSub': 'Planowane ukończenie studiów B.Sc.',
    'work.label': 'Projekty i Kod', 'work.h2': 'Co zbudowałem',
    'work.intro': 'Bez sztucznych projektów i wypełniaczy AI. Poniżej znajdują się moje prawdziwe repozytoria pobierane prosto z GitHuba.',
    'work.ghPill': '● Na żywo z GitHuba', 'work.loading': 'Ładowanie repozytoriów z GitHuba…',
    'tel.pill': 'Telemetria na żywo', 'tel.title': 'Wrocław, Polska',
    'tel.desc': 'Czas lokalny, warunki pogodowe i aktualny status nauki.',
    'tel.timeLabel': 'Czas lokalny (CET)', 'tel.weatherLabel': 'Pogoda', 'tel.windLabel': 'Wiatr',
    'tel.focusLabel': 'Aktualny fokus', 'tel.focusVal': 'Python · C · Docker',
    'vis.label': 'Fotografia', 'vis.h2': 'Muzo Visuals — Kadry widziane moimi oczami.',
    'vis.sub': 'Portrety, nocne ulice i ujęcia z Wrocławia pobierane prosto z mojego portfolio fotograficznego.',
    'vis.btn': 'Odwiedź visuals.muzo.sh ↗',
    'exp.label': 'Doświadczenie', 'exp.h2': 'Moja droga',
    'e1.title': 'B.Sc. Software Development',
    'e1.desc': 'Obecnie na 3. roku — budowanie fundamentów: Python, C, algorytmy, bazy danych, systemy operacyjne, sieci, testowanie i Docker.',
    'e5.title': 'Kierowca Rideshare', 'e5.date': 'Maj 2025 — Obecnie',
    'e5.desc': 'Setki codziennych rozmów po angielsku z pasażerami z całego świata. Szybka ocena sytuacji, spokój i bezproblemowa komunikacja.',
    'e2.title': 'Operator produkcji',
    'e2.desc': 'Obsługa zautomatyzowanych maszyn na linii montażu baterii litowo-jonowych w LG Energy Solution Wrocław z zachowaniem rygorystycznych norm jakości.',
    'e3.title': 'Koordynator studencki, projekty Erasmus+',
    'e3.desc': 'Lider zespołów studenckich w międzynarodowych projektach Erasmus+. Koordynacja zadań, reprezentowanie szkoły za granicą i komunikacja po angielsku.',
    'e4.title': 'Liceum', 'e4.desc': 'Profil matematyczno-językowy.',
    'contact.label': 'Kontakt', 'contact.h2': 'Zbudujmy coś razem.',
    'contact.sub': 'Jestem otwarty na staże i praktyki. Najszybciej odpowiem na e-mail.',
    'footer.text': 'Zbudowane od podstaw, wdrożone na Vercel.'
  },
  tr: {
    'nav.about': 'Hikâyem', 'nav.projects': 'Projeler', 'nav.visuals': 'Görseller', 'nav.experience': 'Deneyim', 'nav.contact': 'Merhaba de',
    'badge.1': 'Yazılım Geliştirme', 'badge.2': 'Donanım & Diyagnostik', 'badge.3': 'Otomasyon', 'badge.4': 'Fotoğrafçılık',
    'hero.eyebrow': '> yazılım geliştirme öğrencisi / Wrocław, Polonya',
    'hero.lead': 'Her gecemi feda etmeyeceğim dengeli bir hayat kurmak için çalışıyorum. Teknolojiyi tembellik için değil, kapasiteyi ve verimi artırmak için kullanıyor; unutulmaz bir iz bırakacağım yeri arıyorum.',
    'hero.work': 'Çalışmalarımı gör', 'hero.cv': "CV'mi indir",
    'about.label': 'Hakkımda',
    'about.h2': 'Bir fırsat her şeyi değiştirene kadar pek de iyi bir öğrenci değildim.',
    'about.p': '11. sınıfta ilk Erasmus+ projeme seçildim ve her şey orada değişti. Öğretmenlerim sonraki uluslararası projelerde de beni seçmeye devam etti; çünkü İngilizcem güvenilirdi ve bir şeyler ters gitmeden önce erkenden devreye girip sorunları adım adım çözerdim.',
    'about.p2': "Lisenin sonuna kadar farklı diller arasında koordinasyon sağlayan ve okulunu yurt dışında temsil eden ekip lideri oldum. Bu fırsat bana harekete geçme vizyonu verdi ve beni Polonya'ya kadar getirdi.",
    'facts.now': 'Şu an', 'facts.nowTitle': '3. Sınıf Öğrencisi', 'facts.nowv': 'Yazılım Geliştirme, WSB Merito Wrocław',
    'facts.lang': 'Diller', 'facts.langTitle': '4 Dil', 'facts.cert': '✓ İngilizce C1 Sertifikası ↗',
    'facts.langv': 'Türkçe (Anadil) · İngilizce (Akıcı C1) · Almanca (Orta-altı) · Lehçe (Başlangıç)',
    'facts.grad': 'Mezuniyet', 'facts.gradv': 'Şubat 2028', 'facts.gradSub': 'Planlanan Lisans Mezuniyeti',
    'work.label': 'Projeler & Kod', 'work.h2': 'Neler geliştirdim',
    'work.intro': "Yapay zekâyla şişirilmiş konsept listeler yerine doğrudan GitHub hesabımdan çekilen gerçek repolarım ve yayındaki projelerim.",
    'work.ghPill': "● GitHub'dan Canlı", 'work.loading': "GitHub'dan repolar çekiliyor…",
    'tel.pill': 'Canlı Telemetri', 'tel.title': 'Wrocław, Polonya',
    'tel.desc': 'Anlık yerel saat, hava durumu ve çalışma istasyonu durumu.',
    'tel.timeLabel': 'Yerel Saat (CET)', 'tel.weatherLabel': 'Hava Durumu', 'tel.windLabel': 'Rüzgâr',
    'tel.focusLabel': 'Güncel Odak', 'tel.focusVal': 'Python · C · Docker',
    'vis.label': 'Fotoğrafçılık', 'vis.h2': 'Muzo Visuals — Kendi kadrajımdan anlar.',
    'vis.sub': "Wrocław sokakları, gece portreleri ve fotoğraf portfolyomdan canlı çekilen kareler.",
    'vis.btn': 'visuals.muzo.sh adresine git ↗',
    'exp.label': 'Deneyim', 'exp.h2': 'Yolculuğum',
    'e1.title': 'Yazılım Geliştirme (Lisans)',
    'e1.desc': '3. sınıf öğrencisi — Python, C, algoritmalar, veritabanları, işletim sistemleri, ağlar, yazılım testi ve Docker mimarileri.',
    'e5.title': 'Sürücü (Rideshare)', 'e5.date': 'Mayıs 2025 — Günümüz',
    'e5.desc': 'Her gün dünyanın dört bir yanından yolcularla İngilizce yüzlerce sohbet. Erasmus günlerimdeki aynı refleks: durumu hızlı oku, sakin kal, süreci sorunsuz yönet.',
    'e2.title': 'Üretim Operatörü',
    'e2.desc': "LG Energy Solution Wrocław'da lityum-iyon batarya montaj hattında sıfır hata ve yüksek güvenlik standartlarıyla otomasyon makineleri operatörlüğü.",
    'e3.title': 'Öğrenci Koordinatörü & Ekip Lideri',
    'e3.desc': 'Uluslararası Erasmus+ projelerinde öğrenci liderliği, ekipler arası koordinasyon ve İngilizce iletişim.',
    'e4.title': 'Lise', 'e4.desc': 'Matematik / Dil bölümü mezunu.',
    'contact.label': 'İletişim', 'contact.h2': 'Birlikte bir şeyler inşa edelim.',
    'contact.sub': 'Staj, trainee ve pratik mühendislik rollerine açığım. Bana ulaşmanın en hızlı yolu e-posta.',
    'footer.text': 'Sıfırdan geliştirildi, Vercel üzerinde yayında.'
  }
};

const LANGS = ['en', 'pl', 'tr'];
const DEFAULT_TEXT = {};
document.querySelectorAll('[data-i18n]').forEach((el) => {
  DEFAULT_TEXT[el.dataset.i18n] = el.textContent;
});

let currentLang = 'en';

function t(key) {
  if (currentLang === 'en') return DEFAULT_TEXT[key] || key;
  const dict = TRANSLATIONS[currentLang];
  return (dict && dict[key]) || DEFAULT_TEXT[key] || key;
}

function applyLanguage(lang) {
  if (!LANGS.includes(lang)) lang = 'en';
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
  try { localStorage.setItem('lang', lang); } catch (e) {}
}

document.querySelectorAll('[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

try {
  const saved = localStorage.getItem('lang');
  if (saved && LANGS.includes(saved)) applyLanguage(saved);
} catch (e) {}

// ============================================================
// Live Wrocław Telemetry (Clock + Open-Meteo Weather API)
// ============================================================
(function initWroclawTelemetry() {
  const timeEl = document.getElementById('tel-time');
  const weatherEl = document.getElementById('tel-weather');
  const windEl = document.getElementById('tel-wind');
  const updatedEl = document.getElementById('tel-updated');

  function updateClock() {
    if (!timeEl) return;
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Warsaw',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
    timeEl.textContent = formatted;
  }

  updateClock();
  setInterval(updateClock, 1000);

  const weatherCodes = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle',
    61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Mod. showers', 95: 'Thunderstorm'
  };

  async function fetchWeather() {
    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=51.1079&longitude=17.0385&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FWarsaw';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      const current = data.current;

      const temp = Math.round(current.temperature_2m);
      const desc = weatherCodes[current.weather_code] || 'Conditions normal';
      const wind = Math.round(current.wind_speed_10m);

      if (weatherEl) weatherEl.textContent = `${temp}°C · ${desc}`;
      if (windEl) windEl.textContent = `${wind} km/h`;
      if (updatedEl) updatedEl.textContent = 'Live feed · Open-Meteo API';
    } catch (e) {
      if (weatherEl) weatherEl.textContent = 'Wrocław · Online';
      if (windEl) windEl.textContent = 'Active';
      if (updatedEl) updatedEl.textContent = 'Local node active';
    }
  }

  fetchWeather();
})();

// ============================================================
// 3D hero scene: wireframe battery cell matrix
// ============================================================
(function heroScene() {
  const canvas = document.getElementById('hero-3d');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLS = 6, ROWS = 2, DEPTH = 3;
  const HALF = { w: 0.4, h: 0.75, d: 0.4 };
  const STEP = { w: 1.05, h: 1.75, d: 1.05 };

  const cells = [];
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      for (let z = 0; z < DEPTH; z++) {
        cells.push({
          col: x,
          cx: (x - (COLS - 1) / 2) * STEP.w,
          cy: (y - (ROWS - 1) / 2) * STEP.h,
          cz: (z - (DEPTH - 1) / 2) * STEP.d
        });
      }
    }
  }

  const corners = [];
  for (let i = 0; i < 8; i++) {
    corners.push([(i & 1 ? 1 : -1) * HALF.w, (i & 2 ? 1 : -1) * HALF.h, (i & 4 ? 1 : -1) * HALF.d]);
  }
  const edges = [];
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      const diff = i ^ j;
      if (diff === 1 || diff === 2 || diff === 4) edges.push([i, j]);
    }
  }

  let width = 0, height = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const startTime = performance.now();
  let visible = true;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function project(x, y, z, angleY, angleX) {
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    const camera = 12;
    const scale = camera / (camera + z2);
    return { x: x1 * scale, y: y2 * scale, depth: z2 };
  }

  function draw(now) {
    const seconds = (now - startTime) / 1000;
    const intro = reduceMotion ? 1 : 1 - Math.pow(1 - Math.min(1, seconds / 1.8), 3);
    const motion = reduceMotion ? 0 : seconds;

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    const angleY = 0.65 + motion * 0.2 + (1 - intro) * 3 + mouse.x * 0.6;
    const angleX = -0.4 + mouse.y * 0.3;
    const spread = 1 + (1 - intro) * 1.4;
    const unit = Math.min(width / 7.5, height / 4.8);
    const scan = (motion * 1.3) % (COLS + 3) - 1;

    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = 'round';

    for (const cell of cells) {
      const active = !reduceMotion && Math.abs(cell.col - scan) < 0.9;
      const pts = corners.map((c) => {
        const p = project((cell.cx + c[0]) * spread, (cell.cy + c[1]) * spread, (cell.cz + c[2]) * spread, angleY, angleX);
        return { x: width / 2 + p.x * unit, y: height / 2 + p.y * unit, depth: p.depth };
      });
      const meanDepth = pts.reduce((sum, p) => sum + p.depth, 0) / 8;
      const shade = Math.min(1, Math.max(0, (4 - meanDepth) / 8));
      const alpha = (0.14 + shade * 0.36 + (active ? 0.42 : 0)) * intro;

      ctx.beginPath();
      for (const e of edges) {
        ctx.moveTo(pts[e[0]].x, pts[e[0]].y);
        ctx.lineTo(pts[e[1]].x, pts[e[1]].y);
      }
      ctx.strokeStyle = 'rgba(34, 197, 94, ' + alpha.toFixed(3) + ')';
      ctx.lineWidth = active ? 1.8 : 1.1;
      ctx.stroke();
    }
  }

  function loop(now) {
    if (visible) draw(now);
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', () => { resize(); if (reduceMotion) draw(performance.now()); });
  if (reduceMotion) { draw(performance.now()); return; }

  window.addEventListener('mousemove', (e) => {
    mouse.tx = e.clientX / window.innerWidth - 0.5;
    mouse.ty = e.clientY / window.innerHeight - 0.5;
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(canvas);
  }
  requestAnimationFrame(loop);
})();
