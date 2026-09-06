/* « Conforming », concrètement.
   La section 8 de la spécification dit : un bloc est conforme si et seulement si
   chacune de ses questions satisfait chaque MUST. Elle ajoute qu'un bloc
   conforme PEUT violer n'importe quel SHOULD — il est alors valide, seulement
   moins bon. Voici ce que cette phrase veut dire quand on l'applique. */

/* Les MUST que l'on peut tester SUR LES DONNÉES d'une question, transcrits en
   fonctions. La spécification en porte davantage : ceux de la section 4 lient le
   BLOC (élément script, type, tableau JSON), ceux de la section 6 engagent le
   LECTEUR, et celui de la 5.1 (« markup intended to be rendered ») porte sur une
   intention, donc ne se teste pas. Ces six-là sont ceux qu'une question peut
   satisfaire ou violer d'elle-même. */
const MUST = [
  ['M1', 'q est une chaîne non vide',
    (x) => typeof x.q === 'string' && x.q.trim().length > 0],
  ['M2', 'a est un tableau d’au moins deux options',
    (x) => Array.isArray(x.a) && x.a.length >= 2],
  ['M3', 'chaque option est une chaîne non vide',
    (x) => Array.isArray(x.a) && x.a.every((o) => typeof o === 'string' && o.trim().length > 0)],
  ['M4', 'correct désigne une option existante',
    (x) => x.correct === undefined ||
      (Number.isInteger(x.correct) && x.correct >= 0 && x.correct < x.a.length)],
  ['M5', 'les options sont deux à deux distinctes',
    (x) => new Set(x.a.map((o) => String(o).trim())).size === x.a.length],
  ['M6', 'aucune option ne parle de sa position',
    (x) => !x.a.some((o) => /(r[ée]ponses?|propositions?|options?)\s+(ci-dessus|ci-dessous|pr[ée]c[ée]dentes?)/i.test(String(o)))],
];
const SHOULD = [
  ['S1', 'une explication accompagne la question',
    (x) => typeof x.explain === 'string' && x.explain.trim().length > 0],
  ['S2', 'la question propose quatre options',
    (x) => x.a.length === 4],
  /* Révisée le 2026-09-06, en même temps que la section 7 de la spécification : elle
     disait « la bonne réponse n’est pas strictement la plus longue », et la tenir
     sans exception descendait l’indice d’un rang au lieu de le supprimer (mesuré
     sur ce cours : 0 bonne réponse la plus longue, 39 sur 64 la DEUXIÈME plus
     longue). L’exemption sous 20 caractères vient de ce que la bande n’y admet
     souvent qu’une seule longueur entière — les options sont alors des jetons. */
  ['S3', 'aucun distracteur hors de la bande 70-130 % de la bonne réponse',
    (x) => {
      const L = x.a.map((o) => String(o).length);
      const bonne = L[x.correct || 0];
      if (!bonne) return false;
      if (bonne < 20) return true;
      return !L.some((n, i) => i !== (x.correct || 0) && (n < bonne * 0.7 || n > bonne * 1.3));
    }],
];

const CAS = [
  ['une question ordinaire', {
    q: 'Que rend Math.trunc(-1.5) ?', a: ['-1', '-2', '1', '2'], correct: 0,
    explain: 'Tronquer coupe vers zéro ; Math.floor, lui, rend -2.',
  }],
  ['sans « correct » — la section 5.3 l’autorise', {
    q: 'Combien de bornes une plage exclusive comprend-elle ?',
    a: ['Une', 'Deux', 'Aucune', 'Trois'],
    explain: 'La borne de début est comprise, celle de fin ne l’est pas.',
  }],
  ['deux options identiques', {
    q: 'Que veut dire deprecated ?', a: ['Déconseillé', 'Déconseillé', 'Retiré', 'Cassé'],
    correct: 0, explain: '…',
  }],
  ['« correct » hors des bornes', {
    q: 'Combien font 2 + 2 ?', a: ['4', '5'], correct: 7, explain: '…',
  }],
  ['une option qui parle de sa position', {
    q: 'Lesquelles de ces valeurs sont falsy ?',
    a: ['Toutes les réponses ci-dessus', '0', 'la chaîne vide', 'NaN'],
    correct: 0, explain: '…',
  }],
  ['conforme, mais sans explication et avec des options très inégales', {
    q: 'Qu’est-ce qu’un tri stable ?',
    a: ['Un tri qui conserve l’ordre d’arrivée des éléments de même clé, ce qui permet de trier deux fois de suite',
      'Un tri rapide', 'Un tri sûr', 'Un tri fixe'],
    correct: 0,
  }],
];

let conformes = 0;
for (const [nom, bloc] of CAS) {
  const echecsM = MUST.filter(([, , t]) => { try { return !t(bloc); } catch (e) { return true; } });
  const verdict = echecsM.length === 0 ? 'CONFORME' : 'NON CONFORME';
  if (!echecsM.length) conformes++;
  console.log(verdict.padEnd(14) + nom);
  if (echecsM.length) console.log('    MUST violés   : ' + echecsM.map(([id, l]) => id + ' (' + l + ')').join(', '));
  /* On n'évalue les SHOULD que si les MUST passent. Sinon on ment : sur un bloc
     dont « correct » vaut 7, L[7] est undefined et S3 se déclare violé alors que
     les deux options font un caractère. Un test qui déraille sur une donnée déjà
     invalide produit une fausse alerte — et une fausse alerte dans un encadré
     qui enseigne la rigueur coûte plus cher qu'un silence. */
  if (echecsM.length) {
    console.log('    SHOULD         : non évalués (le bloc est déjà non conforme)');
    continue;
  }
  const echecsS = SHOULD.filter(([, , t]) => { try { return !t(bloc); } catch (e) { return true; } });
  if (echecsS.length) console.log('    SHOULD ignorés : ' + echecsS.map(([id, l]) => id + ' (' + l + ')').join(', '));
}

console.log('');
console.log(conformes + ' blocs conformes sur ' + CAS.length + '.');
console.log('Le dernier viole deux SHOULD et reste conforme : c’est exactement');
console.log('ce que la section 8 annonce. Un MUST se corrige, un SHOULD se discute.');
