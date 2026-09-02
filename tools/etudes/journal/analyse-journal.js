/* =========================================================================
   analyse-journal.js — Lire un journal d'accès et en tirer un rapport.

   Un serveur web écrit une ligne par requête reçue. Au bout d'une journée,
   ce fichier fait des dizaines de milliers de lignes que personne ne lit.
   Ce programme les lit pour nous et répond à quatre questions :
   combien de requêtes, lesquelles ont échoué, quelles pages sont les plus
   demandées, et à quelle heure la charge monte.
   ========================================================================= */

/* Un extrait de journal, au format « combiné » que produisent Apache et nginx.
   Deux lignes sont volontairement abîmées : un vrai journal en contient
   toujours, et un programme qui suppose le contraire s'arrête au mauvais
   moment. */
var JOURNAL = [
  '10.0.0.4 - - [12/Mar/2026:08:14:02 +0100] "GET /index.html HTTP/1.1" 200 5120',
  '10.0.0.9 - - [12/Mar/2026:08:14:19 +0100] "GET /css/style.css HTTP/1.1" 200 8340',
  '10.0.0.4 - - [12/Mar/2026:08:15:47 +0100] "GET /cours/python HTTP/1.1" 200 24810',
  'ligne abimee sans aucune structure',
  '10.0.0.7 - - [12/Mar/2026:09:02:11 +0100] "GET /cours/python HTTP/1.1" 200 24810',
  '10.0.0.7 - - [12/Mar/2026:09:02:12 +0100] "GET /favicon.ico HTTP/1.1" 404 209',
  '10.0.0.2 - - [12/Mar/2026:09:31:58 +0100] "POST /api/inscription HTTP/1.1" 500 87',
  '10.0.0.9 - - [12/Mar/2026:09:44:03 +0100] "GET /cours/python HTTP/1.1" 200 24810',
  '10.0.0.3 - - [12/Mar/2026:09:58:40 +0100] "GET /cours/sql HTTP/1.1" 200 19004',
  '10.0.0.4 - - [12/Mar/2026:10:07:22 +0100] "GET /favicon.ico HTTP/1.1" 404 209',
  '',
  '10.0.0.8 - - [12/Mar/2026:10:12:05 +0100] "GET /cours/sql HTTP/1.1" 200 19004',
  '10.0.0.2 - - [12/Mar/2026:10:12:44 +0100] "POST /api/inscription HTTP/1.1" 500 87',
  '10.0.0.5 - - [12/Mar/2026:10:29:31 +0100] "GET /index.html HTTP/1.1" 200 5120',
  '10.0.0.8 - - [12/Mar/2026:10:47:16 +0100] "GET /cours/python HTTP/1.1" 200 24810',
  '10.0.0.1 - - [12/Mar/2026:11:03:09 +0100] "GET /admin HTTP/1.1" 403 0',
  '10.0.0.5 - - [12/Mar/2026:11:18:52 +0100] "GET /cours/sql HTTP/1.1" 200 19004',
  '10.0.0.6 - - [12/Mar/2026:11:19:07 +0100] "GET /index.html HTTP/1.1" 200 5120'
];

/* Une seule expression rationnelle décrit la ligne entière. Chaque groupe
   entre parenthèses devient une case du tableau que rend `exec`. On la lit
   de gauche à droite : adresse, deux champs ignorés, date entre crochets,
   requête entre guillemets, code de statut, taille. */
var LIGNE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+) [^"]*" (\d{3}) (\d+)$/;

/* Rend un objet décrivant la requête, ou `null` si la ligne ne suit pas le
   format. Rendre `null` plutôt que lever une exception est un choix : une
   ligne abîmée ne doit pas arrêter l'analyse des 40 000 autres. */
function analyserLigne(ligne) {
  var m = LIGNE.exec(ligne);
  if (!m) return null;
  return {
    adresse: m[1],
    heure: Number(m[2].slice(12, 14)),
    methode: m[3],
    chemin: m[4],
    statut: Number(m[5]),
    octets: Number(m[6])
  };
}

/* Compte les occurrences d'une clé dans une Map. Une Map, et pas un objet
   ordinaire : un chemin d'URL est une donnée venue de l'extérieur, et rien
   n'empêche qu'il s'appelle « /constructor » ou « /__proto__ ». Sur un objet,
   ces deux noms-là ne comptent pas, ils DÉRAILLENT — et en silence :
     o["constructor"] = (o["constructor"] || 0) + 1
        → "function Object() { [native code] }1", une concaténation.
     o["__proto__"]   = 1
        → ignoré : __proto__ est un accesseur, la clé n'apparaît même pas
          dans Object.keys(), donc ce chemin DISPARAÎT du rapport.
   Une Map n'a pas de prototype dans le chemin de ses clés : les trois
   comptes sont justes. (Mesuré, pas supposé.) */
function compter(map, cle) {
  map.set(cle, (map.get(cle) || 0) + 1);
}

/* Parcourt les lignes une seule fois et remplit toutes les statistiques au
   passage. Un seul parcours, parce qu'un journal ne tient pas toujours en
   mémoire : ce qui est écrit ici marcherait aussi ligne par ligne. */
function agreger(lignes) {
  var stat = {
    lues: 0, valides: 0, ignorees: 0,
    octets: 0,
    parChemin: new Map(),
    parHeure: new Map(),
    echecs: []
  };

  for (var i = 0; i < lignes.length; i++) {
    stat.lues++;
    var req = analyserLigne(lignes[i]);
    if (!req) { stat.ignorees++; continue; }
    stat.valides++;
    stat.octets += req.octets;
    compter(stat.parChemin, req.chemin);
    compter(stat.parHeure, req.heure);
    if (req.statut >= 400) stat.echecs.push(req);
  }
  return stat;
}

/* Les n clés les plus fréquentes. Le `||` départage les ex æquo en comparant
   les clés elles-mêmes. Sans cette seconde comparaison, le classement resterait
   parfaitement REPRODUCTIBLE — le tri de JavaScript est stable depuis 2019 —
   mais l'ordre des ex æquo serait celui de leur PREMIÈRE APPARITION dans le
   journal, c'est-à-dire un ordre qui ne veut rien dire pour le lecteur du
   rapport. Départager explicitement, c'est choisir un ordre qu'on peut
   expliquer plutôt qu'en subir un qui vient d'ailleurs. */
function palmares(map, n) {
  return Array.from(map.entries())
    .sort(function (a, b) { return b[1] - a[1] || (a[0] < b[0] ? -1 : 1); })
    .slice(0, n);
}

/* Une taille en octets, lisible par un humain. */
function taille(octets) {
  if (octets < 1024) return octets + ' o';
  if (octets < 1024 * 1024) return (octets / 1024).toFixed(1) + ' Ko';
  return (octets / 1024 / 1024).toFixed(1) + ' Mo';
}

/* Met en forme le rapport. La mise en forme est séparée du calcul : on peut
   changer l'affichage sans toucher à l'analyse, et l'analyse est testable
   sans lire du texte. */
function formaterRapport(stat) {
  var lignes = [];
  lignes.push('=== RAPPORT D\'ACCÈS ===');
  lignes.push('lignes lues ........ ' + stat.lues);
  lignes.push('requêtes valides ... ' + stat.valides);
  lignes.push('lignes ignorées .... ' + stat.ignorees);
  lignes.push('volume servi ....... ' + taille(stat.octets));

  lignes.push('');
  lignes.push('-- pages les plus demandées --');
  palmares(stat.parChemin, 3).forEach(function (p, rang) {
    lignes.push('  ' + (rang + 1) + '. ' + p[0] + ' (' + p[1] + ')');
  });

  lignes.push('');
  lignes.push('-- heures les plus chargées --');
  palmares(stat.parHeure, 2).forEach(function (p) {
    lignes.push('  ' + String(p[0]).padStart(2, '0') + 'h : ' + p[1] + ' requêtes');
  });

  lignes.push('');
  lignes.push('-- échecs (' + stat.echecs.length + ') --');
  var parStatut = new Map();
  stat.echecs.forEach(function (r) { compter(parStatut, r.statut + ' ' + r.chemin); });
  palmares(parStatut, 10).forEach(function (p) {
    lignes.push('  ' + p[0] + ' × ' + p[1]);
  });

  return lignes.join('\n');
}

console.log(formaterRapport(agreger(JOURNAL)));
