/* Mesure de PRÉSENCE des candidats du vocabulaire minimal.
   Question posée : « ce mot revient-il PARTOUT ? » — mesurée en nombre de cours
   distincts qui l'emploient, pas en occurrences : 400 occurrences dans un seul
   cours ne prouvent rien, 40 cours qui l'emploient une fois, si.

   Deux corpus séparés, parce qu'ils ne disent pas la même chose :
     • CODE  — les blocs <code> des leçons : le mot tel qu'il apparaît dans un
       identifiant, un mot-clé, un message. C'est ce que l'apprenant LIT.
     • PROSE — le texte français des leçons : le mot que le site emploie déjà
       en anglais faute de traduction. C'est ce qu'il ENTEND.

   Le cours « doc » est exclu par corpus-lib : une leçon qui se compte elle-même
   périme ses propres chiffres le jour de sa publication (leçon de D1).

   USAGE : node tools/doc/mesures/presence.js [--json] [--top=N]            */
'use strict';
const fs = require('fs'), path = require('path');
const lib = require('./corpus-lib.js');

/* Les candidats vivent dans le JSON du vocabulaire : la mesure ne choisit pas
   les mots, elle les classe. */
const MOTS = require(path.join(__dirname, '..', 'vocab', 'mots.json'));

/* Un candidat peut être une expression (« race condition ») : on cherche alors
   la suite de mots, séparateur libre (espace, tiret, souligné, casse chameau). */
function motif(terme) {
  /* « to escape » est l'entrée de dictionnaire ; dans un texte, le mot s'écrit
     « escape ». On cherche donc le verbe, pas la particule — sans quoi la moitié
     des entrées seraient déclarées absentes du corpus alors qu'elles y sont. */
  const nettoye = terme.toLowerCase().replace(/^to /, '');
  const parts = nettoye.split(/[ -]/);
  const sep = '[ _\\-]?';
  return new RegExp('(^|[^a-z])' + parts.join(sep) + '([^a-z]|$)', 'i');
}

function mesurer() {
  const etat = MOTS.map((m) => ({
    en: m.en,
    re: motif(m.en),
    coursCode: new Set(), coursProse: new Set(),
    leconsCode: 0, leconsProse: 0,
  }));

  let lecons = 0;
  for (const f of lib.fichiersLecons()) {
    const html = fs.readFileSync(f, 'utf8');
    const art = html.match(/<article class="prose"[\s\S]*?<\/article>/);
    if (!art) continue;
    lecons++;
    const cours = path.relative(lib.RACINE, f).split(path.sep)[1];
    /* le code d'un côté, tout le reste de l'autre. */
    const codes = [];
    const prose = art[0].replace(/<code[^>]*>([\s\S]*?)<\/code>/g, function (_, c) {
      codes.push(lib.texteDe(c));
      return ' ';
    });
    const txtCode = codes.join('\n');
    const txtProse = lib.texteDe(prose);
    for (const e of etat) {
      if (e.re.test(txtCode)) { e.coursCode.add(cours); e.leconsCode++; }
      if (e.re.test(txtProse)) { e.coursProse.add(cours); e.leconsProse++; }
    }
  }
  const cours = new Set();
  for (const f of lib.fichiersLecons()) cours.add(path.relative(lib.RACINE, f).split(path.sep)[1]);

  return {
    lecons, cours: cours.size,
    mots: etat.map((e) => ({
      en: e.en,
      coursCode: e.coursCode.size, coursProse: e.coursProse.size,
      cours: new Set([...e.coursCode, ...e.coursProse]).size,
      lecons: e.leconsCode + e.leconsProse,
      leconsCode: e.leconsCode, leconsProse: e.leconsProse,
    })),
  };
}

module.exports = { mesurer, motif };

if (require.main === module) {
  const r = mesurer();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 1));
  } else {
    const top = Number((process.argv.find((a) => a.startsWith('--top=')) || '--top=999').slice(6));
    const tri = r.mots.slice().sort((a, b) => b.cours - a.cours || b.lecons - a.lecons);
    console.log('corpus : ' + r.lecons + ' leçons, ' + r.cours + ' cours (le cours « doc » exclu)');
    console.log('rang  cours  dont code  dont prose  leçons  terme');
    tri.slice(0, top).forEach((m, i) => {
      console.log(String(i + 1).padStart(4) + String(m.cours).padStart(7) +
        String(m.coursCode).padStart(11) + String(m.coursProse).padStart(12) +
        String(m.lecons).padStart(8) + '  ' + m.en);
    });
    const absents = tri.filter((m) => m.cours === 0);
    console.log('\ncandidats absents du corpus : ' + absents.length +
      (absents.length ? ' — ' + absents.map((m) => m.en).join(', ') : ''));
  }
}
