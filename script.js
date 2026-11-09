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


// ============================================================
// Language switch: English (default), Polish, Turkish.
// English text lives in the HTML itself; only PL and TR are listed here.
// ============================================================
const TRANSLATIONS = {
  pl: {
    'nav.about': 'O mnie', 'nav.projects': 'Projekty', 'nav.experience': 'Doświadczenie', 'nav.contact': 'Napisz do mnie',
    'hero.eyebrow': 'Student programowania · Wrocław, Polska',
    'hero.t1': 'Oprogramowanie blisko', 'hero.t2': 'prawdziwych maszyn.',
    'hero.lead': 'Student trzeciego roku programowania. Lubię wiedzieć, dlaczego rzeczy działają – samochody, automatyka, łamigłówki – i uczę się Javy, budując małe, prawdziwe projekty.',
    'tag.java': 'Java (w trakcie nauki)', 'tag.sql': 'SQL (podstawy)',
    'hero.work': 'Zobacz moje prace', 'hero.cv': 'Pobierz CV',
    'about.label': 'moja historia',
    'about.h2': 'Nie byłem szczególnie dobrym uczniem, dopóki jedna okazja tego nie zmieniła.',
    'about.p': 'W 11. klasie zostałem wybrany do mojego pierwszego projektu Erasmus+ i wszystko się odwróciło. Nauczyciele wybierali mnie do kolejnych międzynarodowych projektów, bo mogli polegać na moim angielskim i bo reagowałem wcześnie, gdy coś zaczynało iść źle. Tak zostałem liderem zespołu – i tak trafiłem na studia informatyczne w Polsce.',
    'facts.now': 'Obecnie', 'facts.nowv': 'student 3. roku programowania, WSB Merito Wrocław',
    'facts.lang': 'Języki', 'facts.langv': 'turecki (ojczysty), angielski (C1), niemiecki (podstawowy), polski (początkujący)',
    'facts.eng': 'Angielski', 'facts.engv': 'certyfikat C1, British Culture Language Schools, 2022', 'facts.view': 'zobacz',
    'facts.grad': 'Ukończenie studiów', 'facts.gradv': 'luty 2028 (planowo)',
    'work.label': 'projekty', 'work.h2': 'Co buduję',
    'work.intro': 'Wolę pokazać kilka uczciwych, małych projektów niż długą listę. Przy każdym piszę, co jest gotowe, a co nie.',
    'p1.pill': 'W trakcie',
    'p1.desc': 'Konsolowa aplikacja w Javie, która śledzi historię tankowań i serwisów, przypomina o terminach przeglądów i dekoduje podstawowe dane OBD-II (temperatura płynu chłodzącego, kody błędów). Powstaje w trakcie nauki Javy.',
    'p1.meta': 'Java 17 · zapis do pliku tekstowego · testy automatyczne', 'p1.link': 'Zobacz na GitHubie ↗',
    'p2.pill': 'Pomysł', 'p2.title': 'Aplikacja do oceny baterii hybrydowej',
    'p2.desc': 'Przyjazne narzędzie diagnostyczne dla mojego Lexusa CT200h: temperatury w °C ze strefami zieloną / żółtą / czerwoną, kody błędów opisane prostym językiem i instrukcje naprawy krok po kroku. Jeszcze nie zacząłem – pierwszym krokiem jest dekoder z Garage Log.',
    'p3.pill': 'Zagraj', 'p3.title': 'Poboczne zadanie: Lights Out',
    'p3.desc': 'Kliknij światło, aby przełączyć je i jego sąsiadów. Zgaś wszystkie. (Napisane z pomocą AI.)',
    'lo.moves': 'Ruchy:', 'lo.new': 'Nowa łamigłówka', 'lo.win': 'Rozwiązane! Ruchy: {n}',
    'exp.label': 'doświadczenie', 'exp.h2': 'Moja droga',
    'e1.title': 'Software Development (studia pierwszego stopnia)',
    'e1.desc': 'Python, algorytmy i struktury danych, bazy danych, systemy operacyjne, sieci, testowanie oprogramowania. W tym semestrze: aplikacje chmurowe, inżynieria oprogramowania, narzędzia open source.',
    'e2.title': 'Operator produkcji (część etatu)',
    'e2.desc': 'Około 40 dni roboczych. Obsługa zautomatyzowanych maszyn na linii montażu baterii litowo-jonowych, zgodnie z procedurami bezpieczeństwa i jakości.',
    'e3.title': 'Lider zespołu studenckiego, projekty Erasmus+',
    'e3.desc': 'Prowadziłem grupy 3–10 uczniów w 4 oficjalnych projektach i kilku wymianach organizowanych w szkole; łącznie ok. 10 międzynarodowych wydarzeń. Koordynowałem zadania, reprezentowałem szkołę za granicą i pomagałem lokalnym i zagranicznym uczniom współpracować po angielsku.',
    'e4.title': 'Liceum', 'e4.desc': 'Profil matematyczno-językowy.',
    'contact.label': 'cześć', 'contact.h2': 'Zbudujmy coś razem.',
    'contact.sub': 'Jestem otwarty na staże i praktyki. Najszybciej odpowiem na e-mail.', 'contact.note': 'napisz tutaj',
    'footer.text': 'Zbudowane z pomocą AI (Claude), wdrożone na Vercel.'
  },
  tr: {
    'nav.about': 'Hakkımda', 'nav.projects': 'Projeler', 'nav.experience': 'Deneyim', 'nav.contact': 'Merhaba de',
    'hero.eyebrow': 'Yazılım geliştirme öğrencisi · Wrocław, Polonya',
    'hero.t1': 'Yazılım, gerçek', 'hero.t2': 'makinelere yakın.',
    'hero.lead': 'Üçüncü sınıf yazılım geliştirme öğrencisiyim. Bir şeyin neden çalıştığını anlamayı seviyorum — arabalar, otomasyon, bulmacalar — ve Java\'yı küçük, gerçek projeler yaparak öğreniyorum.',
    'tag.java': 'Java (öğreniyorum)', 'tag.sql': 'SQL (temel)',
    'hero.work': 'Çalışmalarımı gör', 'hero.cv': 'CV\'mi indir',
    'about.label': 'hikâyem',
    'about.h2': 'Bir fırsat her şeyi değiştirene kadar pek de iyi bir öğrenci değildim.',
    'about.p': '11. sınıfta ilk Erasmus+ projeme seçildim ve işler değişmeye başladı. Öğretmenlerim sonraki uluslararası projelerde de beni seçti; çünkü İngilizcem güvenilirdi ve bir şeyler ters gitmeden önce erkenden devreye girerdim. Böylece ekip lideri oldum — ve yazılım okumak için Polonya\'ya kadar geldim.',
    'facts.now': 'Şu an', 'facts.nowv': '3. sınıf yazılım geliştirme öğrencisi, WSB Merito Wrocław',
    'facts.lang': 'Diller', 'facts.langv': 'Türkçe (anadil), İngilizce (C1), Almanca (temel), Lehçe (başlangıç)',
    'facts.eng': 'İngilizce', 'facts.engv': 'C1 sertifikası, British Culture Language Schools, 2022', 'facts.view': 'görüntüle',
    'facts.grad': 'Mezuniyet', 'facts.gradv': 'Şubat 2028 (planlanan)',
    'work.label': 'projeler', 'work.h2': 'Neler yapıyorum',
    'work.intro': 'Uzun bir liste yerine birkaç dürüst, küçük proje göstermeyi tercih ederim. Her birinde neyin hazır, neyin hazır olmadığını yazıyorum.',
    'p1.pill': 'Devam ediyor',
    'p1.desc': 'Yakıt ve servis geçmişini takip eden, bakım zamanı geldiğinde hatırlatan ve temel OBD-II verilerini (soğutma suyu sıcaklığı, arıza kodları) çözen bir Java konsol uygulaması. Java öğrenirken geliştiriyorum.',
    'p1.meta': 'Java 17 · metin dosyasına kayıt · otomatik testler', 'p1.link': 'GitHub\'da gör ↗',
    'p2.pill': 'Fikir', 'p2.title': 'Hibrit batarya sağlığı uygulaması',
    'p2.desc': 'Lexus CT200h\'im için daha anlaşılır bir teşhis aracı: °C cinsinden sıcaklıklar ve yeşil / sarı / kırmızı bölgeler, sade dille arıza kodları ve adım adım çözüm önerileri. Henüz başlamadım — ilk adım Garage Log\'daki çözücü.',
    'p3.pill': 'Oyna', 'p3.title': 'Yan görev: Lights Out',
    'p3.desc': 'Bir ışığa tıkla; kendisi ve komşuları ters döner. Hepsini söndür. (Yapay zekâ yardımıyla yazıldı.)',
    'lo.moves': 'Hamle:', 'lo.new': 'Yeni bulmaca', 'lo.win': 'Çözüldü! Hamle: {n}',
    'exp.label': 'deneyim', 'exp.h2': 'Yolculuğum',
    'e1.title': 'Software Development (lisans)',
    'e1.desc': 'Python, algoritmalar ve veri yapıları, veritabanları, işletim sistemleri, ağlar, yazılım testi. Bu dönem: bulut uygulamaları, yazılım mühendisliği, açık kaynak araçları.',
    'e2.title': 'Üretim operatörü (yarı zamanlı)',
    'e2.desc': 'Yaklaşık 40 iş günü. Lityum-iyon pil montaj hattında otomatik makineleri, güvenlik ve kalite prosedürlerine uyarak çalıştırdım.',
    'e3.title': 'Öğrenci ekip lideri, Erasmus+ projeleri',
    'e3.desc': '4 resmî projede ve okulda düzenlenen birkaç değişim programında 3–10 kişilik öğrenci gruplarına liderlik ettim; toplamda yaklaşık 10 uluslararası etkinlik. Görevleri koordine ettim, okulumu yurt dışında temsil ettim ve yerli ile yabancı öğrencilerin İngilizce birlikte çalışmasına yardımcı oldum.',
    'e4.title': 'Lise', 'e4.desc': 'Matematik / dil alanı.',
    'contact.label': 'merhaba', 'contact.h2': 'Birlikte bir şeyler yapalım.',
    'contact.sub': 'Staj ve stajyer pozisyonlarına açığım. Bana ulaşmanın en hızlı yolu e-posta.', 'contact.note': 'buraya yaz',
    'footer.text': 'Yapay zekâ (Claude) yardımıyla yapıldı, Vercel üzerinde yayında.'
  }
};
const EXTRA_EN = { 'lo.win': 'Solved! Moves: {n}' };
const LANGS = ['en', 'pl', 'tr'];

// Remember the English text that is already in the page.
const DEFAULT_TEXT = {};
document.querySelectorAll('[data-i18n]').forEach((el) => { DEFAULT_TEXT[el.dataset.i18n] = el.textContent; });
Object.assign(DEFAULT_TEXT, EXTRA_EN);

let currentLang = 'en';

function t(key, vars) {
  const dict = TRANSLATIONS[currentLang];
  let text = (dict && dict[key]) || DEFAULT_TEXT[key] || key;
  if (vars) {
    Object.keys(vars).forEach((name) => { text = text.replace('{' + name + '}', vars[name]); });
  }
  return text;
}

function applyLanguage(lang) {
  if (!LANGS.includes(lang)) lang = 'en';
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
  document.dispatchEvent(new CustomEvent('languagechange'));
  try { localStorage.setItem('lang', lang); } catch (e) { /* storage can be blocked: that is fine */ }
}

document.querySelectorAll('[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});
try {
  const saved = localStorage.getItem('lang');
  if (saved && saved !== 'en') applyLanguage(saved);
} catch (e) { /* ignore */ }


// ============================================================
// 3D hero scene: a small battery pack made of wireframe cells.
// Plain canvas maths, no libraries. It assembles itself when the page opens,
// then turns slowly, follows the mouse a little, and a "scan" runs along the cells.
// ============================================================
(function heroScene() {
  const canvas = document.getElementById('hero-3d');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLS = 6, ROWS = 2, DEPTH = 3;
  const HALF = { w: 0.4, h: 0.75, d: 0.4 };   // half size of one cell
  const STEP = { w: 1.05, h: 1.75, d: 1.05 }; // distance between cell centres

  // Cell centres
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

  // The 8 corners of a box (bits of i choose the sign) and its 12 edges (corners that differ in one bit)
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

  // Rotate a point around Y then X, then apply simple perspective.
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
    const unit = Math.min(width / 8.2, height / 5.2);
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
      const alpha = (0.14 + shade * 0.36 + (active ? 0.4 : 0)) * intro;

      ctx.beginPath();
      for (const e of edges) {
        ctx.moveTo(pts[e[0]].x, pts[e[0]].y);
        ctx.lineTo(pts[e[1]].x, pts[e[1]].y);
      }
      ctx.strokeStyle = 'rgba(31, 122, 77, ' + alpha.toFixed(3) + ')';
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

  if (reduceMotion) {
    draw(performance.now());   // one still picture, no animation
    return;
  }

  window.addEventListener('mousemove', (e) => {
    mouse.tx = e.clientX / window.innerWidth - 0.5;
    mouse.ty = e.clientY / window.innerHeight - 0.5;
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(canvas);
  }
  requestAnimationFrame(loop);
})();


// ============================================================
// Lights Out: 5x5 board. Pressing a light flips it and its neighbours.
// A new puzzle starts from "all off" and applies random presses, so it can always be solved.
// ============================================================
(function lightsOut() {
  const boardEl = document.getElementById('lo-board');
  const movesEl = document.getElementById('lo-moves');
  const statusEl = document.getElementById('lo-status');
  const newBtn = document.getElementById('lo-new');
  if (!boardEl || !movesEl || !statusEl || !newBtn) return;

  const SIZE = 5;
  const lights = new Array(SIZE * SIZE).fill(false);
  const buttons = [];
  let moves = 0;
  let solved = false;

  function flipAround(index) {
    const row = Math.floor(index / SIZE), col = index % SIZE;
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) lights[r * SIZE + c] = !lights[r * SIZE + c];
    });
  }

  function render() {
    lights.forEach((on, i) => buttons[i].setAttribute('aria-pressed', String(on)));
    movesEl.textContent = String(moves);
    statusEl.textContent = solved ? t('lo.win', { n: moves }) : '';
  }

  function press(index) {
    if (solved) return;
    flipAround(index);
    moves += 1;
    solved = lights.every((on) => !on);
    render();
  }

  function newPuzzle() {
    do {
      lights.fill(false);
      const presses = new Set();
      while (presses.size < 8) presses.add(Math.floor(Math.random() * SIZE * SIZE));
      presses.forEach(flipAround);
    } while (lights.every((on) => !on));
    moves = 0;
    solved = false;
    render();
  }

  for (let i = 0; i < SIZE * SIZE; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lo__cell';
    b.setAttribute('aria-label', 'Row ' + (Math.floor(i / SIZE) + 1) + ', column ' + (i % SIZE + 1));
    b.addEventListener('click', () => press(i));
    boardEl.appendChild(b);
    buttons.push(b);
  }
  newBtn.addEventListener('click', newPuzzle);
  document.addEventListener('languagechange', render);
  newPuzzle();
})();
