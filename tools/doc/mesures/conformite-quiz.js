/* tools/doc/mesures/conformite-quiz.js — le corpus des QCM du site, confronté
   clause par clause à la spécification de tools/doc/reference/quiz-format.txt.

   POURQUOI : la leçon 03 enseigne à lire un document normatif. Le meilleur
   moyen de montrer à quoi sert un MUST est d'en écrire un, puis de compter ce
   qui le respecte. Le corpus est celui du site : tous les blocs data-quiz et
   data-quiz-bilan des leçons, le cours « doc » exclu (une leçon qui se mesure
   elle-même périme ses chiffres en étant publiée — leçon de D1).

   USAGE : node tools/doc/mesures/conformite-quiz.js [--details] [--clause=M3] */
'use strict';
const fs = require('fs');
const path = require('path');
const lib = require('./corpus-lib.js');

/* Le contrat RÉELLEMENT implémenté par buildQuiz() dans js/lecon.js :
     opts = item.a.map(...)                → « a » doit être un tableau
     i === (item.correct || 0)             → « correct » absent vaut 0
     opts = shuffle(opts)                  → L'ORDRE D'AFFICHAGE EST ALÉATOIRE
     escapeHTML(item.q), item.explain      → texte brut, explication facultative
   Chaque clause ci-dessous découle d'une de ces lignes. */
const CLAUSES = [
  { id: 'M1', niveau: 'MUST', libelle: 'q est une chaîne non vide',
    test: (x) => typeof x.q === 'string' && x.q.trim().length > 0 },
  { id: 'M2', niveau: 'MUST', libelle: 'a est un tableau d au moins deux options',
    test: (x) => Array.isArray(x.a) && x.a.length >= 2 },
  { id: 'M3', niveau: 'MUST', libelle: 'chaque option est une chaîne non vide',
    test: (x) => Array.isArray(x.a) && x.a.every((o) => typeof o === 'string' && o.trim().length > 0) },
  { id: 'M4', niveau: 'MUST', libelle: 'correct, s il est présent, désigne une option existante',
    test: (x) => x.correct === undefined ||
      (Number.isInteger(x.correct) && x.correct >= 0 && Array.isArray(x.a) && x.correct < x.a.length) },
  { id: 'M5', niveau: 'MUST', libelle: 'les options sont deux à deux distinctes',
    test: (x) => Array.isArray(x.a) && new Set(x.a.map((o) => String(o).trim())).size === x.a.length },
  /* Celle-ci est la seule qu'on ne devine pas en lisant les données : elle
     découle du shuffle(). Une option qui parle de sa position ment dès que
     l'ordre change — c'est-à-dire à chaque affichage. */
  /* ⚠ PREMIÈRE RÉDACTION DE CETTE CLAUSE : elle cherchait « aucune des deux »,
     « les deux premiers », « ci-dessus ». Elle a rendu 11 manquements — et les
     ONZE étaient faux : « aucune des deux ReLU », « les deux premiers éléments
     du tableau », « les trois premiers tours » parlent du SUJET de la question,
     pas des options. Une clause normative doit être testable SANS AMBIGUÏTÉ :
     celle-ci ne vise donc que les tournures qui désignent explicitement les
     réponses, ou leur place à l'écran. */
  { id: 'M6', niveau: 'MUST', libelle: 'aucune option ne fait référence à sa position d affichage',
    test: (x) => {
      if (!Array.isArray(x.a)) return false;
      /* deux motifs, et le second n'est PAS insensible à la casse — voir plus bas */
      const parPosition = /(r[ée]ponses?|propositions?|affirmations?|options?)\s+(ci-dessus|ci-dessous|pr[ée]c[ée]dentes?|suivantes?)|(ci-dessus|ci-dessous)[^.]{0,20}(r[ée]ponses?|propositions?|options?)/i;
      /* ⚠ TROISIÈME RÉDACTION. La deuxième cherchait « réponse [ABCD] » avec le
         drapeau i et un \b final : elle voyait une violation dans « filtre la
         réponse côté client » et dans « la réponse d'un fetch ». La cause est
         un piège d'expression régulière : en JavaScript, \b ne connaît que
         [A-Za-z0-9_], donc « ô » compte comme une frontière de mot et « réponse
         côté » ressemble à « réponse C ». Ici, la lettre doit être une vraie
         MAJUSCULE isolée, accents compris dans le refus. */
      /* ⚠ Variantes trouvées par relecture adversariale : espace insécable,
         pluriel, guillemets autour de la lettre. La casse de la LETTRE reste
         imposée — « réponse c » en minuscule est du français ordinaire. */
      const parLettre = /(?:R|r)[ée]ponses?[\s\u00a0]+[«"']?[ABCD][»"']?(?![A-Za-zÀ-ÿ0-9'’-])|(?:O|o)ptions?[\s\u00a0]+[«"']?[ABCD][»"']?(?![A-Za-zÀ-ÿ0-9'’-])/;
      /* ⚠ Ce motif doit voir « Aucune de ces réponses » et laisser passer
         « écarte toutes les réponses qui portent un code 401 » : la formule
         n'est une référence aux OPTIONS que si elle constitue l'option
         entière, ou si un marqueur de position la suit. */
      const parEnsemble = /^[\s\u00a0]*(toutes|aucune)[\s\u00a0]+(de[\s\u00a0]+)?(ces|les|ses)?[\s\u00a0]*(r[ée]ponses|propositions|options)[\s\u00a0]*[.!]?[\s\u00a0]*$|(toutes|aucune)[\s\u00a0]+(de[\s\u00a0]+)?(ces|les)[\s\u00a0]+(r[ée]ponses|propositions|options)[\s\u00a0]+(ci-dessus|ci-dessous|pr[ée]c[ée]dentes|suivantes)/i;
      if (x.a.some((o) => parEnsemble.test(String(o)))) return false;
      return !x.a.some((o) => parPosition.test(String(o)) || parLettre.test(String(o)));
    } },
  { id: 'S1', niveau: 'SHOULD', libelle: 'une explication accompagne la question',
    test: (x) => typeof x.explain === 'string' && x.explain.trim().length > 0 },
  { id: 'S2', niveau: 'SHOULD', libelle: 'la question propose quatre options',
    test: (x) => Array.isArray(x.a) && x.a.length === 4 },
  /* La clause née de la mesure de verif-contenu : sur ce site, la bonne réponse
     est la plus longue dans neuf cas sur dix. Une bonne réponse reconnaissable
     à sa forme n'évalue plus rien.
     ⚠️ RÉVISÉE le 2026-09-06 (B4). Elle disait « la bonne réponse n'est pas
     STRICTEMENT la plus longue », et le cours `doc` était écrit pour la tenir
     sans exception. Mesure : 0,0 % de ses 64 questions avaient la bonne réponse
     la plus longue — et 60,2 % l'avaient en DEUXIÈME position. La clause ne
     supprimait pas l'indice, elle le descendait d'un rang, là où aucun outil ne
     le cherchait. Une règle énoncée PAR QUESTION ne peut pas exprimer une
     propriété de POPULATION ; celle-ci le peut, et laisse le classement libre.
     Manquements SUR LE CORPUS DE CE FICHIER (le cours `doc` exclu) : 68,1 % avec
     l'ancienne formulation, 60,3 % avec celle-ci — le contraste que la leçon
     enseigne entre MUST et SHOULD tient.
     ⚠️ L'EXEMPTION est imposée par la mesure, pas par le confort : sous 20
     caractères, la bande 70-130 % n'admet souvent qu'UNE SEULE longueur entière
     (à 3 caractères : de 2,1 à 3,9), donc quatre options de longueur identique.
     Elle rendrait insatisfaisables 30 questions du site dont les options sont des
     JETONS DE CODE — `["any","unknown","object","never"]` demanderait d'inventer
     trois types TypeScript de trois lettres. Le B4 avait déjà acté cette exception
     par écrit ; elle est ici dans la règle. 415 questions (6,7 %) sont exemptées. */
  { id: 'S3', niveau: 'SHOULD NOT', libelle: 'aucun distracteur hors de la bande 70-130 % de la bonne réponse',
    test: (x) => {
      if (!Array.isArray(x.a) || x.a.length < 2) return false;
      const L = x.a.map((o) => String(o).length);
      const bonne = L[x.correct || 0];
      if (!bonne) return false;
      if (bonne < 20) return true;   /* jetons de code : voir ci-dessus */
      return !L.some((n, i) => i !== (x.correct || 0) && (n < bonne * 0.7 || n > bonne * 1.3));
    } },
  /* Un MAY ne peut pas être violé : la colonne « conformes » compte donc ici
     les questions qui EMPLOIENT la faculté, pas celles qui la respectent.
     L'outil qui sert à démontrer la différence entre les trois niveaux ne peut
     pas la nier dans sa propre sortie. */
  { id: 'A1', niveau: 'MAY', libelle: 'correct est omis — faculté EMPLOYÉE (un MAY ne se viole pas)',
    test: (x) => x.correct === undefined },
];

/* ⚠ La première version cherchait directement le motif canonique
   « <script type="application/json" data-quiz> ». Un bloc écrit autrement —
   attributs inversés, apostrophes simples, saut de ligne entre attributs — lui
   échappait EN SILENCE : le total aurait baissé sans qu'un message le dise,
   et la mesure se serait crue complète. On repère donc d'abord TOUT script
   portant un attribut data-quiz, puis on rejette explicitement ce qui ne suit
   pas la section 4. */
const TOUT_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;

function questions() {
  const out = [];
  const rejets = [];
  for (const f of lib.fichiersLecons()) {
    const html = fs.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    const rel = path.relative(lib.RACINE, f).split(path.sep).join('/');
    TOUT_SCRIPT.lastIndex = 0;
    for (const b of art[0].matchAll(TOUT_SCRIPT)) {
      const attrs = b[1];
      if (!/\bdata-quiz(-bilan)?\b/.test(attrs)) continue;
      if (!/type\s*=\s*["']application\/json["']/.test(attrs)) {
        rejets.push({ fichier: rel, pourquoi: 'type absent ou autre que application/json', attrs: attrs.trim() });
        continue;
      }
      let lot;
      try { lot = JSON.parse(b[2]); } catch (e) { out.push({ fichier: rel, invalide: e.message }); continue; }
      if (!Array.isArray(lot)) { out.push({ fichier: rel, invalide: 'le bloc n est pas un tableau' }); continue; }
      lot.forEach((q, i) => out.push({ fichier: rel, rang: i + 1, q }));
    }
  }
  out.rejets = rejets;
  return out;
}

function mesurer() {
  const toutes = questions();
  const valides = toutes.filter((e) => !e.invalide);
  const resultats = CLAUSES.map((c) => {
    const echecs = valides.filter((e) => {
      try { return !c.test(e.q); } catch (err) { return true; }
    });
    return {
      id: c.id, niveau: c.niveau, libelle: c.libelle,
      total: valides.length, conformes: valides.length - echecs.length,
      echecs: echecs.length,
      exemples: echecs.slice(0, 5).map((e) => e.fichier + ' #' + e.rang),
      liste: echecs,
    };
  });
  const cours = new Set(valides.map((e) => e.fichier.split('/')[1]));
  /* S4 est une clause de POPULATION : elle ne se teste pas sur une question,
     seulement sur un cours entier. C'est la leçon que la révision du 2026-09-06 a
     apprise à ses dépens — une clause par question (« la bonne réponse n'est pas la
     plus longue ») tenue sans exception ne supprime pas l'indice, elle le descend
     d'un rang. Elle est donc comptée à part, en cours et non en questions. */
  const rangs = {};
  for (const e of valides) {
    const c = e.fichier.split('/')[1];
    const L = e.q.a.map((o) => String(o).length);
    const bonne = L[e.q.correct || 0];
    const r = L.filter((n, i) => i !== (e.q.correct || 0) && n > bonne).length;
    (rangs[c] = rangs[c] || [0, 0, 0, 0])[Math.min(r, 3)]++;
  }
  const noms = Object.keys(rangs);
  const s4Conformes = noms.filter((c) => {
    const t = rangs[c].reduce((a, b) => a + b, 0);
    return Math.max.apply(null, rangs[c]) / t <= 0.40;
  });
  /* L'ANCIENNE CLAUSE S3, celle qui a été RETIRÉE le 2026-09-06 : « la bonne
     réponse ne doit pas être strictement la plus longue des quatre ». Elle est
     mesurée ici alors qu'elle n'est plus en vigueur, et pour une raison précise :
     la leçon 03 raconte pourquoi elle a été révisée, et elle le fait avec un
     chiffre — sur les questions qui la respectaient DÉJÀ, la bonne réponse tombe
     quand même au rang 1 bien plus d'une fois sur quatre. Ce chiffre était écrit
     À LA MAIN dans la page ; il y est resté juste, mais rien ne le tenait, et le
     corpus bouge à chaque passe du chantier B4. Il est désormais mesuré.
     « Respectaient déjà » = au moins une option STRICTEMENT plus longue que la
     bonne réponse. La nuance compte : admettre les ex æquo au sommet donnerait
     2 747 questions au lieu de 1 835 au relevé d'origine, et un autre taux. */
  let ancRespect = 0, ancRang1 = 0;
  for (const e of valides) {
    const ci = e.q.correct || 0;
    const L = e.q.a.map((o) => String(o).length);
    const plusLongues = L.filter((n, i) => i !== ci && n > L[ci]).length;
    if (plusLongues === 0) continue;
    ancRespect++;
    if (plusLongues === 1) ancRang1++;
  }
  return {
    questions: valides.length,
    blocsInvalides: toutes.filter((e) => e.invalide),
    rejets: toutes.rejets || [],
    cours: cours.size, clauses: resultats,
    s4: { cours: noms.length, conformes: s4Conformes.length,
          echecs: noms.length - s4Conformes.length, rangs: rangs },
    ancienneS3: { respectent: ancRespect, rang1: ancRang1 },
  };
}

module.exports = { mesurer, CLAUSES };

if (require.main === module) {
  const r = mesurer();
  console.log(r.questions + ' questions dans ' + r.cours + ' cours (le cours « doc » exclu).');
  if (r.blocsInvalides.length) console.log('BLOCS JSON INVALIDES : ' + r.blocsInvalides.length);
  if (r.rejets.length) {
    console.log('BLOCS PORTANT data-quiz MAIS REJETÉS : ' + r.rejets.length);
    for (const x of r.rejets.slice(0, 10)) console.log('  ' + x.fichier + ' — ' + x.pourquoi);
  } else {
    console.log('aucun bloc data-quiz rejeté : tous suivent la section 4.');
  }
  console.log('');
  console.log('clause  niveau   conformes / total    échecs   libellé');
  for (const c of r.clauses) {
    const pct = ((c.conformes / c.total) * 100).toFixed(1);
    console.log('  ' + c.id.padEnd(6) + c.niveau.padEnd(9) +
      (c.conformes + ' / ' + c.total).padStart(14) + '  ' + (pct + ' %').padStart(7) +
      (c.niveau === 'MAY' ? '       —' : String(c.echecs).padStart(8)) + '   ' + c.libelle);
  }
  const detail = process.argv.find((a) => a.startsWith('--clause='));
  if (detail) {
    const c = r.clauses.find((x) => x.id === detail.slice(9));
    console.log('\nÉchecs de ' + c.id + ' (' + c.echecs + ') :');
    for (const e of c.liste.slice(0, 40)) {
      console.log('  ' + e.fichier + ' #' + e.rang + '  ' + String(e.q.q).slice(0, 90));
      if (process.argv.includes('--details')) console.log('      ' + JSON.stringify(e.q.a));
    }
  }
}
