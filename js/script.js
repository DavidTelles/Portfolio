/* ═══════════════════════════════════════════════════════════════
   DAVID TELLES — PORTFOLIO SCRIPT
   Modules: Particles · Typewriter · Nav · Reveal · Skills ·
            GitHub API · Projects · Stats · Counters · Timeline ·
            Contact Form · Filter
   ═══════════════════════════════════════════════════════════════ */

/* ── CONFIG ───────────────────────────────────────────────────── */
const GITHUB_USER = 'DavidTelles';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}`;
const REPOS_API = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

/* ══════════════════════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════════════════════ */
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animFrame;

    const COLORS = ['rgba(0,212,255,', 'rgba(124,58,237,', 'rgba(16,185,129,'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.4 + 0.05,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            color,
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: 90 }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = p.color + (0.06 * (1 - dist / 120)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = canvas.height + 10;
            if (p.y > canvas.height + 10) p.y = -10;
        });

        animFrame = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener('resize', () => { resize(); });

    // Pause when section not visible
    const heroObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            if (!animFrame) draw();
        } else {
            cancelAnimationFrame(animFrame);
            animFrame = null;
        }
    });
    heroObserver.observe(document.querySelector('.hero'));
})();

/* ══════════════════════════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════════════════════════ */
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Desenvolvedor Web',
        'Entusiasta de Cybersecurity',
        'Estudante de Pentest',
        'Backend Developer',
        'Open Source Contributor',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let paused = false;

    function type() {
        const current = phrases[phraseIdx];

        if (paused) {
            paused = false;
            setTimeout(type, 1500);
            return;
        }

        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) { deleting = true; paused = true; }
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
        }

        const speed = deleting ? 40 : (paused ? 1500 : 80);
        setTimeout(type, speed);
    }

    setTimeout(type, 800);
})();

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
(function initNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
})();

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
(function initReveal() {
    const items = document.querySelectorAll('[data-reveal], .section-eyebrow, .section-title, .timeline-item');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                e.target.style.transitionDelay = (i % 4) * 80 + 'ms';
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    items.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════════════════════ */
(function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.width = e.target.dataset.pct + '%';
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(b => obs.observe(b));
})();

/* ══════════════════════════════════════════════════════════════
   GITHUB API
══════════════════════════════════════════════════════════════ */
async function fetchGitHub() {
    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(GITHUB_API),
            fetch(REPOS_API),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

        const user = await userRes.json();
        const repos = await reposRes.json();

        renderProjects(repos);
        renderStats(user, repos);
        renderLangStats(repos);
    } catch (err) {
        console.warn('GitHub API unavailable, using fallback data.', err);
        renderProjectsFallback();
        renderStatsFallback();
    }
}

/* ══════════════════════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════════════════════ */
const CATEGORY_MAP = {
    web: ['html', 'css', 'javascript', 'js', 'react', 'vue', 'web', 'frontend', 'site', 'portfolio'],
    backend: ['node', 'express', 'api', 'rest', 'server', 'backend', 'python', 'flask'],
    security: ['security', 'pentest', 'hack', 'ctf', 'owasp', 'vuln', 'exploit', 'nmap', 'kali'],
    study: ['study', 'learn', 'curso', 'exercicio', 'challenge', 'algoritmo', 'aula'],
};

function detectCategory(repo) {
    const text = ((repo.name || '') + ' ' + (repo.description || '') + ' ' + (repo.language || '')).toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
        if (keywords.some(k => text.includes(k))) return cat;
    }
    return 'study';
}

function buildProjectCard(repo, delay = 0) {
    const category = detectCategory(repo);
    const desc = repo.description || 'Sem descrição disponível. Confira o repositório para mais detalhes.';
    const lang = repo.language || 'N/A';

    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = category;
    card.style.animationDelay = delay + 'ms';

    card.innerHTML = `
    <div class="card-terminal-bar">
      <span class="t-dot t-red"></span>
      <span class="t-dot t-yellow"></span>
      <span class="t-dot t-green"></span>
      <span class="card-repo-name">${repo.full_name || GITHUB_USER + '/' + repo.name}</span>
    </div>
    <div class="card-body">
      <h4>${formatRepoName(repo.name)}</h4>
      <p class="card-desc">${desc}</p>
      <div class="card-langs">
        ${lang !== 'N/A' ? `<span class="lang-badge">${lang}</span>` : ''}
        ${(repo.topics || []).slice(0, 3).map(t => `<span class="lang-badge">${t}</span>`).join('')}
      </div>
      <div class="card-footer">
        <div class="card-stats">
          <span><i class="fa-regular fa-star"></i> ${repo.stargazers_count || 0}</span>
          <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count || 0}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="card-link">
          <i class="fa-brands fa-github"></i> Ver
        </a>
      </div>
    </div>
  `;

    return card;
}

function formatRepoName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function renderProjects(repos) {
    const grid = document.getElementById('projectsGrid');
    const visible = repos.filter(r => !r.fork && !r.private && r.name !== '.github');

    grid.innerHTML = '';
    if (visible.length === 0) { renderProjectsFallback(); return; }

    visible.slice(0, 12).forEach((repo, i) => {
        grid.appendChild(buildProjectCard(repo, i * 80));
    });

    initProjectFilter();
}

function renderProjectsFallback() {
    const fallback = [
        { name: 'portfolio', description: 'Portfólio pessoal desenvolvido com HTML, CSS e JavaScript puro.', language: 'JavaScript', stargazers_count: 2, forks_count: 0, html_url: `https://github.com/${GITHUB_USER}`, category_hint: 'web' },
        { name: 'web-studies', description: 'Projetos e exercícios de HTML, CSS e JavaScript durante minha jornada de aprendizado.', language: 'HTML', stargazers_count: 1, forks_count: 0, html_url: `https://github.com/${GITHUB_USER}`, category_hint: 'web' },
        { name: 'node-api', description: 'API RESTful construída com Node.js e Express, com integração ao PostgreSQL.', language: 'JavaScript', stargazers_count: 3, forks_count: 1, html_url: `https://github.com/${GITHUB_USER}`, category_hint: 'backend' },
        { name: 'sql-exercises', description: 'Coleção de exercícios e scripts SQL para prática com PostgreSQL.', language: 'SQL', stargazers_count: 0, forks_count: 0, html_url: `https://github.com/${GITHUB_USER}`, category_hint: 'study' },
        { name: 'linux-scripts', description: 'Scripts utilitários para automação e administração em sistemas Linux.', language: 'Shell', stargazers_count: 1, forks_count: 0, html_url: `https://github.com/${GITHUB_USER}`, category_hint: 'security' },
        { name: 'ctf-writeups', description: 'Writeups e soluções de desafios CTF (Capture The Flag) em diversas categorias.', language: 'Markdown', stargazers_count: 2, forks_count: 0, html_url: `https://github.com/${GITHUB_USER}`, category_hint: 'security' },
    ];

    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';

    fallback.forEach((repo, i) => {
        const fakeRepo = {
            ...repo,
            full_name: `${GITHUB_USER}/${repo.name}`,
            topics: [],
        };
        const card = buildProjectCard(fakeRepo, i * 80);
        card.dataset.category = repo.category_hint;
        grid.appendChild(card);
    });

    initProjectFilter();
}

function initProjectFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.style.display = show ? 'flex' : 'none';
            });
        });
    });
}

/* ══════════════════════════════════════════════════════════════
   GITHUB STATS
══════════════════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1500) {
    if (isNaN(target) || target < 0) { el.textContent = target; return; }
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

function renderStats(user, repos) {
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);

    const statsObs = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        statsObs.disconnect();
        animateCounter(document.getElementById('repoCount'), user.public_repos || 0);
        animateCounter(document.getElementById('starCount'), totalStars);
        animateCounter(document.getElementById('forkCount'), totalForks);
        animateCounter(document.getElementById('followerCount'), user.followers || 0);
    }, { threshold: 0.3 });

    statsObs.observe(document.getElementById('statsGrid'));
}

function renderStatsFallback() {
    const statsObs = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        statsObs.disconnect();
        animateCounter(document.getElementById('repoCount'), 12);
        animateCounter(document.getElementById('starCount'), 9);
        animateCounter(document.getElementById('forkCount'), 3);
        animateCounter(document.getElementById('followerCount'), 5);
    }, { threshold: 0.3 });
    statsObs.observe(document.getElementById('statsGrid'));
    renderLangsFallback();
}

function renderLangStats(repos) {
    const langs = {};
    repos.forEach(r => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });

    const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const total = sorted.reduce((s, [, n]) => s + n, 0);

    const container = document.getElementById('langBars');
    container.innerHTML = '';

    const langColors = {
        JavaScript: '#F7DF1E', HTML: '#E34F26', CSS: '#1572B6',
        Python: '#3776AB', Shell: '#4EAA25', TypeScript: '#3178C6',
        SQL: '#CC2927', Markdown: '#083fa1', Ruby: '#CC342D',
    };

    sorted.forEach(([lang, count]) => {
        const pct = Math.round((count / total) * 100);
        const color = langColors[lang] || '#00D4FF';

        const item = document.createElement('div');
        item.className = 'lang-item';
        item.innerHTML = `
      <div class="lang-header">
        <span class="lang-name">${lang}</span>
        <span class="lang-pct">${pct}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-pct="${pct}" style="background: linear-gradient(90deg, ${color}88, ${color}); width: 0;"></div>
      </div>
    `;
        container.appendChild(item);
    });

    // Trigger bars
    setTimeout(() => {
        container.querySelectorAll('.skill-fill').forEach(b => { b.style.width = b.dataset.pct + '%'; });
    }, 300);
}

function renderLangsFallback() {
    const container = document.getElementById('langBars');
    container.innerHTML = '';
    const langs = [
        { lang: 'JavaScript', pct: 45, color: '#F7DF1E' },
        { lang: 'HTML', pct: 25, color: '#E34F26' },
        { lang: 'CSS', pct: 15, color: '#1572B6' },
        { lang: 'Shell', pct: 10, color: '#4EAA25' },
        { lang: 'SQL', pct: 5, color: '#CC2927' },
    ];
    langs.forEach(({ lang, pct, color }) => {
        const item = document.createElement('div');
        item.className = 'lang-item';
        item.innerHTML = `
      <div class="lang-header">
        <span class="lang-name">${lang}</span>
        <span class="lang-pct">${pct}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-pct="${pct}" style="background: linear-gradient(90deg, ${color}88, ${color}); width: 0;"></div>
      </div>
    `;
        container.appendChild(item);
    });
    setTimeout(() => {
        container.querySelectorAll('.skill-fill').forEach(b => { b.style.width = b.dataset.pct + '%'; });
    }, 300);
}

/* ══════════════════════════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════════════════════ */
(function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    function setError(fieldId, errorId, msg) {
        const field = document.getElementById(fieldId);
        const err = document.getElementById(errorId);
        if (msg) {
            field.classList.add('error');
            err.textContent = msg;
        } else {
            field.classList.remove('error');
            err.textContent = '';
        }
        return !!msg;
    }

    function validate() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        let hasError = false;

        hasError = setError('name', 'nameError', name.length < 2 ? 'Nome deve ter pelo menos 2 caracteres.' : '') || hasError;
        hasError = setError('email', 'emailError', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'E-mail inválido.' : '') || hasError;
        hasError = setError('message', 'messageError', message.length < 10 ? 'Mensagem deve ter pelo menos 10 caracteres.' : '') || hasError;

        return !hasError;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedback.className = 'form-feedback';
        feedback.style.display = 'none';

        if (!validate()) return;

        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        // Simulate send (Firebase integration hook)
        await new Promise(r => setTimeout(r, 1200));

        // Try Firebase if available
        if (typeof sendToFirestore === 'function') {
            await sendToFirestore({
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                message: document.getElementById('message').value.trim(),
                createdAt: new Date().toISOString(),
            });
        }

        // Show success
        feedback.className = 'form-feedback success';
        feedback.textContent = '✓ Mensagem enviada com sucesso! Responderei em breve.';
        form.reset();

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensagem';
    });
})();

/* ══════════════════════════════════════════════════════════════
   PARALLAX (subtle)
══════════════════════════════════════════════════════════════ */
(function initParallax() {
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
            hero.style.backgroundPositionY = (y * 0.3) + 'px';
        }
    }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════════
   SMOOTH ACTIVE NAV
══════════════════════════════════════════════════════════════ */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => {
                    a.style.color = a.getAttribute('href') === '#' + entry.target.id
                        ? 'var(--text-primary)'
                        : '';
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
})();

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHub();
});