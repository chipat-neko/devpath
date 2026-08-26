'use strict';
/**
 * tools/prediction-exos.js — Les exercices « que produit ce code ? » (chantier V14, B7).
 *
 * POURQUOI CE SCRIPT EXISTE
 * -------------------------
 * 37 langages du site (6 978 blocs) ne seront jamais exécutables en `file://` : ni
 * moteur embarqué, ni interpréteur. On ne peut donc pas y corriger un exercice en
 * exécutant ce que l'apprenant écrit. Le format retenu en A5 est la PRÉDICTION —
 * « que vaut cette ligne ? » — avec une règle qui le rend honnête :
 *
 *   > On ne bâtit un exercice de prédiction que sur une sortie DÉJÀ AFFIRMÉE par la
 *   > leçon. Jamais on n'invente la sortie d'un code qu'on ne peut pas exécuter.
 *
 * Sans elle, écrire mille exercices de prédiction reviendrait à écrire mille
 * affirmations que rien ne vérifie — précisément ce qui a laissé passer cinq exemples
 * faux sous quatre vérificateurs verts.
 *
 * D'OÙ LE PRINCIPE : CE SCRIPT N'ÉCRIT AUCUNE VALEUR. Le code cité est EXTRAIT du bloc
 * de la leçon, et la réponse attendue est EXTRAITE du commentaire `# =>` de la ligne
 * visée. La table ci-dessous ne fait que DÉSIGNER une ligne et rédiger l'énoncé, les
 * indices et le lien. Trois contrôles bloquent avant écriture : la ligne visée doit
 * porter une annonce de sortie, la réponse attendue doit passer le champ (normExo
 * reproduit depuis `js/lecon.js`), et la réponse ne doit pas rester LISIBLE dans le
 * code cité — ce dernier a écarté 2 des 16 exercices envisagés.
 *
 *   node tools/prediction-exos.js          contrôle (n'écrit rien)
 *   node tools/prediction-exos.js --write  écrit
 *
 * IDEMPOTENT : une leçon qui porte déjà un exercice « Prédiction » est sautée.
 */
var fs = require('fs'), path = require('path');
var RACINE = path.resolve(__dirname, '..');
var DIR = path.join(RACINE, 'pages', 'ruby');
var ECRIRE = process.argv.indexOf('--write') !== -1;

/* lecon, bloc (motif identifiant le bloc), cible (motif de la ligne à masquer),
   quoi (ce qu'on demande, inséré dans le placeholder), hints, label du lien. */
var TABLE = [
  { lecon: '02', bloc: '"3a".to_i', cible: 'puts "3a".to_i', quoi: 'ce qu’affiche puts "3a".to_i',
    hints: ['to_i ne lève pas d’erreur : il lit ce qu’il peut.',
            'Il s’arrête au premier caractère non numérique.',
            'Un seul chiffre est lisible ici.'],
    label: 'Revoir « Les conversions »' },
  { lecon: '03', bloc: 'puts "b" if 0', cible: 'puts "b" if 0', quoi: 'ce qu’affiche puts "b" if 0',
    hints: ['En Ruby, seuls false et nil sont falsy.',
            'Zéro est un objet comme un autre.',
            'La condition est donc vraie : la ligne s’exécute.'],
    label: 'Revoir « Ce qui est vrai, ce qui est faux »' },
  { lecon: '04', bloc: 'langages[99]', cible: 'langages[99]', quoi: 'la valeur de langages[99]',
    hints: ['Le tableau n’a que cinq éléments.',
            'Ruby ne lève pas d’erreur pour un indice hors limites.',
            'Trois lettres, l’absence de valeur.'],
    label: 'Revoir « Accéder aux éléments »' },
  { lecon: '05', bloc: 'contact.delete(:metier)', cible: 'contact.delete(:metier)',
    quoi: 'la valeur que renvoie contact.delete(:metier)',
    hints: ['delete ne renvoie pas le hash, ni true.',
            'Il rend ce qu’il vient d’enlever.',
            'La clé :metier avait été modifiée juste avant.'],
    label: 'Revoir « Modifier un hash »' },
  { lecon: '06', bloc: 'addition_proc.call(1)', cible: 'addition_proc.call(1)',
    quoi: 'la valeur de addition_proc.call(1)',
    hints: ['Un Proc ne vérifie pas le nombre d’arguments.',
            'b vaut donc nil, et nil.to_i vaut 0.',
            'C’est là que le lambda, lui, lèverait une erreur.'],
    label: 'Revoir « Proc et lambda »' },
  { lecon: '07', bloc: 'take_while', cible: 'notes.take_while { |n| n >= 10 }',
    quoi: 'la valeur de notes.take_while { |n| n >= 10 }',
    hints: ['take_while n’est pas select : il ne filtre pas tout le tableau.',
            'Il prend tant que la condition tient, et s’arrête au premier échec.',
            'Le 16 vient après le 9 : il ne sera jamais atteint.'],
    label: 'Revoir « take, drop et leurs variantes »' },
  { lecon: '08', bloc: 'def prix_ttc', cible: 'prix_ttc(100)', quoi: 'la valeur de prix_ttc(100)',
    hints: ['La dernière expression évaluée est la valeur de retour.',
            'La TVA est un flottant : la multiplication l’est aussi.',
            'La réponse n’est donc pas un entier.'],
    label: 'Revoir « Le retour implicite »' },
  { lecon: '09', bloc: 'def ==(autre)', cible: 'a == b', quoi: 'la valeur de a == b',
    hints: ['Les deux comptes n’ont ni le même titulaire ni le même solde.',
            'Mais la classe redéfinit == : c’est elle qui décide.',
            'Elle ne compare qu’une seule chose, et les deux la partagent.'],
    label: 'Revoir « Redéfinir == »' },
  { lecon: '10', bloc: 'clamp(v32, v34)', cible: 'Version.new(3, 9).clamp(v32, v34).to_s',
    quoi: 'la valeur de Version.new(3, 9).clamp(v32, v34).to_s',
    hints: ['clamp ramène une valeur dans un intervalle.',
            '3.9 dépasse la borne haute.',
            'On obtient donc la borne, pas la valeur.'],
    label: 'Revoir « Comparable »' },
  { lecon: '11', bloc: 'inverse_mots', cible: '"le chat dort".inverse_mots',
    quoi: 'la valeur de "le chat dort".inverse_mots',
    hints: ['split sans argument découpe sur les espaces.',
            'reverse s’applique au tableau de mots, pas aux lettres.',
            'join recolle avec une espace.'],
    label: 'Revoir « Rouvrir une classe »' },
  { lecon: '12', bloc: 'e.backtrace.first', cible: 'puts e.class', quoi: 'ce qu’affiche puts e.class',
    hints: ['Integer("abc") ne renvoie pas nil : il lève.',
            'Ce n’est ni TypeError ni StandardError.',
            'L’argument est du bon type, mais sa valeur est invalide.'],
    label: 'Revoir « Inspecter l’exception »' },
  { lecon: '18', bloc: '"1 lapin, 2 lapins"', cible: '"1 lapin, 2 lapins".gsub(/lapins?/, "chat")',
    quoi: 'la valeur de "1 lapin, 2 lapins".gsub(/lapins?/, "chat")',
    hints: ['gsub remplace TOUTES les occurrences.',
            'Le motif /lapins?/ capte aussi bien le singulier que le pluriel.',
            'Le remplaçant, lui, ne s’accorde pas.'],
    label: 'Revoir « Remplacer avec gsub »' },
  { lecon: '19', bloc: '.to_json', cible: '{ ville: "Lyon", hab: 522_000 }.to_json',
    quoi: 'la valeur de { ville: "Lyon", hab: 522_000 }.to_json',
    hints: ['Les clés symboles deviennent des chaînes entre guillemets.',
            'Le tiret bas de 522_000 n’est qu’une aide à la lecture.',
            'JSON n’ajoute aucune espace.'],
    label: 'Revoir « Écrire du JSON »' },
  { lecon: '20', bloc: 'premier, *reste', cible: 'reste', quoi: 'la valeur de reste',
    hints: ['L’astérisque ramasse tout ce qui reste.',
            'Le résultat est un tableau, même s’il n’y avait qu’un élément.',
            'Le premier élément, lui, est parti dans premier.'],
    label: 'Revoir « La déstructuration »' },
  /* ÉCARTÉ — `lecon-21` : la seule sortie affirmée est `compteur # => 1000`, et 1000
     est écrit noir sur blanc dans le code du bloc (10 fils × 100 tours). Le contrôle
     « la réponse ne doit pas rester lisible » l'a signalé ; on ne force pas. */
];

var RE_BLOC = /<figure\b([^>]*)>\s*<pre><code class="language-ruby">([\s\S]*?)<\/code><\/pre>/gi;
function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
}
function enc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/* La valeur annoncée, débarrassée de la glose que la leçon met entre parenthèses :
   « nil       (hors limites : pas d'erreur !) » → « nil ». */
function valeurNette(s) {
  return String(s).trim().replace(/\s+\([^)]*\)\s*$/, '').trim();
}
/* normExo de js/lecon.js — le juge du site, reproduit pour vérifier ici même que la
   réponse attendue est bien acceptée par le champ. */
function normExo(s) {
  s = s == null ? '' : String(s);
  s = s.replace(/ /g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return s.trim().replace(/\s+/g, ' ').replace(/;+\s*$/, '').toLowerCase();
}
/* Graphies acceptées : la valeur telle que la leçon l'écrit, sans ses guillemets
   englobants, et sans les espaces après les virgules (normExo n'égalise QUE les
   suites d'espaces, il ne les supprime pas : « [18,15] » ≠ « [18, 15] »). */
function graphies(v) {
  var out = [], vus = {};
  function add(x) { x = String(x).trim(); if (x && !vus[normExo(x)]) { vus[normExo(x)] = 1; out.push(x); } }
  add(v);
  var sansG = v.replace(/^"([\s\S]*)"$/, '$1').replace(/^'([\s\S]*)'$/, '$1');
  add(sansG);
  add(v.replace(/,\s+/g, ','));
  add(sansG.replace(/,\s+/g, ','));
  add(v.replace(/:\s+/g, ':'));
  return out;
}

var rapport = [], fautes = [];

TABLE.forEach(function (t) {
  var f = path.join(DIR, 'lecon-' + t.lecon + '.html');
  var src = fs.readFileSync(f, 'utf8');
  /* Idempotence : relancer le script ne doit pas empiler un second exercice. */
  if (src.indexOf('exercise__level">Prédiction') >= 0) {
    rapport.push({ lecon: t.lecon, attendu: '(déjà posé)', accept: [], lignes: 0, num: 0 });
    return;
  }

  /* 1. le bloc, extrait — jamais retapé */
  var m, code = null;
  RE_BLOC.lastIndex = 0;
  while ((m = RE_BLOC.exec(src))) {
    var c = dec(m[2]);
    if (c.indexOf(t.bloc) >= 0) { code = c; break; }
  }
  if (code === null) { fautes.push('lecon-' + t.lecon + ' : bloc introuvable (' + t.bloc + ')'); return; }

  /* 2. la ligne visée et SA sortie annoncée */
  var lignes = code.split('\n');
  var iCible = -1;
  for (var i = 0; i < lignes.length; i++) {
    if (lignes[i].indexOf(t.cible) >= 0 && /#\s*=>/.test(lignes[i])) { iCible = i; break; }
  }
  if (iCible < 0) { fautes.push('lecon-' + t.lecon + ' : ligne visée sans « # => » (' + t.cible + ')'); return; }
  var attendu = valeurNette(lignes[iCible].replace(/^[\s\S]*?#\s*=>\s*/, ''));
  if (!attendu) { fautes.push('lecon-' + t.lecon + ' : sortie annoncée vide'); return; }

  /* 3. le code cité : toutes les annonces de sortie retirées, un « ? » sur la ligne visée */
  var cite = [];
  for (var j = 0; j < lignes.length; j++) {
    var l = lignes[j];
    if (/^\s*#\s*=>/.test(l)) continue;                 // ligne d'annonce seule : elle disparaît
    var nu = l.replace(/\s*#\s*=>[\s\S]*$/, '');
    if (j === iCible) cite.push(nu + '   # => ?');
    else cite.push(nu);
  }
  while (cite.length && !cite[cite.length - 1].trim()) cite.pop();
  var codeCite = cite.join('\n');

  /* 4. contrôle : la réponse attendue passe-t-elle le champ ? (moteur du site) */
  var accept = graphies(attendu);
  if (!accept.some(function (a) { return normExo(a) === normExo(attendu); })) {
    fautes.push('lecon-' + t.lecon + ' : la réponse attendue n\'est pas dans accept');
    return;
  }
  /* 5. contrôle : la réponse ne doit pas rester lisible dans le code cité */
  if (codeCite.indexOf(attendu) >= 0 && attendu.length > 2) {
    fautes.push('lecon-' + t.lecon + ' : la réponse « ' + attendu + ' » est encore visible dans le code cité');
    return;
  }

  var num = (src.match(/<div class="exercise">/g) || []).length + 1;
  var bloc =
    '<div class="exercise"><div class="exercise__head"><span class="exercise__num">Exercice ' + num +
    '</span><span class="exercise__level">Prédiction</span></div><p><strong>Sans exécuter le code</strong> : que vaut la ligne marquée <code>#&nbsp;=&gt;&nbsp;?</code> ?</p>' +
    '<figure class="code-block" data-file="prediction.rb"><pre><code class="language-ruby">' +
    enc(codeCite) + '</code></pre></figure>' +
    '<details><summary>Voir la réponse</summary><p>La ligne vaut <code>' + enc(attendu) +
    '</code>. Cette sortie est celle que la leçon annonce pour ce même code : elle n’a pas été recalculée ici.</p></details></div>';

  var entree = {
    type: 'text', accept: accept,
    placeholder: t.quoi + ' : …',
    hints: t.hints,
    link: { href: 'lecon-' + t.lecon + '.html', label: t.label }
  };

  rapport.push({ lecon: t.lecon, attendu: attendu, accept: accept, lignes: cite.length, num: num });

  if (!ECRIRE) return;

  /* insertion : le bloc juste après le dernier .exercise, l'entrée en fin de tableau */
  var dernier = src.lastIndexOf('<div class="exercise">');
  var fin = src.indexOf('</div>\n\n', dernier);
  var ancre = '</details></div>';
  var posFin = src.indexOf(ancre, dernier);
  if (posFin < 0) { fautes.push('lecon-' + t.lecon + ' : fin du dernier exercice introuvable'); return; }
  posFin += ancre.length;
  src = src.slice(0, posFin) + '\n' + bloc + src.slice(posFin);

  var mj = src.match(/(<script type="application\/json" data-exos>\s*)([\s\S]*?)(\s*<\/script>)/);
  if (!mj) { fautes.push('lecon-' + t.lecon + ' : tableau data-exos introuvable'); return; }
  var tab = JSON.parse(mj[2]);
  tab.push(entree);
  var json = '[\n' + tab.map(function (e) { return '  ' + JSON.stringify(e); }).join(',\n') + '\n]';
  src = src.replace(mj[0], mj[1] + json + mj[3]);

  fs.writeFileSync(f, src, 'utf8');
});

console.log('B7a — exercices de prédiction ruby');
rapport.forEach(function (r) {
  console.log('  lecon-' + r.lecon + '  exercice ' + r.num + '  ' + r.lignes + ' lignes citées  attendu = ' +
    JSON.stringify(r.attendu) + '  (' + r.accept.length + ' graphies)');
});
var neufs = rapport.filter(function (r) { return r.num; }).length;
console.log('  total : ' + rapport.length + ' exercice(s), dont ' + (rapport.length - neufs) +
  ' déjà en place' + (ECRIRE ? ' — ' + neufs + ' écrit(s)' : ' — contrôle seul'));
if (fautes.length) { console.log('\n  FAUTES :'); fautes.forEach(function (x) { console.log('   · ' + x); }); process.exit(1); }
