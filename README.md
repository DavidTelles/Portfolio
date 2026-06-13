# David Telles — Portfolio

Portfólio profissional desenvolvido com HTML, CSS e JavaScript puro.

## Tecnologias

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript ES6+
- Firebase Hosting
- GitHub Public API

## Estrutura

```
/portfolio
├── index.html
├── firebase.json
├── .firebaserc
├── README.md
├── /css
│   └── style.css
├── /js
│   └── script.js
└── /assets
    ├── images/
    ├── icons/
    └── animations/
```

## Funcionalidades

- Hero com partículas animadas e efeito typewriter
- Seção Sobre Mim
- Habilidades com barras de progresso animadas
- Projetos carregados via GitHub API (com fallback)
- Estatísticas do GitHub (repos, stars, forks, seguidores)
- Linguagens mais usadas calculadas dinamicamente
- Timeline da jornada de aprendizado
- Objetivos profissionais
- Formulário de contato com validação JS
- Totalmente responsivo (mobile, tablet, desktop)
- Animações de scroll reveal
- Modo de movimento reduzido respeitado

## Firebase Hosting — Deploy

### Pré-requisitos

```bash
npm install -g firebase-tools
```

### Passos

```bash
# 1. Login no Firebase
firebase login

# 2. Inicializar hosting (dentro da pasta do projeto)
firebase init hosting
# Selecione seu projeto Firebase
# Public directory: . (ponto — raiz do projeto)
# Configure as a single-page app: No
# Set up automatic builds: No

# 3. Publicar
firebase deploy
```

### Firebase Firestore (Opcional — formulário de contato)

Para salvar mensagens do formulário no Firestore, adicione o SDK do Firebase
no `index.html` antes do `</body>` e implemente a função `sendToFirestore`:

```html
<!-- Firebase SDK -->
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
  import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';

  const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    // ...
  };

  const app = window._firebaseApp = initializeApp(firebaseConfig);
  const db  = getFirestore(app);

  window.sendToFirestore = async (data) => {
    await addDoc(collection(db, 'contacts'), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };
</script>
```

## Personalizações Sugeridas

1. **Foto de perfil** — Substitua o placeholder `<i class="fa-solid fa-user-shield">` por `<img src="assets/images/profile.jpg" alt="David Telles">` dentro de `.avatar-placeholder`
2. **E-mail de contato** — Atualize o `href="mailto:..."` na seção de contato
3. **Projetos em destaque** — Edite o array `fallback` em `script.js` com seus projetos reais caso a API não esteja acessível
4. **Cores** — Altere as CSS Custom Properties em `:root` no `style.css`

## Licença

MIT © David Telles