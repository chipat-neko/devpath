#!/usr/bin/env node
// Compteur de consommation de l'autonomie, sur 7 jours glissants.
//
// POURQUOI CE FICHIER. Le quota reel d'un abonnement Claude n'est PAS lisible depuis
// cette machine : mesure du 2026-08-26, les limites hebdomadaires passees sont tombees
// a 2 M, 7 M puis 9 M de jetons de sortie sur 7 jours, alors que la semaine en cours en
// comptait 21 M sans qu'aucune limite ne tombe. Le plafond n'est donc pas une constante,
// et tout seuil calcule ici est un BUDGET MAISON, pas une lecture du quota. On l'assume :
// ce compteur sert a brider une derive de depense, pas a predire la limite d'Anthropic.
//
//   node tools/conso-hebdo.js enregistrer <isoDebutPasse>   ajoute la passe au relev
//   node tools/conso-hebdo.js total                          somme des 7 derniers jours
//   node tools/conso-hebdo.js etat                           lecture lisible + budget
//
// Le releve est un CSV simple : .autonomie/conso.csv (date;sortie;cache)
// Le budget est un entier de jetons de SORTIE dans .autonomie/budget.txt (0 = desactive).

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const RACINE   = path.resolve(__dirname, '..');
const CSV      = path.join(RACINE, '.autonomie', 'conso.csv');
const BUDGET   = path.join(RACINE, '.autonomie', 'budget.txt');
const TRANSCRIPTS = [
  'C:/Users/chipat/.claude/projects/D--test-claude',
  'C:/Users/chipat/.claude/projects/d--test-claude',
];

function litBudget() {
  try {
    const v = parseInt(fs.readFileSync(BUDGET, 'utf8').replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(v) ? v : 0;
  } catch { return 0; }
}

// Somme des 7 derniers jours du releve.
function total() {
  let sortie = 0, cache = 0, lignes = 0;
  const limite = Date.now() - 7 * 86400000;
  try {
    for (const l of fs.readFileSync(CSV, 'utf8').split(/\r?\n/)) {
      const p = l.split(';');
      if (p.length < 3) continue;
      const t = Date.parse(p[0]);
      if (!Number.isFinite(t) || t < limite) continue;
      sortie += +p[1] || 0;
      cache  += +p[2] || 0;
      lignes++;
    }
  } catch {}
  return { sortie, cache, lignes };
}

// Mesure les transcripts ecrits depuis le debut de la passe. On ne parse PAS le JSON
// (les lignes font parfois des centaines de kilo-octets) : une regex sur la ligne suffit
// et coute mille fois moins cher.
async function mesureDepuis(iso) {
  const depuis = Date.parse(iso);
  if (!Number.isFinite(depuis)) throw new Error('date de debut illisible : ' + iso);
  const vus = new Set();
  let sortie = 0, cache = 0, fichiers = 0;
  for (const dir of TRANSCRIPTS) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.jsonl') || vus.has(f)) continue;
      const p = path.join(dir, f);
      let st; try { st = fs.statSync(p); } catch { continue; }
      if (st.mtimeMs < depuis) continue;
      vus.add(f);
      // NE COMPTER QUE L'AUTONOMIE. Sans ce filtre, une session interactive ouverte
      // pendant une passe serait imputee au budget de l'autonomie, qu'elle n'a pas
      // depensee. Le marqueur est la premiere phrase du prompt du wrapper.
      let estAutonomie = false;
      try {
        const tete = fs.readFileSync(p, 'utf8').slice(0, 400000);
        estAutonomie = tete.includes('Tu es lance AUTOMATIQUEMENT');
      } catch {}
      if (!estAutonomie) continue;
      fichiers++;
      const rl = readline.createInterface({ input: fs.createReadStream(p), crlfDelay: Infinity });
      for await (const l of rl) {
        if (l.length < 40 || !l.includes('output_tokens')) continue;
        const ts = /"timestamp":"([^"]+)"/.exec(l);
        if (!ts || Date.parse(ts[1]) < depuis) continue;
        const o  = /"output_tokens":(\d+)/.exec(l);
        const cr = /"cache_read_input_tokens":(\d+)/.exec(l);
        const cc = /"cache_creation_input_tokens":(\d+)/.exec(l);
        const i  = /"input_tokens":(\d+)/.exec(l);
        if (!o) continue;
        sortie += +o[1];
        cache  += (cr ? +cr[1] : 0) + (cc ? +cc[1] : 0) + (i ? +i[1] : 0);
      }
    }
  }
  return { sortie, cache, fichiers };
}

const k = n => n >= 1e9 ? (n / 1e9).toFixed(1) + ' G' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' M' : (n / 1e3).toFixed(0) + ' k';

(async () => {
  const cmd = process.argv[2];

  if (cmd === 'enregistrer') {
    const m = await mesureDepuis(process.argv[3]);
    fs.mkdirSync(path.dirname(CSV), { recursive: true });
    fs.appendFileSync(CSV, `${new Date().toISOString()};${m.sortie};${m.cache}\n`, 'utf8');
    const t = total();
    console.log(`passe : sortie ${m.sortie} cache ${m.cache} (${m.fichiers} transcrits) | 7 jours : sortie ${t.sortie}`);
    process.exit(0);
  }

  if (cmd === 'total') {           // sortie brute, pour le wrapper
    console.log(total().sortie);
    process.exit(0);
  }

  // etat : lecture humaine
  const t = total(), b = litBudget();
  console.log(`  7 jours glissants : sortie ${k(t.sortie)} | cache+entree ${k(t.cache)} | ${t.lignes} passes`);
  if (b > 0) {
    const pct = Math.round(t.sortie / b * 100);
    console.log(`  budget : ${k(b)} de sortie -> ${pct} % consomme${pct >= 100 ? '  [DEPASSE : l autonomie s arretera]' : ''}`);
  } else {
    console.log('  budget : aucun (.autonomie/budget.txt absent ou a 0) -> le verrou de budget est INACTIF');
  }
  process.exit(0);
})().catch(e => { console.error('conso-hebdo : ' + e.message); process.exit(1); });
