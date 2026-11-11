"use strict";
/* =============================================================================
   tools/preuves/joue-qcm.js — LES QCM DU SITE JOUÉS POUR DE VRAI, DANS CHROME.

   POURQUOI CET OUTIL EXISTE (point A1 du chantier V18). Pendant B5 du V16, une
   sonde a joué les 6 167 questions du site dans Chrome et relu `syntaxe-quiz`
   — puis elle est restée dans le dossier de travail de l'agent, hors du dépôt
   (`scratchpad/v16-parallele/b5e2/joue-qcm.js`). Aucun mode de `verif.js` ne
   jouait un QCM de leçon : `maths/module-5/verif-bilan.js` (étape `mth-bil`)
   ne joue que deux bilans de `maths`, et ne lit pas le stockage. Le moteur de
   QCM de `js/lecon.js` pouvait donc cesser de compter une bonne réponse ou
   d'enregistrer un score sans qu'aucune étape ne rougisse. La sonde est ici
   ramenée, branchée dans `--complet` et éprouvée par injection
   (`tools/preuves/joue-qcm-mutations.js`).

   CE QU'ELLE FAIT, pour chaque bloc `data-quiz` (QCM de leçon) et
   `data-quiz-bilan` (QCM bilan) du site, dans un Chrome headless à profil
   NEUF, en `file://`, SANS `--allow-file-access-from-files` et DNS coupé —
   les conditions de l'apprenant :
     1. elle SÈME dans `syntaxe-quiz` un score « d'avant »
        {best: N-1, total: N, rates: [0]} sous [id du cours][fichier][sorte],
        recharge, et exige « 🏆 Meilleur score : N-1 / N » ;
     2. elle coche la BONNE option de chaque question, retrouvée par son texte
        EXACT (lecon.js mélange l'ordre ; on ne se fie pas à `data-correct`,
        qui est la parole du moteur jugé) : elle exige « Score : N / N » et,
        dans le stockage, exactement {best: N, total: N}, sans `rates` ;
     3. elle recharge et exige que le score parfait soit RELU
        (« 🏆 Meilleur score : N / N ») : un score qui ne survit pas au
        rechargement ne s'est pas enregistré, quoi qu'en dise la page ;
     4. elle efface le stockage, coche un DISTRACTEUR partout : elle exige
        « Score : 0 / N » et rates = [0, …, N-1] ;
     5. à chaque passe, elle exige que les options AFFICHÉES soient celles du
        bloc (mêmes textes, même nombre) et qu'aucune question n'affiche deux
        fois le même texte d'option ;
     6. elle exige zéro exception JavaScript (`Runtime.exceptionThrown`) et
        zéro échec d'écriture compté par `SyntaxeStore`.
   La liste des pages est construite ICI, en lisant le disque : toute page de
   `pages/` qui porte un bloc `<script … data-quiz>` ou `data-quiz-bilan`.
   Elle ne dépend d'aucun fichier de travail.

   USAGE
     node tools/preuves/joue-qcm.js                       # tout le site, les deux sortes
     node tools/preuves/joue-qcm.js --sorte=bilan         # quiz | bilan | tout (défaut)
     node tools/preuves/joue-qcm.js --pages=pages/js/lecon-01.html,pages/maths/lecon-13.html
     node tools/preuves/joue-qcm.js --pages=liste.json    # un tableau JSON de chemins
     node tools/preuves/joue-qcm.js --paralleles=4        # Chrome simultanés (défaut 6)
     node tools/preuves/joue-qcm.js --json=sortie.json    # le détail page par page

   CODES DE SORTIE : 0 tous les QCM joués et conformes · 1 au moins un QCM en
   défaut · 2 rien d'anormal trouvé, mais au moins un QCM n'a pas pu être joué
   (Chrome absent, Chrome qui ne démarre pas, page jamais chargée). 1 prime
   sur 2 : une faute trouvée est ce qu'on lit en premier.
   ============================================================================= */
var cp = require("child_process");
var path = require("path");
var http = require("http");
var net = require("net");
var crypto = require("crypto");
var fs = require("fs");

var RACINE = path.resolve(__dirname, "..", "..");
var ARGS = process.argv.slice(2);
function opt(nom, defaut) {
  for (var i = 0; i < ARGS.length; i++) {
    if (ARGS[i].indexOf("--" + nom + "=") === 0) return ARGS[i].slice(nom.length + 3);
  }
  return defaut;
}

var CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium"].find(function (p) { return fs.existsSync(p); });
if (!CHROME) {
  console.log("NON MESURÉ : Chrome introuvable, aucune question n'a été jouée.");
  process.exit(2);
}

var profilChrome = require(path.join(RACINE, "tools", "lib", "profil-chrome.js"));
var portChrome = require(path.join(RACINE, "tools", "lib", "port-chrome.js"));

/* Toute exception non rattrapée est IMPRIMÉE et rend 2 : la sonde n'a pas pu aller au
   bout, ce n'est ni un « tout va bien » ni une faute du site. */
process.on("uncaughtException", function (e) { console.log("EXCEPTION DE LA SONDE : " + (e && e.stack || e)); process.exit(2); });
process.on("unhandledRejection", function (e) { console.log("REJET NON TRAITÉ : " + (e && e.stack || e)); process.exit(2); });

var SORTE = opt("sorte", "tout");
if (["quiz", "bilan", "tout"].indexOf(SORTE) === -1) {
  console.log("--sorte vaut quiz, bilan ou tout (reçu : « " + SORTE + " »)");
  process.exit(2);
}
var PARALLELES = Math.max(1, Number(opt("paralleles", "6")) || 6);
var DELAI_PAGE = Math.max(30, Number(opt("delai", "180")) || 180) * 1000;
var SORTIE_JSON = opt("json", "");

/* ------------------------------------------------------------ les pages à jouer */
var RE_QUIZ = /<script\b[^>]*\bdata-quiz(?=[\s>=\/])/i;
var RE_BILAN = /<script\b[^>]*\bdata-quiz-bilan\b/i;

function sortesDe(rel) {
  var t;
  try { t = fs.readFileSync(path.join(RACINE, rel), "utf8"); } catch (e) { return null; }
  var s = [];
  if ((SORTE === "tout" || SORTE === "quiz") && RE_QUIZ.test(t)) s.push("quiz");
  if ((SORTE === "tout" || SORTE === "bilan") && RE_BILAN.test(t)) s.push("bilan");
  return s;
}
function listerHtml(dossier, acc) {
  fs.readdirSync(dossier, { withFileTypes: true }).forEach(function (e) {
    var p = path.join(dossier, e.name);
    if (e.isDirectory()) listerHtml(p, acc);
    else if (/\.html$/i.test(e.name)) acc.push(path.relative(RACINE, p).replace(/\\/g, "/"));
  });
  return acc;
}

var demandees = opt("pages", "");
var CIBLES = [];
var illisibles = [];
if (demandees) {
  var liste = /\.json$/i.test(demandees)
    ? JSON.parse(fs.readFileSync(path.resolve(RACINE, demandees), "utf8"))
    : demandees.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  liste.forEach(function (p) {
    var rel = p.replace(/\\/g, "/");
    var s = sortesDe(rel);
    if (s === null) illisibles.push(rel + " (fichier introuvable)");
    else if (!s.length) illisibles.push(rel + " (aucun bloc " + (SORTE === "tout" ? "data-quiz ni data-quiz-bilan" : "de la sorte " + SORTE) + ")");
    else CIBLES.push({ page: rel, sortes: s });
  });
} else {
  listerHtml(path.join(RACINE, "pages"), []).sort().forEach(function (rel) {
    var s = sortesDe(rel);
    if (s && s.length) CIBLES.push({ page: rel, sortes: s });
  });
}
if (!CIBLES.length) {
  console.log("NON MESURÉ : aucune page à jouer." + (illisibles.length ? " " + illisibles.join(" ; ") : ""));
  process.exit(2);
}

/* L'identifiant de cours sous lequel lecon.js range les scores : celui de data.js, dont le
   dossier peut différer de l'identifiant (`dir`). */
var fenetre = {};
new Function("window", fs.readFileSync(path.join(RACINE, "js", "data.js"), "utf8"))(fenetre);
var DOSSIER_VERS_ID = {};
Object.keys(fenetre.SITE_DATA.content).forEach(function (id) {
  DOSSIER_VERS_ID[fenetre.SITE_DATA.content[id].dir || id] = id;
});

/* ------------------------------------------------------------ Chrome et DevTools */
var attendre = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
function lireJson(url) {
  return new Promise(function (resoudre, rejeter) {
    http.get(url, function (r) {
      var d = "";
      r.on("data", function (c) { d += c; });
      r.on("end", function () { try { resoudre(JSON.parse(d)); } catch (e) { rejeter(e); } });
    }).on("error", rejeter);
  });
}
/* `proc.kill()` ne tue que le lanceur : Chrome se ré-exécute dans des processus fils
   (leçon du point A3 du V17, `verif-clic.js`). On tue l'arbre, sans bloquer la boucle
   d'événements : les autres Chrome de la sonde attendent leurs réponses pendant ce temps. */
function tuerArbre(proc) {
  return new Promise(function (resoudre) {
    if (!proc || proc.exitCode !== null) return resoudre();
    if (process.platform === "win32") {
      cp.execFile("taskkill", ["/PID", String(proc.pid), "/T", "/F"], { windowsHide: true }, function () { resoudre(); });
    } else {
      try { proc.kill("SIGKILL"); } catch (e) { /* déjà mort */ }
      resoudre();
    }
  });
}

/* Client DevTools minimal (WebSocket écrit à la main : aucune dépendance). La première
   trame n'est envoyée qu'APRÈS la poignée de main — le défaut corrigé dans
   `verif-bilan.js` au B5 du V16, où une attente fixe en tenait lieu. */
function connecter(wsUrl) {
  return new Promise(function (resoudre, rejeter) {
    var u = new URL(wsUrl);
    var sock = net.connect(Number(u.port), u.hostname);
    var buf = Buffer.alloc(0), poignee = false, numero = 0, attentes = {}, erreurs = [];
    function toutRejeter(msg) {
      Object.keys(attentes).forEach(function (k) { attentes[k].rej(new Error(msg)); delete attentes[k]; });
    }
    sock.on("connect", function () {
      sock.write("GET " + u.pathname + " HTTP/1.1\r\nHost: " + u.host + "\r\nUpgrade: websocket\r\n" +
        "Connection: Upgrade\r\nSec-WebSocket-Key: " + crypto.randomBytes(16).toString("base64") +
        "\r\nSec-WebSocket-Version: 13\r\n\r\n");
    });
    sock.on("error", function (e) { if (!poignee) rejeter(e); toutRejeter("connexion DevTools perdue : " + e.message); });
    sock.on("close", function () { toutRejeter("connexion DevTools fermée"); });
    sock.on("data", function (morceau) {
      buf = Buffer.concat([buf, morceau]);
      if (!poignee) {
        var fin = buf.indexOf("\r\n\r\n");
        if (fin < 0) return;
        var statut = buf.slice(0, fin).toString().split("\r\n")[0];
        if (!/ 101 /.test(statut)) { rejeter(new Error("poignée de main refusée : " + statut)); sock.destroy(); return; }
        poignee = true;
        buf = buf.slice(fin + 4);
        resoudre(client);
      }
      while (buf.length >= 2) {
        var long = buf[1] & 127, debut = 2;
        if (long === 126) { if (buf.length < 4) return; long = buf.readUInt16BE(2); debut = 4; }
        else if (long === 127) { if (buf.length < 10) return; long = Number(buf.readBigUInt64BE(2)); debut = 10; }
        if (buf.length < debut + long) return;
        var m;
        try { m = JSON.parse(buf.slice(debut, debut + long).toString()); } catch (e) { m = {}; }
        buf = buf.slice(debut + long);
        if (m.id && attentes[m.id]) { attentes[m.id].res(m); delete attentes[m.id]; }
        if (m.method === "Runtime.exceptionThrown") {
          var det = m.params.exceptionDetails || {};
          erreurs.push(String(det.exception && det.exception.description || det.text || "?").split("\n")[0]);
        }
      }
    });
    function envoyer(methode, params) {
      return new Promise(function (res, rej) {
        var msg = Buffer.from(JSON.stringify({ id: ++numero, method: methode, params: params || {} }));
        attentes[numero] = { res: res, rej: rej };
        var masque = crypto.randomBytes(4), tete;
        if (msg.length < 126) tete = Buffer.from([0x81, 0x80 | msg.length]);
        else if (msg.length < 65536) { tete = Buffer.alloc(4); tete[0] = 0x81; tete[1] = 0xfe; tete.writeUInt16BE(msg.length, 2); }
        else { tete = Buffer.alloc(10); tete[0] = 0x81; tete[1] = 0xff; tete.writeBigUInt64BE(BigInt(msg.length), 2); }
        for (var k = 0; k < msg.length; k++) msg[k] ^= masque[k % 4];
        sock.write(Buffer.concat([tete, masque, msg]));
      });
    }
    var client = {
      erreurs: erreurs,
      envoyer: envoyer,
      fermer: function () { try { sock.destroy(); } catch (e) { /* déjà fermé */ } },
      /* Renvoie la valeur, ou { __exception: texte } si l'expression a levé dans la page. */
      evaluer: function (expr) {
        return envoyer("Runtime.evaluate", { expression: expr, returnByValue: true }).then(function (m) {
          var r = m.result || {};
          if (r.exceptionDetails) {
            var ex = r.exceptionDetails;
            return { __exception: String(ex.exception && ex.exception.description || ex.text || "?").split("\n")[0] };
          }
          return r.result ? r.result.value : undefined;
        });
      }
    };
  });
}

/* ------------------------------------------------------------ ce qu'on demande à la page */
/* Le conteneur rendu par lecon.js pour chaque sorte, et le bloc de données qu'il lit. */
var MONTAGE = {
  bilan: "document.querySelector('.quiz-bilan .quiz')",
  quiz: "Array.from(document.querySelectorAll('.quiz')).filter(function(q){return !q.closest('.quiz-bilan');})[0]"
};
var BLOC = { bilan: "script[data-quiz-bilan]", quiz: "script[data-quiz]" };
var NORME = "function n(s){return String(s).replace(/\\s+/g,' ').trim();}";

/* L'état de la page : `ancien` tant que le document d'avant le rechargement répond encore
   (repère posé juste avant `location.reload()`), puis chargée ou non, puis combien de
   questions sont rendues face au nombre déclaré par le bloc. */
function exprEtat(sorte) {
  return "(function(){if(window.__joueQcmAncien)return {ancien:true};" +
    "if(document.readyState!=='complete')return {charge:false};" +
    "var b=document.querySelector('" + BLOC[sorte] + "');var m=" + MONTAGE[sorte] + ";var d=null;" +
    "try{d=b?JSON.parse(b.textContent):null;}catch(e){}" +
    "return {charge:true,bloc:!!b,declarees:d&&d.length?d.length:0," +
    "rendues:m?m.querySelectorAll('.quiz__q').length:-1};})()";
}
/* Coche une option par question, retrouvée par son TEXTE exact. `justes` : la bonne
   réponse du bloc ; sinon le premier distracteur dont le texte diffère de la bonne.
   Relève au passage, pour chaque question, les options affichées en double et l'écart
   entre les options affichées et celles du bloc. */
function exprCocher(sorte, justes) {
  return "(function(){" + NORME + "var m=" + MONTAGE[sorte] + ";" +
    "var d=JSON.parse(document.querySelector('" + BLOC[sorte] + "').textContent);" +
    "var qs=m.querySelectorAll('.quiz__q');" +
    "var r={cliques:0,introuvables:[],ambigus:[],doublons:[],ecarts:[],sansAutre:[]};" +
    "for(var i=0;i<qs.length;i++){var c=d[i].correct||0;var a=d[i].a.map(n);" +
    "var boutons=Array.from(qs[i].querySelectorAll('.quiz__opt'));var vus=boutons.map(function(o){return n(o.textContent);});" +
    "var uniques={};vus.forEach(function(t){uniques[t]=1;});" +
    "if(Object.keys(uniques).length!==vus.length)r.doublons.push(i+1);" +
    "if(JSON.stringify(vus.slice().sort())!==JSON.stringify(a.slice().sort()))r.ecarts.push(i+1);" +
    "var vise;" +
    (justes
      ? "vise=a[c];"
      : "vise=null;for(var k=1;k<a.length;k++){var j=(c+k)%a.length;if(a[j]!==a[c]){vise=a[j];break;}}" +
        "if(vise===null){r.sansAutre.push(i+1);continue;}") +
    "var cand=boutons.filter(function(o){return n(o.textContent)===vise;});" +
    "if(!cand.length){r.introuvables.push(i+1);continue;}if(cand.length>1)r.ambigus.push(i+1);" +
    "cand[0].click();r.cliques++;}" +
    "r.score=n((m.querySelector('.quiz__score')||{}).textContent||'');" +
    "return r;})()";
}
function exprMeilleur(sorte) {
  return "(function(){" + NORME + "var m=" + MONTAGE[sorte] + ";return m?n((m.querySelector('.quiz__best')||{}).textContent||''):'(QCM absent)';})()";
}
function exprStock(id, fichier, sorte) {
  return "(function(){try{var q=JSON.parse(localStorage.getItem('syntaxe-quiz')||'{}');" +
    "var e=((q[" + JSON.stringify(id) + "]||{})[" + JSON.stringify(fichier) + "]||{})[" + JSON.stringify(sorte) + "];" +
    "return e===undefined?null:e;}catch(e){return 'ILLISIBLE : '+e.message;}})()";
}
var EXPR_MAGASIN = "(function(){var s=window.SyntaxeStore;return s?{echecs:s.echecs,abimees:s.abimees}:null;})()";

/* Attend le NOUVEAU document, chargé, puis le QCM rendu en entier.
   - page jamais chargée dans le délai : rien n'a pu être mesuré (technique) ;
   - page chargée mais QCM absent ou incomplet 8 s plus tard : c'est une FAUTE du site
     (les scripts du site sont `defer` : à `complete`, lecon.js a fini de construire). */
async function attendrePret(cdp, sorte) {
  var t0 = Date.now(), tCharge = 0, dernier = null;
  for (;;) {
    /* Une socket perdue fait lever `evaluer` : l'erreur remonte et la page est technique. */
    var e = await cdp.evaluer(exprEtat(sorte));
    if (e && !e.__exception && e.charge) {
      if (!tCharge) tCharge = Date.now();
      dernier = e;
      if (e.declarees > 0 && e.rendues === e.declarees) return { n: e.declarees };
      if (Date.now() - tCharge > 8000) {
        if (!e.bloc) return { faute: "bloc " + BLOC[sorte] + " absent de la page chargée" };
        if (!e.declarees) return { faute: "bloc JSON illisible ou vide" };
        return { faute: "QCM non rendu : " + Math.max(0, e.rendues) + " question(s) affichée(s) sur " + e.declarees + " déclarée(s)" };
      }
    } else if (Date.now() - t0 > 60000) {
      return { technique: "la page ne s'est pas chargée en 60 s" + (dernier ? "" : " (aucun état lisible)") };
    }
    await attendre(100);
  }
}
async function recharger(cdp, avant) {
  await cdp.evaluer("window.__joueQcmAncien=1;" + (avant || "") + "location.reload();1");
}
/* Égalité de valeurs JSON, sans dépendre de l'ordre des clés d'un objet. */
function egal(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  var ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
  if (ka.join("\u0000") !== kb.join("\u0000")) return false;
  return ka.every(function (k) { return egal(a[k], b[k]); });
}

/* ------------------------------------------------------------ une page */
async function jouerUneSorte(cdp, cible, sorte, v) {
  var id = cible.id, fichier = cible.fichier;
  var r = { sorte: sorte, defauts: [] };
  v.sortes.push(r);
  function faute(t) { r.defauts.push(t); }

  /* 1. un score d'avant, semé puis relu */
  var pret = await attendrePret(cdp, sorte);
  if (pret.technique) { r.technique = pret.technique; return; }
  if (pret.faute) { faute(pret.faute); return; }
  var N = pret.n;
  r.n = N;
  var seme = {}; seme[id] = {}; seme[id][fichier] = {}; seme[id][fichier][sorte] = { best: N - 1, total: N, rates: [0] };
  await recharger(cdp, "localStorage.clear();localStorage.setItem('syntaxe-quiz'," + JSON.stringify(JSON.stringify(seme)) + ");");
  pret = await attendrePret(cdp, sorte);
  if (pret.technique) { r.technique = pret.technique + " (après le semis)"; return; }
  if (pret.faute) { faute(pret.faute + " (après le semis)"); return; }
  var attenduAvant = "🏆 Meilleur score : " + (N - 1) + " / " + N;
  var lu = await cdp.evaluer(exprMeilleur(sorte));
  if (lu !== attenduAvant) faute("score d'avant mal relu : « " + lu + " » au lieu de « " + attenduAvant + " »");

  /* 2. toutes justes */
  var j = await cdp.evaluer(exprCocher(sorte, true));
  if (!j || j.__exception) { faute("la sonde n'a pas pu cocher les bonnes réponses : " + (j && j.__exception)); return; }
  if (j.introuvables.length) faute("bonne option introuvable par son texte : q" + j.introuvables.join(", q"));
  if (j.ambigus.length) faute("bonne réponse dont le texte est aussi celui d'une autre option : q" + j.ambigus.join(", q"));
  if (j.doublons.length) faute("option affichée en double : q" + j.doublons.join(", q"));
  if (j.ecarts.length) faute("options affichées différentes de celles du bloc : q" + j.ecarts.join(", q"));
  if (j.score.indexOf("Score : " + N + " / " + N) !== 0) faute("toutes les bonnes réponses cochées, le score dit « " + j.score + " »");
  var st = await cdp.evaluer(exprStock(id, fichier, sorte));
  if (!egal(st, { best: N, total: N })) {
    faute("après " + N + " / " + N + ", syntaxe-quiz contient " + JSON.stringify(st) + " au lieu de " + JSON.stringify({ best: N, total: N }));
  }

  /* 3. le score parfait survit au rechargement */
  await recharger(cdp);
  pret = await attendrePret(cdp, sorte);
  if (pret.technique) { r.technique = pret.technique + " (relecture du score)"; return; }
  if (pret.faute) { faute(pret.faute + " (relecture du score)"); return; }
  var attenduParfait = "🏆 Meilleur score : " + N + " / " + N;
  lu = await cdp.evaluer(exprMeilleur(sorte));
  if (lu !== attenduParfait) faute("score parfait non relu après rechargement : « " + lu + " » au lieu de « " + attenduParfait + " »");

  /* 4. stockage effacé, un distracteur partout */
  await cdp.evaluer("localStorage.removeItem('syntaxe-quiz');1");
  var f = await cdp.evaluer(exprCocher(sorte, false));
  if (!f || f.__exception) { faute("la sonde n'a pas pu cocher les distracteurs : " + (f && f.__exception)); return; }
  if (f.sansAutre.length) faute("aucun distracteur de texte distinct de la bonne réponse : q" + f.sansAutre.join(", q"));
  if (f.introuvables.length) faute("distracteur introuvable par son texte : q" + f.introuvables.join(", q"));
  if (f.doublons.length && !j.doublons.length) faute("option affichée en double (passe des distracteurs) : q" + f.doublons.join(", q"));
  if (f.ecarts.length && !j.ecarts.length) faute("options affichées différentes de celles du bloc (passe des distracteurs) : q" + f.ecarts.join(", q"));
  if (f.score.indexOf("Score : 0 / " + N) !== 0) faute("un distracteur coché partout, le score dit « " + f.score + " »");
  var tous = []; for (var k = 0; k < N; k++) tous.push(k);
  var st2 = await cdp.evaluer(exprStock(id, fichier, sorte));
  if (!egal(st2, { best: 0, total: N, rates: tous })) {
    faute("après 0 / " + N + ", syntaxe-quiz contient " + JSON.stringify(st2) + " au lieu de " + JSON.stringify({ best: 0, total: N, rates: tous }));
  }
  r.questions = N;
}

async function unePage(cible) {
  var url = "file:///" + path.resolve(RACINE, cible.page).replace(/\\/g, "/");
  var v = { page: cible.page, sortes: [], erreursJs: [] };
  cible.fichier = cible.page.split("/").pop();
  cible.id = DOSSIER_VERS_ID[cible.page.split("/")[1]];
  if (!cible.id) { v.technique = "dossier de cours inconnu de data.js"; return v; }
  var profil = profilChrome.neuf("joue-qcm");
  portChrome.oublier(profil);
  var proc = cp.spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", "--disable-gpu",
    "--no-first-run", "--disable-extensions", "--host-resolver-rules=MAP * ~NOTFOUND",
    "--user-data-dir=" + profil, "about:blank"], { stdio: "ignore" });
  proc.on("error", function () { /* rendu technique plus bas */ });
  var cdp = null, minuteur = null;
  try {
    var travail = (async function () {
      var port = await portChrome.attendre(profil, 60000);
      var onglet = null;
      for (var i = 0; i < 100 && !onglet; i++) {
        try { onglet = (await lireJson("http://127.0.0.1:" + port + "/json/list")).filter(function (t) { return t.type === "page"; })[0]; } catch (e) { /* pas encore */ }
        if (!onglet) await attendre(200);
      }
      if (!onglet) throw new Error("Chrome n'a pas ouvert d'onglet");
      cdp = await connecter(onglet.webSocketDebuggerUrl);
      await cdp.envoyer("Runtime.enable");
      await cdp.envoyer("Page.enable");
      await cdp.envoyer("Page.navigate", { url: url });
      /* Pas de rechargement entre deux sortes : l'étape 1 de la suivante sème et recharge. */
      for (var s = 0; s < cible.sortes.length; s++) await jouerUneSorte(cdp, cible, cible.sortes[s], v);
      var magasin = await cdp.evaluer(EXPR_MAGASIN);
      if (!magasin || magasin.__exception) v.defautPage = "SyntaxeStore absent de la page";
      else if (magasin.echecs || magasin.abimees) v.defautPage = "SyntaxeStore a compté " + magasin.echecs + " échec(s) d'écriture et " + magasin.abimees + " donnée(s) abîmée(s)";
      v.erreursJs = cdp.erreurs.slice();
    })();
    var delai = new Promise(function (res, rej) {
      minuteur = setTimeout(function () { rej(new Error("délai de " + (DELAI_PAGE / 1000) + " s dépassé")); }, DELAI_PAGE);
    });
    /* `race` s'abonne aux deux promesses : un rejet tardif de `travail` (socket fermée
       après le délai) est donc traité, jamais « non rattrapé ». */
    await Promise.race([travail, delai]);
  } catch (e) {
    v.technique = e.message;
  }
  clearTimeout(minuteur);
  if (cdp) cdp.fermer();
  await tuerArbre(proc);
  try { fs.rmSync(profil, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch (e) { /* Chrome le tient encore : effacé à la sortie */ }
  return v;
}

/* Le verdict d'une page : technique (rien de jugé), en défaut, ou conforme. */
function bilanPage(v) {
  var defauts = [];
  v.sortes.forEach(function (s) { s.defauts.forEach(function (d) { defauts.push("[" + s.sorte + "] " + d); }); });
  if (v.defautPage) defauts.push(v.defautPage);
  if (v.erreursJs.length) defauts.push("exception(s) JavaScript : " + v.erreursJs.join(" | "));
  var technique = v.technique || v.sortes.filter(function (s) { return s.technique; }).map(function (s) { return "[" + s.sorte + "] " + s.technique; }).join(" ; ");
  return { defauts: defauts, technique: technique || "" };
}

/* ------------------------------------------------------------ la passe */
(async function () {
  var t0 = Date.now();
  var attendus = CIBLES.reduce(function (a, c) { return a + c.sortes.length; }, 0);
  console.log("joue-qcm.js — " + CIBLES.length + " page(s), " + attendus + " QCM (sorte : " + SORTE + "), " +
    Math.min(PARALLELES, CIBLES.length) + " Chrome en parallèle");
  console.log("  file://, profil neuf par page, sans --allow-file-access-from-files, DNS coupé\n");
  if (illisibles.length) illisibles.forEach(function (s) { console.log("  ? demandée mais injouable : " + s); });

  var resultats = [];
  async function passe(lot) {
    var file = lot.slice(), faits = 0;
    async function ouvrier() {
      while (file.length) {
        var c = file.shift();
        var v = await unePage(c);
        var b = bilanPage(v);
        v.verdict = b;
        resultats.push(v);
        process.stdout.write(b.defauts.length ? "X" : b.technique ? "?" : ".");
        if (++faits % 100 === 0) process.stdout.write("  " + faits + "\n");
      }
    }
    var ouvriers = [];
    for (var i = 0; i < Math.min(PARALLELES, lot.length); i++) ouvriers.push(ouvrier());
    await Promise.all(ouvriers);
    process.stdout.write("\n");
  }
  await passe(CIBLES);

  /* Un Chrome qui ne démarre pas sous charge n'est pas une faute du site : on redonne UNE
     chance aux pages restées techniques, et on le DIT. Une page en défaut, elle, n'est
     jamais rejouée : une faute vue une fois est une faute. */
  var techniques = resultats.filter(function (v) { return !v.verdict.defauts.length && v.verdict.technique; });
  var rejouees = 0;
  if (techniques.length) {
    console.log("\n  " + techniques.length + " page(s) non jouée(s) pour une raison technique : second essai");
    techniques.forEach(function (v) { console.log("    ? " + v.page + " : " + v.verdict.technique); });
    resultats = resultats.filter(function (v) { return techniques.indexOf(v) === -1; });
    rejouees = techniques.length;
    await passe(CIBLES.filter(function (c) { return techniques.some(function (v) { return v.page === c.page; }); }));
  }

  resultats.sort(function (a, b) { return a.page < b.page ? -1 : 1; });
  var questions = 0, joues = 0, conformes = 0, enDefaut = [], nonMesurees = [];
  resultats.forEach(function (v) {
    v.sortes.forEach(function (s) { if (s.questions) { questions += s.questions; joues++; } });
    if (v.verdict.defauts.length) enDefaut.push(v);
    else if (v.verdict.technique) nonMesurees.push(v);
    else conformes++;
  });
  console.log("");
  enDefaut.forEach(function (v) {
    console.log("  X " + v.page);
    v.verdict.defauts.forEach(function (d) { console.log("      " + d); });
  });
  nonMesurees.forEach(function (v) { console.log("  ? " + v.page + " : NON MESURÉE (" + v.verdict.technique + ")"); });

  var duree = (Date.now() - t0) / 1000;
  console.log("\n=== BILAN ===");
  console.log("  pages ............................ " + resultats.length + " (conformes " + conformes + ", en défaut " + enDefaut.length + ", non mesurées " + nonMesurees.length + ")");
  console.log("  QCM attendus (lus dans le source)  " + attendus);
  console.log("  QCM joués jusqu'au bout .......... " + joues);
  console.log("  questions jouées ................. " + questions + " (chacune deux fois : bonne réponse, puis distracteur)");
  if (rejouees) console.log("  pages rejouées après échec technique : " + rejouees);
  console.log("  Chrome en parallèle .............. " + Math.min(PARALLELES, CIBLES.length));
  console.log("  durée ............................ " + duree.toFixed(1) + " s");
  if (SORTIE_JSON) {
    try { fs.writeFileSync(path.resolve(SORTIE_JSON), JSON.stringify(resultats, null, 1), "utf8"); console.log("  détail ........................... " + SORTIE_JSON); }
    catch (e) { console.log("  détail non écrit : " + e.message); }
  }
  console.log("");
  if (enDefaut.length) {
    console.log("RÉSULTAT : " + enDefaut.length + " page(s) en défaut — " +
      enDefaut.reduce(function (a, v) { return a + v.verdict.defauts.length; }, 0) + " erreur(s) relevée(s) dans le moteur de QCM ou ses données");
    process.exit(1);
  }
  if (nonMesurees.length || illisibles.length || joues < attendus) {
    console.log("RÉSULTAT : NON MESURÉ — " + (attendus - joues) + " QCM sur " + attendus + " n'ont pas pu être joués");
    process.exit(2);
  }
  console.log("Aucun problème : " + joues + " QCM joués, " + questions + " questions, chacune deux fois ; " +
    "chaque score semé est relu, chaque score parfait survit au rechargement, chaque 0 / N note ses questions ratées.");
  process.exit(0);
})();
