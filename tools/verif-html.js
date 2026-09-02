#!/usr/bin/env node
'use strict';

/**
 * tools/verif-html.js — Vérificateur HTML « type navigateur » des leçons.
 *
 * POURQUOI CE SCRIPT
 * ------------------
 * L'ancien vérificateur maison supprimait les blocs <pre> AVANT de compter les
 * balises. Il était donc structurellement aveugle à la seule famille de bugs qui
 * existe réellement sur ce site : un caractère « < » non échappé DANS un exemple
 * de code. Le navigateur, lui, ne « saute » pas le contenu d'un <pre> : il y crée
 * de vrais éléments, ce qui peut détruire la moitié d'une page.
 *
 * Ce script fait donc l'inverse : un parcours SÉQUENTIEL du fichier, à la manière
 * du tokeniseur HTML, qui maintient une pile des éléments ouverts et signale tout
 * élément (ou commentaire) créé alors que la pile contient déjà « pre » ou « code ».
 *
 * LES TROIS PIÈGES TRAITÉS EXPLICITEMENT
 * --------------------------------------
 *  1. Éléments à texte brut (script, style, textarea, title, xmp, iframe,
 *     noembed, noframes) : tout est du TEXTE jusqu'à leur balise fermante. Un
 *     <script> écrit dans un exemple avale la suite de la page jusqu'au premier
 *     </script> rencontré — souvent celui d'un autre bloc, des dizaines de lignes
 *     plus loin.
 *  2. La séquence « <! » qui n'est ni « <!-- », ni « <!DOCTYPE », ni « <![CDATA[ » :
 *     elle produit un « bogus comment », c'est-à-dire un commentaire qui avale le
 *     texte jusqu'au prochain « > ». C'est ce que déclenche un « (<!!) » en Clojure.
 *  3. <template> : son contenu part dans un fragment séparé et n'est jamais
 *     exécuté ni rendu. Un <template> non refermé dans un exemple emporte tous
 *     les <script> de fin de page — la page ne fait plus rien du tout.
 *
 * LA CONVENTION D'ÉCRITURE À RESPECTER (c'est la règle que ce script contrôle)
 * ---------------------------------------------------------------------------
 * Dans un bloc <pre><code>…</code></pre>, TOUT « < » doit être écrit « &lt; »,
 * y compris dans un commentaire de code, dans une chaîne de caractères, dans un
 * opérateur générique (List<T>) et dans une expression régulière (/</g).
 * Si l'exemple doit AFFICHER « &lt; », il faut écrire « &amp;lt; ».
 *
 * USAGE
 * -----
 *   node tools/verif-html.js                     analyse les pages de leçon
 *   node tools/verif-html.js --tous              analyse tous les .html du site
 *   node tools/verif-html.js --racine <dossier>  analyse un autre dossier (ex. une sauvegarde)
 *   node tools/verif-html.js --fichier <chemin>  analyse un seul fichier
 *   node tools/verif-html.js --json              sortie machine
 *   node tools/verif-html.js --tout-signaler     inclut les remarques mineures dans la liste
 *   node tools/verif-html.js --tolere-mineurs    ne rend 1 que sur un probleme GRAVE (ancien comportement)
 *   node tools/verif-html.js --dom [--dom-max N] seconde passe Chrome headless (lente, optionnelle)
 *
 * Code de sortie : 1 dès qu'un problème est détecté — GRAVE ou ATTENTION. Une remarque
 * ATTENTION signifie qu'un exemple de code affiché à l'apprenant a été altéré : c'est le
 * défaut même que ce chantier existe pour empêcher, pas un détail cosmétique.
 * Aucune dépendance : Node seul. La passe --dom est optionnelle et non bloquante.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

/* ------------------------------------------------------------------ */
/* Tables du tokeniseur                                                */
/* ------------------------------------------------------------------ */

// Contenu entièrement textuel jusqu'à la balise fermante correspondante.
const TEXTE_BRUT = new Set(['script', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'textarea', 'title']);

// Éléments sans contenu : ils ne s'empilent jamais.
const VIDES = new Set(['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'embed', 'frame', 'hr',
  'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

// Balise de fin facultative : leur fermeture implicite n'est pas une anomalie.
const FIN_FACULTATIVE = new Set(['p', 'li', 'dd', 'dt', 'td', 'th', 'tr', 'thead', 'tbody', 'tfoot',
  'option', 'optgroup', 'rt', 'rp', 'caption', 'colgroup', 'html', 'head', 'body']);

// Éléments de bloc : leur ouverture ferme implicitement un <p> ouvert.
const BLOCS = new Set(['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset',
  'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup',
  'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre', 'section', 'summary', 'table', 'ul', 'li', 'dd', 'dt']);

// Mise en forme volontaire ADMISE dans un <code> en ligne (hors <pre>) : le site
// écrit couramment <code>fit-content(<em>limite</em>)</code> pour montrer un
// paramètre à remplacer. Ce n'est pas une balise oubliée, c'est de la typographie.
const TYPO_EN_LIGNE = new Set(['em', 'strong', 'b', 'i', 'u', 'mark', 'small', 'span', 'abbr',
  'kbd', 'samp', 'var', 'sub', 'sup', 'a', 'br', 'wbr', 'del', 'ins', 's', 'q', 'time', 'dfn']);

// Éléments SVG/MathML qui acceptent la syntaxe auto-fermante « /> ».
const ETRANGERS = new Set(['svg', 'math']);

const ESPACES = new Set([' ', '\t', '\n', '\r', '\f']);

/* ------------------------------------------------------------------ */
/* Utilitaires de position                                             */
/* ------------------------------------------------------------------ */

function indexLignes(src) {
  const debuts = [0];
  for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) debuts.push(i + 1);
  return debuts;
}

function position(debuts, offset) {
  let bas = 0, haut = debuts.length - 1;
  while (bas < haut) {
    const mid = (bas + haut + 1) >> 1;
    if (debuts[mid] <= offset) bas = mid; else haut = mid - 1;
  }
  return { ligne: bas + 1, colonne: offset - debuts[bas] + 1 };
}

function extraitLigne(src, debuts, offset, max) {
  const p = position(debuts, offset);
  const debut = debuts[p.ligne - 1];
  let fin = src.indexOf('\n', debut);
  if (fin < 0) fin = src.length;
  let s = src.slice(debut, fin).replace(/\r$/, '').trim();
  if (s.length > (max || 140)) s = s.slice(0, (max || 140) - 1) + '…';
  return s;
}

/* ------------------------------------------------------------------ */
/* Lecture d'une balise                                                */
/* ------------------------------------------------------------------ */

function litNom(src, i) {
  let j = i;
  while (j < src.length) {
    const ch = src[j];
    if (ESPACES.has(ch) || ch === '/' || ch === '>') break;
    j++;
  }
  return [src.slice(i, j).toLowerCase(), j];
}

// Avance jusqu'au « > » qui termine la balise, en tenant compte des valeurs
// d'attribut entre guillemets (c'est ce qui explique qu'un </g, "&lt;") avale
// la ligne suivante : le « > » cherché est celui de la ligne d'après).
function finBalise(src, j) {
  let guillemet = null;
  while (j < src.length) {
    const ch = src[j];
    if (guillemet) { if (ch === guillemet) guillemet = null; j++; continue; }
    if (ch === '"' || ch === "'") { guillemet = ch; j++; continue; }
    if (ch === '>') return { fin: j + 1, autoFermante: src[j - 1] === '/', tronquee: false };
    j++;
  }
  return { fin: src.length, autoFermante: false, tronquee: true };
}

// Un « bogus comment » ne connaît NI attribut NI guillemet : il s'arrête au tout
// premier « > » rencontré. C'est pour cela qu'un « (<!!) » n'avale que quelques
// dizaines de caractères… mais souvent juste ce qu'il faut pour manger le
// « </code> » qui devait fermer le bloc.
function finBogus(src, j) {
  const p = src.indexOf('>', j);
  return p < 0 ? src.length : p + 1;
}

// Un avalage n'est GRAVE que s'il franchit la fin du bloc de code : dans ce cas
// la balise fermante du bloc disparaît et toute la suite de la page bascule
// dedans. Sinon, seul le texte de l'exemple est abîmé.
function franchitFinDeBloc(src, debut, fin) {
  return /<\/(pre|code)[\s>/]/i.test(src.slice(debut, fin));
}

// Recherche de la balise fermante d'un élément à texte brut, comme le fait le
// navigateur : « </nom » suivi d'un espace, d'un « / » ou d'un « > ».
function chercheFermetureBrute(src, depuis, nom) {
  const cible = '</' + nom;
  let i = depuis;
  for (;;) {
    const p = src.toLowerCase().indexOf(cible, i);
    if (p < 0) return -1;
    const suite = src[p + cible.length];
    if (suite === undefined || ESPACES.has(suite) || suite === '/' || suite === '>') return p;
    i = p + cible.length;
  }
}

/* ------------------------------------------------------------------ */
/* Analyse d'un fichier                                                */
/* ------------------------------------------------------------------ */

function analyse(src, fichier) {
  const debuts = indexLignes(src);
  const problemes = [];
  const pile = [];          // éléments ouverts
  const bas = src.toLowerCase();

  function signale(gravite, offset, code, message, extra) {
    const p = position(debuts, offset);
    problemes.push(Object.assign({
      fichier, gravite, code, message,
      ligne: p.ligne, colonne: p.colonne,
      extrait: extraitLigne(src, debuts, offset)
    }, extra || {}));
  }

  // Indice, dans la pile, du plus extérieur bloc de code ouvert (pre ou code).
  function indiceBlocCode() {
    for (let k = 0; k < pile.length; k++) if (pile[k].nom === 'pre' || pile[k].nom === 'code') return k;
    return -1;
  }

  // BOM : invisible mais casse la première règle CSS / le premier octet attendu.
  if (src.charCodeAt(0) === 0xFEFF) {
    signale('grave', 0, 'bom', 'BOM UTF-8 en tête de fichier');
  }

  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt < 0) break;
    const c = src[lt + 1];
    const dansCode = indiceBlocCode();

    /* ---- commentaire, doctype, bogus comment ---- */
    if (c === '!') {
      if (src.startsWith('--', lt + 2)) {
        const fin = src.indexOf('-->', lt + 4);
        if (fin < 0) {
          signale('grave', lt, 'commentaire-non-ferme',
            'Commentaire « <!-- » jamais refermé : tout le reste du fichier devient invisible');
          break;
        }
        if (dansCode >= 0) {
          const avale = fin + 3 - lt;
          signale('attention', lt, 'commentaire-dans-code',
            'Commentaire HTML réel créé dans un bloc de code : ces ' + avale +
            ' caractères de l\'exemple ne s\'affichent pas (écrire &lt;!-- …)');
        }
        i = fin + 3;
        continue;
      }
      if (/^doctype/i.test(src.substr(lt + 2, 7))) {
        i = finBalise(src, lt + 2).fin;
        continue;
      }
      // Tout le reste (« <! », « <![CDATA[ ») est un bogus comment.
      const fin = finBogus(src, lt + 2);
      const franchit = franchitFinDeBloc(src, lt, fin);
      signale(franchit ? 'grave' : 'attention', lt, 'bogus-comment',
        'Séquence « <' + '!' + ' » → commentaire parasite (bogus comment) : ' + (fin - lt) +
        ' caractères avalés jusqu\'au prochain « > »' +
        (dansCode >= 0 ? ', dans le bloc <' + pile[dansCode].nom + '> ouvert ligne ' + pile[dansCode].ligne : '') +
        (franchit ? ' — il emporte la balise fermante du bloc de code : la suite de la page y est absorbée' : '') +
        ' — écrire &lt;!');
      i = fin;
      continue;
    }

    /* ---- instruction de traitement : bogus comment aussi ---- */
    if (c === '?') {
      const fin = finBogus(src, lt + 2);
      const franchit = franchitFinDeBloc(src, lt, fin);
      signale(franchit ? 'grave' : 'attention', lt, 'bogus-comment',
        'Séquence « <? » → commentaire parasite (bogus comment) : ' + (fin - lt) + ' caractères avalés' +
        (franchit ? ' — il emporte la balise fermante du bloc de code' : ''));
      i = fin;
      continue;
    }

    /* ---- balise fermante ---- */
    if (c === '/') {
      const d = src[lt + 2];
      if (d === undefined) break;
      if (d === '>') { i = lt + 3; continue; }           // « </> » : ignoré par le navigateur
      if (!/[a-zA-Z]/.test(d)) {                          // « </ 3 » : bogus comment
        const fin = finBogus(src, lt + 2);
        const franchit = franchitFinDeBloc(src, lt, fin);
        signale(franchit ? 'grave' : 'attention', lt, 'bogus-comment',
          'Séquence « </ » suivie d\'un caractère non alphabétique → commentaire parasite : ' +
          (fin - lt) + ' caractères avalés' + (franchit ? ' — il emporte la fin du bloc de code' : ''));
        i = fin;
        continue;
      }
      const [nom, apresNom] = litNom(src, lt + 2);
      const r = finBalise(src, apresNom);
      i = r.fin;

      let k = -1;
      for (let n = pile.length - 1; n >= 0; n--) if (pile[n].nom === nom) { k = n; break; }
      if (k < 0) {
        signale(franchitFinDeBloc(src, lt, r.fin) ? 'grave' : 'attention', lt, 'fermante-orpheline',
          'Balise fermante </' + nom + '> sans ouverture correspondante' +
          (dansCode >= 0 ? ' (dans le bloc <' + pile[dansCode].nom + '> ouvert ligne ' + pile[dansCode].ligne + ')' : '') +
          ' : le navigateur l\'ignore et le texte « <' + '/' + nom + ' … > » (' + (r.fin - lt) + ' caractères) disparaît');
        continue;
      }
      // Tout ce qui est au-dessus est fermé implicitement.
      for (let n = pile.length - 1; n > k; n--) {
        const el = pile[n];
        if (el.dansCode) {
          el.probleme.message = '<' + el.nom + '> créé dans le bloc <' + el.blocNom + '> (ligne ' +
            el.blocLigne + ') et JAMAIS refermé dans ce bloc : le texte « <' + el.nom +
            '…> » disparaît de l\'exemple et un élément vide est inséré dans la page — écrire &lt;' + el.nom + '&gt;';
        } else if (!FIN_FACULTATIVE.has(el.nom)) {
          signale('attention', el.offset, 'non-ferme',
            '<' + el.nom + '> jamais refermé (fermé de force par </' + nom + '> ligne ' + position(debuts, lt).ligne + ')');
        }
        pile.pop();
      }
      pile.pop();
      continue;
    }

    /* ---- balise ouvrante ---- */
    if (/[a-zA-Z]/.test(c)) {
      const [nom, apresNom] = litNom(src, lt + 1);
      const r = finBalise(src, apresNom);
      if (r.tronquee) {
        signale('grave', lt, 'balise-tronquee', 'Balise <' + nom + '> jamais terminée (pas de « > » jusqu\'à la fin du fichier)');
        break;
      }
      i = r.fin;

      // Fermetures implicites usuelles, pour que la pile reste juste sans
      // implémenter tout l'algorithme d'insertion HTML.
      const sommet = () => (pile.length ? pile[pile.length - 1].nom : null);
      if (BLOCS.has(nom)) { while (sommet() === 'p') pile.pop(); }
      if (nom === 'li') { while (sommet() === 'li') pile.pop(); }
      if (nom === 'dt' || nom === 'dd') { while (sommet() === 'dt' || sommet() === 'dd') pile.pop(); }
      if (nom === 'option') { while (sommet() === 'option') pile.pop(); }
      if (nom === 'tr') { while (sommet() === 'td' || sommet() === 'th' || sommet() === 'tr') pile.pop(); }
      if (nom === 'td' || nom === 'th') { while (sommet() === 'td' || sommet() === 'th') pile.pop(); }

      const bloc = indiceBlocCode();
      const dansBloc = bloc >= 0;
      // Deux usages légitimes, et deux seulement :
      //  · le motif du site <pre><code class="language-…"> ;
      //  · la typographie d'un <code> en ligne (hors <pre>), cf. TYPO_EN_LIGNE.
      //  · la coloration pré-calculée <span class="token …"> de la page d'accueil.
      const legitime = dansBloc && (
        (nom === 'code' && bloc === pile.length - 1 && pile[bloc].nom === 'pre') ||
        (pile[bloc].nom === 'code' && TYPO_EN_LIGNE.has(nom)) ||
        (nom === 'span' && /\bclass="token[\s"]/.test(src.slice(lt, r.fin)))
      );

      let prob = null;
      if (dansBloc && !legitime) {
        const blocNom = pile[bloc].nom, blocLigne = pile[bloc].ligne;
        if (TEXTE_BRUT.has(nom)) {
          const f = chercheFermetureBrute(bas, r.fin, nom);
          const avale = (f < 0 ? src.length : f) - r.fin;
          const lFin = f < 0 ? debuts.length : position(debuts, f).ligne;
          signale('grave', lt, 'texte-brut-dans-code',
            '<' + nom + '> créé dans le bloc <' + blocNom + '> (ligne ' + blocLigne +
            ') : élément à TEXTE BRUT, il avale ' + avale + ' caractères jusqu\'' +
            (f < 0 ? 'à la fin du fichier' : 'au </' + nom + '> de la ligne ' + lFin) +
            ' — écrire &lt;' + nom + '&gt;');
        } else if (nom === 'template') {
          const f = bas.indexOf('</template', r.fin);
          signale('grave', lt, 'template-dans-code',
            '<template> créé dans le bloc <' + blocNom + '> (ligne ' + blocLigne + ')' +
            (f < 0 ? ' et jamais refermé : tout le reste de la page part dans un fragment inerte, les <script> de fin ne s\'exécutent plus'
                   : ' : son contenu part dans un fragment inerte') + ' — écrire &lt;template&gt;');
        } else {
          signale('attention', lt, 'element-dans-code',
            '<' + nom + '> créé dans le bloc <' + blocNom + '> (ligne ' + blocLigne +
            ') : le navigateur en fait un vrai élément, le texte « <' + nom + '…> » disparaît de l\'exemple — écrire &lt;' + nom + '&gt;');
          prob = problemes[problemes.length - 1];
        }
      }

      if (VIDES.has(nom)) continue;
      if (r.autoFermante && (ETRANGERS.has(nom) || pile.some(e => ETRANGERS.has(e.nom)))) continue;

      if (TEXTE_BRUT.has(nom)) {
        // Contenu textuel : on saute jusqu'à la fermeture, sans rien analyser.
        const f = chercheFermetureBrute(bas, r.fin, nom);
        if (f < 0) {
          if (!dansBloc) {
            signale('grave', lt, 'texte-brut-non-ferme',
              '<' + nom + '> jamais refermé : le reste du fichier (' + (src.length - r.fin) + ' caractères) est avalé comme du texte');
          }
          break;
        }
        i = finBalise(src, f + 2 + nom.length).fin;
        continue;
      }

      pile.push({
        nom, offset: lt, ligne: position(debuts, lt).ligne,
        dansCode: !!prob, probleme: prob,
        blocNom: dansBloc ? pile[bloc].nom : null,
        blocLigne: dansBloc ? pile[bloc].ligne : null
      });
      continue;
    }

    /* ---- « < » suivi d'autre chose : simple texte (a < b, i<<n…) ---- */
    i = lt + 1;
  }

  // Fin de fichier : ce qui reste ouvert.
  for (let n = pile.length - 1; n >= 0; n--) {
    const el = pile[n];
    if (el.dansCode) {
      el.probleme.gravite = 'grave';
      el.probleme.message = '<' + el.nom + '> créé dans le bloc <' + el.blocNom + '> (ligne ' + el.blocLigne +
        ') et jamais refermé jusqu\'à la FIN DU FICHIER : la structure de la page est cassée';
    } else if (!FIN_FACULTATIVE.has(el.nom)) {
      signale('attention', el.offset, 'non-ferme', '<' + el.nom + '> jamais refermé (fin de fichier atteinte)');
    }
  }

  problemes.sort((a, b) => a.ligne - b.ligne || a.colonne - b.colonne);

  // Quand un avalage GRAVE se produit, tout ce qui suit dans le fichier est vu
  // « dans un bloc de code » : c'est exact (c'est ce que voit le navigateur) mais
  // ce sont des CONSÉQUENCES, pas des causes. On les replie derrière une ligne de
  // synthèse pour que le rapport reste lisible et que la cause reste en tête.
  const CASCADE = new Set(['element-dans-code', 'non-ferme', 'fermante-orpheline', 'commentaire-dans-code', 'bogus-comment']);
  const premierGrave = problemes.find(p => p.gravite === 'grave' &&
    (p.code === 'texte-brut-dans-code' || p.code === 'template-dans-code' || p.code === 'bogus-comment'));
  if (premierGrave) {
    const gardes = [];
    let masques = 0;
    for (const p of problemes) {
      const apres = p.ligne > premierGrave.ligne || (p.ligne === premierGrave.ligne && p.colonne > premierGrave.colonne);
      if (apres && p.gravite !== 'grave' && CASCADE.has(p.code)) { masques++; continue; }
      gardes.push(p);
    }
    if (masques) {
      gardes.push({
        fichier, gravite: 'attention', code: 'cascade',
        message: masques + ' conséquence(s) en cascade après le problème de la ligne ' + premierGrave.ligne +
          ' (éléments de la page vus « dans le bloc de code ») : elles disparaîtront en corrigeant la cause',
        ligne: premierGrave.ligne, colonne: premierGrave.colonne, extrait: premierGrave.extrait
      });
    }
    return gardes;
  }
  return problemes;
}

/* ------------------------------------------------------------------ */
/* Comptages source (pour la passe DOM)                                */
/* ------------------------------------------------------------------ */

function comptages(src) {
  const n = (re) => (src.match(re) || []).length;
  return {
    h2: n(/<h2[\s>]/gi),
    figure: n(/<figure[\s>]/gi),
    exercise: n(/class="[^"]*\bexercise\b[^"]*"/gi)
  };
}

// Second témoin, indispensable : une page peut garder tous ses h2 et ses figures
// tout en étant morte, si un <template> non refermé a emporté les <script> de fin.
// On compare alors ce que la leçon DÉCLARE (data-quiz / data-exos) à ce que les
// moteurs ont réellement monté dans le DOM (.quiz / .exo-try).
function moteurs(src, dom) {
  const n = (t, re) => (t.match(re) || []).length;
  return {
    declare: n(src, /data-quiz(?![-\w])/g) + n(src, /data-exos(?![-\w])/g),
    monte: n(dom, /class="quiz"/g) + n(dom, /class="exo-try"/g)
  };
}

/* ------------------------------------------------------------------ */
/* Passe 2 (optionnelle) : Chrome headless --dump-dom                  */
/* ------------------------------------------------------------------ */

function trouveChrome() {
  const candidats = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const c of candidats) { try { if (fs.statSync(c).isFile()) return c; } catch (e) { /* suivant */ } }
  return null;
}

function passeDom(fichiers, max) {
  const chrome = trouveChrome();
  if (!chrome) {
    console.log('\nPasse DOM ignorée : ni Chrome ni Edge trouvé (elle est optionnelle).');
    return [];
  }
  const udd = path.join(os.tmpdir(), 'verif-html-udd');
  const liste = fichiers.slice(0, max);
  const ecarts = [];
  console.log('\n--- Passe 2 (optionnelle) : Chrome headless --dump-dom sur ' + liste.length + ' fichier(s) ---');
  for (const f of liste) {
    let dom = '';
    try {
      dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-first-run',
        '--no-default-browser-check', '--disable-extensions', '--user-data-dir=' + udd,
        '--virtual-time-budget=4000', '--dump-dom',
        'file:///' + f.replace(/\\/g, '/')],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'], timeout: 30000 });
    } catch (e) {
      console.log('  ?  ' + f + ' — Chrome a échoué (' + (e.code || e.message) + '), on continue');
      continue;
    }
    const texte = fs.readFileSync(f, 'utf8');
    const src = comptages(texte);
    const rendu = comptages(dom);
    const mot = moteurs(texte, dom);
    const perdus = ['h2', 'figure', 'exercise'].filter(k => rendu[k] < src[k]);
    const morte = mot.declare > 0 && mot.monte === 0;
    if (perdus.length || morte) {
      ecarts.push({ fichier: f, source: src, dom: rendu, perdus, moteurs: mot });
      console.log('  !! ' + f);
      for (const k of ['h2', 'figure', 'exercise']) {
        console.log('       ' + k.padEnd(9) + ' source ' + String(src[k]).padStart(3) + '  →  DOM ' +
          String(rendu[k]).padStart(3) + (rendu[k] < src[k] ? '   ⇦ PERTE' : ''));
      }
      if (morte) {
        console.log('       moteurs JS : ' + mot.declare + ' bloc(s) data-quiz/data-exos déclaré(s), 0 monté ' +
          'dans le DOM ⇦ les scripts de la page n\'ont pas tourné');
      }
    } else {
      console.log('  ok ' + f + '  (h2 ' + src.h2 + '/' + rendu.h2 + ', figure ' + src.figure + '/' + rendu.figure +
        ', exercice ' + src.exercise + '/' + rendu.exercise + ', moteurs ' + mot.declare + '/' + mot.monte + ')');
    }
  }
  return ecarts;
}

/* ------------------------------------------------------------------ */
/* Collecte des fichiers                                               */
/* ------------------------------------------------------------------ */

function listeHtml(dossier, sortie) {
  let entrees;
  try { entrees = fs.readdirSync(dossier, { withFileTypes: true }); } catch (e) { return sortie; }
  for (const e of entrees) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) listeHtml(p, sortie);
    else if (/\.html?$/i.test(e.name)) sortie.push(p);
  }
  return sortie;
}

/* ------------------------------------------------------------------ */
/* Programme principal                                                 */
/* ------------------------------------------------------------------ */

function main(argv) {
  const opt = {
    racine: path.resolve(__dirname, '..'),
    tous: false, json: false, toutSignaler: false, tolereMineurs: false, dom: false, domMax: 20, fichiers: []
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--tous') opt.tous = true;
    else if (a === '--json') opt.json = true;
    else if (a === '--tout-signaler') opt.toutSignaler = true;
    else if (a === '--tolere-mineurs') opt.tolereMineurs = true;
    else if (a === '--dom') opt.dom = true;
    else if (a === '--dom-max') opt.domMax = parseInt(argv[++i], 10) || 20;
    else if (a === '--racine') opt.racine = path.resolve(argv[++i]);
    else if (a === '--fichier') opt.fichiers.push(path.resolve(argv[++i]));
    else if (a === '--aide' || a === '-h' || a === '--help') {
      console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]);
      return 0;
    } else if (!a.startsWith('--')) opt.fichiers.push(path.resolve(a));
  }

  let fichiers = opt.fichiers;
  if (!fichiers.length) {
    const tout = listeHtml(path.join(opt.racine, 'pages'), []);
    fichiers = opt.tous
      ? listeHtml(opt.racine, []).filter(f => !/[\\/](tools|scratchpad|node_modules)[\\/]/i.test(f))
      : tout.filter(f => /lecon-\d+\.html$/i.test(path.basename(f)));
    fichiers.sort();
  }

  const t0 = Date.now();
  let problemes = [];
  let lus = 0;
  for (const f of fichiers) {
    let src;
    try { src = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
    lus++;
    problemes = problemes.concat(analyse(src, f));
  }
  const duree = (Date.now() - t0) / 1000;

  const graves = problemes.filter(p => p.gravite === 'grave');
  const mineurs = problemes.filter(p => p.gravite !== 'grave');
  const fichiersGraves = new Set(graves.map(p => p.fichier));
  const fichiersMineurs = new Set(mineurs.map(p => p.fichier));

  if (opt.json) {
    console.log(JSON.stringify({
      racine: opt.racine, fichiers: lus, secondes: duree,
      graves: graves.length, mineurs: mineurs.length, problemes
    }, null, 2));
  } else {
    const rel = (f) => path.relative(opt.racine, f) || f;
    console.log('Vérificateur HTML « type navigateur » — ' + lus + ' fichier(s) analysé(s) en ' +
      duree.toFixed(2) + ' s');
    console.log('Racine : ' + opt.racine);

    if (graves.length) {
      console.log('\n=== GRAVE — la page est cassée dans le navigateur (' + graves.length + ') ===');
      for (const p of graves) {
        console.log('\n  ' + rel(p.fichier) + ':' + p.ligne + ':' + p.colonne + '  [' + p.code + ']');
        console.log('    ' + p.message);
        console.log('    ligne : ' + p.extrait);
      }
    }
    if (mineurs.length) {
      console.log('\n=== ATTENTION — contenu d\'exemple altéré, structure de page intacte (' + mineurs.length + ') ===');
      const aAfficher = opt.toutSignaler ? mineurs : mineurs.slice(0, 40);
      for (const p of aAfficher) {
        console.log('  ' + rel(p.fichier) + ':' + p.ligne + ':' + p.colonne + '  [' + p.code + '] ' + p.message);
      }
      if (aAfficher.length < mineurs.length) {
        console.log('  … ' + (mineurs.length - aAfficher.length) + ' de plus (relancer avec --tout-signaler)');
      }
    }

    console.log('\n=== RÉSUMÉ ===');
    console.log('  fichiers analysés ........ ' + lus);
    console.log('  problèmes GRAVES ......... ' + graves.length + '  sur ' + fichiersGraves.size + ' fichier(s)');
    console.log('  remarques ATTENTION ...... ' + mineurs.length + '  sur ' + fichiersMineurs.size + ' fichier(s)');
    console.log('  durée .................... ' + duree.toFixed(2) + ' s');
    const parCode = {};
    for (const p of problemes) parCode[p.code] = (parCode[p.code] || 0) + 1;
    for (const k of Object.keys(parCode).sort((a, b) => parCode[b] - parCode[a])) {
      console.log('  · ' + k.padEnd(24, '.') + ' ' + parCode[k]);
    }
    if (!problemes.length) console.log('  Aucun problème détecté.');
    else {
      console.log('\nRappel de la convention : dans un bloc <pre><code>, tout « < » s\'écrit « &lt; »');
      console.log('(y compris dans un commentaire, une chaîne, un générique List<T> ou une regex /</g).');
      console.log('Pour AFFICHER « &lt; » dans l\'exemple, écrire « &amp;lt; ».');
    }
  }

  if (opt.dom) {
    const cibles = fichiersGraves.size ? Array.from(fichiersGraves) : fichiers;
    passeDom(cibles, opt.domMax);
  }

  /* ⚠️ UNE REMARQUE « ATTENTION » EST BLOQUANTE, ET ELLE NE L'A PAS TOUJOURS ÉTÉ.
     Jusqu'au 2026-09-02, ce script ne rendait 1 que sur un problème GRAVE : un <b>
     créé dans un bloc <pre><code> était affiché à l'écran, puis la chaîne repartait
     verte. Or c'est EXACTEMENT le défaut qui fonde le chantier V14 — un exemple que
     l'apprenant lit et qui ne dit pas ce que le code dit. « Structure de page intacte »
     ne veut pas dire « sans conséquence » : le texte avalé disparaît de l'exemple.
     Mesuré par tools/verif-chaine-mutations.js (mutation `source`), qui a trouvé cet
     angle mort en injectant la faute et en constatant un code de sortie 0.
     Le site en compte 0 le jour où cette ligne est écrite : rendre la remarque
     bloquante ne coûte donc rien et ferme le trou. --tolere-mineurs rétablit
     l'ancien comportement pour un diagnostic ponctuel. */
  if (opt.tolereMineurs) return graves.length ? 1 : 0;
  return graves.length + mineurs.length ? 1 : 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { analyse, comptages };
