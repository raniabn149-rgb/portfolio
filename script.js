// ---------- Réglages ----------
// Laisse vide pour utiliser les réponses intégrées (aucune clé nécessaire).
// Après hébergement avec la fonction api/chat.js, mets : "/api/chat"
const API_URL = "";

// ---------- Connaissances de l'assistant (à modifier librement) ----------
const KB = [
  {
    k: ["bonjour", "salut", "hello", "bonsoir", "coucou"],
    a: "Bonjour ! Je suis l’assistant du portfolio de Rania. Posez-moi une question sur son parcours, ses projets ou ses compétences.",
  },
  {
    k: ["qui", "presente", "profil", "rania", "propos"],
    a: "Rania Ben Hassen est étudiante en 3ème année de Licence en Technologies de l’Informatique (Multimédia et Développement Web) à l’ISET Sidi Bouzid. Elle est créative, s’adapte vite et cherche un stage PFE.",
  },
  {
    k: [
      "stage",
      "pfe",
      "disponible",
      "recrut",
      "embauch",
      "recherche",
      "cherche",
    ],
    a: "Rania recherche un stage de fin d’études (PFE) en développement web et multimédia, pour contribuer à un projet concret au sein d’une équipe. Pour les dates, le plus simple est de lui écrire : <a href='mailto:raniabn149@gmail.com'>raniabn149@gmail.com</a>.",
  },
  {
    k: [
      "competence",
      "technolog",
      "langage",
      "stack",
      "maitrise",
      "php",
      "javascript",
      "laravel",
      "angular",
      "codeigniter",
      "python",
      "java",
      "sql",
      "mysql",
      "framework",
    ],
    a: "Langages : PHP, JavaScript, C/C++, Java, Python, HTML/CSS. Frameworks : Laravel, Angular, CodeIgniter 4, Bootstrap 5. Bases de données : SQL et MySQL. Elle travaille avec l’architecture MVC et Git/GitHub.",
  },
  {
    k: [
      "bijoux",
      "ecommerce",
      "e-commerce",
      "jewelry",
      "boutique",
      "yes internet",
      "panier",
    ],
    a: "Rania Jewelry Collection est un site e-commerce complet de vente de bijoux, créé pendant son stage chez Yes Internet (PHP, CodeIgniter 4, MySQL, Bootstrap 5). Les clients ont un catalogue, un panier et la commande en ligne. L’administrateur gère produits, catégories, commandes et messages.",
  },
  {
    k: [
      "projet",
      "realis",
      "github",
      "code",
      "covoiturage",
      "cms",
      "productfood",
      "study",
    ],
    a: "Ses projets : le site e-commerce Rania Jewelry Collection, Covoiturage, Study Group Website, Mini CMS et ProductFood. Les codes sont sur <a href='https://github.com/raniabn149-rgb' target='_blank' rel='noopener'>son GitHub</a>.",
  },
  {
    k: ["experience", "iconconcept", "travail", "professionnel", "note"],
    a: "Deux stages : Iconconcept (janvier 2025, note 17/20) où elle a créé un email promotionnel, mis à jour 15 hôtels et préparé des icônes SVG ; puis Yes Internet (janvier 2026, note 18/20) pour l’application e-commerce.",
  },
  {
    k: [
      "formation",
      "etude",
      "iset",
      "licence",
      "diplome",
      "mention",
      "ecole",
      "universite",
    ],
    a: "Licence en Technologies de l’Informatique, spécialité Multimédia et Développement Web, à l’ISET Sidi Bouzid depuis 2024. Les 1re et 2e années sont validées avec mention Bien.",
  },
  {
    k: ["3d", "unity", "blender", "multimedia", "photoshop", "design"],
    a: "En multimédia, Rania utilise Unity et Blender pour la 3D interactive, et Photoshop pour le graphisme. C’est l’une de ses spécialisations, avec le développement web moderne.",
  },
  {
    k: ["langue", "arabe", "francais", "anglais", "parle"],
    a: "Arabe : langue maternelle. Français : très bien. Anglais : très bien.",
  },
  {
    k: [
      "contact",
      "email",
      "mail",
      "telephone",
      "tel",
      "linkedin",
      "joindre",
      "cv",
      "ecrire",
      "appeler",
    ],
    a: "Email : <a href='mailto:raniabn149@gmail.com'>raniabn149@gmail.com</a> · Tél : <a href='tel:+21690615818'>+216 90 615 818</a> · <a href='https://www.linkedin.com/in/rania-ben-hassen' target='_blank' rel='noopener'>LinkedIn</a>. Son <a href='CV_Rania_Ben_Hassen.pdf' download>CV est téléchargeable ici</a>.",
  },
  {
    k: ["hammamet", "ville", "habite", "lieu", "tunisie", "ou "],
    a: "Rania vit à Hammamet, en Tunisie.",
  },
  {
    k: [
      "qualite",
      "force",
      "personnalite",
      "leadership",
      "certification",
      "interet",
      "loisir",
    ],
    a: "Ses qualités : adaptation, créativité et amélioration continue. Elle a aussi des certifications en leadership. Ses centres d’intérêt : voyages, sport et lecture.",
  },
];

const FALLBACK =
  "Je n’ai pas la réponse à cette question. Essayez avec les projets, les compétences, les stages ou le contact, ou écrivez directement à Rania.";
const CHIPS = [
  "Quelles compétences ?",
  "Parle-moi du site e-commerce",
  "Quels stages a-t-elle faits ?",
  "Comment la contacter ?",
];

// ---------- Interface ----------
const log = document.getElementById("log");
const form = document.getElementById("form");
const input = document.getElementById("q");
const chips = document.getElementById("chips");

const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function add(text, who, html = false) {
  const d = document.createElement("div");
  d.className = "msg " + who;
  html ? (d.innerHTML = text) : (d.textContent = text);
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}

function localAnswer(q) {
  const t = " " + norm(q) + " ";
  let best = null,
    top = 0;
  for (const item of KB) {
    const score = item.k.filter((w) => t.includes(w)).length;
    if (score > top) {
      top = score;
      best = item;
    }
  }
  return best ? { text: best.a, html: true } : { text: FALLBACK, html: false };
}

async function answer(q) {
  if (!API_URL) return localAnswer(q);
  try {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q }),
    });
    const data = await r.json();
    return { text: data.reply || FALLBACK, html: false };
  } catch {
    return localAnswer(q); // repli si l’API est indisponible
  }
}

async function ask(q) {
  q = q.trim();
  if (!q) return;
  add(q, "me");
  input.value = "";
  const wait = add("…", "bot");
  const [res] = await Promise.all([
    answer(q),
    new Promise((r) => setTimeout(r, 450)),
  ]);
  wait.remove();
  add(res.text, "bot", res.html);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ask(input.value);
});

CHIPS.forEach((c) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = c;
  b.addEventListener("click", () => ask(c));
  chips.appendChild(b);
});

add(
  "Bonjour ! Je réponds à vos questions sur le parcours, les projets et les compétences de Rania.",
  "bot"
);

// ---------- Thème clair / sombre ----------
const themeBtn = document.getElementById("theme");
function setTheme(t) {
  document.documentElement.setAttribute("data-bs-theme", t);
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  try {
    localStorage.setItem("theme", t);
  } catch {}
}
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch {}
setTheme(
  savedTheme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
);
themeBtn.addEventListener("click", () =>
  setTheme(
    document.documentElement.getAttribute("data-bs-theme") === "dark"
      ? "light"
      : "dark"
  )
);

// ---------- Filtre des compétences ----------
const filters = document.querySelectorAll("[data-filter]");
filters.forEach((b) =>
  b.addEventListener("click", () => {
    filters.forEach((x) => x.classList.toggle("active", x === b));
    const f = b.dataset.filter;
    document
      .querySelectorAll(".skill")
      .forEach((s) =>
        s.parentElement.classList.toggle(
          "d-none",
          f !== "all" && s.dataset.cat !== f
        )
      );
  })
);

// ---------- Fiche détaillée d’une compétence ----------
const CATS = {
  lang: "Langage",
  web: "Framework",
  data: "Base de données",
  media: "3D et design",
  tools: "Outil",
};
const G = "Dépôts publics sur mon GitHub";
// Modifie ou complète librement : d = description, u = où je l’utilise
const INFO = {
  PHP: {
    d: "Langage côté serveur très utilisé pour créer des sites dynamiques et des applications web.",
    u: ["Rania Jewelry Collection (back-end, MVC)"],
  },
  JavaScript: {
    d: "Langage qui rend les pages web interactives directement dans le navigateur.",
    u: ["Ce portfolio : assistant, filtre des compétences, thème clair/sombre"],
  },
  C: {
    d: "Langage compilé proche de la machine, base de la programmation système.",
  },
  "C++": {
    d: "Extension orientée objet du C, utilisée pour les applications performantes.",
  },
  Java: {
    d: "Langage orienté objet et portable, utilisé pour les applications de bureau, mobiles et serveur.",
  },
  Python: {
    d: "Langage lisible et polyvalent : scripts, web, analyse de données.",
  },
  HTML5: {
    d: "Langage de structure des pages web.",
    u: [
      "Email promotionnel ExpressMailing.tn (tableaux de tarifs)",
      "Rania Jewelry Collection",
      "Ce portfolio",
    ],
  },
  CSS3: {
    d: "Langage de mise en forme et de mise en page, avec le responsive design.",
    u: ["Rania Jewelry Collection", "Ce portfolio"],
  },
  Laravel: {
    d: "Framework PHP moderne, basé sur l’architecture MVC, pour créer des applications web structurées.",
  },
  Angular: { d: "Framework pour créer des applications web monopages." },
  "CodeIgniter 4": {
    d: "Framework PHP léger basé sur l’architecture MVC.",
    u: ["Rania Jewelry Collection"],
  },
  "Bootstrap 5": {
    d: "Framework CSS pour construire rapidement des interfaces responsive.",
    u: ["Rania Jewelry Collection", "Ce portfolio"],
  },
  MySQL: {
    d: "Système de gestion de bases de données relationnelles.",
    u: ["Rania Jewelry Collection (produits, catégories, commandes, messages)"],
  },
  phpMyAdmin: {
    d: "Interface web pour administrer les bases de données MySQL.",
    u: ["Rania Jewelry Collection"],
  },
  Unity: {
    d: "Moteur pour créer des jeux et des expériences 3D interactives.",
    u: ["Fait partie de ma spécialisation en modélisation 3D interactive"],
  },
  Blender: {
    d: "Logiciel libre de modélisation, d’animation et de rendu 3D.",
    u: ["Fait partie de ma spécialisation en modélisation 3D interactive"],
  },
  Photoshop: { d: "Logiciel de retouche d’image et de création graphique." },
  "VS Code": { d: "Éditeur de code léger et extensible.", u: ["Ce portfolio"] },
  Git: { d: "Système de gestion de versions du code.", u: [G] },
  GitHub: {
    d: "Plateforme pour héberger, partager et suivre du code.",
    u: ["Covoiturage, Study Group Website, Mini CMS, ProductFood"],
  },
  Linux: {
    d: "Système d’exploitation open source, très répandu côté serveurs.",
  },
  Qt: {
    d: "Framework C++ pour créer des interfaces graphiques d’applications.",
  },
};
document.getElementById("skillModal").addEventListener("show.bs.modal", (e) => {
  const b = e.relatedTarget;
  const name = b.querySelector("span").textContent;
  const info = INFO[name] || { d: "" };
  document.getElementById("skIcon").className =
    "sk-big " + b.querySelector("i").className;
  document.getElementById("skTitle").textContent = name;
  document.getElementById("skCat").textContent = CATS[b.dataset.cat];
  document.getElementById("skDesc").textContent = info.d;
  const use = document.getElementById("skUse");
  use.textContent = "";
  if (info.u) {
    const t = document.createElement("strong");
    t.textContent = "Où je l’utilise";
    const ul = document.createElement("ul");
    info.u.forEach((x) => {
      const li = document.createElement("li");
      li.textContent = x;
      ul.appendChild(li);
    });
    use.append(t, ul);
  }
});

// ---------- Formulaire de contact ----------
// Option 1 (par défaut, FORM_URL vide) : ouvre la messagerie du visiteur avec le message prérempli.
// Option 2 : colle ici ton lien Formspree (https://formspree.io/f/xxxxxxxx) pour recevoir les messages par email.
const FORM_URL = "";
const MY_EMAIL = "raniabn149@gmail.com";
const cf = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const sendBtn = document.getElementById("cSend");
const show = (msg, type) => {
  status.className = "alert alert-" + type + " mt-3 mb-0";
  status.textContent = msg;
};

cf.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!cf.checkValidity()) {
    cf.classList.add("was-validated");
    return;
  }
  const data = Object.fromEntries(new FormData(cf));
  if (data.website) return; // champ piège anti-spam

  if (!FORM_URL) {
    const body = `Nom : ${data.name}\nEmail : ${data.email}\n\n${data.message}`;
    location.href = `mailto:${MY_EMAIL}?subject=${encodeURIComponent(
      data.subject + " – " + data.name
    )}&body=${encodeURIComponent(body)}`;
    show(
      "Votre application de messagerie s’ouvre : il ne reste qu’à envoyer.",
      "info"
    );
    return;
  }
  sendBtn.disabled = true;
  try {
    const r = await fetch(FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error();
    cf.reset();
    cf.classList.remove("was-validated");
    show(
      "Merci ! Votre message est envoyé, je vous réponds bientôt.",
      "success"
    );
  } catch {
    show(
      "L’envoi a échoué. Écrivez-moi directement à " + MY_EMAIL + ".",
      "danger"
    );
  } finally {
    sendBtn.disabled = false;
  }
});

// ---------- Barre de progression de lecture ----------
const bar = document.getElementById("progress");
addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  },
  { passive: true }
);

// ---------- Inclinaison 3D des cartes projets ----------
if (
  matchMedia("(hover: hover)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  document.querySelectorAll(".proj:not(.proj-big)").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-y * 8).toFixed(
        2
      )}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ---------- Scène 3D : symbole </> de développeur (Three.js) ----------
// Réagit à la souris et au défilement ; un clic déclenche une rotation et une gerbe d’étincelles.
(function () {
  if (!window.THREE || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;
  const canvas = document.getElementById("scene");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 9;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8877cc, 0.9));
  const warm = new THREE.PointLight(0xffb48a, 70, 60);
  warm.position.set(5, 5, 6);
  scene.add(warm);
  const cool = new THREE.PointLight(0x7b61ff, 70, 60);
  cool.position.set(-6, -3, 4);
  scene.add(cool);

  const tilt = new THREE.Group(),
    spinG = new THREE.Group();
  tilt.add(spinG);
  scene.add(tilt);
  // objet de développeur : le symbole </> en 3D
  const mat = (col) =>
    new THREE.MeshStandardMaterial({
      color: col,
      metalness: 0.3,
      roughness: 0.32,
    });
  const cap = (col, len, x, y, rz) => {
    const m = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.22, len, 10, 20),
      mat(col)
    );
    m.position.set(x, y, 0);
    m.rotation.z = rz;
    return m;
  };
  const chevron = (side) => {
    // side = -1 pour "<", +1 pour ">"
    const g = new THREE.Group();
    g.add(
      cap(0x6a4cff, 1.5, 0.21, 0.66, -0.82),
      cap(0x6a4cff, 1.5, 0.21, -0.66, 0.82)
    );
    g.position.x = side * 1.5;
    g.scale.x = -side;
    return g;
  };
  spinG.add(chevron(-1), chevron(1), cap(0xffb48a, 2.3, 0, 0, -0.3));

  // étincelles
  const N = 420,
    pos = new Float32Array(N * 3),
    vel = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pmat = new THREE.PointsMaterial({
    size: 0.07,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  scene.add(new THREE.Points(geo, pmat));

  let mx = 0,
    my = 0,
    spin = 0,
    tx = 0,
    ty = 0,
    tx0 = 0,
    ty0 = 0,
    pulse = 0;
  addEventListener("mousemove", (e) => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  });
  addEventListener("click", () => {
    spin = 0.35;
    pulse = 1;
    for (let i = 0; i < N; i++) {
      const dx = pos[i * 3] - tilt.position.x,
        dy = pos[i * 3 + 1] - tilt.position.y;
      const d = Math.hypot(dx, dy) + 0.5,
        f = 0.5 / d;
      vel[i * 3] += (dx / d) * f;
      vel[i * 3 + 1] += (dy / d) * f;
    }
  });
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize);
  resize();

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - innerHeight
    );
    const p = scrollY / max;
    const halfW = Math.tan((22.5 * Math.PI) / 180) * 9 * camera.aspect;
    const mobile = innerWidth < 820;
    // la bague traverse la page en suivant le défilement
    tx0 = mobile ? 0 : Math.sin(p * Math.PI * 3 + 1.2) * halfW * 0.72;
    ty0 = mobile ? 2.4 : Math.sin(p * 7) * 1.2;
    tx += (tx0 - tx) * 0.05;
    ty += (ty0 - ty) * 0.05;
    tilt.position.set(tx, ty + Math.sin(t * 1.2) * 0.15, 0);
    const s = (mobile ? 0.42 : 0.62) + pulse * 0.25;
    tilt.scale.setScalar(s);
    pulse *= 0.92;
    spin *= 0.96;
    spinG.rotation.y += 0.008 + spin + p * 0.004;
    tilt.rotation.x += (my * 0.45 + 0.25 - tilt.rotation.x) * 0.06;
    tilt.rotation.z += (-mx * 0.3 - tilt.rotation.z) * 0.06;
    spinG.rotation.x = Math.sin(t * 0.7) * 0.12;

    const dark =
      document.documentElement.getAttribute("data-bs-theme") === "dark";
    pmat.color.set(dark ? 0xd9ccff : 0x7b5cff);
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      pos[k] += vel[k] + Math.sin(t + i) * 0.0012;
      pos[k + 1] += vel[k + 1] + 0.004;
      vel[k] *= 0.96;
      vel[k + 1] *= 0.96;
      if (pos[k + 1] > 7.5) pos[k + 1] = -7.5;
      if (Math.abs(pos[k]) > 13) pos[k] *= -0.98;
    }
    geo.attributes.position.needsUpdate = true;
    camera.position.x += (mx * 0.6 - camera.position.x) * 0.03;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
})();

// ---------- Rôle animé dans le hero ----------
(function () {
  const el = document.getElementById("role");
  const roles = [
    "développement web moderne",
    "intégration multimédia",
    "modélisation 3D interactive",
  ];
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = roles.join(" · ");
    return;
  }
  let i = 0,
    n = 0,
    del = false;
  (function tick() {
    const w = roles[i];
    n += del ? -1 : 1;
    el.textContent = w.slice(0, n);
    let d = del ? 35 : 70;
    if (!del && n === w.length) {
      del = true;
      d = 1600;
    } else if (del && n === 0) {
      del = false;
      i = (i + 1) % roles.length;
      d = 350;
    }
    setTimeout(tick, d);
  })();
})();

// ---------- Fiche de profil tapée comme dans un éditeur ----------
(function () {
  const code = document.getElementById("code");
  const src = `const rania = {
  nom: "Rania Ben Hassen",
  formation: "Licence TI, Multimédia et Développement Web",
  ecole: "ISET Sidi Bouzid",
  web: ["PHP", "CodeIgniter 4", "JavaScript", "MySQL", "Bootstrap 5"],
  multimedia: ["Unity", "Blender", "Photoshop"],
  langues: ["arabe", "français", "anglais"],
  recherche: "Stage PFE"
};`;
  const hl = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"[^"]*"?/g, (m) => `<span class="tk-s">${m}</span>`)
      .replace(/^(\s+)(\w+)(:)/gm, '$1<span class="tk-p">$2</span>$3')
      .replace(/\bconst\b/g, '<span class="tk-k">const</span>');
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    code.innerHTML = hl(src);
    return;
  }
  let started = false;
  new IntersectionObserver(
    (en, ob) => {
      if (!en[0].isIntersecting || started) return;
      started = true;
      ob.disconnect();
      let n = 0;
      (function type() {
        n += 2;
        code.innerHTML = hl(src.slice(0, n)) + '<span class="caret"></span>';
        if (n < src.length) setTimeout(type, 22);
        else code.innerHTML = hl(src);
      })();
    },
    { threshold: 0.4 }
  ).observe(code);
})();

// ---------- Bouton retour en haut ----------
const topBtn = document.getElementById("topBtn");
addEventListener(
  "scroll",
  () => topBtn.classList.toggle("show", scrollY > 700),
  { passive: true }
);

// ---------- Effet « décodage » du nom ----------
function decode() {
  const h = document.querySelector("h1"),
    txt = h.textContent;
  h.setAttribute("aria-label", txt);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#<>/{}";
  let f = 0;
  const id = setInterval(() => {
    f++;
    h.textContent = [...txt]
      .map((ch, i) =>
        ch === " "
          ? " "
          : i < f / 2
          ? ch
          : chars[(Math.random() * chars.length) | 0]
      )
      .join("");
    if (f > txt.length * 2) {
      clearInterval(id);
      h.textContent = txt;
    }
  }, 40);
}

// ---------- Écran de démarrage (une fois par session) ----------
(function () {
  const boot = document.getElementById("boot");
  if (!boot) {
    decode();
    return;
  }
  const out = document.getElementById("bootTxt");
  const lines = [
    "> npm run portfolio",
    "✔ chargement des projets",
    "✔ compilation des compétences",
    "✔ prêt, bienvenue !",
  ];
  let l = 0,
    c = 0,
    done = false;
  function finish() {
    if (done) return;
    done = true;
    try {
      sessionStorage.setItem("boot", "1");
    } catch {}
    boot.classList.add("boot-out");
    setTimeout(() => boot.remove(), 800);
    decode();
  }
  boot.addEventListener("click", finish);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") finish();
  });
  (function type() {
    if (done) return;
    if (l >= lines.length) {
      setTimeout(finish, 500);
      return;
    }
    const t = lines[l];
    c++;
    out.textContent =
      lines.slice(0, l).join("\n") + (l ? "\n" : "") + t.slice(0, c);
    if (c >= t.length) {
      l++;
      c = 0;
      setTimeout(type, 260);
    } else setTimeout(type, l === 0 ? 55 : 22);
  })();
})();

// ---------- Projecteur de lumière et boutons magnétiques ----------
if (matchMedia("(hover: hover)").matches) {
  addEventListener(
    "mousemove",
    (e) => {
      document.documentElement.style.setProperty("--mx", e.clientX + "px");
      document.documentElement.style.setProperty("--my", e.clientY + "px");
    },
    { passive: true }
  );
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".hero .btn, .links a").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${
          ((e.clientX - r.left) / r.width - 0.5) * 14
        }px, ${((e.clientY - r.top) / r.height - 0.5) * 10}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }
}

// ---------- Palette de commandes (Ctrl+K) ----------
(function () {
  const box = document.getElementById("cmd"),
    inp = document.getElementById("cmdIn");
  const list = document.getElementById("cmdList"),
    toast = document.getElementById("toast");
  const go = (id) => () =>
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  const say = (m) => {
    toast.textContent = m;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const CMDS = [
    ["Aller à : À propos", go("apropos")],
    ["Aller à : Projets", go("projets")],
    ["Aller à : Parcours", go("parcours")],
    ["Aller à : Compétences", go("competences")],
    ["Aller à : Contact", go("contact")],
    [
      "Poser une question à l’assistant",
      () => {
        scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => document.getElementById("q").focus(), 450);
      },
    ],
    [
      "Écrire un message à Rania",
      () => {
        go("contact")();
        setTimeout(
          () => document.getElementById("cName").focus({ preventScroll: true }),
          700
        );
      },
    ],
    [
      "Télécharger le CV",
      () => {
        const a = document.createElement("a");
        a.href = "CV_Rania_Ben_Hassen.pdf";
        a.download = "";
        a.click();
      },
    ],
    ["Basculer le thème clair / sombre", () => themeBtn.click()],
    [
      "Ouvrir GitHub",
      () => open("https://github.com/raniabn149-rgb", "_blank", "noopener"),
    ],
    [
      "Ouvrir LinkedIn",
      () =>
        open(
          "https://www.linkedin.com/in/rania-ben-hassen",
          "_blank",
          "noopener"
        ),
    ],
    [
      "Copier l’email",
      async () => {
        try {
          await navigator.clipboard.writeText(MY_EMAIL);
          say("Email copié");
        } catch {
          say(MY_EMAIL);
        }
      },
    ],
  ];
  let items = [],
    idx = 0,
    last = null;
  function render() {
    const q = norm(inp.value);
    items = CMDS.filter((c) => norm(c[0]).includes(q));
    idx = Math.min(idx, Math.max(0, items.length - 1));
    list.textContent = "";
    items.forEach((c, i) => {
      const li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", i === idx);
      li.textContent = c[0];
      li.addEventListener("click", () => run(i));
      list.appendChild(li);
    });
    if (!items.length) {
      const li = document.createElement("li");
      li.textContent = "Aucune commande trouvée";
      list.appendChild(li);
    }
  }
  function open_() {
    last = document.activeElement;
    box.hidden = false;
    inp.value = "";
    idx = 0;
    render();
    inp.focus();
  }
  function close_() {
    box.hidden = true;
    if (last) last.focus();
  }
  function run(i) {
    const c = items[i];
    if (!c) return;
    close_();
    setTimeout(c[1], 120);
  }
  inp.addEventListener("input", () => {
    idx = 0;
    render();
  });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      idx = (idx + 1) % items.length;
      render();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      idx = (idx - 1 + items.length) % items.length;
      render();
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(idx);
    } else if (e.key === "Escape") close_();
  });
  box.addEventListener("click", (e) => {
    if (e.target === box) close_();
  });
  document.getElementById("cmdBtn").addEventListener("click", open_);
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      box.hidden ? open_() : close_();
    }
  });
})();
