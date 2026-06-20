/* ═══════════════════════════════════════════════════════════════
   FIREBASE — INICIALIZAÇÃO CENTRAL
   Usado por: visitors.js, contact.js (sendToFirestore), admin.html
   ═══════════════════════════════════════════════════════════════ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBQuVdc9cCXMiyjb8tw9_Qi2XKV5Kdxe5k",
    authDomain: "portfolio-david-b1b75.firebaseapp.com",
    projectId: "portfolio-david-b1b75",
    storageBucket: "portfolio-david-b1b75.firebasestorage.app",
    messagingSenderId: "809966167840",
    appId: "1:809966167840:web:4d9833f2b6ea85058b9945",
    measurementId: "G-8ZTJ6FL887"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Expostos globalmente para os scripts clássicos (script.js, contact.js)
// que não são módulos ES, e para uso fácil no admin.html.
window._firebaseApp = app;
window._firestoreDb = db;
window._firebaseAuth = auth;

// Hook usado pelo formulário de contato (script.js já chama
// `sendToFirestore` se a função existir).
window.sendToFirestore = async (data) => {
    await addDoc(collection(db, 'contacts'), {
        ...data,
        createdAt: serverTimestamp(),
    });
};

// Sinaliza para outros scripts que o Firebase já está pronto,
// já que o carregamento de módulos ES é assíncrono.
window.dispatchEvent(new Event('firebase-ready'));

export { app, db, auth };
