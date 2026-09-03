/* tools/maths/verite/groupe-2.js — leçons 04, 05, 06 recalculées de zéro.
   =====================================================================
   V15 · point F2, groupe 2.

   RÈGLE DE CE FICHIER. Rien ici ne provient du code publié dans les leçons :
   aucun require, aucune copie, aucune exécution. Chaque fait est recalculé par
   la méthode la plus naïve disponible — on ÉNUMÈRE quand le cours applique une
   formule (produits cartésiens, permutations, arrangements, sous-ensembles), on
   applique la formule fermée quand le cours énumère, on compte en BigInt exact
   dès que les valeurs dépassent 2^53, et on cherche un seuil discret en
   comparant deux entiers exacts plutôt qu'en approchant. Le texte publié n'est
   lu qu'APRÈS, pour être confronté.

   La valeur attendue n'est jamais lue dans la page. Les seules choses lues avant
   calcul sont les DONNÉES d'un énoncé (les noms d'une liste, les tailles d'un
   jeu d'essai, l'hypothèse « 10^12 essais par seconde ») : ce sont les entrées
   du problème, pas ses réponses. */
'use strict';
const L = require('./lib.js');

/* ===================================================================== */
/* 1. LECTURE DU PUBLIÉ — aucune arithmétique du cours ne vit ici.        */
/* ===================================================================== */

/* Le site écrit ses milliers avec une espace insécable (U+00A0) ou fine
   insécable (U+202F, celle que toLocaleString('fr-FR') produit) ; les blocs de
   sortie mêlent les deux conventions avec le point décimal de JavaScript. */
function nrm(s) {
  return String(s).replace(/[    ⁠]/g, ' ');
}

/* « 65 536 » -> 65536 ; « 0,0014 » -> 0.0014 ; « 4.29 x 10^9 » -> 4.29e9. */
function nb(s) {
  if (s === null || s === undefined) return null;
  let t = nrm(s).trim().replace(/\s/g, '').replace(/,/g, '.');
  const m = t.match(/^(-?[\d.]+)x10\^(-?\d+)$/);
  if (m) return Number(m[1]) * Math.pow(10, Number(m[2]));
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  return Number(t);
}

/* Premier groupe capturé d'une expression, ou null — jamais d'exception ici :
   une ligne manquante doit rendre le contrôle ROUGE, pas l'interrompre. */
function lire(txt, re, i) {
  const m = nrm(txt).match(re);
  return m ? m[i === undefined ? 1 : i] : null;
}
function lireNb(txt, re, i) {
  return nb(lire(txt, re, i));
}

/* Les cellules d'une ligne de tableau à colonnes alignées : on coupe sur deux
   espaces ou plus, ce qui garde « 65 536 » et « + 33 symboles » entiers. */
function cellules(ligne) {
  return nrm(ligne).trim().split(/\s{2,}/);
}
function ligneDe(txt, etiquette) {
  const e = etiquette.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = nrm(txt).match(new RegExp('^' + e + '\\s{2,}(.*)$', 'm'));
  return m ? m[1] : null;
}

/* La prose emploie l'apostrophe typographique, les blocs de sortie l'apostrophe
   droite : sans cette normalisation, une phrase serait déclarée introuvable pour
   une raison purement typographique. */
function apos(s) { return String(s).replace(/’/g, '\''); }

const cacheTexte = {};
function prose(n) {
  if (!cacheTexte[n]) cacheTexte[n] = apos(nrm(L.texte(n)));
  return cacheTexte[n];
}

/* ===================================================================== */
/* 2. LE COLLECTEUR DE DIVERGENCES                                       */
/* ===================================================================== */

function V() {
  const e = [];
  return {
    manque: function (quoi) { e.push('ligne introuvable : ' + quoi); },
    eq: function (quoi, attendu, lu) {
      if (lu === null || lu === undefined) { e.push('ligne introuvable : ' + quoi); return; }
      if (String(lu) !== String(attendu)) {
        e.push(quoi + ' : publié ' + lu + ', recalculé ' + attendu);
      }
    },
    proche: function (quoi, attendu, lu, tol) {
      if (lu === null || lu === undefined || !isFinite(lu)) { e.push('ligne introuvable : ' + quoi); return; }
      if (!(Math.abs(lu - attendu) <= tol)) {
        e.push(quoi + ' : publié ' + lu + ', recalculé ' + attendu + ' (écart toléré ' + tol + ')');
      }
    },
    dans: function (quoi, min, max, lu) {
      if (lu === null || lu === undefined || !isFinite(lu)) { e.push('ligne introuvable : ' + quoi); return; }
      if (!(lu >= min && lu <= max)) {
        e.push(quoi + ' : publié ' + lu + ', recalculé entre ' + min + ' et ' + max);
      }
    },
    vrai: function (quoi, cond, detail) { if (!cond) e.push(quoi + ' : ' + detail); },
    ecrit: function (n, s) {
      if (prose(n).indexOf(apos(nrm(s))) < 0) e.push('ligne introuvable : « ' + s + ' » dans la prose de la leçon ' + n);
    },
    fin: function () { return e; }
  };
}

function fin(r, nom, v) {
  const e = v.fin();
  r.push({ nom: nom, ok: e.length === 0, detail: e.join(' | ') });
}

/* ===================================================================== */
/* 3. L'ARITHMÉTIQUE DE RÉFÉRENCE — naïve, exacte, écrite ici seulement.  */
/* ===================================================================== */

/* Ensembles à la main, sans Set : le cours mesure Set, la référence ne doit pas
   emprunter l'outil qu'elle contrôle. */
function uniq(a) {
  const o = [];
  for (let i = 0; i < a.length; i++) if (o.indexOf(a[i]) < 0) o.push(a[i]);
  return o;
}
function inter(a, b) { return uniq(a).filter(function (x) { return b.indexOf(x) >= 0; }); }
function moins(a, b) { return uniq(a).filter(function (x) { return b.indexOf(x) < 0; }); }
function reunion(a, b) { return uniq(a.concat(b)); }
function memeEnsemble(a, b) {
  const A = uniq(a).slice().sort(), B = uniq(b).slice().sort();
  if (A.length !== B.length) return false;
  for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) return false;
  return true;
}

/* Énumérations réelles — la seule façon de contredire une formule. */
function produitCartesien(tailles) {
  let out = [[]];
  for (let d = 0; d < tailles.length; d++) {
    const suivant = [];
    for (let i = 0; i < out.length; i++) {
      for (let v = 0; v < tailles[d]; v++) suivant.push(out[i].concat([v]));
    }
    out = suivant;
  }
  return out;
}
function permutations(n) {
  if (n === 0) return [[]];
  const out = [];
  const petites = permutations(n - 1);
  for (let i = 0; i < petites.length; i++) {
    for (let pos = 0; pos <= n - 1; pos++) {
      const c = petites[i].slice();
      c.splice(pos, 0, n - 1);
      out.push(c);
    }
  }
  return out;
}
/* Suites de k éléments distincts pris parmi n, l'ordre comptant. */
function arrangementsEnum(n, k) {
  let out = [[]];
  for (let etape = 0; etape < k; etape++) {
    const suivant = [];
    for (let i = 0; i < out.length; i++) {
      for (let v = 0; v < n; v++) if (out[i].indexOf(v) < 0) suivant.push(out[i].concat([v]));
    }
    out = suivant;
  }
  return out;
}
/* Tous les sous-ensembles par masque de bits, puis filtrage sur la taille. */
function sousEnsembles(n) {
  const out = [];
  const total = Math.pow(2, n);
  for (let masque = 0; masque < total; masque++) {
    const s = [];
    for (let i = 0; i < n; i++) if (masque & (1 << i)) s.push(i);
    out.push(s);
  }
  return out;
}
function combinaisonsEnum(n, k) {
  return sousEnsembles(n).filter(function (s) { return s.length === k; });
}

/* Formules fermées, en BigInt : aucun arrondi possible. */
function fact(n) { let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return f; }
function arrFormule(n, k) { return fact(n) / fact(n - k); }
function combFormule(n, k) { return fact(n) / (fact(k) * fact(n - k)); }
function puis(a, b) { return BigInt(a) ** BigInt(b); }

/* Probabilité qu'au moins deux de n tirages dans N valeurs coïncident, calculée
   en rationnels EXACTS : 1 − (N·(N−1)···(N−n+1)) / N^n. Aucun flottant dans le
   produit ; la conversion en Number n'arrive qu'à la toute fin. */
function pCoincidence(n, N) {
  const NB = BigInt(N);
  /* Produit en arbre : le produit séquentiel de 77 000 facteurs de 32 bits est
     quadratique et rendrait ce contrôle interminable. */
  const num = produitArbre(0, n, function (i) { return NB - BigInt(i); });
  if (num <= 0n) return 1;
  const S = 10n ** 20n;
  return 1 - Number((num * S) / (NB ** BigInt(n))) / 1e20;
}

/* Le plus petit nombre de tirages pour lequel la collision est plus probable
   qu'improbable, décidé par une comparaison d'ENTIERS : 2·∏(N−i) ≤ N^k.
   Le point de départ vient de l'approximation √(2 ln 2 · N), jamais de la page. */
function produitArbre(a, b, f) {
  if (b - a <= 0) return 1n;
  if (b - a === 1) return f(a);
  const m = (a + b) >> 1;
  return produitArbre(a, m, f) * produitArbre(m, b, f);
}
const cacheSeuil = {};
function seuilExactCollision(N) {
  if (cacheSeuil[N] !== undefined) return cacheSeuil[N];
  cacheSeuil[N] = seuilExactCollisionCalcul(N);
  return cacheSeuil[N];
}
function seuilExactCollisionCalcul(N) {
  const NB = BigInt(N);
  const depart = Math.max(2, Math.floor(1.177410023 * Math.sqrt(N)) - 6);
  let num = produitArbre(0, depart, function (i) { return NB - BigInt(i); });
  let den = NB ** BigInt(depart);
  for (let k = depart; k < depart + 40; k++) {
    if (2n * num <= den) return k;
    num *= NB - BigInt(k);
    den *= NB;
  }
  return -1;
}

/* Probabilité de collision pour k tirages dans N valeurs, quand k est trop
   grand pour un produit exact : forme fermée 1 − exp(−k(k−1)/2N). */
function pCollisionApprox(k, N) { return -Math.expm1(-k * (k - 1) / (2 * N)); }

function chiffres(bigint) { return bigint.toString().length; }

/* ===================================================================== */
/* 4. LES CONTRÔLES                                                      */
/* ===================================================================== */

function controles() {
  const r = [];

  /* ---------------------------------------------------------------- */
  /* LEÇON 04 — ensembles                                             */
  /* ---------------------------------------------------------------- */
  const ens = L.sortie(4, 'ensembles.txt');

  /* Les membres imprimés sont les DONNÉES ; les tailles et les ensembles
     dérivés sont les AFFIRMATIONS. On relit les uns, on recalcule les autres. */
  function bloc(etiquette) {
    const m = nrm(ens).match(new RegExp('^' + etiquette.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
      '\\s{2,}[{\\[]([^}\\]]*)[}\\]]\\s+(\\d+)\\s*$', 'm'));
    if (!m) return null;
    return {
      membres: m[1].split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s.length; }),
      taille: Number(m[2])
    };
  }
  const A = bloc('infolettre'), B = bloc('promotions');

  {
    const v = V();
    if (!A) v.manque('ligne « infolettre » de ensembles.txt');
    if (!B) v.manque('ligne « promotions » de ensembles.txt');
    if (A && B) {
      v.eq('|infolettre| recompté sur ses membres', uniq(A.membres).length, A.taille);
      v.eq('|promotions| recompté sur ses membres', uniq(B.membres).length, B.taille);
      const u = bloc('union'), i = bloc('intersection');
      if (!u) v.manque('ligne « union »');
      if (!i) v.manque('ligne « intersection »');
      if (u) {
        v.eq('taille de l\'union', reunion(A.membres, B.membres).length, u.taille);
        v.vrai('contenu de l\'union', memeEnsemble(u.membres, reunion(A.membres, B.membres)),
          'publié {' + u.membres.join(', ') + '}, recalculé {' + reunion(A.membres, B.membres).join(', ') + '}');
      }
      if (i) {
        v.eq('taille de l\'intersection', inter(A.membres, B.membres).length, i.taille);
        v.vrai('contenu de l\'intersection', memeEnsemble(i.membres, inter(A.membres, B.membres)),
          'publié {' + i.membres.join(', ') + '}, recalculé {' + inter(A.membres, B.membres).join(', ') + '}');
      }
      v.ecrit(4, 'Sept personnes ici, pas neuf');
    }
    fin(r, 'leçon 04 · ensembles.js — tailles, union et intersection recomptées à la main', v);
  }

  {
    const v = V();
    const ab = bloc('infolettre sans promos'), ba = bloc('promos sans infolettre'), d = bloc('différence symétrique');
    if (!ab || !ba || !d || !A || !B) v.manque('lignes des différences de ensembles.txt');
    else {
      const mAB = moins(A.membres, B.membres), mBA = moins(B.membres, A.membres);
      v.eq('|A \\ B|', mAB.length, ab.taille);
      v.eq('|B \\ A|', mBA.length, ba.taille);
      v.vrai('contenu de A \\ B', memeEnsemble(ab.membres, mAB), 'publié {' + ab.membres.join(', ') + '}, recalculé {' + mAB.join(', ') + '}');
      v.vrai('contenu de B \\ A', memeEnsemble(ba.membres, mBA), 'publié {' + ba.membres.join(', ') + '}, recalculé {' + mBA.join(', ') + '}');
      const sym = reunion(mAB, mBA);
      v.eq('|A △ B|', sym.length, d.taille);
      v.vrai('contenu de A △ B', memeEnsemble(d.membres, sym), 'publié {' + d.membres.join(', ') + '}, recalculé {' + sym.join(', ') + '}');
      /* La formule fermée doit retomber sur l'énumération. */
      v.eq('|A| + |B| − 2|A ∩ B| (formule fermée)', sym.length,
        uniq(A.membres).length + uniq(B.membres).length - 2 * inter(A.membres, B.membres).length);
      v.vrai('asymétrie annoncée dans la prose (3 d\'un côté, 2 de l\'autre)',
        mAB.length === 3 && mBA.length === 2 &&
        prose(4).indexOf('Trois personnes d\'un côté, deux de l\'autre') >= 0 &&
        prose(4).indexOf('3 personnes d\'un côté et 2 de l\'autre') >= 0,
        'recalculé ' + mAB.length + ' et ' + mBA.length + ' ; la prose doit écrire les deux formulations');
    }
    fin(r, 'leçon 04 · ensembles.js — les deux différences et la différence symétrique', v);
  }

  {
    const v = V();
    const brute = bloc('liste brute'), net = bloc('la même en ensemble');
    if (!brute || !net) v.manque('lignes « liste brute » / « la même en ensemble »');
    else {
      v.eq('longueur de la liste brute', brute.membres.length, brute.taille);
      v.eq('nombre de personnes distinctes', uniq(brute.membres).length, net.taille);
      v.vrai('contenu après dédoublonnage', memeEnsemble(net.membres, uniq(brute.membres)),
        'publié {' + net.membres.join(', ') + '}, recalculé {' + uniq(brute.membres).join(', ') + '}');
      v.vrai('phrase de conclusion', /Six noms écrits, trois personnes distinctes/.test(ens) &&
        brute.membres.length === 6 && uniq(brute.membres).length === 3,
        'recalculé ' + brute.membres.length + ' noms pour ' + uniq(brute.membres).length + ' personnes');
    }
    fin(r, 'leçon 04 · ensembles.js — six noms écrits, trois personnes distinctes', v);
  }

  {
    const v = V();
    const ie = L.sortie(4, 'inclusion-exclusion.txt');
    if (!A || !B) v.manque('les deux listes de ensembles.txt');
    else {
      const ta = uniq(A.membres).length, tb = uniq(B.membres).length, ti = inter(A.membres, B.membres).length;
      v.eq('|A| publié par inclusion-exclusion.js', ta, lireNb(ie, /^\|A\|\s+= (\d+)/m));
      v.eq('|B|', tb, lireNb(ie, /^\|B\|\s+= (\d+)/m));
      v.eq('|A ∩ B|', ti, lireNb(ie, /^\|A ∩ B\|\s+= (\d+)/m));
      v.eq('|A| + |B| (naïf)', ta + tb, lireNb(ie, /\(naïf\)\s+= (\d+)/));
      v.eq('|A| + |B| − |A ∩ B|', ta + tb - ti, lireNb(ie, /^\|A\| \+ \|B\| - \|A ∩ B\|\s+= (\d+)/m));
      v.eq('taille réelle de A ∪ B', reunion(A.membres, B.membres).length, lireNb(ie, /taille réelle de A ∪ B\s+= (\d+)/));
      v.eq('surestimation du comptage naïf', ti, lireNb(ie, /surestime de (\d+)/));
    }
    /* Trois ensembles : les tailles ne sont pas publiées, mais l'arithmétique
       interne de la phrase doit tenir. */
    const complete = lireNb(ie2(), /formule complète = (\d+)/);
    const reel = lireNb(ie2(), /formule complète = \d+ , réel = (\d+)/);
    const sans = lireNb(ie2(), /sans le dernier terme = (\d+)/);
    const manque = lireNb(ie2(), /il manque (\d+)/);
    const abc = lireNb(ie2(), /taille de A ∩ B ∩ C = (\d+)/);
    v.eq('trois ensembles : formule complète = union réelle', complete, reel);
    v.vrai('le terme oublié vaut la différence des deux comptes',
      complete !== null && sans !== null && manque !== null && complete - sans === manque,
      'publié ' + complete + ' − ' + sans + ' ≠ ' + manque);
    v.eq('le manque est bien |A ∩ B ∩ C|', manque, abc);
    fin(r, 'leçon 04 · inclusion-exclusion.js — la formule confrontée au comptage réel', v);
  }
  function ie2() { return L.sortie(4, 'inclusion-exclusion.txt'); }

  {
    const v = V();
    const ie = L.sortie(4, 'inclusion-exclusion.txt');
    const m = nrm(ie).match(/destinataires distincts = (\d+) \+ (\d+) - (\d+) = (\d+)/);
    if (!m) v.manque('ligne « destinataires distincts = … »');
    else {
      const a = Number(m[1]), b = Number(m[2]), c = Number(m[3]);
      v.eq('destinataires distincts (a + b − c recalculé)', a + b - c, Number(m[4]));
      v.eq('addition naïve annoncée', a + b, lireNb(ie, /on aurait annoncé (\d+)/));
      v.eq('messages en double', c, lireNb(ie, /soit (\d+) messages en double/));
      v.vrai('les trois entrées sont celles de la prose',
        prose(4).indexOf(nrm(L.frNombre(a) + ' + ' + L.frNombre(b) + ' − ' + L.frNombre(c) + ' = ' + L.frNombre(a + b - c))) >= 0,
        'la prose n\'écrit pas ' + L.frNombre(a) + ' + ' + L.frNombre(b) + ' − ' + L.frNombre(c) + ' = ' + L.frNombre(a + b - c));
      v.ecrit(4, L.frNombre(a + b) + ' pour l\'addition naïve');
      v.ecrit(4, 'soit ' + L.frNombre(c) + ' personnes comptées deux fois');
    }
    fin(r, 'leçon 04 · inclusion-exclusion.js — les 474 000 destinataires et le piège des 570 000', v);
  }

  const svt = L.sortie(4, 'set-vs-tableau.txt');
  const cibles = ['u0', 'u49999', 'u99999', 'u-absent'];
  function ligneRecherche(cible) {
    const e = cible.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = nrm(svt).match(new RegExp('chercher ' + e +
      '\\s+— tableau :\\s+(\\d+) comparaison\\(s\\), trouvé=(\\w+)\\s+·\\s+Set : (\\d+) accès, trouvé=(\\w+)'));
    return m ? { comparaisons: Number(m[1]), trouveTab: m[2], acces: Number(m[3]), trouveSet: m[4] } : null;
  }

  {
    const v = V();
    const N = lireNb(svt, /collection de ([\d ]+) identifiants/);
    v.eq('taille de la collection', 100000, N);
    /* Le tableau contient u0 … u(N−1) dans l'ordre : chercher « uK » coûte
       exactement K+1 comparaisons, et une absence coûte N. Aucun besoin
       d'exécuter quoi que ce soit pour le savoir. */
    for (let c = 0; c < cibles.length; c++) {
      const cible = cibles[c];
      const ligne = ligneRecherche(cible);
      if (!ligne) { v.manque('ligne « chercher ' + cible + ' »'); continue; }
      const idx = /^u(\d+)$/.test(cible) ? Number(cible.slice(1)) : -1;
      const present = idx >= 0 && idx < N;
      v.eq('comparaisons pour ' + cible, present ? idx + 1 : N, ligne.comparaisons);
      v.eq('trouvé pour ' + cible, String(present), ligne.trouveTab);
    }
    v.eq('3 recherches infructueuses', 3 * N, lireNb(svt, /3 recherches infructueuses dans le tableau : ([\d ]+) comparaisons/));
    v.eq('coût de construction du Set', N, lireNb(svt, /Construire le Set a coûté ([\d ]+) insertions/));
    v.ecrit(4, '100 000 comparaisons pour conclure qu\'un élément est absent');
    fin(r, 'leçon 04 · set-vs-tableau.js — le coût du tableau dépend de la position', v);
  }

  {
    const v = V();
    /* Une recherche dans un ensemble = un accès, par définition du compteur que
       la page affiche. Les quatre lignes doivent donc afficher 1, y compris la
       première. */
    for (let c = 0; c < cibles.length; c++) {
      const ligne = ligneRecherche(cibles[c]);
      if (!ligne) { v.manque('ligne « chercher ' + cibles[c] + ' »'); continue; }
      v.eq('accès au Set pour ' + cibles[c] + ' (une recherche = un accès)', 1, ligne.acces);
    }
    fin(r, 'leçon 04 · set-vs-tableau.js — chaque recherche dans le Set coûte un accès', v);
  }

  {
    const v = V();
    /* Le total annoncé doit valoir la somme des accès réellement effectués :
       4 recherches du tableau du haut + 3 recherches infructueuses = 7. */
    const total = lireNb(svt, /Compté sur cette page : (\d+) accès au Set/);
    const secondBloc = lireNb(svt, /Les mêmes avec un Set : (\d+) accès/);
    v.eq('accès du second bloc (3 recherches)', 3, secondBloc);
    v.eq('total des accès (4 recherches + 3 recherches)', cibles.length + 3, total);
    let somme = 0, complet = true;
    for (let c = 0; c < cibles.length; c++) {
      const ligne = ligneRecherche(cibles[c]);
      if (!ligne) { complet = false; break; }
      somme += ligne.acces;
    }
    v.vrai('le total annoncé est la somme des accès affichés',
      complet && total !== null && secondBloc !== null && somme + secondBloc === total,
      'somme des lignes ' + somme + ' + ' + secondBloc + ' = ' + (somme + secondBloc) + ', total annoncé ' + total);
    v.eq('insertions rappelées en fin de bloc', 100000, lireNb(svt, /(\d[\d ]*) insertions pour le construire/));
    fin(r, 'leçon 04 · set-vs-tableau.js — le total des accès au Set', v);
  }

  {
    const v = V();
    /* 40 000 lignes de chaque côté : la boucle imbriquée coûte le produit, la
       version avec ensemble coûte la somme. */
    const n = 40000;
    const paires = n * n;
    v.vrai('40 000 × 40 000 = 1,6 milliard', paires === 1600000000, 'recalculé ' + paires);
    v.ecrit(4, 'soit 1,6 milliard de comparaisons');
    v.ecrit(4, '40 000 insertions et 40 000 recherches');
    v.eq('rapport comparaisons / opérations', paires / (n + n), lireNb(prose(4), /rapport des comparaisons aux opérations est de ([\d ]+)/));
    fin(r, 'leçon 04 · prose — la boucle imbriquée à 1,6 milliard de comparaisons', v);
  }

  {
    const v = V();
    const s1 = L.sortie(4, 'solution-1.txt');
    /* Les deux listes de l'énoncé sont les données ; les noms communs et leur
       nombre sont la réponse, recalculée ici par filtrage à la main. */
    const listes = prose(4).match(/\['[^\]]*'\]/g);
    if (!listes || listes.length < 2) v.manque('les deux listes de l\'énoncé de l\'exercice 1');
    else {
      const parse = function (s) { return s.replace(/[[\]']/g, '').split(',').map(function (x) { return x.trim(); }); };
      const l1 = parse(listes[0]), l2 = parse(listes[1]);
      const communs = inter(l1, l2);
      const pubA = lire(s1, /^liste A : (.*)$/m), pubB = lire(s1, /^liste B : (.*)$/m);
      v.vrai('la liste A rejouée est celle de l\'énoncé', pubA !== null && memeEnsemble(pubA.split(',').map(function (x) { return x.trim(); }), l1),
        'publié « ' + pubA + ' », énoncé « ' + l1.join(', ') + ' »');
      v.vrai('la liste B rejouée est celle de l\'énoncé', pubB !== null && memeEnsemble(pubB.split(',').map(function (x) { return x.trim(); }), l2),
        'publié « ' + pubB + ' », énoncé « ' + l2.join(', ') + ' »');
      const pubC = lire(s1, /^communs : (.*)$/m);
      v.vrai('les noms communs', pubC !== null && memeEnsemble(pubC.split(',').map(function (x) { return x.trim(); }), communs),
        'publié « ' + pubC + ' », recalculé « ' + communs.join(', ') + ' »');
      v.eq('le nombre seul sur la dernière ligne', communs.length, nb(nrm(s1).trim().split('\n').pop()));
      v.vrai('tailles des deux listes citées dans le commentaire', l1.length === 6 && l2.length === 5 && prose(4).indexOf('(6 et 5)') >= 0,
        'recalculé ' + l1.length + ' et ' + l2.length);
    }
    fin(r, 'leçon 04 · solution-1 — les noms présents dans les deux listes', v);
  }

  {
    const v = V();
    const s2 = L.sortie(4, 'solution-2.txt');
    /* Données de l'énoncé, relues dans la prose pour que le contrôle rougisse
       si l'énoncé change ; la réponse, elle, est recalculée. */
    v.ecrit(4, 'Trois canaux comptent 5 200, 3 100 et 1 800 abonnés');
    v.ecrit(4, '900 entre le premier et le deuxième, 400 entre le premier et le troisième, 300 entre le deuxième et le troisième, et 150 personnes');
    const a = 5200, b = 3100, c = 1800, ab = 900, ac = 400, bc = 300, abc = 150;
    const distincts = a + b + c - ab - ac - bc + abc;
    v.eq('somme naïve des trois canaux', a + b + c, lireNb(s2, /somme naïve des trois canaux : (\d+)/));
    v.eq('personnes distinctes (inclusion-exclusion à trois)', distincts, lireNb(s2, /personnes distinctes\s+: (\d+)/));
    v.eq('doublons évités', a + b + c - distincts, lireNb(s2, /doublons évités\s+: (\d+)/));

    /* Jeu d'essai : les sept tailles sont des données, les quatre résultats sont
       recalculés terme à terme. */
    const j = nrm(s2).match(/tailles du jeu de contrôle : (\{[^}]*\})/);
    if (!j) v.manque('ligne « tailles du jeu de contrôle »');
    else {
      let t = null;
      try { t = JSON.parse(j[1]); } catch (err) { t = null; }
      if (!t) v.manque('jeu de contrôle illisible');
      else {
        const correcte = t.A + t.B + t.C - t.AB - t.AC - t.BC + t.ABC;
        const signeAB = t.A + t.B + t.C + t.AB - t.AC - t.BC + t.ABC;
        const signeAC = t.A + t.B + t.C - t.AB + t.AC - t.BC + t.ABC;
        const sansCentre = t.A + t.B + t.C - t.AB - t.AC - t.BC;
        v.eq('formule correcte sur le jeu d\'essai', correcte, lireNb(s2, /formule correcte\s+->\s+(\d+)/));
        v.eq('signe inversé sur |A∩B|', signeAB, lireNb(s2, /signe inversé sur \|A∩B\|\s+->\s+(\d+)/));
        v.eq('signe inversé sur |A∩C|', signeAC, lireNb(s2, /signe inversé sur \|A∩C\|\s+->\s+(\d+)/));
        v.eq('terme |A∩B∩C| oublié', sansCentre, lireNb(s2, /terme \|A∩B∩C\| oublié\s+->\s+(\d+)/));
        v.eq('union réelle', correcte, lireNb(s2, /union réelle : (\d+)/));
        const detectees = [signeAB, signeAC, sansCentre].filter(function (x) { return x !== correcte; }).length;
        v.eq('erreurs détectées par le jeu d\'essai', detectees, lireNb(s2, /(\d+) erreur\(s\) sur 3 détectée/));
      }
    }
    fin(r, 'leçon 04 · solution-2 — inclusion-exclusion à trois canaux et son jeu d\'essai', v);
  }

  {
    const v = V();
    const s3 = L.sortie(4, 'solution-3.txt');
    /* Les huit sous-ensembles publiés doivent être EXACTEMENT les parties de
       {a, b, c}, énumérées ici par masque de bits. */
    const noms = ['a', 'b', 'c'];
    const attendus = sousEnsembles(3).map(function (s) {
      return s.map(function (i) { return noms[i]; }).sort().join(',');
    }).sort();
    const listees = [];
    const re = /^ {2}\{([^}]*)\}\s*$/gm;
    let m;
    const texte3 = nrm(s3);
    while ((m = re.exec(texte3))) {
      listees.push(m[1].split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x.length; }).sort().join(','));
    }
    listees.sort();
    v.vrai('les parties de {a, b, c} énumérées', listees.length === attendus.length && listees.join(' | ') === attendus.join(' | '),
      'publié [' + listees.join(' | ') + '], recalculé [' + attendus.join(' | ') + ']');
    v.eq('total pour 3 éléments', attendus.length, lireNb(s3, /total : (\d+) sous-ensembles pour 3 éléments/));

    const reN = /^n = *(\d+) -> formule\s+(\d+)\s+énuméré\s+(\d+)\s+d'accord\s*$/gm;
    let lignes = 0;
    while ((m = reN.exec(texte3))) {
      lignes++;
      const n = Number(m[1]);
      const attendu = puis(2, n).toString();
      v.eq('2^' + n + ' (colonne formule)', attendu, m[2]);
      v.eq('2^' + n + ' (colonne énumérée)', attendu, m[3]);
    }
    v.vrai('six valeurs de n confrontées', lignes === 6, 'recalculé 6 lignes attendues, ' + lignes + ' lues');
    const lu30 = lire(texte3, /\(2\^30 = ([\d ]+)\)/);
    v.eq('2^30 annoncé en fin de bloc', puis(2, 30).toString(), lu30 === null ? null : lu30.replace(/\s/g, ''));
    v.ecrit(4, '65 536 sous-ensembles sont déjà beaucoup');
    v.vrai('2^16 = 65 536 (prose)', Number(puis(2, 16)) === 65536, 'recalculé ' + puis(2, 16));
    fin(r, 'leçon 04 · solution-3 — les 2^n sous-ensembles, énumérés puis comparés à la formule', v);
  }

  /* ---------------------------------------------------------------- */
  /* LEÇON 05 — dénombrement                                          */
  /* ---------------------------------------------------------------- */
  const den = nrm(L.sortie(5, 'denombrement.txt'));
  const lignesDen = [];
  {
    const re = /^(.*?)\s{2,}formule\s+(\d+)\s+énuméré\s+(\d+)\s+(.+?)\s*$/gm;
    let m;
    while ((m = re.exec(den))) {
      lignesDen.push({ etiquette: m[1].trim(), formule: Number(m[2]), enumere: Number(m[3]), verdict: m[4].trim() });
    }
  }
  function ligneDen(motif) {
    for (let i = 0; i < lignesDen.length; i++) if (motif.test(lignesDen[i].etiquette)) return lignesDen[i];
    return null;
  }

  {
    const v = V();
    const l1 = ligneDen(/^3 tailles x 4 couleurs$/);
    const l2 = ligneDen(/^2 x 2 x 2/);
    if (!l1) v.manque('ligne « 3 tailles x 4 couleurs »');
    else {
      const compte = produitCartesien([3, 4]).length;
      v.eq('3 × 4 (colonne formule)', compte, l1.formule);
      v.eq('3 × 4 (colonne énumérée)', compte, l1.enumere);
    }
    if (!l2) v.manque('ligne « 2 x 2 x 2 »');
    else {
      const compte = produitCartesien([2, 2, 2]).length;
      v.eq('2 × 2 × 2 (colonne formule)', compte, l2.formule);
      v.eq('2 × 2 × 2 (colonne énumérée)', compte, l2.enumere);
    }
    v.ecrit(5, '3 tailles × 4 couleurs = 12');
    v.vrai('un menu « ou bien » additionne : 3 + 4 = 7', 3 + 4 === 7 && prose(5).indexOf('offre 7 possibilités') >= 0,
      'la prose n\'annonce pas 7 possibilités');
    fin(r, 'leçon 05 · denombrement.js — principe multiplicatif, énuméré par produit cartésien', v);
  }

  {
    const v = V();
    let vues = 0;
    for (let n = 1; n <= 5; n++) {
      const l = ligneDen(new RegExp('^permutations de ' + n + ' élément'));
      if (!l) { v.manque('ligne « permutations de ' + n + ' élément(s) »'); continue; }
      vues++;
      const enumere = permutations(n).length;
      v.eq(n + '! (colonne formule)', Number(fact(n)), l.formule);
      v.eq(n + '! (colonne énumérée)', enumere, l.enumere);
      v.vrai(n + '! : énumération et formule fermée concordent', enumere === Number(fact(n)),
        'énuméré ' + enumere + ', formule ' + fact(n));
    }
    v.vrai('cinq lignes de permutations', vues === 5, vues + ' lignes lues');
    /* Les arrangements, énumérés comme suites d'éléments distincts. */
    const cas = [[5, 2], [5, 3], [4, 4], [5, 1]];
    for (let i = 0; i < cas.length; i++) {
      const n = cas[i][0], k = cas[i][1];
      const l = ligneDen(new RegExp('^arrangements de ' + k + ' parmi ' + n + '$'));
      if (!l) { v.manque('ligne « arrangements de ' + k + ' parmi ' + n + ' »'); continue; }
      const enumere = arrangementsEnum(n, k).length;
      v.eq('A(' + n + ',' + k + ') (colonne formule)', Number(arrFormule(n, k)), l.formule);
      v.eq('A(' + n + ',' + k + ') (colonne énumérée)', enumere, l.enumere);
      v.vrai('A(' + n + ',' + k + ') : énumération = n!/(n−k)!', enumere === Number(arrFormule(n, k)),
        'énuméré ' + enumere + ', formule ' + arrFormule(n, k));
    }
    fin(r, 'leçon 05 · denombrement.js — permutations et arrangements, réellement énumérés', v);
  }

  {
    const v = V();
    const cas = [[5, 2], [5, 3], [5, 0], [5, 5]];
    for (let i = 0; i < cas.length; i++) {
      const n = cas[i][0], k = cas[i][1];
      const l = ligneDen(new RegExp('^combinaisons de ' + k + ' parmi ' + n + '$'));
      if (!l) { v.manque('ligne « combinaisons de ' + k + ' parmi ' + n + ' »'); continue; }
      const enumere = combinaisonsEnum(n, k).length;
      v.eq('C(' + n + ',' + k + ') (colonne formule)', Number(combFormule(n, k)), l.formule);
      v.eq('C(' + n + ',' + k + ') (colonne énumérée)', enumere, l.enumere);
      v.vrai('C(' + n + ',' + k + ') : énumération = n!/(k!(n−k)!)', enumere === Number(combFormule(n, k)),
        'énuméré ' + enumere + ', formule ' + combFormule(n, k));
    }
    /* Le rapport arrangements / combinaisons vaut k!. */
    const a53 = arrangementsEnum(5, 3).length, c53 = combinaisonsEnum(5, 3).length;
    v.eq('vérification finale : C(5,3) × 3!', a53, lireNb(den, /Vérification : \d+ x \d+ = (\d+)/));
    v.eq('facteur du regroupement (3!)', Number(fact(3)), lireNb(den, /Vérification : \d+ x (\d+) =/));
    v.eq('nombre de combinaisons dans la vérification', c53, lireNb(den, /Vérification : (\d+) x/));
    v.vrai('A(5,3) = C(5,3) × 3! (énumérations comparées)', a53 === c53 * Number(fact(3)),
      'énuméré A=' + a53 + ', C=' + c53);
    fin(r, 'leçon 05 · denombrement.js — combinaisons énumérées et rapport k! avec les arrangements', v);
  }

  {
    const v = V();
    /* La prose engage un compte : « Les 15 lignes du programme … 15 accords, 0
       écart ». On recompte les lignes et les verdicts. */
    v.vrai('quinze lignes de confrontation', lignesDen.length === 15, lignesDen.length + ' lignes lues dans le bloc');
    const desaccords = lignesDen.filter(function (l) { return l.verdict !== 'd\'accord' || l.formule !== l.enumere; });
    v.vrai('aucun désaccord', desaccords.length === 0, desaccords.length + ' ligne(s) en désaccord');
    v.ecrit(5, '15 accords, 0 écart');
    /* La table « choisir sa formule » de la prose engage cinq nombres. */
    v.ecrit(5, '5 ! = 120');
    v.vrai('5! = 120', Number(fact(5)) === 120, 'recalculé ' + fact(5));
    v.ecrit(5, 'A(8,3) = 336');
    v.vrai('A(8,3) = 336', Number(arrFormule(8, 3)) === 336, 'recalculé ' + arrFormule(8, 3));
    v.ecrit(5, 'C(8,3) = 56');
    v.vrai('C(8,3) = 56', Number(combFormule(8, 3)) === 56, 'recalculé ' + combFormule(8, 3));
    v.ecrit(5, '= 1 024 sous-ensembles');
    v.vrai('2^10 = 1 024', Number(puis(2, 10)) === 1024, 'recalculé ' + puis(2, 10));
    v.ecrit(5, '65 536 cases → ≥ 16');
    v.vrai('⌈10^6 / 65 536⌉ = 16', Math.ceil(1000000 / 65536) === 16, 'recalculé ' + Math.ceil(1000000 / 65536));
    fin(r, 'leçon 05 · prose — les 15 accords et la table « choisir sa formule »', v);
  }

  {
    const v = V();
    /* Deux ordres de grandeur affirmés en toutes lettres. */
    v.ecrit(5, '10 ! dépasse déjà 3,6 millions');
    v.vrai('10! dépasse 3,6 millions sans atteindre 3,7', fact(10) > 3600000n && fact(10) < 3700000n, 'recalculé ' + fact(10));
    v.ecrit(5, '20 ! dépasse le nombre de secondes écoulées depuis le Big Bang');
    /* Majorant très large de l'âge de l'univers : 14 milliards d'années de
       365,25 jours. 20! doit le dépasser. */
    const secondesUnivers = BigInt(Math.round(14e9 * 365.25 * 86400));
    v.vrai('20! > secondes depuis le Big Bang', fact(20) > secondesUnivers,
      '20! = ' + fact(20) + ', majorant de l\'âge de l\'univers ' + secondesUnivers + ' s');
    v.ecrit(5, '7 776');
    v.proche('4 × log2(7776) annoncé dans la prose', 4 * Math.log2(7776), lireNb(prose(5), /4 × log₂ 7776 = ([\d,]+)/), 0.05);
    v.vrai('arrondi à 52 bits', Math.round(4 * Math.log2(7776)) === 52 && prose(5).indexOf('en fournit 52') >= 0,
      'recalculé ' + (4 * Math.log2(7776)));
    fin(r, 'leçon 05 · prose — 10!, 20! et l\'entropie d\'une phrase de quatre mots', v);
  }

  const tir = nrm(L.sortie(5, 'tiroirs.txt'));
  {
    const v = V();
    /* La répartition imprimée est la donnée ; le nombre de clés, le nombre de
       cases chargées et la case la plus remplie sont les affirmations. */
    const re = /^ {2}case (\d+) : (.*)$/gm;
    let m, clefs = 0, cases = 0, chargees = 0, maxi = 0;
    while ((m = re.exec(tir))) {
      const contenu = m[2].split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x.length; });
      cases++;
      clefs += contenu.length;
      if (contenu.length > 1) chargees++;
      if (contenu.length > maxi) maxi = contenu.length;
    }
    const annonceC = nrm(tir).match(/^(\d+) clés rangées dans (\d+) cases/m);
    if (!annonceC) v.manque('ligne « N clés rangées dans M cases »');
    else {
      v.eq('clés effectivement réparties', clefs, Number(annonceC[1]));
      v.vrai('cases utilisées', cases <= Number(annonceC[2]), 'recalculé ' + cases + ' cases affichées pour ' + annonceC[2] + ' annoncées');
    }
    v.eq('cases contenant plus d\'une clé', chargees, lireNb(tir, /cases contenant plus d.une clé : (\d+)/));
    v.vrai('la case la plus remplie atteint au moins ⌈9/5⌉ = 2', maxi >= Math.ceil(clefs / cases),
      'recalculé maximum ' + maxi + ', borne ' + Math.ceil(clefs / cases));
    v.vrai('la prose annonce une case à quatre clés', maxi === 4 && prose(5).indexOf('une case qui en contient quatre') >= 0,
      'maximum recalculé ' + maxi);
    fin(r, 'leçon 05 · tiroirs.js — la répartition de 9 clés dans 5 cases, recomptée', v);
  }

  {
    const v = V();
    const re = /^ranger\s+(\d+) clés dans\s+(\d+) cases -> au moins une case en contient (\d+)$/gm;
    let m, lignes = 0;
    while ((m = re.exec(tir))) {
      lignes++;
      const n = Number(m[1]), mm = Number(m[2]);
      v.eq('⌈' + n + '/' + mm + '⌉', Math.ceil(n / mm), Number(m[3]));
    }
    v.vrai('quatre lignes de forme quantitative', lignes === 4, lignes + ' lignes lues');
    /* Empreintes : 2^b en BigInt, et l'entrée de trop, c'est 2^b + 1. */
    const re2 = /^empreinte de\s+(\d+) bits :\s+([\d ]+) valeurs possibles -> avec ([\d ]+) entrées/gm;
    let lignes2 = 0;
    while ((m = re2.exec(tir))) {
      lignes2++;
      const b = Number(m[1]);
      v.eq('2^' + b + ' valeurs possibles', puis(2, b).toString(), nrm(m[2]).replace(/\s/g, ''));
      v.eq('2^' + b + ' + 1 entrées', (puis(2, b) + 1n).toString(), nrm(m[3]).replace(/\s/g, ''));
    }
    v.vrai('quatre tailles d\'empreinte', lignes2 === 4, lignes2 + ' lignes lues');
    fin(r, 'leçon 05 · tiroirs.js — ⌈n/m⌉ et les 2^b valeurs d\'une empreinte (BigInt exact)', v);
  }

  /* --- mots de passe ------------------------------------------------ */
  const mdp = nrm(L.sortie(5, 'mots-de-passe.txt'));
  /* Tailles d'alphabet définies ICI, pas lues : 10 chiffres ; 26 minuscules ;
     26+10 = 36 ; +26 majuscules = 62 ; +33 symboles imprimables = 95. */
  const ALPHABETS = [
    { etiquette: 'chiffres', taille: 10 },
    { etiquette: 'minuscules', taille: 26 },
    { etiquette: 'minuscules+chiffres', taille: 36 },
    { etiquette: '+ majuscules', taille: 62 },
    { etiquette: '+ 33 symboles', taille: 95 }
  ];

  {
    const v = V();
    v.vrai('cohérence des tailles d\'alphabet posées ici', 26 + 10 === 36 && 36 + 26 === 62 && 62 + 33 === 95, 'incohérence interne');
    const section = mdp.slice(0, mdp.indexOf('exemples exacts'));
    const enTete = ligneDe(section, 'alphabet');
    if (!enTete) v.manque('en-tête du tableau des tailles');
    else {
      const longueurs = cellules(enTete).map(function (c) { return nb(c.replace(' car.', '')); });
      v.vrai('cinq longueurs en en-tête', longueurs.length === 5 && longueurs.indexOf(null) < 0, 'en-tête lu : ' + enTete);
      for (let i = 0; i < ALPHABETS.length; i++) {
        const a = ALPHABETS[i];
        const ligne = ligneDe(section, a.etiquette);
        if (!ligne) { v.manque('ligne « ' + a.etiquette + ' » du tableau des tailles'); continue; }
        const cs = cellules(ligne);
        for (let j = 0; j < longueurs.length; j++) {
          const attendu = chiffres(puis(a.taille, longueurs[j]));
          v.eq(a.taille + '^' + longueurs[j] + ' : nombre de chiffres', attendu, cs[j] === undefined ? null : nb(cs[j].replace(' chif.', '')));
        }
      }
    }
    fin(r, 'leçon 05 · mots-de-passe.js — les 25 tailles d\'espace, en nombre de chiffres (BigInt)', v);
  }

  {
    const v = V();
    const brut = function (re) { const x = lire(mdp, re); return x === null ? null : x.replace(/\s/g, ''); };
    v.eq('8 caractères, minuscules seules (26^8)', puis(26, 8).toString(), brut(/8 caractères, minuscules seules : ([\d ]+)/));
    v.eq('8 caractères, 95 symboles (95^8)', puis(95, 8).toString(), brut(/8 caractères, 95 symboles\s+: ([\d ]+)/));
    v.eq('12 caractères, minuscules seules (26^12)', puis(26, 12).toString(), brut(/12 caractères, minuscules seules: ([\d ]+)/));
    fin(r, 'leçon 05 · mots-de-passe.js — les trois tailles exactes', v);
  }

  {
    const v = V();
    const debut = mdp.indexOf('DURÉE D\'UNE RECHERCHE EXHAUSTIVE');
    const finSection = mdp.indexOf('8 caractères parmi 95 symboles');
    if (debut < 0 || finSection < 0) v.manque('section « DURÉE D\'UNE RECHERCHE EXHAUSTIVE »');
    else {
      const section = mdp.slice(debut, finSection);
      const essais = lireNb(section, /hypothèse ANNONCÉE : ([\d ]+) essais par seconde/);
      v.eq('hypothèse d\'essais par seconde', 1e12, essais);
      v.ecrit(5, '1 000 milliards d\'essais par seconde');
      const UNITES = { seconde: 1, minute: 60, heure: 3600, jour: 86400 };
      const longueurs = [8, 12];
      for (let i = 0; i < ALPHABETS.length && essais; i++) {
        const a = ALPHABETS[i];
        const ligne = ligneDe(section, a.etiquette);
        if (!ligne) { v.manque('ligne « ' + a.etiquette + ' » du tableau des durées'); continue; }
        const cs = cellules(ligne);
        for (let j = 0; j < longueurs.length; j++) {
          const cle = a.taille + '^' + longueurs[j];
          const secondes = Number(puis(a.taille, longueurs[j])) / essais;
          const cellule = cs[j];
          if (cellule === undefined) { v.manque('cellule ' + cle + ' du tableau des durées'); continue; }
          if (/moins d'une seconde/.test(cellule)) {
            v.vrai(cle + ' : « moins d\'une seconde »', secondes < 1, 'recalculé ' + secondes + ' s');
            continue;
          }
          const m = cellule.match(/^([\d ]+) (seconde|minute|heure|jour|an)s?$/);
          if (!m) { v.manque('cellule ' + cle + ' illisible : « ' + cellule + ' »'); continue; }
          const val = nb(m[1]);
          if (m[2] === 'an') {
            /* L'année n'a pas de durée conventionnelle unique : on borne entre
               365 et 365,25 jours et on tolère l'arrondi entier. */
            const hautes = secondes / (365 * 86400), basses = secondes / (365.25 * 86400);
            v.dans(cle + ' : durée en années', Math.floor(basses), Math.ceil(hautes), val);
          } else {
            const exact = secondes / UNITES[m[2]];
            v.dans(cle + ' : durée en ' + m[2] + 's', Math.floor(exact), Math.ceil(exact), val);
          }
        }
      }
    }
    fin(r, 'leçon 05 · mots-de-passe.js — les dix durées de recherche exhaustive', v);
  }

  {
    const v = V();
    const grand = Number(puis(26, 12)) / Number(puis(95, 8));
    v.proche('« 14,4 fois plus grand »', grand, lireNb(mdp, /Le second est ([\d,]+) fois plus grand/), 0.05);
    v.proche('« alphabet 3,7 fois plus petit »', 95 / 26, lireNb(mdp, /alphabet ([\d,]+) fois plus petit/), 0.05);
    const bits95 = 8 * Math.log2(95), bits26 = 12 * Math.log2(26);
    v.proche('entropie de 8 caractères parmi 95', bits95, lireNb(mdp, /En bits : ([\d,]+) contre/), 0.05);
    v.proche('entropie de 12 minuscules', bits26, lireNb(mdp, /En bits : [\d,]+ contre (\d+,\d+)/), 0.05);
    v.proche('écart en bits', bits26 - bits95, lireNb(mdp, /soit ([\d,]+) bits/), 0.05);
    v.proche('un caractère minuscule vaut log2(26) bits', Math.log2(26), lireNb(mdp, /qui en vaut ([\d,]+)/), 0.05);
    v.vrai('l\'écart en bits est bien inférieur à un caractère minuscule', bits26 - bits95 < Math.log2(26),
      'recalculé écart ' + (bits26 - bits95) + ' contre ' + Math.log2(26));
    v.ecrit(5, '14,4 fois plus grand');
    v.ecrit(5, '52,6 contre 56,4');
    v.ecrit(5, '3,8 bits');
    fin(r, 'leçon 05 · mots-de-passe.js — 14,4 fois, 3,8 bits d\'écart, 4,7 bits par caractère', v);
  }

  {
    const v = V();
    const debut = mdp.indexOf('DIVERSIFIER OU ALLONGER');
    if (debut < 0) v.manque('section « DIVERSIFIER OU ALLONGER »');
    else {
      const section = mdp.slice(debut);
      const re = /^(\d+) [^\n]*?\s{2,}x ([\d ]+)\s+x ([\d ]+)\s+-> (\w+) gagne\s*$/gm;
      let m, lignes = 0;
      while ((m = re.exec(section))) {
        lignes++;
        const a = Number(m[1]);
        /* Depuis 8 caractères : passer à 95 symboles multiplie par (95/a)^8 ;
           ajouter deux caractères multiplie par a^2. Exact en BigInt, arrondi
           seulement au moment de comparer à l'entier affiché. */
        const facteurAlphabet = Number(puis(95, 8)) / Number(puis(a, 8));
        const facteurLongueur = Number(puis(a, 2));
        v.dans('alphabet ' + a + ' → 95 symboles', Math.floor(facteurAlphabet), Math.ceil(facteurAlphabet), nb(m[2]));
        v.eq('alphabet ' + a + ' → + 2 caractères', facteurLongueur, nb(m[3]));
        v.eq('verdict pour l\'alphabet ' + a, facteurAlphabet > facteurLongueur ? 'diversifier' : 'allonger', m[4]);
      }
      v.vrai('trois alphabets de départ', lignes === 3, lignes + ' lignes lues');
      v.ecrit(5, 'multiplie l\'espace par 31 769');
      v.ecrit(5, 'ne le multiplie que par 676');
    }
    fin(r, 'leçon 05 · mots-de-passe.js — diversifier ou allonger, les six facteurs', v);
  }

  {
    const v = V();
    const s4 = L.sortie(5, 'solution-4.txt');
    const paires = combinaisonsEnum(6, 2).length;
    v.eq('C(6,2) annoncé par la formule', paires, lireNb(s4, /formule C\(6,2\) = (\d+)/));
    v.eq('C(6,2) énuméré', paires, lireNb(s4, /énuméré = (\d+)/));
    v.eq('total sur la dernière ligne', paires, nb(nrm(s4).trim().split('\n').pop()));
    v.vrai('C(6,2) = 15 par la formule fermée', Number(combFormule(6, 2)) === paires, 'formule ' + combFormule(6, 2) + ', énuméré ' + paires);
    /* La remarque annonce 30 paires si la boucle démarre à j = 0 : ce sont les
       couples ordonnés, soit A(6,2). */
    v.ecrit(5, 'elle produirait 30 paires');
    v.vrai('A(6,2) = 30', arrangementsEnum(6, 2).length === 30, 'recalculé ' + arrangementsEnum(6, 2).length);
    const debut = nrm(s4).split('\n').filter(function (l) { return /^ {2}\w/.test(l); }).length;
    v.vrai('cinq binômes affichés avant le repli', debut === 5, debut + ' lignes de binômes lues');
    v.eq('binômes restants annoncés', paires - debut, lireNb(s4, /… \((\d+) autres\)/));
    fin(r, 'leçon 05 · solution-4 — les 15 binômes de six personnes', v);
  }

  {
    const v = V();
    const s5 = L.sortie(5, 'solution-5.txt');
    const podiums = arrangementsEnum(8, 3).length;
    const trios = combinaisonsEnum(8, 3).length;
    v.eq('A(8,3) — podiums', podiums, lireNb(s5, /A\(8,3\) = (\d+)/));
    v.eq('C(8,3) — trios', trios, lireNb(s5, /C\(8,3\) = (\d+)/));
    v.eq('rapport annoncé', podiums / trios, lireNb(s5, /rapport : (\d+) = 3!/));
    v.eq('3!', Number(fact(3)), podiums / trios);
    v.eq('podiums énumérés', podiums, lireNb(s5, /podiums énumérés : (\d+)/));
    v.eq('trios distincts', trios, lireNb(s5, /trios distincts : (\d+)/));
    v.eq('podiums de la phrase finale', podiums, lireNb(s5, /Les (\d+) podiums se regroupent/));
    v.eq('paquets de la phrase finale', trios, lireNb(s5, /se regroupent en (\d+) trios/));
    v.eq('taille des paquets', podiums / trios, lireNb(s5, /chacun comptant (\d+) ordres/));
    v.ecrit(5, 'la réponse est 56, pas 336');
    fin(r, 'leçon 05 · solution-5 — 336 podiums, 56 trios, rapport 3!', v);
  }

  {
    const v = V();
    const s6 = L.sortie(5, 'solution-6.txt');
    const N = lireNb(s6, /(\d+) employés, ([\d ]+) identifiants possibles/, 2);
    const employes = lireNb(s6, /(\d+) employés,/);
    v.eq('identifiants possibles pour 3 chiffres', Number(puis(10, 3)), N);
    v.vrai('les tiroirs ne forcent rien tant que employés < identifiants', employes !== null && N !== null && employes < N,
      'recalculé ' + employes + ' contre ' + N);
    const re = /^\s*(\d+) identifiants tirés -> probabilité de collision : ([\d,]+|> [\d,]+) %$/gm;
    let m, lignes = 0;
    while ((m = re.exec(nrm(s6)))) {
      lignes++;
      const k = Number(m[1]);
      const p = pCoincidence(k, N) * 100;
      if (m[2].charAt(0) === '>') {
        const seuil = nb(m[2].slice(1));
        v.vrai(k + ' tirages : « > ' + seuil + ' % »', p > seuil, 'recalculé ' + p.toFixed(6) + ' %');
      } else {
        v.proche(k + ' tirages, probabilité de collision', p, nb(m[2]), 0.05);
      }
    }
    v.vrai('cinq lignes de probabilité', lignes === 5, lignes + ' lignes lues');
    v.eq('seuil de certitude par les tiroirs', N + 1, lireNb(s6, /À partir de ([\d ]+) employés/));
    v.ecrit(5, '1 001 employés');
    fin(r, 'leçon 05 · solution-6 — collisions probables sur 1 000 identifiants (produit exact)', v);
  }

  /* ---------------------------------------------------------------- */
  /* LEÇON 06 — probabilités                                          */
  /* ---------------------------------------------------------------- */
  const ann = nrm(L.sortie(6, 'anniversaires.txt'));

  {
    const v = V();
    const jours = lireNb(ann, /groupe de n personnes, (\d+) jours/);
    v.eq('nombre de dates possibles', 365, jours);
    const section = ann.slice(0, ann.indexOf('À 23 personnes'));
    const re = /^\s*(\d+) \|\s+([\d.]+) %\s*$/gm;
    let m, lignes = 0;
    while ((m = re.exec(section))) {
      lignes++;
      const n = Number(m[1]);
      v.proche('p(' + n + ') — produit exact 1 − ∏(365−i)/365', pCoincidence(n, jours) * 100, Number(m[2]), 0.05);
    }
    v.vrai('onze valeurs de n', lignes === 11, lignes + ' lignes lues');
    fin(r, 'leçon 06 · anniversaires.js — les onze probabilités, recalculées en rationnels exacts', v);
  }

  {
    const v = V();
    const re = /^\s*(\d+) personnes ->\s+(\d+) paires à comparer/gm;
    let m, lignes = 0;
    while ((m = re.exec(ann))) {
      lignes++;
      const n = Number(m[1]);
      /* Comptage direct par double boucle, pas la formule n(n−1)/2. */
      let compte = 0;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) compte++;
      v.eq('paires dans un groupe de ' + n, compte, Number(m[2]));
      v.vrai('n(n−1)/2 concorde avec le comptage pour n = ' + n, compte === n * (n - 1) / 2,
        'compté ' + compte + ', formule ' + (n * (n - 1) / 2));
    }
    v.vrai('cinq groupes', lignes === 5, lignes + ' lignes lues');
    let p23 = 0;
    for (let i = 0; i < 23; i++) for (let j = i + 1; j < 23; j++) p23++;
    v.vrai('253 paires pour 23 personnes', p23 === 253, 'compté ' + p23);
    v.ecrit(6, '23 personnes → 253 paires');
    v.ecrit(6, '253 paires');
    fin(r, 'leçon 06 · anniversaires.js — 253 paires dans un groupe de 23, recomptées une à une', v);
  }

  {
    const v = V();
    const tirages = lireNb(ann, /simulation : ([\d ]+) groupes tirés/);
    v.eq('nombre de tirages par valeur de n', 20000, tirages);
    const re = /^\s*(\d+) \|\s+([\d.]+) %\s+\|\s+([\d.]+) %\s+\|\s+([\d.]+) pt \|\s+([\d.]+) pt\s*$/gm;
    let m, lignes = 0;
    while ((m = re.exec(ann))) {
      lignes++;
      const n = Number(m[1]);
      const p = pCoincidence(n, 365);
      v.proche('n = ' + n + ' : colonne « calcul »', p * 100, Number(m[2]), 0.05);
      /* Écart type de l'estimation : √(p(1−p)/tirages), exprimé en points. */
      v.proche('n = ' + n + ' : colonne « attendu »', Math.sqrt(p * (1 - p) / tirages) * 100, Number(m[4 + 1]), 0.005);
      /* L'écart annoncé doit être compatible avec les deux pourcentages
         affichés, chacun arrondi au dixième. */
      const brut = Math.abs(Number(m[3]) - Number(m[2]));
      v.dans('n = ' + n + ' : colonne « écart »', Math.max(0, brut - 0.1), brut + 0.1, Number(m[4]));
    }
    v.vrai('quatre lignes de simulation', lignes === 4, lignes + ' lignes lues');
    v.ecrit(6, '0,23 point à n = 10');
    v.ecrit(6, '0,05 seulement à n = 60');
    fin(r, 'leçon 06 · anniversaires.js — colonnes « calcul » et « attendu » de la simulation', v);
  }

  {
    const v = V();
    /* Le seuil entier : le plus petit n dont la probabilité dépasse 50 %. */
    let seuil = 0;
    for (let n = 2; n <= 100; n++) { if (pCoincidence(n, 365) >= 0.5) { seuil = n; break; } }
    v.vrai('seuil entier du paradoxe des anniversaires', seuil === 23, 'recalculé ' + seuil);
    v.vrai('p(22) reste sous 50 %', pCoincidence(22, 365) < 0.5, 'recalculé ' + (pCoincidence(22, 365) * 100).toFixed(4) + ' %');
    v.ecrit(6, 'le seuil entier reste 23');
    v.ecrit(6, 'dans un groupe de 23 personnes');
    v.proche('99,4 % annoncés à 60 personnes', pCoincidence(60, 365) * 100, 99.4, 0.05);
    v.ecrit(6, '60 donnent 99,4 %');
    v.proche('proportion de l\'espace : 23/365', 23 / 365 * 100, 6.3, 0.5);
    v.ecrit(6, '6 % de l\'espace');
    fin(r, 'leçon 06 · anniversaires — le seuil de 23 personnes, cherché et non lu', v);
  }

  const col = nrm(L.sortie(6, 'collisions.txt'));
  const lignesCol = [];
  {
    const re = /^\s*(16|32|64|122|128|256)\s{2,}(.+)$/gm;
    let m;
    while ((m = re.exec(col))) {
      const cs = cellules(m[2]);
      lignesCol.push({ bits: Number(m[1]), valeurs: cs[0], seuilExact: cs[1], approche: cs[2] });
    }
  }

  {
    const v = V();
    v.vrai('six lignes de bits', lignesCol.length === 6, lignesCol.length + ' lignes lues');
    for (let i = 0; i < lignesCol.length; i++) {
      const l = lignesCol[i];
      const exact = puis(2, l.bits);
      const lu = nb(l.valeurs);
      if (lu === null) { v.manque('colonne « valeurs possibles » pour ' + l.bits + ' bits'); continue; }
      if (l.bits <= 16) {
        /* Seule la première ligne est écrite en entier : elle doit être exacte. */
        v.eq('2^' + l.bits + ' valeurs possibles', exact.toString(), String(lu));
      } else {
        /* Trois chiffres significatifs : on tolère une unité sur le dernier. */
        const attendu = Number(exact);
        v.proche('2^' + l.bits + ' valeurs possibles (3 chiffres significatifs)', attendu, lu, attendu * 5e-3);
      }
      /* La colonne « approché » est 1,1774 x racine(N) sur TOUTES les lignes :
         elle n'est affichée qu'à trois chiffres significatifs au-delà de 32 bits,
         donc on contrôle l'ordre de grandeur, jamais le dernier chiffre. */
      const approx = 1.177410023 * Math.sqrt(Number(exact));
      v.proche('colonne « approché » à ' + l.bits + ' bits', approx, nb(l.approche), approx * 5e-3);
      /* La colonne « seuil exact » ne doit annoncer un nombre QUE là où le
         programme peut vraiment le chercher un par un. Au-delà de 32 bits, il se
         compte en milliards de tirages : la page doit dire « hors portée », et
         surtout pas recopier l'approximation en la baptisant exacte — c'est très
         exactement le défaut trouvé sur ce tableau. */
      if (l.bits >= 64) {
        v.eq('seuil exact à ' + l.bits + ' bits : hors de portée d'+"'"+'une recherche', 'hors portée', String(l.seuilExact).trim());
      }
    }
    fin(r, 'leçon 06 · collisions.js — 2^b valeurs possibles et les seuils au-delà de 64 bits', v);
  }

  {
    const v = V();
    /* Ce tableau annonce « combien de valeurs tirées avant qu'une collision
       devienne plus probable qu'improbable » : c'est le seuil DISCRET exact,
       trouvé ici en comparant deux entiers, sans aucun flottant. */
    const ligne = lignesCol.filter(function (l) { return l.bits === 16; })[0];
    if (!ligne) v.manque('ligne « 16 bits » du tableau des seuils');
    else {
      const exact = seuilExactCollision(65536);
      const approx = 1.177410023 * Math.sqrt(65536);
      v.vrai('plus petit k tel que p(collision) ≥ 1/2 sur 2^16 valeurs', nb(ligne.seuilExact) === exact,
        'publié ' + nb(ligne.seuilExact) + ', recalculé ' + exact +
        ' — p(' + (exact - 1) + ') = ' + (pCoincidence(exact - 1, 65536) * 100).toFixed(4) + ' % (< 50 %), p(' + exact + ') = ' +
        (pCoincidence(exact, 65536) * 100).toFixed(4) + ' % ; approximation √(2 ln 2 · N) = ' + approx.toFixed(2) +
        ', dont la valeur publiée est la troncature');
    }
    fin(r, 'leçon 06 · collisions.js — seuil des 50 % sur 16 bits (recherche exacte en entiers)', v);
  }

  {
    const v = V();
    const ligne = lignesCol.filter(function (l) { return l.bits === 32; })[0];
    if (!ligne) v.manque('ligne « 32 bits » du tableau des seuils');
    else {
      const exact = seuilExactCollision(4294967296);
      v.vrai('plus petit k tel que p(collision) ≥ 1/2 sur 2^32 valeurs', nb(ligne.seuilExact) === exact,
        'publié ' + nb(ligne.seuilExact) + ', recalculé ' + exact +
        ' — p(' + (exact - 2) + ') = ' + (pCoincidence(exact - 2, 4294967296) * 100).toFixed(4) + ' % (< 50 %), p(' + exact + ') = ' +
        (pCoincidence(exact, 4294967296) * 100).toFixed(4) + ' % ; approximation √(2 ln 2 · N) = ' +
        (1.177410023 * 65536).toFixed(2) + ', dont la valeur publiée est la troncature');
    }
    /* L'arrondi « environ 77 000 » de la prose, lui, reste juste. */
    v.ecrit(6, '77 000');
    v.vrai('« environ 77 000 » est un arrondi acceptable',
      Math.abs(seuilExactCollision(4294967296) - 77000) < 500, 'recalculé ' + seuilExactCollision(4294967296));
    fin(r, 'leçon 06 · collisions.js — seuil des 50 % sur 32 bits (recherche exacte en entiers)', v);
  }

  {
    const v = V();
    const debut = col.indexOf('RISQUE POUR UN VOLUME DONNÉ');
    if (debut < 0) v.manque('section « RISQUE POUR UN VOLUME DONNÉ »');
    else {
      const section = col.slice(debut);
      const bitsCols = [32, 64, 122];
      const re = /^([\d. x^]+?)\s{2,}(.+)$/gm;
      let m, lignes = 0;
      while ((m = re.exec(section))) {
        const k = nb(m[1]);
        if (k === null || k < 1000) continue;
        const cs = cellules(m[2]);
        lignes++;
        for (let c = 0; c < bitsCols.length; c++) {
          const N = Math.pow(2, bitsCols[c]);
          const p = pCollisionApprox(k, N);
          const cellule = cs[c];
          const quoi = k.toExponential(2) + ' tirages sur ' + bitsCols[c] + ' bits';
          if (cellule === undefined) { v.manque('cellule ' + quoi); continue; }
          if (/quasi certaine/.test(cellule)) {
            v.vrai(quoi + ' : « quasi certaine »', p > 0.999, 'recalculé p = ' + p);
          } else if (/négligeable/.test(cellule)) {
            v.vrai(quoi + ' : « négligeable »', p < 1e-12, 'recalculé p = ' + p);
          } else if (/%/.test(cellule)) {
            const lu = nb(cellule.replace('%', ''));
            const dec = (String(lu).split('.')[1] || '').length;
            v.proche(quoi + ' : probabilité', p * 100, lu, 0.5 * Math.pow(10, -dec) + 1e-9);
          } else if (/^1 sur /.test(cellule)) {
            const lu = nb(cellule.replace('1 sur ', ''));
            v.proche(quoi + ' : cote « 1 sur … »', 1 / p, lu, (1 / p) * 5e-3);
          } else {
            v.manque('cellule ' + quoi + ' illisible : « ' + cellule + ' »');
          }
        }
      }
      v.vrai('cinq volumes', lignes === 5, lignes + ' lignes lues');
    }
    /* Deux chiffres repris dans la prose. */
    v.proche('« probable à 69 % » à 100 000 valeurs sur 32 bits', pCollisionApprox(1e5, Math.pow(2, 32)) * 100, 69, 0.5);
    v.proche('« 9,4 × 10^−32 » à 1 000 valeurs sur 122 bits', pCollisionApprox(1000, Math.pow(2, 122)) / 1e-32, 9.4, 0.05);
    v.ecrit(6, '4,29 milliards');
    v.vrai('un compteur de 32 bits tient jusqu\'à 4,29 milliards', Math.abs(Number(puis(2, 32)) / 1e9 - 4.29) < 0.005,
      'recalculé ' + Number(puis(2, 32)) / 1e9);
    fin(r, 'leçon 06 · collisions.js — le tableau des risques par volume', v);
  }

  const bay = nrm(L.sortie(6, 'bayes.txt'));
  {
    const v = V();
    const sections = [
      { titre: 'DÉTECTEUR TRÈS BON, PROBLÈME RARE', fin: 'MÊME DÉTECTEUR' },
      { titre: 'MÊME DÉTECTEUR, PROBLÈME FRÉQUENT', fin: 'Le détecteur est le MÊME' }
    ];
    for (let s = 0; s < sections.length; s++) {
      const d = bay.indexOf(sections[s].titre), f = bay.indexOf(sections[s].fin, d + 1);
      if (d < 0 || f < 0) { v.manque('section « ' + sections[s].titre + ' »'); continue; }
      const bloc = bay.slice(d, f);
      const pop = lireNb(bloc, /population\s+([\d ]+)/);
      const prev = lireNb(bloc, /cas réellement problématiques\s+[\d ]+\s+\(([\d.,]+) %\)/);
      const sens = lireNb(bloc, /sensibilité ([\d.,]+) %/);
      const fpr = lireNb(bloc, /faux positifs ([\d.,]+) %/);
      if (pop === null || prev === null || sens === null || fpr === null) { v.manque('hypothèses de « ' + sections[s].titre + ' »'); continue; }
      /* Tout se recompte sur la population : aucune probabilité conditionnelle. */
      const cas = Math.round(pop * prev / 100);
      const attrapes = Math.round(cas * sens / 100);
      const sains = pop - cas;
      const fausses = Math.round(sains * fpr / 100);
      const alertes = attrapes + fausses;
      v.eq(sections[s].titre + ' — cas problématiques', cas, lireNb(bloc, /cas réellement problématiques\s+([\d ]+)/));
      v.eq(sections[s].titre + ' — détectés', attrapes, lireNb(bloc, /le détecteur en attrape\s+([\d ]+)/));
      v.eq(sections[s].titre + ' — faux positifs', fausses, lireNb(bloc, /il crie aussi sur des cas sains\s+([\d ]+)/));
      v.eq(sections[s].titre + ' — alertes au total', alertes, lireNb(bloc, /ALERTES au total\s+([\d ]+)/));
      v.proche(sections[s].titre + ' — valeur prédictive positive', attrapes / alertes * 100,
        lireNb(bloc, /VRAI problème dans ([\d.,]+) %/), 0.05);
    }
    v.ecrit(6, 'passe de 9,0 % à 96,1 %');
    v.ecrit(6, 'Une alerte fondée dans 9 % des cas');
    fin(r, 'leçon 06 · bayes.js — les deux scénarios recomptés sur la population', v);
  }

  {
    const v = V();
    const parJour = lireNb(bay, /([\d ]+) requêtes surveillées par jour/);
    const incidents = lireNb(bay, /(\d+) incident réel par semaine/);
    v.eq('requêtes surveillées par jour', 10000, parJour);
    v.eq('incidents réels par semaine', 1, incidents);
    const parSemaine = parJour * 7;
    const re = /^([\d,]+) %\s+([\d,]+)\s+([\d,]+) %\s*$/gm;
    let m, lignes = 0;
    while ((m = re.exec(bay))) {
      lignes++;
      /* Le taux affiché est arrondi : on propage l'intervalle qu'il autorise
         plutôt que de le prendre pour exact (la dernière ligne vaut 1/70000). */
      const dec = (m[1].split(',')[1] || '').length;
      const demi = 0.5 * Math.pow(10, -dec);
      const tauxMin = (nb(m[1]) - demi) / 100, tauxMax = (nb(m[1]) + demi) / 100;
      const fMin = parSemaine * tauxMin, fMax = parSemaine * tauxMax;
      v.dans('taux ' + m[1] + ' % → fausses alertes par semaine', fMin - 0.05, fMax + 0.05, nb(m[2]));
      const jMin = incidents / (incidents + fMax) * 100, jMax = incidents / (incidents + fMin) * 100;
      v.dans('taux ' + m[1] + ' % → proportion d\'alertes justes', jMin - 0.05, jMax + 0.05, nb(m[3]));
    }
    v.vrai('cinq lignes de charge hebdomadaire', lignes === 5, lignes + ' lignes lues');
    /* « 1/70000 = 0,0014 % » et « 700 fois moins ». */
    const cible = lireNb(bay, /un taux de 1\/(\d+) =/);
    v.eq('dénominateur du taux cible', parSemaine, cible);
    v.proche('taux cible en pourcentage', 100 / parSemaine, lireNb(bay, /un taux de 1\/\d+ = ([\d,]+) %/), 0.00005);
    /* « 700 fois moins » : le rapport entre le taux de départ (1 %) et le taux
       cible (1/70000). */
    v.eq('facteur de réduction annoncé', 0.01 * parSemaine, lireNb(bay, /: (\d+) fois moins qu.au départ/));
    v.eq('fausses alertes à 1 % annoncées dans le commentaire', Math.round(parSemaine * 0.01), lireNb(bay, /l.équipe reçoit (\d+) fausses alertes/));
    v.ecrit(6, '0,0014 %');
    v.ecrit(6, '700 fois moins');
    fin(r, 'leçon 06 · bayes.js — les fausses alertes par semaine et le taux cible', v);
  }

  {
    const v = V();
    const s7 = L.sortie(6, 'solution-7.txt');
    const re = /^\s*(\d+) tirages -> collision probable à\s+([\d.,]+) %$/gm;
    let m, lignes = 0;
    while ((m = re.exec(nrm(s7)))) {
      lignes++;
      v.proche(m[1] + ' tirages sur 1 000 valeurs', pCoincidence(Number(m[1]), 1000) * 100, nb(m[2]), 0.05);
    }
    v.vrai('six lignes de tirages', lignes === 6, lignes + ' lignes lues');
    const seuil = seuilExactCollision(1000);
    v.eq('seuil des 50 % sur 1 000 valeurs', seuil, nb(nrm(s7).trim().split('\n').pop()));
    v.vrai('le seuil est bien le premier à dépasser 50 %',
      pCoincidence(seuil - 1, 1000) < 0.5 && pCoincidence(seuil, 1000) >= 0.5,
      'p(' + (seuil - 1) + ') = ' + pCoincidence(seuil - 1, 1000) + ', p(' + seuil + ') = ' + pCoincidence(seuil, 1000));
    v.ecrit(6, 'moins de 4 % de l\'espace');
    v.vrai('38 tirages sur 1 000 font moins de 4 % de l\'espace', seuil / 1000 < 0.04, 'recalculé ' + (seuil / 10) + ' %');
    fin(r, 'leçon 06 · solution-7 — le seuil des 50 % sur 1 000 valeurs', v);
  }

  {
    const v = V();
    const s8 = nrm(L.sortie(6, 'solution-8.txt'));
    const facteur = lireNb(s8, /approximation ([\d,]+) x racine/);
    v.proche('constante de l\'approximation annoncée', 1.177410023, facteur, 0.005);
    const re = /^\s*(\d+)\s+(\d+)\s+(\d+)\s*$/gm;
    let m, lignes = 0;
    while ((m = re.exec(s8))) {
      lignes++;
      const N = Number(m[1]);
      const exact = seuilExactCollision(N);
      v.eq('seuil cherché pour N = ' + N, exact, Number(m[2]));
      /* L'approximation publiée : ⌈1,1774 × √N⌉. On tolère l'unité d'arrondi. */
      const approx = 1.177410023 * Math.sqrt(N);
      v.dans('approximation pour N = ' + N, Math.floor(approx), Math.ceil(approx), Number(m[3]));
      v.vrai('l\'approximation colle à une unité près pour N = ' + N, Math.abs(exact - Number(m[3])) <= 1,
        'exact ' + exact + ', approximation publiée ' + m[3]);
    }
    v.vrai('cinq tailles d\'espace', lignes === 5, lignes + ' lignes lues');
    /* « Multiplier l'espace par 100 ne multiplie le seuil que par 10. » */
    const r1 = seuilExactCollision(1000000) / seuilExactCollision(10000);
    const r2 = seuilExactCollision(100000) / seuilExactCollision(1000);
    v.vrai('espace × 100 → seuil × 10 environ', Math.abs(r1 - 10) < 0.3 && Math.abs(r2 - 10) < 0.3,
      'rapports recalculés ' + r1.toFixed(3) + ' et ' + r2.toFixed(3));
    v.ecrit(6, 'Multiplier l\'espace par 100 ne multiplie le seuil que par 10');
    fin(r, 'leçon 06 · solution-8 — seuils exacts contre approximation 1,1774 × √N', v);
  }

  {
    const v = V();
    const s9 = nrm(L.sortie(6, 'solution-9.txt'));
    /* Données de l'énoncé, recopiées ici depuis la consigne ; la réponse est
       recomptée sur la population. */
    v.ecrit(6, 'Il attrape 95 % des fraudes et se trompe sur 0,5 % des messages honnêtes');
    v.ecrit(6, 'Les fraudes représentent 1 message sur 1 000');
    v.ecrit(6, 'Sur 200 000 messages');
    const messages = 200000, fraudes = messages / 1000;
    const detectees = Math.round(fraudes * 0.95);
    const honnetes = messages - fraudes;
    const faussesAlertes = Math.round(honnetes * 0.005);
    const alertes = detectees + faussesAlertes;
    v.eq('messages traités', messages, lireNb(s9, /messages traités\s+: ([\d ]+)/));
    v.eq('fraudes réelles', fraudes, lireNb(s9, /fraudes réelles\s+: ([\d ]+)/));
    v.eq('fraudes détectées', detectees, lireNb(s9, /fraudes détectées\s+: ([\d ]+)/));
    v.eq('fausses alertes', faussesAlertes, lireNb(s9, /fausses alertes\s+: ([\d ]+)/));
    v.eq('alertes au total', alertes, lireNb(s9, /alertes au total\s+: ([\d ]+)/));
    v.proche('proportion d\'alertes fondées', detectees / alertes * 100, lireNb(s9, /une alerte est fondée dans\s+([\d.,]+) %/), 0.05);
    v.proche('proportion d\'alertes infondées', faussesAlertes / alertes * 100, lireNb(s9, /il se trompe dans ([\d.,]+) %/), 0.05);
    v.eq('messages bloqués rappelés', alertes, lireNb(s9, /sur ([\d ]+) messages bloqués/));
    v.eq('messages légitimes bloqués', faussesAlertes, lireNb(s9, /messages bloqués, ([\d ]+) sont légitimes/));
    v.ecrit(6, '999 messages légitimes pour 190 fraudes réelles');
    fin(r, 'leçon 06 · solution-9 — le filtre antipourriel, recompté sur 200 000 messages', v);
  }

  return r;
}

module.exports = { titre: 'leçons 04-06 — ensembles, dénombrement, probabilités', controles: controles };
