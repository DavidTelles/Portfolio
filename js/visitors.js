/* ═══════════════════════════════════════════════════════════════
   VISITOR TRACKING — Firebase Firestore
   - Registra 1 visita por sessão de navegador (sessionStorage)
   - Mantém um contador agregado em stats/visitors (leitura barata)
   - Grava o log detalhado em visits/{autoId} (usado pelo admin)
   - Exibe o total no card público #visitorCount
   ═══════════════════════════════════════════════════════════════ */

import {
    collection,
    addDoc,
    doc,
    runTransaction,
    onSnapshot,
    serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const SESSION_KEY = 'dt_portfolio_visit_logged';

function waitForDb() {
    return new Promise((resolve) => {
        if (window._firestoreDb) return resolve(window._firestoreDb);
        window.addEventListener('firebase-ready', () => resolve(window._firestoreDb), { once: true });
    });
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    if (/mobile|android|iphone/i.test(ua)) return 'mobile';
    return 'desktop';
}

function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('Chrome/') && !ua.includes('OPR/')) return 'Chrome';
    if (ua.includes('Firefox/')) return 'Firefox';
    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
    if (ua.includes('OPR/')) return 'Opera';
    return 'Outro';
}

/* ── REGISTRA A VISITA (1x por sessão) ───────────────────────── */
async function logVisit(db) {
    if (sessionStorage.getItem(SESSION_KEY)) return; // já contado nesta sessão

    try {
        // 1) Log detalhado — alimenta o painel admin
        await addDoc(collection(db, 'visits'), {
            createdAt: serverTimestamp(),
            page: location.pathname,
            referrer: document.referrer || 'direto',
            language: navigator.language || 'desconhecido',
            device: getDeviceType(),
            browser: getBrowser(),
            screen: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'desconhecido',
        });

        // 2) Contador agregado — leitura barata para o card público
        const statsRef = doc(db, 'stats', 'visitors');
        await runTransaction(db, async (tx) => {
            const snap = await tx.get(statsRef);
            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

            if (!snap.exists()) {
                tx.set(statsRef, {
                    total: 1,
                    lastVisitAt: serverTimestamp(),
                    dailyDate: today,
                    dailyCount: 1,
                });
                return;
            }

            const data = snap.data();
            const isSameDay = data.dailyDate === today;

            tx.update(statsRef, {
                total: (data.total || 0) + 1,
                lastVisitAt: serverTimestamp(),
                dailyDate: today,
                dailyCount: isSameDay ? (data.dailyCount || 0) + 1 : 1,
            });
        });

        sessionStorage.setItem(SESSION_KEY, '1');
    } catch (err) {
        console.warn('Visitor tracking indisponível:', err);
    }
}

/* ── EXIBE O CONTADOR PÚBLICO EM TEMPO REAL ──────────────────── */
function watchVisitorCount(db) {
    const el = document.getElementById('visitorCount');
    if (!el) return;

    const statsRef = doc(db, 'stats', 'visitors');
    let animated = false;

    onSnapshot(statsRef, (snap) => {
        if (!snap.exists()) { el.textContent = '0'; return; }
        const total = snap.data().total || 0;

        if (!animated && typeof animateCounter === 'function') {
            animated = true;
            animateCounter(el, total);
        } else {
            el.textContent = total.toLocaleString('pt-BR');
        }
    }, (err) => {
        console.warn('Não foi possível carregar contagem de visitantes:', err);
        el.textContent = '—';
    });
}

/* ── INIT ─────────────────────────────────────────────────────── */
(async function initVisitors() {
    const db = await waitForDb();
    if (!db) return;
    await logVisit(db);
    watchVisitorCount(db);
})();
