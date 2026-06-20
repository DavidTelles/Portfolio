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
├── admin.html
├── firebase.json
├── firestore.rules
├── .firebaserc
├── README.md
├── /css
│   ├── style.css
│   └── admin.css
├── /js
│   ├── firebase-init.js
│   ├── visitors.js
│   ├── admin.js
│   ├── script.js
│   └── contact.js
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
- Contador de visitantes em tempo real via Firebase Firestore
- Painel administrativo privado com gráfico e log de visitas (`admin.html`)
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

### Firebase Firestore — já configurado

O SDK do Firebase (App, Firestore e Authentication) já está integrado em
`js/firebase-init.js`, incluindo o hook `sendToFirestore` usado pelo
formulário de contato. Veja a seção **Contador de Visitantes (Firebase)**
abaixo para os detalhes de configuração no Console (regras, Auth, etc).

## Contador de Visitantes (Firebase)

O portfólio já vem com rastreamento de visitas via **Firestore**, um card público
com o total em tempo real (seção "GitHub" → "Visitantes") e um painel
administrativo em `admin.html`.

### Como funciona

- `js/firebase-init.js` inicializa o Firebase (App, Firestore e Auth) com as
  credenciais do projeto `portfolio-david-b1b75`.
- `js/visitors.js` roda em todas as páginas públicas: registra 1 visita por
  sessão de navegador (`visits/{autoId}`, com device, navegador, idioma,
  fuso horário e referrer) e atualiza um contador agregado em
  `stats/visitors` via transação atômica. O card `#visitorCount` escuta esse
  documento em tempo real (`onSnapshot`).
- `admin.html` + `js/admin.js` mostram um dashboard privado: total de
  visitas, visitas hoje, últimos 7 dias, gráfico dos últimos 14 dias e
  tabela com as 20 visitas mais recentes. O acesso exige login (Firebase
  Authentication, e-mail/senha).

### Configuração necessária no Console do Firebase

1. **Ative o Firestore** (modo produção) no projeto `portfolio-david-b1b75`,
   se ainda não estiver ativo.
2. **Publique as regras de segurança**: o repositório já inclui
   `firestore.rules` com as permissões corretas (visitantes só podem criar
   registros, nunca ler dados de outros visitantes; o card público só lê o
   contador agregado). Publique com:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. **Ative Authentication → método E-mail/senha**, em
   Build → Authentication → Sign-in method.
4. **Crie seu usuário admin** em Authentication → Users → Add user, com o
   e-mail e senha que você vai usar para entrar em `/admin.html`.

### Deploy

```bash
firebase deploy
```

Isso publica o hosting e as regras do Firestore juntos. Depois, acesse
`https://portfolio-david-b1b75.web.app/admin.html` (ou seu domínio
customizado + `/admin.html`) e faça login com o usuário criado no passo 4.

> **Nota de segurança:** a `apiKey` do Firebase no `firebase-init.js` não é
> secreta — ela só identifica o projeto publicamente, como em qualquer app
> Firebase. Quem protege os dados de fato são as Firestore Rules e o
> Authentication, então não há problema em ela estar visível no código.

## Personalizações Sugeridas

1. **Foto de perfil** — Substitua o placeholder `<i class="fa-solid fa-user-shield">` por `<img src="assets/images/profile.jpg" alt="David Telles">` dentro de `.avatar-placeholder`
2. **E-mail de contato** — Atualize o `href="mailto:..."` na seção de contato
3. **Projetos em destaque** — Edite o array `fallback` em `script.js` com seus projetos reais caso a API não esteja acessível
4. **Cores** — Altere as CSS Custom Properties em `:root` no `style.css`

## Licença

MIT © David Telles