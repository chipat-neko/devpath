'use strict';
/**
 * tools/lib/publier-etude.js — ÉCRIRE LA PAGE D'UNE ÉTUDE, OU VÉRIFIER QU'ELLE EST À JOUR.
 *
 * POURQUOI CE FICHIER EXISTE (2026-09-10, chantier V17, point C6)
 * --------------------------------------------------------------
 * Les sept pages d'étude sont ASSEMBLÉES : aucun chiffre n'y est écrit à la main, tout
 * vient d'une mesure que l'assembleur refait à chaque exécution. C'est une bonne
 * propriété — mais elle ne vaut que si quelqu'un RELANCE l'assembleur. Personne ne le
 * faisait, et le point C5 a écarté ces pages du contrôle des compteurs (I19) précisément
 * parce que leurs nombres sont des mesures. Elles n'étaient donc contrôlées par personne.
 *
 * LA MESURE QUI A FONDÉ CE MODULE : les sept assembleurs relancés le 2026-09-10 ont
 * reproduit la page publiée À L'OCTET PRÈS — sauf UN. `pages/etude-moteur-exos.html`
 * publiait « 4288 exercices de type text, 307 de type code » quand la mesure du jour en
 * comptait **4293 et 302** : cinq exercices avaient changé de type au fil des chantiers
 * B2b, et la page l'affirmait faux à trois endroits, dont un raisonnement (« pourquoi ce
 * serait une très mauvaise idée sur 307 exercices »). Aucun vérificateur n'a bronché.
 *
 * CE QUE FAIT CE MODULE, ET RIEN D'AUTRE : la toute dernière ligne de chaque assembleur.
 * Sans argument il écrit, comme avant. Avec `--verifier`, il n'écrit RIEN : il compare la
 * page qu'il vient de fabriquer à celle qui est publiée et sort en 1 si elles diffèrent,
 * en nommant la première ligne divergente. Même principe que `build-index.js` sans
 * `--write` — le mode comparaison, ici, est le contrôle.
 *
 * ⚠️ CE MODE NE REMPLACE PAS LES PREUVES PAR NAVIGATEUR. Il répond à « la page publiée
 * est-elle celle que l'assembleur produit aujourd'hui ? ». Les preuves d'étude, elles,
 * répondent à « ce que l'assembleur a mesuré est-il vrai dans un vrai Chrome ? ». Un
 * assembleur qui se tromperait resterait vert ici et rouge là-bas. Les deux sont
 * nécessaires ; celui-ci est celui qui manquait.
 */

const fs = require('fs');
const path = require('path');

/** Le mode est lu sur la ligne de commande de l'assembleur qui nous appelle. */
function modeVerification(argv) {
  return (argv || process.argv).slice(2).indexOf('--verifier') !== -1;
}

/**
 * publier(cible, page, racine) — écrit, ou compare et rend le verdict.
 * @returns {boolean} true si tout va bien (écrit, ou identique).
 */
function publier(cible, page, racine) {
  const nom = racine ? path.relative(racine, cible).replace(/\\/g, '/') : cible;
  if (!modeVerification()) {
    fs.writeFileSync(cible, page);
    console.log('✓ écrit : ' + nom + ' (' + page.length + ' octets)');
    return true;
  }

  let publiee = null;
  try { publiee = fs.readFileSync(cible, 'utf8'); } catch (e) { publiee = null; }
  if (publiee === null) {
    console.log('✗ ' + nom + ' : ABSENTE du disque, l\'assemblage en produit ' + page.length + ' octets');
    process.exitCode = 1;
    return false;
  }
  /* Le dépôt convertit les fins de ligne : on compare le CONTENU, pas l'encodage des
     sauts de ligne, sans quoi le contrôle rougirait sur chaque poste de travail. */
  const a = publiee.replace(/\r\n/g, '\n');
  const b = page.replace(/\r\n/g, '\n');
  if (a === b) {
    console.log('✓ ' + nom + ' : à jour (' + page.length + ' octets, assemblage identique)');
    return true;
  }
  const la = a.split('\n'), lb = b.split('\n');
  let i = 0;
  while (i < la.length && i < lb.length && la[i] === lb[i]) i++;
  console.log('✗ ' + nom + ' : PÉRIMÉE — publiée ' + a.length + ' o, assemblage du jour ' + b.length + ' o');
  console.log('    première divergence, ligne ' + (i + 1));
  console.log('      publié       : ' + JSON.stringify((la[i] || '').trim().slice(0, 150)));
  console.log('      mesure du jour : ' + JSON.stringify((lb[i] || '').trim().slice(0, 150)));
  console.log('    remède : relancer cet assembleur sans --verifier');
  process.exitCode = 1;
  return false;
}

module.exports = { publier, modeVerification };
