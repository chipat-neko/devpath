/* tools/maths/verite/groupe-4.js — leçon 09, « Pourquoi 0.1 + 0.2 ne fait pas 0.3 ».
   =====================================================================================
   V15 · point F2.

   RÈGLE DU JEU. Rien ici ne vient du cours. Aucun programme de la leçon n'est lu,
   copié, adapté ni exécuté : la page ne sert qu'à fournir les chiffres PUBLIÉS, que
   l'on confronte à une valeur calculée d'abord, par un autre chemin.

   LE CHEMIN CHOISI. La leçon parle de flottants ; on ne fait donc confiance ni à
   l'affichage de JavaScript, ni même à ses opérateurs. Tout est refait en dessous :

     · les 64 bits sont décodés à la main (Float64Array + BigUint64Array), signe,
       exposant et mantisse séparés, la valeur reconstruite en BigInt sous la forme
       m × 2^e, puis en développement décimal EXACT (m × 5^k, virgule décalée) ;
     · les additions, soustractions et multiplications flottantes sont RÉ-ÉMULÉES :
       somme exacte des mantisses entières, puis arrondi au plus proche — pair en cas
       d'égalité — écrit ici. L'opérateur « + » du moteur n'est jamais l'arbitre ;
     · les conversions décimal → double (les littéraux « 0.015 », « 5e-324 », ce que
       fait JSON.parse) sont refaites en rationnels exacts n/d puis arrondies de la
       même façon. Un nombre publié est donc validé ainsi : la chaîne imprimée
       désigne-t-elle EXACTEMENT le double calculé de notre côté ?
     · les ULP se déduisent de l'exposant biaisé (2^(eb-1075)), jamais de EPSILON
       multiplié par quelque chose ;
     · les dénombrements (20 sur 100, 22 037 répartitions, 4 800 arrondis vers le bas,
       les 9 218 868 437 227 405 312 flottants positifs) sont refaits par énumération
       ou par arithmétique entière exacte, jamais par la formule du cours.

   CE QUI N'EST PAS VÉRIFIABLE AINSI est dit tel quel : les tirages à graine fixe du
   cours (Sterbenz, banc d'essai de l'exercice 3) ne se reproduisent pas sans recopier
   son générateur. On vérifie alors le LEMME lui-même, sur nos propres couples, et la
   cohérence arithmétique des totaux annoncés.
*/
'use strict';
const L = require('./lib.js');

/* ===================== 1. IEEE 754, décodé et ré-émulé à la main ================== */

const TAMPON = new ArrayBuffer(8);
const F64 = new Float64Array(TAMPON);
const U64 = new BigUint64Array(TAMPON);
const M52 = 0xfffffffffffffn, UN52 = 1n << 52n, UN53 = 1n << 53n;
const GROS = [];
for (let i = 0; i <= 2200; i++) GROS.push(BigInt(i));

function bits(x) { F64[0] = x; return U64[0]; }
function deBits(n) { U64[0] = n; return F64[0]; }

/* signe, exposant biaisé, mantisse entière : la valeur vaut ±m × 2^e, exactement. */
function decomp(x) {
  const n = bits(x);
  const neg = (n >> 63n) === 1n;
  const eb = Number((n >> 52n) & 0x7ffn);
  const f = n & M52;
  return { neg: neg, eb: eb, f: f, m: eb === 0 ? f : (UN52 | f), e: eb === 0 ? -1074 : eb - 1075 };
}

const P32 = 0x100000000n, P16 = 0x10000n, P8 = 0x100n;
function bitlen(x) {
  let n = 0;
  while (x >= P32) { x >>= 32n; n += 32; }
  if (x >= P16) { x >>= 16n; n += 16; }
  if (x >= P8) { x >>= 8n; n += 8; }
  let y = Number(x);
  while (y >= 1) { y = y >>> 1; n++; }
  return n;
}

/* mantisse normalisée et exposant -> le double correspondant, bit à bit. */
function assemble(q, e, neg) {
  let n;
  if (q < UN52) n = q;                       /* dénormalisé : exposant brut 0, e = -1074 */
  else n = (GROS[e + 1075] << 52n) | (q & M52);
  if (neg) n |= (1n << 63n);
  return deBits(n);
}

/* m × 2^e (m entier signé de taille quelconque) -> le double le plus proche,
   pair en cas d'égalité. C'est notre unique règle d'arrondi. */
function depuisMantisse(m, e) {
  if (m === 0n) return 0;
  let neg = false;
  if (m < 0n) { neg = true; m = -m; }
  const bl = bitlen(m);
  let k = bl - 53;
  if (e + k < -1074) k = -1074 - e;
  if (k > 0) {
    const sh = GROS[k];
    const reste = m & ((1n << sh) - 1n);
    let q = m >> sh;
    const moitie = 1n << (sh - 1n);
    if (reste > moitie || (reste === moitie && (q & 1n) === 1n)) q += 1n;
    e += k;
    if (q >= UN53) { q >>= 1n; e += 1; }
    m = q;
  } else if (k < 0) {
    let d = -k;
    const dispo = e + 1074;
    if (d > dispo) d = dispo;
    if (d > 0) { m <<= GROS[d]; e -= d; }
  }
  if (e > 971) return neg ? -Infinity : Infinity;
  return assemble(m, e, neg);
}

/* --- rationnels exacts : n/d en BigInt, pour tout ce qui n'est pas binaire --- */
function rNorm(n, d) { if (d < 0n) { n = -n; d = -d; } return { n: n, d: d }; }
function rDouble(x) {
  const c = decomp(x), m = c.neg ? -c.m : c.m;
  return c.e >= 0 ? { n: m << GROS[c.e], d: 1n } : { n: m, d: 1n << GROS[-c.e] };
}
function rChaine(s) {
  const m = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(String(s).trim());
  if (!m) throw new Error('nombre illisible : ' + s);
  const signe = m[1] === '-' ? -1n : 1n;
  const frac = m[3] || '', exp = m[4] ? parseInt(m[4], 10) : 0;
  let n = BigInt((m[2] || '0') + frac) * signe, d = 10n ** BigInt(frac.length);
  if (exp > 0) n *= 10n ** BigInt(exp); else if (exp < 0) d *= 10n ** BigInt(-exp);
  return rNorm(n, d);
}
function rPlus(a, b) { return rNorm(a.n * b.d + b.n * a.d, a.d * b.d); }
function rMoins(a, b) { return rNorm(a.n * b.d - b.n * a.d, a.d * b.d); }
function rFois(a, b) { return rNorm(a.n * b.n, a.d * b.d); }
function rDiv(a, b) { return rNorm(a.n * b.d, a.d * b.n); }
function rCmp(a, b) { const g = a.n * b.d - b.n * a.d; return g < 0n ? -1 : (g > 0n ? 1 : 0); }
function rAbs(a) { return { n: a.n < 0n ? -a.n : a.n, d: a.d }; }

/* rationnel exact -> double le plus proche : c'est ce que fait la lecture d'un
   littéral décimal, ou JSON.parse. On le refait plutôt que de l'invoquer. */
function rArrondi(r) {
  let n = r.n; const d = r.d;
  if (n === 0n) return 0;
  const neg = n < 0n; if (neg) n = -n;
  let s = 52 - (bitlen(n) - bitlen(d));
  let a, b, q;
  for (let i = 0; i < 8; i++) {
    if (s >= 0) { a = n << BigInt(s); b = d; } else { a = n; b = d << BigInt(-s); }
    q = a / b;
    if (q < UN52) { s++; continue; }
    if (q >= UN53) { s--; continue; }
    break;
  }
  let e = -s;
  if (e < -1074) { a = n << 1074n; b = d; q = a / b; e = -1074; }
  const deux = (a - q * b) * 2n;
  if (deux > b || (deux === b && (q & 1n) === 1n)) q += 1n;
  if (q >= UN53 && e > -1074) { q >>= 1n; e += 1; }
  if (e > 971) return neg ? -Infinity : Infinity;
  return assemble(q, e, neg);
}

/* les opérations, ré-émulées : arithmétique exacte sur les entiers, puis arrondi. */
function flPlus(a, b) {
  const A = decomp(a), B = decomp(b);
  const e = A.e < B.e ? A.e : B.e;
  const m = ((A.neg ? -A.m : A.m) << GROS[A.e - e]) + ((B.neg ? -B.m : B.m) << GROS[B.e - e]);
  if (m === 0n) return 0;
  return depuisMantisse(m, e);
}
function flMoins(a, b) { return flPlus(a, -b); }
function flFois(a, b) {
  const A = decomp(a), B = decomp(b);
  return depuisMantisse((A.neg ? -A.m : A.m) * (B.neg ? -B.m : B.m), A.e + B.e);
}
function flDiv(a, b) { return rArrondi(rDiv(rDouble(a), rDouble(b))); }
function flDec(s) { return rArrondi(rChaine(s)); }
function deuxPuiss(k) { return depuisMantisse(1n, k); }
function dixPuiss(k) { return rArrondi({ n: 10n ** BigInt(k), d: 1n }); }
function abs(x) { return x < 0 ? -x : x; }
function egal(a, b) { return bits(a) === bits(b); }
/* l'écart avec le flottant suivant, lu dans l'exposant et nulle part ailleurs */
function ulp(x) { const c = decomp(x); return deuxPuiss(c.eb === 0 ? -1074 : c.eb - 1075); }

/* développement décimal EXACT d'un double : m/2^k = m·5^k/10^k. */
function decExact(x) {
  const c = decomp(x), signe = c.neg ? '-' : '';
  if (c.e >= 0) return signe + (c.m << GROS[c.e]).toString();
  const k = -c.e;
  const num = (c.m * 5n ** BigInt(k)).toString().padStart(k + 1, '0');
  const ent = num.slice(0, num.length - k);
  let dec = num.slice(num.length - k).replace(/0+$/, '');
  if (dec === '') dec = '0';
  return signe + ent + '.' + dec;
}
function decimalesDe(x) { const s = decExact(x); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; }

/* toFixed(f) refait exactement : le n/10^f le plus proche, égalité vers le plus grand n. */
function fixeExact(x, f) {
  const r = rDouble(x), neg = r.n < 0n;
  const a = rFois(rAbs(r), { n: 10n ** BigInt(f), d: 1n });
  let N = a.n / a.d;
  const deux = (a.n - N * a.d) * 2n;
  if (neg) { if (deux > a.d) N += 1n; } else if (deux >= a.d) N += 1n;
  const s = N.toString().padStart(f + 1, '0');
  const res = f === 0 ? s : s.slice(0, s.length - f) + '.' + s.slice(s.length - f);
  return (neg && N !== 0n ? '-' : '') + res;
}

/* les p premiers chiffres significatifs, arrondis exactement (toPrecision). */
function chiffresSignif(x, p) {
  const r = rAbs(rDouble(x));
  const dx = decExact(abs(x)), pt = dx.indexOf('.');
  const entier = pt < 0 ? dx : dx.slice(0, pt);
  let exp;
  if (entier !== '0') exp = entier.length - 1;
  else { const frac = dx.slice(pt + 1); let z = 0; while (frac[z] === '0') z++; exp = -z - 1; }
  const k = p - 1 - exp;
  const ech = k >= 0 ? rFois(r, { n: 10n ** BigInt(k), d: 1n }) : rDiv(r, { n: 10n ** BigInt(-k), d: 1n });
  let N = ech.n / ech.d;
  if ((ech.n - N * ech.d) * 2n >= ech.d) N += 1n;
  let ch = N.toString();
  if (ch.length > p) { ch = ch.slice(0, p); exp += 1; }
  return { chiffres: ch, exp: exp, neg: x < 0 };
}
function precisionExacte(x, p) {
  const c = chiffresSignif(x, p);
  let out;
  if (c.exp >= 0) out = c.chiffres.slice(0, c.exp + 1) + (p > c.exp + 1 ? '.' + c.chiffres.slice(c.exp + 1) : '');
  else out = '0.' + '0'.repeat(-c.exp - 1) + c.chiffres;
  return (c.neg ? '-' : '') + out;
}
function expoExact(x, f) {                    /* équivalent exact de toExponential(f) */
  if (x === 0) return '0.' + '0'.repeat(f) + 'e+0';
  const c = chiffresSignif(x, f + 1);
  return (c.neg ? '-' : '') + c.chiffres[0] + (f > 0 ? '.' + c.chiffres.slice(1) : '') +
    'e' + (c.exp >= 0 ? '+' : '-') + abs(c.exp);
}
function pourcent(partie, total, decimales) {
  return fixeExact(rArrondi(rFois({ n: 100n, d: 1n }, { n: BigInt(partie), d: BigInt(total) })), decimales);
}

/* ===================== 2. lecture de ce que la page publie ======================= */

const PROSE = L.texte(9);
const D01 = flDec('0.1'), D02 = flDec('0.2'), D03 = flDec('0.3');
const EPSILON = deuxPuiss(-52);

function ligne(txt, re) { return re.exec(txt); }
function frac(x) { return L.frNombre(x); }
function nu(s) { return s.replace(/[\s\u00a0\u202f]/g, '').replace(',', '.'); }

/* --- les façons de confronter, et leurs messages d'échec --- */
function dit(e, quoi, calcule, publie) {
  if (publie === null || publie === undefined) { e.push('ligne introuvable : ' + quoi); return; }
  if (String(calcule) !== String(publie)) e.push(quoi + ' — recalculé « ' + calcule + ' », publié « ' + publie + ' »');
}
/* le décimal publié désigne-t-il EXACTEMENT le double recalculé ? */
function ditFl(e, quoi, calcule, publie) {
  if (publie === null || publie === undefined) { e.push('ligne introuvable : ' + quoi); return; }
  let v;
  try { v = flDec(nu(publie)); } catch (err) { e.push(quoi + ' — nombre publié illisible : « ' + publie + ' »'); return; }
  if (!egal(v, calcule)) e.push(quoi + ' — recalculé ' + String(calcule) + ', publié ' + publie);
}
/* un affichage arrondi : concorde-t-il à un demi-dernier-chiffre près ? */
function ditArrondi(e, quoi, calcule, mantisse, exposant) {
  if (mantisse === null || mantisse === undefined) { e.push('ligne introuvable : ' + quoi); return; }
  const dec = (mantisse.split(',')[1] || '').length;
  const p = rChaine(nu(mantisse) + 'e' + exposant);
  const tol = rChaine('5e' + (exposant - dec - 1));
  if (rCmp(rAbs(rMoins(rDouble(calcule), p)), tol) > 0) {
    e.push(quoi + ' — recalculé ' + String(calcule) + ', publié ' + mantisse + ' x 10^' + exposant);
  }
}
function proseNombre(e, quoi, re, calcule) {
  const m = ligne(PROSE, re);
  if (!m) { e.push('ligne introuvable dans la prose : ' + quoi); return; }
  const lu = m[1].trim();
  if (lu !== String(calcule)) e.push(quoi + ' — recalculé « ' + calcule + ' », prose « ' + lu + ' »');
}
function proseFl(e, quoi, re, calcule) {
  const m = ligne(PROSE, re);
  if (!m) { e.push('ligne introuvable dans la prose : ' + quoi); return; }
  ditFl(e, quoi, calcule, m[1]);
}
function proseDit(e, quoi, phrase) {
  if (PROSE.indexOf(phrase) < 0) e.push('affirmation absente de la prose : ' + quoi);
}
function fin(r, nom, e) { r.push({ nom: nom, ok: e.length === 0, detail: e.join(' ; ') }); }
function echappe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/* ============ 3. le calcul lourd, fait une fois pour toutes ============ */

let MEMO = null;
function accumulation() {
  if (MEMO) return MEMO;
  const jalons = {};
  let s = 0, somme = 0, comp = 0, premier = null;
  for (let i = 1; i <= 10000000; i++) {
    s = flPlus(s, D01);
    const y = flMoins(D01, comp);                 /* sommation de Kahan, même passe */
    const t = flPlus(somme, y);
    comp = flMoins(flMoins(t, somme), y);
    somme = t;
    if (premier === null && i <= 200 && !egal(s, flDiv(i, 10))) premier = { i: i, obtenu: s, juste: flDiv(i, 10) };
    if (i === 10 || i === 1000 || i === 10000 || i === 100000 || i === 10000000) {
      jalons[i] = { naive: s, kahan: somme };
    }
  }
  MEMO = { jalons: jalons, premier: premier };
  return MEMO;
}

/* ===================== 4. les contrôles ===================== */

function controles() {
  const r = [];
  let e, m;

  /* ---------------- bloc « valeur-exacte » ---------------- */
  const VE = L.sortie(9, 'valeur-exacte.txt');
  function fiche(nom) {
    const re = new RegExp('(?:^|\\n)' + echappe(nom) +
      ' {2}= {2}(\\d+) x 2\\^(-?\\d+)\\n\\s*valeur exacte : ([0-9.]+)\\n\\s*chiffres apres la virgule : (\\d+)');
    return re.exec(VE);
  }
  function verifieFiche(e, nom, x) {
    const f = fiche(nom);
    if (!f) { e.push('ligne introuvable : la fiche de ' + nom); return; }
    const c = decomp(x);
    dit(e, nom + ' · mantisse', c.m.toString(), f[1]);
    dit(e, nom + ' · exposant', String(c.e), f[2]);
    dit(e, nom + ' · développement exact', decExact(x), f[3]);
    dit(e, nom + ' · nombre de décimales', String(decimalesDe(x)), f[4]);
  }

  e = [];
  verifieFiche(e, '0.1', D01);
  fin(r, 'leçon 09 · 0,1 vaut 7 205 759 403 792 794 × 2^-56, et ses 55 décimales exactes', e);

  e = [];
  verifieFiche(e, '0.2', D02);
  verifieFiche(e, '0.3', D03);
  verifieFiche(e, '0.5', flDec('0.5'));
  verifieFiche(e, '0.25', flDec('0.25'));
  fin(r, 'leçon 09 · 0,2 · 0,3 · 0,5 · 0,25 : mantisse, exposant, valeur exacte, décimales', e);

  e = [];
  const somme12 = flPlus(D01, D02);
  m = ligne(VE, /0\.1 \+ 0\.2 exactement : ([0-9.]+)\n0\.3\s+exactement : ([0-9.]+)\negaux \? (\w+)/);
  if (!m) e.push('ligne introuvable : « 0.1 + 0.2 exactement »');
  else {
    dit(e, '0.1 + 0.2 exactement', decExact(somme12), m[1]);
    dit(e, '0.3 exactement', decExact(D03), m[2]);
    dit(e, 'egaux ?', String(egal(somme12, D03)), m[3]);
  }
  fin(r, 'leçon 09 · 0.1 + 0.2 exactement, 0.3 exactement, et leur inégalité', e);

  e = [];
  const ecart12 = flMoins(somme12, D03);
  m = ligne(VE, /ecart\s+: (\S+)\necart en nombre de flottants consecutifs : (\d+)/);
  if (!m) e.push('ligne introuvable : l’écart entre 0.1 + 0.2 et 0.3');
  else {
    ditFl(e, 'écart 0.1 + 0.2 - 0.3', ecart12, m[1]);
    dit(e, 'distance en flottants', String(Number(bits(somme12) - bits(D03))), m[2]);
  }
  const rang = -chiffresSignif(ecart12, 1).exp;
  const mots = { 15: 'quinzième', 16: 'seizième', 17: 'dix-septième', 18: 'dix-huitième' };
  proseNombre(e, 'rang de la première décimale non nulle de l’écart',
    /n'apparaît qu'à la (\S+) décimale/, mots[rang] || ('rang ' + rang));
  fin(r, 'leçon 09 · l’écart 5,55e-17, sa dix-septième décimale, un seul flottant d’intervalle', e);

  e = [];
  const justes = [];
  for (let i = 1; i <= 100; i++) if (i % 5 === 0) justes.push(i);   /* i/10 exact <=> 5 divise i */
  let desaccords = 0;
  for (let i = 1; i <= 100; i++) {                                  /* la règle, re-confrontée */
    const exact = rCmp(rDouble(flDiv(i, 10)), { n: BigInt(i), d: 10n }) === 0;
    if (exact !== (i % 5 === 0)) desaccords++;
  }
  m = ligne(VE, /parmi[^\n]*: (\d+) valeurs sur (\d+) sont exactes\n {2}([^\n]+)\n/);
  if (!m) e.push('ligne introuvable : « parmi 0.1, 0.2, … 10.0 »');
  else {
    dit(e, 'nombre de valeurs exactes', String(justes.length), m[1]);
    dit(e, 'taille de l’échantillon', '100', m[2]);
    const lus = m[3].trim().split(/\s+/);
    if (lus.length !== justes.length) {
      e.push('liste des valeurs exactes — recalculé ' + justes.length + ' valeurs, publié ' + lus.length);
    } else {
      for (let k = 0; k < lus.length; k++) ditFl(e, 'valeur exacte n°' + (k + 1), flDiv(justes[k], 10), lus[k]);
    }
  }
  m = ligne(VE, /regle confrontee aux 100 ecritures exactes : (\d+) desaccord/);
  dit(e, 'désaccords de la règle', String(desaccords), m ? m[1] : null);
  fin(r, 'leçon 09 · 20 valeurs exactes sur 100, la liste, et 0 désaccord avec la règle', e);

  e = [];
  proseNombre(e, '(0.1).toPrecision(20)', /toPrecision\(20\) lève le voile : ([0-9.]+)/, precisionExacte(D01, 20));
  proseNombre(e, 'valeur exacte de 0,1 dans le récapitulatif',
    /Elle contient (0,[0-9]+), soit/, decExact(D01).replace('.', ','));
  proseNombre(e, 'mantisse de 0,1 dans le récapitulatif',
    /soit ([\d ]+) × 2 − ?56/, frac(Number(decomp(D01).m)));
  proseNombre(e, 'nombre de décimales annoncé', /avec (\d+) chiffres après la virgule/, String(decimalesDe(D01)));
  proseNombre(e, 'nombre de décimales annoncé (introduction)',
    /la valeur exacte de 0,1 avec ses (\d+) décimales/, String(decimalesDe(D01)));
  fin(r, 'leçon 09 · prose : toPrecision(20), la valeur exacte et la mantisse de 0,1', e);

  /* ---------------- bloc « espacement » ---------------- */
  const ES = L.sortie(9, 'espacement.txt');

  e = [];
  const attendus = [0, flDec('1e-300'), D01, 1, 100, dixPuiss(6), dixPuiss(9),
    deuxPuiss(52), deuxPuiss(53), dixPuiss(15), dixPuiss(16), dixPuiss(20)];
  m = ligne(ES, /valeur\s+ecart avec le flottant suivant\n([\s\S]*?)\n\n/);
  if (!m) e.push('ligne introuvable : le tableau des écarts');
  else {
    const rangs = m[1].split('\n').filter(function (l) { return l.trim(); });
    if (rangs.length !== attendus.length) {
      e.push('tableau des écarts — recalculé ' + attendus.length + ' lignes, publié ' + rangs.length);
    } else {
      for (let k = 0; k < rangs.length; k++) {
        const cols = rangs[k].trim().split(/\s+/);
        ditFl(e, 'ligne ' + (k + 1) + ' · la valeur', attendus[k], cols[0]);
        ditFl(e, 'ligne ' + (k + 1) + ' · l’écart au flottant suivant', ulp(attendus[k]), cols[1]);
      }
    }
  }
  let doublements = 0, constants = 0;
  for (let k = -1021; k <= 1023; k++) if (egal(ulp(deuxPuiss(k)), flFois(ulp(deuxPuiss(k - 1)), 2))) doublements++;
  for (let k = -1074; k <= -1023; k++) if (egal(ulp(deuxPuiss(k)), deuxPuiss(-1074))) constants++;
  proseDit(e, 'le doublement à chaque puissance de 2', "Il double chaque fois qu'on franchit une puissance de 2");
  dit(e, 'binades normalisées où l’écart double (sur 2045)', '2045', String(doublements));
  dit(e, 'binades dénormalisées à écart constant (sur 52)', '52', String(constants));
  fin(r, 'leçon 09 · les 12 écarts du tableau, et le doublement à chaque puissance de 2', e);

  e = [];
  m = ligne(ES, /Number\.EPSILON = (\S+) /);
  ditFl(e, 'Number.EPSILON', EPSILON, m ? m[1] : null);
  m = ligne(ES, /ecart au voisinage de 1\s+: (\S+)/);
  ditFl(e, 'écart au voisinage de 1', ulp(1), m ? m[1] : null);
  const facteur = Math.pow(2, decomp(ulp(dixPuiss(6))).e - decomp(EPSILON).e);
  m = ligne(ES, /ecart au voisinage de 1000000\s+: (\S+)\s+soit (\d+) fois EPSILON/);
  if (!m) e.push('ligne introuvable : « ecart au voisinage de 1000000 »');
  else {
    ditFl(e, 'écart au voisinage d’un million', ulp(dixPuiss(6)), m[1]);
    dit(e, 'facteur par rapport à EPSILON', String(facteur), m[2]);
  }
  proseNombre(e, 'facteur annoncé dans la prose', /l'écart réel vaut ([\d ]+) fois cette valeur/, frac(facteur));
  proseNombre(e, 'facteur répété dans le récapitulatif', /l'écart réel est ([\d ]+) fois plus grand/, frac(facteur));
  fin(r, 'leçon 09 · Number.EPSILON vaut 2^-52, et l’écart au million vaut 524 288 fois plus', e);

  e = [];
  const p53 = deuxPuiss(53);
  m = ligne(ES, /2\^53\s+= (\d+)\n2\^53 \+ 1 = (\d+)\s+<- inchange\n2\^53 \+ 2 = (\d+)\s+<- la, ca bouge : l'ecart y vaut (\d+)/);
  if (!m) e.push('ligne introuvable : le bloc 2^53');
  else {
    dit(e, '2^53', (1n << 53n).toString(), m[1]);
    ditFl(e, '2^53 + 1 arrondi', flPlus(p53, 1), m[2]);
    ditFl(e, '2^53 + 2', flPlus(p53, 2), m[3]);
    ditFl(e, 'écart au voisinage de 2^53', ulp(p53), m[4]);
  }
  proseDit(e, '2**53 + 1 rend exactement 2**53', 'rend exactement 2**53');
  fin(r, 'leçon 09 · 2^53 + 1 retombe sur 2^53, 2^53 + 2 non, et l’écart y vaut 2', e);

  e = [];
  m = ligne(ES, /intervalle\s+nombre de flottants qu'il contient\n([\s\S]*?)\n\n/);
  if (!m) e.push('ligne introuvable : le tableau des intervalles');
  else {
    const rangs = m[1].split('\n').filter(function (l) { return l.trim(); });
    if (rangs.length !== 5) e.push('tableau des intervalles — 5 lignes attendues, publié ' + rangs.length);
    else for (let k = 0; k < rangs.length; k++) {
      const c = /^(\S+) a (\S+)\s+(\d+)$/.exec(rangs[k].trim());
      if (!c) { e.push('ligne d’intervalle illisible : « ' + rangs[k].trim() + ' »'); continue; }
      const compte = bits(flDec(c[2])) - bits(flDec(c[1]));
      dit(e, 'flottants de ' + c[1] + ' à ' + c[2], compte.toString(), c[3]);
    }
  }
  fin(r, 'leçon 09 · les cinq intervalles et le nombre de flottants qu’ils contiennent', e);

  e = [];
  const tousPositifs = bits(Infinity), sousUn = bits(1);
  m = ligne(ES, /flottants positifs finis au total : (\d+)\ndont sous 1\s+: (\d+)\s+soit ([\d.]+) %/);
  if (!m) e.push('ligne introuvable : le dénombrement des flottants positifs');
  else {
    dit(e, 'flottants positifs finis', tousPositifs.toString(), m[1]);
    dit(e, 'flottants sous 1', sousUn.toString(), m[2]);
    dit(e, 'part sous 1', pourcent(sousUn, tousPositifs, 2), m[3]);
  }
  proseNombre(e, 'part sous 1 (prose)', /Mesuré : ([\d,]+) % des flottants positifs/,
    pourcent(sousUn, tousPositifs, 2).replace('.', ','));
  fin(r, 'leçon 09 · 9 218 868 437 227 405 312 flottants positifs, dont 49,98 % sous 1', e);

  e = [];
  ditArrondi(e, 'écart au voisinage de 1 (prose)', ulp(1),
    (ligne(PROSE, /sont séparés de ([\d,]+) × 10 − ?16/) || [])[1], -16);
  ditArrondi(e, 'écart au voisinage d’un million (prose)', ulp(dixPuiss(6)),
    (ligne(PROSE, /au voisinage d'un million, de ([\d,]+) × 10 − ?10/) || [])[1], -10);
  proseNombre(e, 'écart au voisinage de 10^20', /au voisinage de 10 20 , de ([\d ]+) \./, frac(ulp(dixPuiss(20))));
  proseNombre(e, 'largeur du trou après 10^20',
    /il n'existe aucun flottant entre 10 20 et 10 20 \+ ([\d ]+) :/, frac(ulp(dixPuiss(20)) - 1));
  ditArrondi(e, 'seuil du domaine normalisé', deuxPuiss(-1022),
    (ligne(PROSE, /tout en bas, sous ([\d,]+) × 10 − ?308/) || [])[1], -308);
  fin(r, 'leçon 09 · prose : 2,2e-16 à 1, 1,16e-10 au million, 16 384 à 10^20, le trou de 16 383', e);

  /* ---------------- bloc « comparer » ---------------- */
  const CO = L.sortie(9, 'comparer.txt');
  const proche2 = function (a, b) { return rCmp(rDouble(abs(flMoins(a, b))), rDouble(EPSILON)) < 0; };
  const proche3 = function (a, b, tol) {
    if (egal(a, b)) return true;
    const d = abs(flMoins(a, b));
    const t = tol === undefined ? flDec('1e-9') : tol;
    return rCmp(rDouble(d), rDouble(flFois(t, Math.max(abs(a), abs(b))))) <= 0;
  };
  let dix01 = 0;
  for (let i = 0; i < 10; i++) dix01 = flPlus(dix01, D01);
  const CAS = [
    ['0.1 + 0.2   et 0.3', somme12, D03, true],
    ['1e9 + 0.1   et 1e9 + 0.2', flPlus(dixPuiss(9), D01), flPlus(dixPuiss(9), D02), true],
    ['1e16 + 1    et 1e16 + 2', flPlus(dixPuiss(16), 1), flPlus(dixPuiss(16), 2), true],
    ['1e-20       et 2e-20', flDec('1e-20'), flDec('2e-20'), false],
    ['0.1*3       et 0.3', flFois(D01, 3), D03, true],
    ['somme de 0.1 dix fois et 1', dix01, 1, true],
  ];
  function ligneCas(nom) {
    return new RegExp('^' + echappe(nom) +
      '\\s+(true|false)\\s+(true|false)\\s+(true|false)\\s+(true|false)\\s*$', 'm').exec(CO);
  }

  e = [];
  m = ligne(CO, /0\.1 \+ 0\.2 === 0\.3\s+: (\w+)/);
  dit(e, '0.1 + 0.2 === 0.3', String(egal(somme12, D03)), m ? m[1] : null);
  for (const c of CAS) {
    const l = ligneCas(c[0]);
    dit(e, 'colonne stricte · ' + c[0], String(egal(c[1], c[2])), l ? l[1] : null);
    dit(e, 'colonne attendu · ' + c[0], String(c[3]), l ? l[4] : null);
  }
  fin(r, 'leçon 09 · la colonne « stricte » des six comparaisons', e);

  e = [];
  for (const c of CAS) {
    const l = ligneCas(c[0]);
    dit(e, 'colonne epsilon · ' + c[0], String(proche2(c[1], c[2])), l ? l[2] : null);
    dit(e, 'colonne relative · ' + c[0], String(proche3(c[1], c[2])), l ? l[3] : null);
  }
  fin(r, 'leçon 09 · les colonnes « epsilon » et « relative » des six comparaisons', e);

  e = [];
  let ds = 0, de = 0, dr = 0;
  for (const c of CAS) {
    if (egal(c[1], c[2]) !== c[3]) ds++;
    if (proche2(c[1], c[2]) !== c[3]) de++;
    if (proche3(c[1], c[2]) !== c[3]) dr++;
  }
  m = ligne(CO, /desaccords avec la colonne .+ : stricte (\d+)\/(\d+), epsilon (\d+)\/\d+, relative (\d+)\/\d+/);
  if (!m) e.push('ligne introuvable : les décomptes de désaccords');
  else {
    dit(e, 'désaccords · stricte', String(ds), m[1]);
    dit(e, 'nombre de cas', String(CAS.length), m[2]);
    dit(e, 'désaccords · epsilon', String(de), m[3]);
    dit(e, 'désaccords · relative', String(dr), m[4]);
  }
  fin(r, 'leçon 09 · les décomptes 5/6, 3/6 et 0/6 face à la colonne « attendu »', e);

  e = [];
  for (const k of [0, 6, 12, 15, 16, 17]) {
    const base = dixPuiss(k);
    const a = flPlus(base, D01), b = flPlus(base, D02);
    const l = new RegExp('^10\\^' + k + '\\s+(\\S+)\\s+(\\S+)\\s+(true|false)\\s*$', 'm').exec(CO);
    if (!l) { e.push('ligne introuvable : l’échelle 10^' + k); continue; }
    ditFl(e, 'échelle 10^' + k + ' · écart calculé', abs(flMoins(a, b)), l[1]);
    ditFl(e, 'échelle 10^' + k + ' · écart entre deux voisins', ulp(base), l[2]);
    dit(e, 'échelle 10^' + k + ' · verdict de la règle 2', String(proche2(a, b)), l[3]);
  }
  fin(r, 'leçon 09 · le tableau des échelles : écart calculé, ULP et verdict (6 lignes)', e);

  e = [];
  const petitA = flDec('1e-20'), petitB = flDec('2e-20');
  m = ligne(CO, /regle 2, \|a-b\| < EPSILON\s+-> proches \? (\w+)/);
  dit(e, 'règle 2 sur 1e-20 et 2e-20', String(proche2(petitA, petitB)), m ? m[1] : null);
  m = ligne(CO, /regle 3, tolerance relative\s+-> proches \? (\w+)/);
  dit(e, 'règle 3 sur 1e-20 et 2e-20', String(proche3(petitA, petitB)), m ? m[1] : null);
  m = ligne(CO, /regle 3 avec une tolerance 0\.6 -> proches \? (\w+)/);
  dit(e, 'règle 3 avec une tolérance 0,6', String(proche3(petitA, petitB, flDec('0.6'))), m ? m[1] : null);
  let surprises = 0;
  for (let i = 0; i < 100000; i++) if (!egal(flMoins(flPlus(i, 1), 1), i)) surprises++;
  m = ligne(CO, /100000 entiers passes par .+ compares strictement : (\d+) surprise/);
  dit(e, 'surprises sur 100 000 entiers', String(surprises), m ? m[1] : null);
  fin(r, 'leçon 09 · 1e-20 contre 2e-20, et zéro surprise sur 100 000 entiers', e);

  /* ---------------- bloc « accumulation » ---------------- */
  const AC = L.sortie(9, 'accumulation.txt');
  const A = accumulation();

  e = [];
  m = ligne(AC, /0\.1 additionne 10 000 fois : (\S+)\nattendu\s+: (\S+)\necart\s+: (\S+)/);
  if (!m) e.push('ligne introuvable : « 0.1 additionne 10 000 fois »');
  else {
    ditFl(e, 'somme de 10 000 fois 0,1', A.jalons[10000].naive, m[1]);
    dit(e, 'valeur attendue', '1000', m[2]);
    ditFl(e, 'écart avec 1000', flMoins(A.jalons[10000].naive, 1000), m[3]);
  }
  m = ligne(AC, /premier decrochage a la (\d+)e addition :\n\s*cumul obtenu : (\S+)\n\s*valeur juste : (\S+)/);
  if (!m) e.push('ligne introuvable : « premier decrochage »');
  else {
    dit(e, 'rang du premier décrochage', String(A.premier.i), m[1]);
    ditFl(e, 'cumul obtenu au décrochage', A.premier.obtenu, m[2]);
    ditFl(e, 'valeur juste au décrochage', A.premier.juste, m[3]);
  }
  proseFl(e, 'somme annoncée dans la prose', /Additionner 0,1 dix mille fois donne ([\d,]+)/, A.jalons[10000].naive);
  fin(r, 'leçon 09 · 0,1 additionné 10 000 fois, et le premier décrochage à la 3e addition', e);

  e = [];
  for (const n of [10, 1000, 100000, 10000000]) {
    const l = new RegExp('^' + n + '\\s+(\\S+)\\s+(\\S+)\\s+(\\S+)\\s*$', 'm').exec(AC);
    if (!l) { e.push('ligne introuvable : le rang ' + n + ' du tableau des additions'); continue; }
    const juste = flDiv(n, 10), obtenue = A.jalons[n].naive, ec = flMoins(obtenue, juste);
    ditFl(e, n + ' additions · somme obtenue', obtenue, l[1]);
    ditFl(e, n + ' additions · écart absolu', ec, l[2]);
    dit(e, n + ' additions · écart relatif', expoExact(flDiv(ec, juste), 3), l[3]);
  }
  ditArrondi(e, 'erreur après mille additions (prose)', abs(flMoins(A.jalons[1000].naive, 100)),
    (ligne(PROSE, /l'erreur grandit : ([\d,]+) × 10 − ?12 après mille additions/) || [])[1], -12);
  ditArrondi(e, 'erreur après dix millions (prose)', abs(flMoins(A.jalons[10000000].naive, 1000000)),
    (ligne(PROSE, /après mille additions, ([\d,]+) × 10 − ?4 après dix millions/) || [])[1], -4);
  ditArrondi(e, 'erreur relative à 10 additions (prose)', abs(flDiv(flMoins(A.jalons[10].naive, 1), 1)),
    (ligne(PROSE, /elle passe tout de même de ([\d,]+) × 10 − ?16 à/) || [])[1], -16);
  ditArrondi(e, 'erreur relative à dix millions (prose)',
    abs(flDiv(flMoins(A.jalons[10000000].naive, 1000000), 1000000)),
    (ligne(PROSE, /× 10 − ?16 à ([\d,]+) × 10 − ?10 quand on va de 10 à 10 millions/) || [])[1], -10);
  fin(r, 'leçon 09 · le tableau des quatre tailles : somme, écart absolu, écart relatif', e);

  e = [];
  const a16 = dixPuiss(16);
  m = ligne(AC, /\(a \+ b\) \+ c : (\d+)\n\s*a \+ \(b \+ c\) : (\d+)\n\s*somme exacte : (\d+)/);
  if (!m) e.push('ligne introuvable : le bloc d’associativité');
  else {
    ditFl(e, '(a + b) + c', flPlus(flPlus(a16, 1), 1), m[1]);
    ditFl(e, 'a + (b + c)', flPlus(a16, flPlus(1, 1)), m[2]);
    dit(e, 'somme exacte de 10^16 + 1 + 1', (10n ** 16n + 2n).toString(), m[3]);
  }
  m = ligne(PROSE, /le premier parenthésage rend ([\d ]*\d) et le second ([\d ]*\d)/);
  if (!m) e.push('ligne introuvable dans la prose : les deux parenthésages');
  else {
    dit(e, 'prose · premier parenthésage', frac(flPlus(flPlus(a16, 1), 1)), m[1]);
    dit(e, 'prose · second parenthésage', frac(flPlus(a16, flPlus(1, 1))), m[2]);
  }
  fin(r, 'leçon 09 · l’addition n’est pas associative : 10^16, 1 et 1', e);

  e = [];
  const petit = flDec('1e-8'), grand = dixPuiss(8);
  let dansLOrdre = grand, empiles = 0;
  for (let i = 0; i < 1000000; i++) dansLOrdre = flPlus(dansLOrdre, petit);
  for (let i = 0; i < 1000000; i++) empiles = flPlus(empiles, petit);
  const trie = flPlus(empiles, grand);
  m = ligne(AC, /somme dans l'ordre du tableau : (\S+)\n\s*somme du plus petit au plus grand : (\S+)\n\s*valeur mathematique : (\S+)/);
  if (!m) e.push('ligne introuvable : le bloc « 1e8 suivi d’un million de 1e-8 »');
  else {
    ditFl(e, 'somme dans l’ordre du tableau', dansLOrdre, m[1]);
    ditFl(e, 'somme du plus petit au plus grand', trie, m[2]);
    ditFl(e, 'valeur mathématique', flPlus(grand, flFois(dixPuiss(6), petit)), m[3]);
  }
  m = ligne(PROSE, /donne ([\d.]+) dans l'ordre du tableau, et ([\d.]+) en triant/);
  if (!m) e.push('ligne introuvable dans la prose : les deux totaux');
  else {
    ditFl(e, 'prose · total dans l’ordre', dansLOrdre, m[1]);
    ditFl(e, 'prose · total trié', trie, m[2]);
  }
  fin(r, 'leçon 09 · 10^8 puis un million de 10^-8 : l’ordre change le total', e);

  e = [];
  m = ligne(AC, /somme naive de 10 000 x 0\.1\s+: (\S+)\nsomme de Kahan\s+: (\S+)\nexacte \? (\w+)/);
  if (!m) e.push('ligne introuvable : le bloc Kahan');
  else {
    ditFl(e, 'somme naïve de 10 000 × 0,1', A.jalons[10000].naive, m[1]);
    ditFl(e, 'somme de Kahan', A.jalons[10000].kahan, m[2]);
    dit(e, 'Kahan exacte ?', String(egal(A.jalons[10000].kahan, 1000)), m[3]);
  }
  for (const n of [1000, 100000, 10000000]) {
    const l = new RegExp('^' + n + '\\s+(\\S+)\\s+(\\S+)\\s*$', 'm').exec(AC);
    if (!l) { e.push('ligne introuvable : le rang ' + n + ' du tableau Kahan'); continue; }
    const juste = flDiv(n, 10);
    ditFl(e, n + ' · naïve moins exact', flMoins(A.jalons[n].naive, juste), l[1]);
    ditFl(e, n + ' · Kahan moins exact', flMoins(A.jalons[n].kahan, juste), l[2]);
  }
  fin(r, 'leçon 09 · Kahan : 1000 exact, et écart nul aux trois tailles', e);

  e = [];
  /* Le tirage du cours n'est pas reproductible sans recopier son générateur : on
     éprouve le LEMME sur nos propres couples (Lehmer), et on vérifie que les totaux
     publiés sont arithmétiquement cohérents. */
  let g = 12345, dans = 0, exactes = 0;
  const tire = function () { g = (g * 48271) % 2147483647; return g / 2147483647; };
  for (let i = 0; i < 20000; i++) {
    const x = flPlus(flFois(tire(), 1000), flDec('0.001'));
    const y = flPlus(flFois(tire(), 1000), flDec('0.001'));
    if (y / 2 <= x && x <= 2 * y) {
      dans++;
      if (rCmp(rDouble(flMoins(x, y)), rMoins(rDouble(x), rDouble(y))) === 0) exactes++;
    }
  }
  if (dans === 0) e.push('aucun couple dans l’intervalle de Sterbenz : contrôle vide');
  dit(e, 'soustractions exactes parmi mes couples de Sterbenz', String(dans), String(exactes));
  m = ligne(AC, /couples dans cet intervalle : (\d+), soustractions exactes : (\d+)\n\s*couples hors intervalle\s+: (\d+), dont inexactes : (\d+)/);
  if (!m) e.push('ligne introuvable : le bloc Sterbenz');
  else {
    dit(e, 'bloc · exactes = couples dans l’intervalle', m[1], m[2]);
    dit(e, 'bloc · total des couples', '20000', String(Number(m[1]) + Number(m[3])));
    if (Number(m[4]) > Number(m[3])) {
      e.push('inexactes hors intervalle (' + m[4] + ') > couples hors intervalle (' + m[3] + ')');
    }
  }
  m = ligne(PROSE, /le vérifie sur ([\d ]+) couples tirés à graine fixe, ([\d ]+) sur ([\d ]+) tombant/);
  if (!m) e.push('ligne introuvable dans la prose : les couples de Sterbenz');
  else {
    dit(e, 'prose · nombre de couples', frac(20000), m[1]);
    dit(e, 'prose · exactes = couples dans l’intervalle', m[2], m[3]);
  }
  fin(r, 'leçon 09 · lemme de Sterbenz : éprouvé sur 20 000 couples à nous, totaux du bloc cohérents', e);

  e = [];
  const compense = function (s, y) { const t = flPlus(s, y); return flMoins(flMoins(t, s), y); };
  m = ligne(AC, /somme = 1e16, y = 1\s+-> compensation (\S+)\s+\(le 1 perdu est retrouve\)\n\s*somme = 1,\s+y = 1e16 -> compensation (\S+)/);
  if (!m) e.push('ligne introuvable : le bloc Fast2Sum');
  else {
    ditFl(e, 'compensation(1e16, 1)', compense(a16, 1), m[1]);
    ditFl(e, 'compensation(1, 1e16)', compense(1, a16), m[2]);
  }
  fin(r, 'leçon 09 · lemme de Fast2Sum : compensation -1 d’un côté, 0 de l’autre', e);

  /* ---------------- bloc « entiers-surs » ---------------- */
  const EN = L.sortie(9, 'entiers-surs.txt');
  const maxSur = (1n << 53n) - 1n;

  e = [];
  m = ligne(EN, /Number\.MAX_SAFE_INTEGER = (\d+)\s+\(2\^53 - 1\)\n9007199254740992 \+ 1\s+= (\d+)\n9007199254740993\s+= (\d+)\s+<- ecrit tel quel[^\n]*\nles deux sont-ils egaux \? (\w+)/);
  if (!m) e.push('ligne introuvable : le bloc MAX_SAFE_INTEGER');
  else {
    dit(e, 'MAX_SAFE_INTEGER', maxSur.toString(), m[1]);
    ditFl(e, '2^53 + 1 en flottant', flPlus(p53, 1), m[2]);
    ditFl(e, 'le littéral 9007199254740993', flDec('9007199254740993'), m[3]);
    dit(e, 'les deux sont-ils égaux ?', String(egal(flPlus(p53, 1), flDec('9007199254740993'))), m[4]);
  }
  fin(r, 'leçon 09 · MAX_SAFE_INTEGER, 2^53 + 1, et le littéral 9007199254740993', e);

  e = [];
  m = ligne(EN, /apres parse : \{"id":(\d+),"nom":"commande"\}\nidentifiant conserve \? (\w+)/);
  if (!m) e.push('ligne introuvable : le bloc JSON');
  else {
    ditFl(e, 'identifiant après JSON.parse', flDec('9007199254740993'), m[1]);
    dit(e, 'identifiant conservé ?', String(m[1] === '9007199254740993'), m[2]);
  }
  proseNombre(e, 'prose · identifiant après parse',
    /JSON\.parse transforme l'identifiant 9007199254740993 en (\d+)/, decExact(flDec('9007199254740993')));
  fin(r, 'leçon 09 · JSON.parse change 9007199254740993 en 9007199254740992', e);

  e = [];
  for (const paire of [['entier 32 bits (auto-increment)', 32], ['identifiant type « snowflake »', 64], ['UUID', 128]]) {
    const l = new RegExp('^' + echappe(paire[0]) + '\\s+(\\d+)\\s+(OUI|non)\\s*$', 'm').exec(EN);
    if (!l) { e.push('ligne introuvable : le type d’identifiant « ' + paire[0] + ' »'); continue; }
    dit(e, 'bits de « ' + paire[0] + ' »', String(paire[1]), l[1]);
    dit(e, 'dépasse 2^53 ? (' + paire[1] + ' bits)', ((1n << BigInt(paire[1])) - 1n > maxSur) ? 'OUI' : 'non', l[2]);
  }
  const nombres = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze'];
  proseNombre(e, 'bits de trop pour un identifiant de 64 bits',
    /tient sur 64 bits : (\S+) de plus/, nombres[64 - 53]);
  fin(r, 'leçon 09 · le tableau des identifiants (32 / 64 / 128 bits) et les « onze de plus »', e);

  e = [];
  m = ligne(EN, /BigInt : 9007199254740993 \+ 1n = (\d+)/);
  dit(e, 'BigInt + 1n', (9007199254740993n + 1n).toString(), m ? m[1] : null);
  m = ligne(EN, /9007199254740993n == 9007199254740993 \? (\w+)/);
  dit(e, 'BigInt comparé au Number', String(rCmp(rDouble(flDec('9007199254740993')), { n: 9007199254740993n, d: 1n }) === 0),
    m ? m[1] : null);
  const SUSPECTS = [['42', 42], ['9007199254740991', flDec('9007199254740991')],
    ['9007199254740992', flDec('9007199254740993')], ['1\\.5', flDec('1.5')]];
  for (const s of SUSPECTS) {
    const l = new RegExp('^' + s[0] + '\\s+(true|false)\\s*$', 'm').exec(EN);
    if (!l) { e.push('ligne introuvable : « ' + s[0].replace('\\', '') +' » dans le tableau des suspects'); continue; }
    const entier = rDouble(s[1]).d === 1n;
    const suspect = entier && rCmp(rAbs(rDouble(s[1])), { n: maxSur, d: 1n }) > 0;
    dit(e, 'suspecte ? ' + s[0].replace('\\', ''), String(suspect), l[1]);
  }
  const l993 = /^9007199254740993\s+(true|false)\s*$/m.exec(EN);
  dit(e, 'suspecte ? la CHAÎNE 9007199254740993 (ce n’est pas un nombre)', 'false', l993 ? l993[1] : null);
  fin(r, 'leçon 09 · BigInt, l’égalité lâche, et le tableau « suspecte ? »', e);

  /* ---------------- bloc « argent » ---------------- */
  const AR = L.sortie(9, 'argent.txt');

  e = [];
  const prixHT = flDec('19.99'), tva = flFois(prixHT, flDec('0.2'));
  m = ligne(AR, /prix HT\s+: (\S+)\nTVA 20 %\s+: (\S+)\ntotal TTC : (\S+)\narrondi au centime : (\S+)/);
  if (!m) e.push('ligne introuvable : le bloc TVA');
  else {
    ditFl(e, 'prix HT', prixHT, m[1]);
    ditFl(e, 'TVA', tva, m[2]);
    ditFl(e, 'total TTC', flPlus(prixHT, tva), m[3]);
    dit(e, 'arrondi au centime', fixeExact(flPlus(prixHT, tva), 2), m[4]);
  }
  m = ligne(AR, /en centimes : (\d+) \+ (\d+) = (\d+) centimes, soit ([\d.]+) euros/);
  if (!m) e.push('ligne introuvable : le bloc en centimes');
  else {
    const tvaC = Number(fixeExact(flDiv(flFois(1999, 20), 100), 0));
    dit(e, 'prix en centimes', '1999', m[1]);
    dit(e, 'TVA en centimes', String(tvaC), m[2]);
    dit(e, 'total en centimes', String(1999 + tvaC), m[3]);
    dit(e, 'total en euros', fixeExact(flDiv(1999 + tvaC, 100), 2), m[4]);
  }
  proseFl(e, 'prose · TVA de 19,99 €', /La TVA de 19,99 € vaut ([\d.]+) et non/, tva);
  fin(r, 'leçon 09 · la TVA de 19,99 € en flottants puis en centimes entiers', e);

  e = [];
  let flottant = 0, centimes = 0;
  for (let i = 1; i <= 100; i++) {
    const brut = flPlus(100, flFois(i, flDec('37.13')));
    const arrondi = flDec(fixeExact(brut, 0));                 /* Math.round, refait exactement */
    const c = flFois(flDiv(arrondi, 100), 100);
    flottant = flPlus(flottant, flDiv(c, 100));
    centimes += Number(fixeExact(c, 0));
  }
  m = ligne(AR, /total en euros flottants : (\S+)\n\s*total en centimes\s+: (\d+) centimes, soit ([\d.]+)\n\s*ecart\s+: (\S+) centimes\n\s*les deux affichent-ils la meme chose apres toFixed\(2\) \? (\w+)/);
  if (!m) e.push('ligne introuvable : le bloc des 100 lignes de facture');
  else {
    ditFl(e, 'total en euros flottants', flottant, m[1]);
    dit(e, 'total en centimes', String(centimes), m[2]);
    dit(e, 'total en euros depuis les centimes', fixeExact(flDiv(centimes, 100), 2), m[3]);
    ditFl(e, 'écart entre les deux totaux', flMoins(flFois(flottant, 100), centimes), m[4]);
    dit(e, 'même affichage après toFixed(2) ?',
      String(fixeExact(flottant, 2) === fixeExact(flDiv(centimes, 100), 2)), m[5]);
  }
  ditArrondi(e, 'écart annoncé dans la prose', abs(flMoins(flFois(flottant, 100), centimes)),
    (ligne(PROSE, /l'écart mesuré vaut ([\d,]+) × 10 − ?11 centime/) || [])[1], -11);
  fin(r, 'leçon 09 · les 100 lignes de facture : 197 507 centimes, 2,9e-11 centime d’écart', e);

  e = [];
  for (const t of ['1.005', '1.015', '1.025', '2.675', '8.575']) {
    const v = flDec(t);
    const l = new RegExp('^' + echappe(t) + '\\s+([\\d.]+)\\s+([\\d.]+)\\s*$', 'm').exec(AR);
    if (!l) { e.push('ligne introuvable : « ' + t + ' » dans le tableau toFixed'); continue; }
    dit(e, t + ' · toFixed(2)', fixeExact(v, 2), l[1]);
    dit(e, t + ' · valeur exacte stockée', precisionExacte(v, 20), l[2]);
  }
  proseNombre(e, 'prose · (1.005).toFixed(2)', /\(1\.005\)\.toFixed\(2\) rend ([\d.]+)/, fixeExact(flDec('1.005'), 2));
  proseNombre(e, 'prose · valeur stockée de 1.005', /la valeur stockée est ([\d.]+)/, precisionExacte(flDec('1.005'), 20));
  fin(r, 'leçon 09 · toFixed(2) contre la valeur exacte stockée (5 lignes)', e);

  e = [];
  let bas = 0, differents = 0, basCalcule = 0;
  const exemples = [];
  for (let i = 0; i < 10000; i++) {
    const texte = Math.floor(i / 100) + '.' + String(i % 100).padStart(2, '0') + '5';
    const v = flDec(texte);                         /* le littéral, converti par nous */
    const attendu = fixeExact(flDiv(i + 1, 100), 2);
    if (fixeExact(v, 2) !== attendu) {
      bas++;
      if (exemples.length < 5) exemples.push(texte + ' -> ' + fixeExact(v, 2) + ' au lieu de ' + attendu);
    }
    const calcule = flPlus(flDiv(i, 100), flDec('0.005'));
    if (!egal(v, calcule)) differents++;
    if (fixeExact(calcule, 2) !== attendu) basCalcule++;
  }
  m = ligne(AR, /valeurs ECRITES .+ essayees\s+: (\d+)\narrondies vers le BAS par toFixed\s+: (\d+)\s+\(([\d.]+) %\)\nexemples : ([^\n]+)/);
  if (!m) e.push('ligne introuvable : le bloc des valeurs « x,xx5 »');
  else {
    dit(e, 'valeurs essayées', '10000', m[1]);
    dit(e, 'arrondies vers le bas', String(bas), m[2]);
    dit(e, 'part arrondie vers le bas', pourcent(bas, 10000, 1), m[3]);
    dit(e, 'les cinq exemples', exemples.join(' | '), m[4]);
  }
  m = ligne(AR, /donne un AUTRE flottant dans (\d+) cas sur (\d+)/);
  if (!m) e.push('ligne introuvable : le décompte « i/100 + 0.005 »');
  else {
    dit(e, 'flottants différents de la version calculée', String(differents), m[1]);
    dit(e, 'taille de l’échantillon', '10000', m[2]);
  }
  proseNombre(e, 'prose · valeurs arrondies vers le bas',
    /« x,xx5 », ([\d ]+) sont arrondies vers le bas/, frac(bas));
  proseNombre(e, 'prose · part arrondie vers le bas',
    /sont arrondies vers le bas , soit ([\d,]+) %/, pourcent(bas, 10000, 1).replace('.', ','));
  proseNombre(e, 'prose · flottants différents',
    /un flottant différent dans ([\d ]+) cas sur 10 000/, frac(differents));
  proseNombre(e, 'prose · part de la version calculée',
    /annonçait — ([\d,]+) % au lieu de/, pourcent(basCalcule, 10000, 1).replace('.', ','));
  fin(r, 'leçon 09 · 4 800 valeurs sur 10 000 arrondies vers le bas, et les 50,3 % de la variante calculée', e);

  e = [];
  const milliards = fixeExact(rArrondi({ n: maxSur, d: 100000000000n }), 0);
  m = ligne(AR, /centimes disponibles avant de depasser 2\^53 : (\d+)\nsoit environ (\d+) milliards d'euros/);
  if (!m) e.push('ligne introuvable : le bloc des centimes disponibles');
  else {
    dit(e, 'centimes disponibles', maxSur.toString(), m[1]);
    dit(e, 'milliards d’euros', milliards, m[2]);
  }
  proseNombre(e, 'prose · centimes disponibles', /confortable — ([\d ]+) centimes, soit environ/, frac(Number(maxSur)));
  proseNombre(e, 'prose · milliards d’euros', /soit environ ([\d ]+) milliards d'euros/, frac(Number(milliards)));
  proseNombre(e, 'prose · milliards d’euros (récapitulatif)', /c'est environ ([\d ]+) milliards d'euros/, frac(Number(milliards)));
  fin(r, 'leçon 09 · 9 007 199 254 740 991 centimes, soit 90 072 milliards d’euros', e);

  /* ---------------- solutions des exercices ---------------- */
  const S7 = L.sortie(9, 'solution-7.txt');

  e = [];
  let x = 0, tours = 0;
  while (!egal(x, 1) && tours < 100) { x = flPlus(x, D01); tours++; }
  let cumul = 0;
  for (let i = 0; i < 10; i++) cumul = flPlus(cumul, D01);
  m = ligne(S7, /tours effectues avant le garde-fou : (\d+)\n\s*x vaut (\S+) — il a DEPASSE 1[^\n]*\n\s*apres exactement 10 tours, le cumul vaut (\S+) et non 1\.\n\s*a noter : 0\.1 \* 10 vaut (\S+)/);
  if (!m) e.push('ligne introuvable : le bloc de la boucle fautive');
  else {
    dit(e, 'tours avant le garde-fou', String(tours), m[1]);
    ditFl(e, 'valeur de x à la sortie', x, m[2]);
    ditFl(e, 'cumul après 10 tours', cumul, m[3]);
    ditFl(e, '0.1 * 10', flFois(D01, 10), m[4]);
  }
  fin(r, 'leçon 09 · exercice 1 : 100 tours, x = 9,99999999999998, et 0.1 × 10 qui tombe juste', e);

  e = [];
  const presque = function (a, b) {
    return rCmp(rDouble(abs(flMoins(a, b))), rDouble(flFois(flDec('1e-9'), Math.max(1, abs(a), abs(b))))) <= 0;
  };
  let y = 0, t2 = 0;
  while (!presque(y, 1) && t2 < 100) { y = flPlus(y, D01); t2++; }
  let horsTolerance = 0, strictement = 0;
  for (let i = 0; i <= 10; i++) {
    let z = 0;
    for (let k = 0; k < i; k++) z = flPlus(z, D01);
    if (!presque(z, flDiv(i, 10))) horsTolerance++;
    if (!egal(z, flDiv(i, 10))) strictement++;
  }
  m = ligne(S7, /en comptant des entiers : ([^\n]+)\nla valeur 1 est-elle atteinte exactement \? (\w+)/);
  if (!m) e.push('ligne introuvable : la liste des onze pas');
  else {
    const lus = m[1].trim().split(/\s+/);
    if (lus.length !== 11) e.push('liste des pas — 11 valeurs attendues, publié ' + lus.length);
    else for (let k = 0; k <= 10; k++) ditFl(e, 'pas n°' + k, flDiv(k, 10), lus[k]);
    dit(e, '1 est-il atteint exactement ?', String(egal(flDiv(10, 10), 1)), m[2]);
  }
  m = ligne(S7, /avec une tolerance : (\d+) tours, y = (\S+)/);
  if (!m) e.push('ligne introuvable : la boucle à tolérance');
  else { dit(e, 'tours avec tolérance', String(t2), m[1]); ditFl(e, 'y final', y, m[2]); }
  m = ligne(S7, /11 etapes comparees[^:]*: (\d+) ecart au-dela de la tolerance\nmais en egalite STRICTE : (\d+) etapes sur (\d+) different/);
  if (!m) e.push('ligne introuvable : la comparaison des onze étapes');
  else {
    dit(e, 'écarts au-delà de la tolérance', String(horsTolerance), m[1]);
    dit(e, 'étapes différentes en égalité stricte', String(strictement), m[2]);
    dit(e, 'nombre d’étapes', '11', m[3]);
  }
  const finS7 = S7.split('\n').filter(function (l) { return l.trim() !== ''; });
  dit(e, 'dernière ligne (la réponse demandée)', String(t2), finS7[finS7.length - 1].trim());
  m = ligne(PROSE, /les onze étapes : (\d+) écart avec une tolérance, mais (\d+) étapes sur (\d+) qui diffèrent/);
  if (!m) e.push('ligne introuvable dans la prose : les onze étapes');
  else {
    dit(e, 'prose · écarts tolérés', String(horsTolerance), m[1]);
    dit(e, 'prose · étapes strictement différentes', String(strictement), m[2]);
    dit(e, 'prose · nombre d’étapes', '11', m[3]);
  }
  fin(r, 'leçon 09 · exercice 1 : les onze étapes, 0 écart toléré, 4 différences strictes', e);

  const S8 = L.sortie(9, 'solution-8.txt');
  const repartir = function (cent, parts) {
    const base = Math.floor(cent / parts), reste = cent - base * parts, out = [];
    for (let i = 0; i < parts; i++) out.push(base + (i < reste ? 1 : 0));
    return out;
  };

  e = [];
  const naif3 = Number(fixeExact(flDiv(10000, 3), 0));
  m = ligne(S8, /parts arrondies : ([\d.]+) \+ ([\d.]+) \+ ([\d.]+) = ([\d.]+)\nmanquant : (\d+) centime/);
  if (!m) e.push('ligne introuvable : le bloc des parts arrondies');
  else {
    for (let k = 0; k < 3; k++) dit(e, 'part arrondie n°' + (k + 1), fixeExact(flDiv(naif3, 100), 2), m[k + 1]);
    dit(e, 'somme des parts arrondies', fixeExact(flDiv(3 * naif3, 100), 2), m[4]);
    dit(e, 'centimes manquants', String(10000 - 3 * naif3), m[5]);
  }
  const juste3 = repartir(10000, 3);
  const total3 = juste3.reduce(function (a, b) { return a + b; }, 0);
  m = ligne(S8, /parts reparties : ([\d.]+) \+ ([\d.]+) \+ ([\d.]+) = ([\d.]+)\nsomme exacte \? (\w+)/);
  if (!m) e.push('ligne introuvable : le bloc des parts réparties');
  else {
    for (let k = 0; k < 3; k++) dit(e, 'part répartie n°' + (k + 1), fixeExact(flDiv(juste3[k], 100), 2), m[k + 1]);
    dit(e, 'somme des parts réparties', fixeExact(flDiv(total3, 100), 2), m[4]);
    dit(e, 'somme exacte ?', String(total3 === 10000), m[5]);
  }
  fin(r, 'leçon 09 · exercice 2 : 33,33 × 3 = 99,99, et la répartition qui retombe juste', e);

  e = [];
  let casT = 0, faux = 0, ecartMax = 0, echecsFl = 0, echecsDec = 0, nonDivisibles = 0, memes = 0;
  for (let c = 1; c <= 5000; c++) {
    for (let n = 2; n <= 7; n++) {
      casT++;
      const parts = repartir(c, n);
      let s = 0, mx = -Infinity, mn = Infinity;
      for (const p of parts) { s += p; if (p > mx) mx = p; if (p < mn) mn = p; }
      if (s !== c) faux++;
      if (mx - mn > ecartMax) ecartMax = mx - mn;
      const euros = flDiv(c, 100);
      const part = flDec(fixeExact(flDiv(euros, n), 2));
      if (fixeExact(flFois(part, n), 2) !== fixeExact(euros, 2)) echecsFl++;
      if (Number(fixeExact(flDiv(c, n), 0)) * n !== c) echecsDec++;
      if (c % n !== 0) nonDivisibles++;
      const a1 = fixeExact(flFois(part, n), 2) !== fixeExact(euros, 2);
      const a2 = Number(fixeExact(flDiv(c, n), 0)) * n !== c;
      const a3 = c % n !== 0;
      if (a1 === a2 && a1 === a3) memes++;
    }
  }
  m = ligne(S8, /repartitions essayees : (\d+)\n\s*dont fausses \(somme != total\) : (\d+)\n\s*ecart maximal entre deux parts : (\d+) centime/);
  if (!m) e.push('ligne introuvable : le bloc des 30 000 répartitions');
  else {
    dit(e, 'répartitions essayées', String(casT), m[1]);
    dit(e, 'répartitions fausses', String(faux), m[2]);
    dit(e, 'écart maximal entre deux parts', String(ecartMax), m[3]);
  }
  m = ligne(S8, /n x part ne redonne pas le total : (\d+)\s+\(([\d.]+) %\)\n\s*la MEME methode en centimes entiers, donc sans flottant : (\d+)\n\s*cas ou le total n est tout simplement pas divisible par n : (\d+)\n\s*cas ou les trois colonnes coincident : (\d+) \/ (\d+)/);
  if (!m) e.push('ligne introuvable : le bloc des trois colonnes');
  else {
    dit(e, 'échecs en euros flottants', String(echecsFl), m[1]);
    dit(e, 'part d’échecs', pourcent(echecsFl, casT, 1), m[2]);
    dit(e, 'échecs en centimes entiers', String(echecsDec), m[3]);
    dit(e, 'totaux non divisibles par n', String(nonDivisibles), m[4]);
    dit(e, 'cas où les trois colonnes coïncident', String(memes), m[5]);
    dit(e, 'nombre de cas', String(casT), m[6]);
  }
  proseNombre(e, 'prose · échecs annoncés',
    /sur 30 000 répartitions faites de cette façon, ([\d ]+) ne retombent pas/, frac(echecsFl));
  proseNombre(e, 'prose · part d’échecs',
    /ne retombent pas sur le total , soit ([\d,]+) %/, pourcent(echecsFl, casT, 1).replace('.', ','));
  fin(r, 'leçon 09 · exercice 2 : 22 037 échecs sur 30 000 (73,5 %), et les trois colonnes qui coïncident', e);

  const S9 = L.sortie(9, 'solution-9.txt');
  const sommeNaive = function (l) { let s = 0; for (const v of l) s = flPlus(s, v); return s; };
  const sommeKahan = function (l) {
    let s = 0, c = 0;
    for (const v of l) { const yy = flMoins(v, c); const t = flPlus(s, yy); c = flMoins(flMoins(t, s), yy); s = t; }
    return s;
  };
  const sommeNeumaier = function (l) {
    let s = 0, c = 0;
    for (const v of l) {
      const t = flPlus(s, v);
      c = flPlus(c, abs(s) >= abs(v) ? flPlus(flMoins(s, t), v) : flPlus(flMoins(v, t), s));
      s = t;
    }
    return flPlus(s, c);
  };

  e = [];
  const geant = flDec('1e100');
  const piege = [1, geant, 1, -geant];
  m = ligne(S9, /liste : 1, 1e100, 1, -1e100\s+\(somme exacte : (\d+)\)\n\s*naive\s+: (\S+)\n\s*Kahan\s+: (\S+)\n\s*Neumaier : (\S+)/);
  if (!m) e.push('ligne introuvable : le bloc du piège de Kahan');
  else {
    dit(e, 'somme exacte du piège', '2', m[1]);
    ditFl(e, 'somme naïve', sommeNaive(piege), m[2]);
    ditFl(e, 'somme de Kahan', sommeKahan(piege), m[3]);
    ditFl(e, 'somme de Neumaier', sommeNeumaier(piege), m[4]);
  }
  fin(r, 'leçon 09 · exercice 3 : le piège [1, 1e100, 1, -1e100]', e);

  e = [];
  const liste = [];
  for (let i = 0; i < 5000; i++) liste.push(D01);
  liste.push(dixPuiss(17));
  for (let i = 0; i < 5000; i++) liste.push(D01);
  liste.push(-dixPuiss(17));
  m = ligne(S9, /10 000 x 0\.1 avec 1e17 puis -1e17 inseres\s+\(somme exacte : (\d+)\)\n\s*naive\s+: (\S+)\n\s*Kahan\s+: (\S+)\n\s*Neumaier : (\S+)/);
  if (!m) e.push('ligne introuvable : le bloc de la liste à 1e17');
  else {
    dit(e, 'somme exacte annoncée', '1000', m[1]);
    ditFl(e, 'somme naïve', sommeNaive(liste), m[2]);
    ditFl(e, 'somme de Kahan', sommeKahan(liste), m[3]);
    ditFl(e, 'somme de Neumaier', sommeNeumaier(liste), m[4]);
  }
  fin(r, 'leçon 09 · exercice 3 : 10 000 × 0,1 autour de 1e17 (496, 992, 1000,0000000000462)', e);

  return r;
}

module.exports = { titre: 'leçon 09 — nombres flottants IEEE 754', controles: controles };
