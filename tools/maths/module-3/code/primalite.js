/* Est-ce un nombre premier ? Trois versions du même test.
   On compte les divisions : c'est une propriété de l'algorithme, la même partout. */

function testerTout(n) {                        // on essaie tous les diviseurs
  let divisions = 0;
  for (let d = 2; d < n; d++) { divisions++; if (n % d === 0) return { premier: false, divisions: divisions }; }
  return { premier: n > 1, divisions: divisions };
}

function testerRacine(n) {                      // on s'arrête à la racine carrée
  let divisions = 0;
  for (let d = 2; d * d <= n; d++) { divisions++; if (n % d === 0) return { premier: false, divisions: divisions }; }
  return { premier: n > 1, divisions: divisions };
}

function tester6k(n) {                          // on saute les multiples de 2 et de 3
  if (n < 2) return { premier: false, divisions: 0 };
  if (n < 4) return { premier: true, divisions: 0 };
  let divisions = 2;
  if (n % 2 === 0 || n % 3 === 0) return { premier: false, divisions: divisions };
  for (let d = 5; d * d <= n; d += 6) {
    divisions += 2;
    if (n % d === 0 || n % (d + 2) === 0) return { premier: false, divisions: divisions };
  }
  return { premier: true, divisions: divisions };
}

// POURQUOI la racine carrée suffit : si n = a x b avec a <= b, alors a <= racine(n).
// Donc le plus petit diviseur, s'il existe, est sous la racine. On le vérifie.
let contre = 0, verifs = 0;
for (let n = 2; n <= 20000; n++) { verifs++; if (testerTout(n).premier !== testerRacine(n).premier) contre++; }
console.log('les deux tests compares sur ' + verifs + ' nombres : ' + contre + ' desaccord(s)');

const cas = [10007, 100003, 1000003, 1000000007, 2147483647];
console.log('');
console.log('nombre           premier   divisions : tout          racine     pas de 6');
for (const n of cas) {
  const b = testerRacine(n), c = tester6k(n);
  // La version « tout » n'est LANCÉE que sur les petits nombres : sur 2 147 483 647
  // elle demanderait plus de deux milliards de divisions, soit bien plus que les
  // 3 secondes que le navigateur accorde. Son compte, lui, est connu : n - 2.
  const tout = n <= 1000003 ? String(testerTout(n).divisions) : (n - 2) + ' (calcule)';
  console.log(String(n).padEnd(17) + String(b.premier).padEnd(10) +
    tout.padStart(17) + String(b.divisions).padStart(11) + String(c.divisions).padStart(11));
}

// Combien y a-t-il de nombres premiers ? On les compte, on ne récite pas.
// ATTENTION à ne pas comparer deux grandeurs différentes : 1/ln(n) prédit la densité
// LOCALE autour de n, pas la proportion CUMULÉE depuis 2 — qui, elle, moyenne des
// zones bien plus denses. On publie les deux.
const bornes = [10, 100, 1000, 10000, 100000, 1000000];
console.log('');
console.log("jusqu'a        premiers    densite cumulee   densite locale   1/ln(n) predit");
for (const b of bornes) {
  let c = 0;
  for (let n = 2; n <= b; n++) if (testerRacine(n).premier) c++;
  const debut = Math.max(2, Math.floor(b * 0.9));      // le dernier dixième de l'intervalle
  let loc = 0, largeur = 0;
  for (let n = debut; n <= b; n++) { largeur++; if (testerRacine(n).premier) loc++; }
  console.log(String(b).padEnd(15) + String(c).padEnd(12) +
    (100 * c / b).toFixed(2).padStart(6) + ' %' +
    (largeur < 30 ? '(trop etroit)' : (100 * loc / largeur).toFixed(2) + ' %').padStart(17) +
    (100 / Math.log(b)).toFixed(2).padStart(14) + ' %');
}
console.log("=> c'est la densite LOCALE que 1/ln(n) predit : 7.22 % contre 7.24 % a un million.");
console.log("   la densite cumulee, 7.85 %, est plus haute parce qu'elle inclut les petits nombres.");

// Combien de tirages pour trouver un premier de 1024 bits ? La densite le dit.
const bits1024 = 1024 * Math.log(2);
console.log('');
console.log('pour un premier de 1024 bits : 1 / ln(2^1024) = 1 sur ' + Math.round(bits1024) + ' nombres,');
console.log('soit 1 sur ' + Math.round(bits1024 / 2) + ' si l on ne tire que des impairs.');
