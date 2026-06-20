/* ═══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD — Login (Firebase Auth) + Leitura de visitas
   ═══════════════════════════════════════════════════════════════ */

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    Timestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

function waitForFirebase() {
    return new Promise((resolve) => {
        if (window._firebaseAuth && window._firestoreDb) {
            return resolve({ auth: window._firebaseAuth, db: window._firestoreDb });
        }
        window.addEventListener('firebase-ready', () => {
            resolve({ auth: window._firebaseAuth, db: window._firestoreDb });
        }, { once: true });
    });
}

const DEVICE_ICON = {
    desktop: 'fa-display',
    mobile: 'fa-mobile-screen',
    tablet: 'fa-tablet-screen-button',
};

function formatDateTime(ts) {
    if (!ts || !ts.toDate) return '—';
    return ts.toDate().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
}

function timeAgo(ts) {
    if (!ts || !ts.toDate) return '—';
    const diffMs = Date.now() - ts.toDate().getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `há ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
}

/* ── LOGIN ────────────────────────────────────────────────────── */
function initLogin(auth) {
    const form = document.getElementById('loginForm');
    const errEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errEl.textContent = '';
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged cuida de revelar o dashboard
        } catch (err) {
            errEl.textContent = 'Credenciais inválidas ou conta não autorizada.';
            console.warn('Login admin falhou:', err.code);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-lock"></i> Entrar';
        }
    });

    document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));
}

/* ── CHART (SVG simples, sem libs) ───────────────────────────── */
function renderChart(dayBuckets) {
    const svg = document.getElementById('chartSvg');
    const W = 700, H = 220;
    const padBottom = 28, padTop = 16, padX = 8;
    const n = dayBuckets.length;
    const barGap = 8;
    const barWidth = (W - padX * 2 - barGap * (n - 1)) / n;
    const maxVal = Math.max(1, ...dayBuckets.map(d => d.count));

    let svgContent = '';

    dayBuckets.forEach((d, i) => {
        const barH = ((d.count / maxVal) * (H - padTop - padBottom)) || 0;
        const x = padX + i * (barWidth + barGap);
        const y = H - padBottom - barH;

        svgContent += `<rect class="chart-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barH.toFixed(1)}" rx="3"></rect>`;
        if (d.count > 0) {
            svgContent += `<text class="chart-value-label" x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle">${d.count}</text>`;
        }
        svgContent += `<text class="chart-axis-label" x="${(x + barWidth / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${d.label}</text>`;
    });

    svg.innerHTML = svgContent;
}

/* ── DASHBOARD DATA ───────────────────────────────────────────── */
async function loadDashboard(db) {
    // 1) Contador agregado (rápido)
    const statsSnap = await getDoc(doc(db, 'stats', 'visitors'));
    const stats = statsSnap.exists() ? statsSnap.data() : { total: 0, dailyCount: 0, dailyDate: null };

    document.getElementById('totalVisits').textContent = (stats.total || 0).toLocaleString('pt-BR');

    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('todayVisits').textContent =
        stats.dailyDate === today ? (stats.dailyCount || 0) : 0;

    // 2) Visitas dos últimos 14 dias para o gráfico + contagem de 7 dias
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const recentQuery = query(
        collection(db, 'visits'),
        where('createdAt', '>=', Timestamp.fromDate(fourteenDaysAgo)),
        orderBy('createdAt', 'asc')
    );
    const recentSnap = await getDocs(recentQuery);

    // Monta buckets de 14 dias
    const buckets = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        buckets.push({
            key,
            label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            count: 0,
        });
    }
    const bucketIndex = Object.fromEntries(buckets.map((b, i) => [b.key, i]));

    recentSnap.forEach(docSnap => {
        const v = docSnap.data();
        if (!v.createdAt) return;
        const key = v.createdAt.toDate().toISOString().slice(0, 10);
        if (key in bucketIndex) buckets[bucketIndex[key]].count++;
    });

    renderChart(buckets);

    const last7 = buckets.slice(-7).reduce((s, b) => s + b.count, 0);
    document.getElementById('last7Visits').textContent = last7;

    // 3) Últimas 20 visitas (tabela)
    const latestQuery = query(collection(db, 'visits'), orderBy('createdAt', 'desc'), limit(20));
    const latestSnap = await getDocs(latestQuery);

    const tbody = document.getElementById('visitsTableBody');
    tbody.innerHTML = '';

    if (latestSnap.empty) {
        tbody.innerHTML = '<tr><td colspan="6" class="admin-empty">Nenhuma visita registrada ainda.</td></tr>';
        document.getElementById('lastVisitTime').textContent = '—';
        return;
    }

    let isFirst = true;
    latestSnap.forEach(docSnap => {
        const v = docSnap.data();
        if (isFirst) {
            document.getElementById('lastVisitTime').textContent = timeAgo(v.createdAt);
            isFirst = false;
        }

        const icon = DEVICE_ICON[v.device] || 'fa-circle-question';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDateTime(v.createdAt)}</td>
            <td><span class="device-badge"><i class="fa-solid ${icon}"></i> ${v.device || '—'}</span></td>
            <td>${v.browser || '—'}</td>
            <td>${v.language || '—'}</td>
            <td>${v.timezone || '—'}</td>
            <td>${v.referrer && v.referrer !== 'direto' ? v.referrer : 'Direto'}</td>
        `;
        tbody.appendChild(row);
    });
}

/* ── INIT ─────────────────────────────────────────────────────── */
(async function initAdmin() {
    const { auth, db } = await waitForFirebase();
    if (!auth || !db) return;

    initLogin(auth);

    onAuthStateChanged(auth, async (user) => {
        const loginWrap = document.getElementById('loginWrap');
        const adminMain = document.getElementById('adminMain');
        const logoutBtn = document.getElementById('logoutBtn');

        if (user) {
            loginWrap.style.display = 'none';
            adminMain.classList.add('visible');
            logoutBtn.style.display = 'inline-flex';
            try {
                await loadDashboard(db);
            } catch (err) {
                console.error('Erro ao carregar dashboard:', err);
                document.getElementById('visitsTableBody').innerHTML =
                    '<tr><td colspan="6" class="admin-empty">Erro ao carregar dados. Verifique as regras do Firestore.</td></tr>';
            }
        } else {
            loginWrap.style.display = 'flex';
            adminMain.classList.remove('visible');
            logoutBtn.style.display = 'none';
        }
    });
})();
