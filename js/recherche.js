/* =============================================================================
   recherche.js — Recherche plein-texte dans le contenu des 1472 leçons.
   Lit window.SEARCH_INDEX (js/search-index.js, index INVERSE compact généré par
   tools/build-index.js) et window.SITE_DATA (titres de cours). Aucun fetch.
   Page : pages/recherche.html.

   FORMAT v2 (point A2) : { v, docs:[[d,f,t,s],...], inv:{ mot:"D0[.tf],D1..." } }.
   L'ancien index embarquait le texte intégral (16 Mo, 104 Mo de RAM). On cherche
   désormais la sous-chaîne du terme sur les CLEFS de « inv » : un terme purement
   alphanumérique est sous-chaîne du texte d'une leçon SSI il est sous-chaîne d'un
   mot indexé de cette leçon. Résultat : même ENSEMBLE de leçons et même top-60
   que l'ancien moteur (vérifié sur 15 requêtes témoins).
   LIMITE ASSUMEE : un terme contenant un séparateur (« put_line », « array.map »)
   est redécoupé en sous-mots tous exigés dans la leçon — un sur-ensemble de
   l'ancienne sous-chaîne littérale, jamais moins de résultats.
   ============================================================================= */
(function () {
  "use strict";

  /* CHARGEMENT PARESSEUX de l'index (point C2). search-index.js pèse ~2,9 Mo :
     l'embarquer d'emblée faisait de recherche.html la page la plus lourde du
     site (3,6 Mo) alors qu'à l'arrivée le champ est vide et l'index ne sert à
     rien. On le récupère donc à la PREMIÈRE recherche réelle (même patron que
     la palette globale dans main.js). Ces vues restent nulles jusque-là. */
  var IDX = null, DOCS = null, INV = null, WORDS = null;
  var idxLoading = false, idxFailed = false;
  var DATA = window.SITE_DATA;

  var input = document.getElementById("fts-input");
  var results = document.getElementById("fts-results");
  var countEl = document.getElementById("fts-count");
  var hint = document.getElementById("fts-hint");
  if (!input || !results) return;

  /* Relie DOCS/INV/WORDS à l'index une fois le script chargé. */
  function bindIndex() {
    IDX = window.SEARCH_INDEX;
    if (!IDX || !IDX.docs || !IDX.docs.length || !IDX.inv) { idxFailed = true; return false; }
    DOCS = IDX.docs;             // [ [d, f, t, s], ... ]
    INV = IDX.inv;              // { mot: "D0[.tf],D1[.tf],..." }
    WORDS = Object.keys(INV);   // clefs propres (les noms de méthodes sont neutralisés par le shadow JSON)
    return true;
  }

  /* Préfixe de chemin de recherche.js → même dossier que search-index.js.
     (Un <script> créé à la volée résout son src par rapport au document ; ce
     préfixe reste correct quelle que soit la profondeur de la page.) */
  function indexBase() {
    var s = document.querySelector('script[src$="recherche.js"]') ||
            document.querySelector('script[src*="/recherche.js"]');
    if (s) return s.getAttribute("src").replace(/recherche\.js(?:\?.*)?$/, "");
    return "../js/"; // repli : recherche.html est sous pages/
  }

  /* Charge search-index.js à la demande puis rappelle cb(ok). Idempotent :
     réentrances mises en attente pendant le téléchargement. */
  function ensureIndex(cb) {
    if (IDX) { cb(true); return; }
    if (window.SEARCH_INDEX) { cb(bindIndex()); return; }
    if (idxFailed) { cb(false); return; }
    if (idxLoading) { setTimeout(function () { ensureIndex(cb); }, 60); return; }
    idxLoading = true;
    var sc = document.createElement("script");
    sc.src = indexBase() + "search-index.js";
    sc.onload = function () { idxLoading = false; cb(bindIndex()); };
    sc.onerror = function () { idxLoading = false; idxFailed = true; cb(false); };
    document.head.appendChild(sc);
  }

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }
  function esc(s) {
    return (s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* dir → titre du cours (via SITE_DATA), repli sur le dir. */
  var COURSE_TITLE = {};
  (function () {
    if (DATA && DATA.content) {
      for (var id in DATA.content) {
        if (DATA.content.hasOwnProperty(id)) COURSE_TITLE[DATA.content[id].dir] = DATA.content[id].title;
      }
    }
  })();
  function courseTitle(dir) {
    return COURSE_TITLE[dir] || dir;
  }

  /* Surligne les tokens dans le texte BRUT, puis échappe segment par segment.
     Il ne faut jamais surligner du texte déjà échappé : chercher « amp »
     tomberait au milieu de « &amp; » et casserait l'entité. On cherche donc
     dans le brut et on n'insère les <mark> qu'autour de segments déjà échappés. */
  function highlight(raw, tokens) {
    raw = raw || "";
    var toks = tokens.filter(function (t) { return t && t.length >= 2; });
    if (!toks.length) return esc(raw);
    var re;
    try {
      re = new RegExp("(" + toks.map(escapeRegExp).join("|") + ")", "gi");
    } catch (e) {
      return esc(raw);
    }
    var out = "", last = 0, m;
    while ((m = re.exec(raw)) !== null) {
      out += esc(raw.slice(last, m.index)) + "<mark>" + esc(m[0]) + "</mark>";
      last = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++; // garde-fou : match vide
    }
    return out + esc(raw.slice(last));
  }

  /* Décodage paresseux des postings d'un mot : "D0[.tf],D1[.tf],..." → [[id,tf],…].
     POST indexé par mot → Object.create(null) obligatoire (mots « constructor »…). */
  var POST = Object.create(null);
  function postings(w) {
    var c = POST[w];
    if (c) return c;
    var parts = INV[w].split(",");
    var out = new Array(parts.length);
    var prev = 0;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var dot = p.indexOf(".");
      var d, tf;
      if (dot === -1) { d = parseInt(p, 36); tf = 1; }
      else { d = parseInt(p.slice(0, dot), 36); tf = parseInt(p.slice(dot + 1), 36); }
      prev += d;
      out[i] = [prev, tf];
    }
    POST[w] = out;
    return out;
  }

  /* Titres normalisés (une seule fois, au premier vrai run). */
  var NTITLE = null;
  function ensureTitles() {
    if (NTITLE) return;
    NTITLE = new Array(DOCS.length);
    for (var i = 0; i < DOCS.length; i++) NTITLE[i] = norm(DOCS[i][2]);
  }

  function run() {
    var qRaw = input.value.trim();
    /* Recolle les décimaux (« 3.14 » → « 314 », « 1,5 » → « 15 ») avant le
       découpage, EXACTEMENT comme l'indexation (tools/build-index.js) : sinon un
       terme d'un seul chiffre est jeté (< 2 car) et « 3.14 » se réduit à « 14 ».
       Le séparateur n'est retiré qu'entre deux chiffres — « array.map »,
       « os.path », « put_line » restent découpés (chacun un sur-ensemble sûr). */
    var q = norm(qRaw).replace(/(?<=\d)[.,](?=\d)/g, "");
    /* Découpe sur TOUT séparateur non alphanumérique, mais « + » et « # » restent
       dans les mots (c++, c#, f#, #include). */
    var tokens = q.split(/[^a-z0-9+#]+/).filter(function (t) { return t.length >= 2; });

    writeURL(qRaw);

    if (!tokens.length) {
      results.innerHTML = "";
      if (countEl) countEl.textContent = "";
      if (hint) hint.style.display = "";
      return;
    }

    /* Index pas encore là : l'afficher comme « en chargement », le récupérer,
       puis relancer cette même recherche. Sur file:// c'est quasi instantané ;
       le message ne clignote qu'un instant (souvent invisible). */
    if (!IDX) {
      if (idxFailed) { if (countEl) countEl.textContent = "Index de recherche indisponible."; return; }
      if (hint) hint.style.display = "none";
      if (countEl) countEl.textContent = "Chargement de l'index…";
      ensureIndex(function (ok) {
        if (!ok) { if (countEl) countEl.textContent = "Index de recherche indisponible."; return; }
        run();
      });
      return;
    }

    ensureTitles();
    if (hint) hint.style.display = "none";

    /* inText : intersection sur les tokens. Pour chaque token, l'ensemble des
       leçons contenant un mot dont il est sous-chaîne. Score de fréquence
       accumulé pour le 1er token (comme l'ancien : occurrences de tokens[0]). */
    var inter = null;
    var freq0 = {};
    tokens.forEach(function (T, ti) {
      var docset = {};
      for (var wi = 0; wi < WORDS.length; wi++) {
        var W = WORDS[wi];
        if (W.indexOf(T) === -1) continue;
        var posts = postings(W);
        for (var k = 0; k < posts.length; k++) {
          var id = posts[k][0];
          docset[id] = 1;
          if (ti === 0) freq0[id] = (freq0[id] || 0) + posts[k][1];
        }
      }
      if (inter === null) inter = docset;
      else {
        var nx = {};
        for (var d in inter) if (docset[d]) nx[d] = 1;
        inter = nx;
      }
    });
    inter = inter || {};

    /* inTitle : tous les tokens présents dans le titre (leçons courtes → scan direct). */
    var titleHit = {};
    for (var i = 0; i < NTITLE.length; i++) {
      var all = true;
      for (var t2 = 0; t2 < tokens.length; t2++) {
        if (NTITLE[i].indexOf(tokens[t2]) === -1) { all = false; break; }
      }
      if (all) titleHit[i] = 1;
    }

    var matched = {};
    for (var a in inter) matched[a] = 1;
    for (var b in titleHit) matched[b] = 1;

    var hits = [];
    for (var m in matched) {
      var mi = +m;
      var score = titleHit[mi] ? 100 : 0;
      var f = freq0[mi] || 0;
      if (f > 25) f = 25;
      score += f;
      hits.push({ i: mi, score: score });
    }

    hits.sort(function (x, y) { return y.score - x.score; });

    var LIMITE_AFFICHAGE = 60;
    if (countEl) {
      var n = hits.length;
      var base = n + (n > 1 ? " résultats" : " résultat");
      /* On n'affiche que les LIMITE_AFFICHAGE premiers : le dire, comme la page antisèches. */
      countEl.textContent = n > LIMITE_AFFICHAGE ? base + " · " + LIMITE_AFFICHAGE + " affichés" : base;
    }

    if (!hits.length) {
      results.innerHTML =
        '<li class="fts-empty">Aucune leçon ne contient ' +
        (tokens.length > 1 ? "tous ces mots" : "ce mot") +
        ". Essaie un autre terme ou moins de mots.</li>";
      return;
    }

    var top = hits.slice(0, LIMITE_AFFICHAGE);
    results.innerHTML = top
      .map(function (h) {
        var e = DOCS[h.i]; // [d, f, t, s]
        return (
          '<li class="fts-result">' +
          /* V12-E1 : un dossier vide = page transverse (pages/<f>), sinon
             lecon (pages/<cours>/<f>). */
          '<a class="fts-result__link" href="' + (e[0] ? esc(e[0]) + "/" : "") + esc(e[1]) + '">' +
          '<span class="fts-result__course">' + esc(courseTitle(e[0])) + "</span>" +
          '<span class="fts-result__title">' + highlight(e[2], tokens) + "</span>" +
          '<span class="fts-result__snippet">' + highlight(e[3], tokens) + "</span>" +
          "</a></li>"
        );
      })
      .join("");
  }

  function writeURL(q) {
    try {
      var file = location.pathname.split("/").pop() || "recherche.html";
      history.replaceState(null, "", file + (q ? "?q=" + encodeURIComponent(q) : ""));
    } catch (e) {}
  }

  var deb;
  input.addEventListener("input", function () {
    clearTimeout(deb);
    deb = setTimeout(run, 180);
  });

  /* Initialisation depuis ?q= (lien partageable). */
  try {
    var p = new URLSearchParams(location.search);
    var q0 = p.get("q");
    if (q0) {
      input.value = q0;
      run();
    }
  } catch (e) {}
  input.focus();
})();
