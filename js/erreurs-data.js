/* =============================================================================
   erreurs-data.js — LE DÉCODEUR DE MESSAGES D'ERREUR (chantier V14, phase C).

   Ce qu'un débutant fait en premier quand son programme casse : il copie le message
   et il le cherche. Le site ne lui répondait rien. Ce fichier est la base de données
   qui lui répond : le message tel que le moteur l'écrit, ce qui s'est réellement
   passé, quoi faire, et la leçon qui l'explique.

   ⚠️ RÈGLE DE CE FICHIER, ET ELLE EST VÉRIFIÉE PAR UN OUTIL : chaque `message` est
   COPIÉ D'UNE EXÉCUTION RÉELLE, jamais reconstitué de mémoire. Un message approximatif
   ne serait jamais retrouvé par recherche — c'est tout l'intérêt du décodeur qui
   tomberait. `tools/verif-erreurs.js` réexécute les extraits fautifs et exige que le
   moteur produise EXACTEMENT le message publié ici ; il exécute aussi chaque correction
   et exige qu'elle ne produise plus rien. Les entrées SQL font exception : aucun
   `sqlite3` n'est installé et sql.js est un moteur de NAVIGATEUR — elles sont donc
   rejouées par `tools/preuves/erreurs-sql.js`, dans le moteur embarqué du site.

   OÙ LES MESSAGES ONT ÉTÉ CAPTURÉS, langue par langue :
     · JavaScript — Node v24.16.0 (moteur V8, celui de Chrome, donc celui des blocs
       « ▶ Tester » du site).
     · Python — CPython 3.14.5 de la machine ET Pyodide 3.12.1, le CPython embarqué du
       site : les 16 messages sont IDENTIQUES dans les deux, mesuré le 2026-08-26.
     · SQL — SQLite 3.49.1, le sql.js embarqué du site, celui-là même qui juge les
       exercices SQL de l'apprenant (`tools/preuves/erreurs-sql.js`).
     · Bash — GNU bash 5.3, avec LC_ALL=C. ⚠️ Les messages du shell sont LOCALISÉS et
       PRÉFIXÉS par le fichier et la ligne (« ./script.sh: line 42: … ») : le préfixe,
       propre à chaque exécution, est retiré ; la forme anglaise est publiée, parce que
       c'est celle que l'on retrouve sur la plupart des machines et dans tous les forums.
   C'est ce qui permet d'affirmer qu'un apprenant retrouvera son message, qu'il ait
   exécuté sur le site ou chez lui.

   FORMAT D'UNE ENTRÉE :
     id       identifiant stable
     langue   "javascript" | "python"
     type     le nom de l'erreur (ReferenceError, KeyError…)
     message  LE MESSAGE EXACT, tel que le moteur l'écrit
     gabarit  le même, parties variables remplacées par … (pour l'affichage)
     motif    expression rationnelle (source) qui reconnaît le message malgré les
              noms de variables qui changent — c'est elle que la recherche emploie
     cles     mots-clés stables du message, pour une recherche tolérante
     cause    ce qui s'est réellement passé, en une phrase
     remede   quoi faire
     exemple  { fautif, corrige } — deux programmes complets, tous deux EXÉCUTÉS
     lecon    { href, label } vers la leçon du site qui enseigne la notion
     moteur   où le message a été capturé
   Rendu : à venir (case C2). 100 % file://, script classique, aucune dépendance.
   ============================================================================= */
window.ERREURS = [

  /* ======================= JavaScript ======================= */
  {
    id: "js-not-defined",
    langue: "javascript",
    type: "ReferenceError",
    message: "ReferenceError: totl is not defined",
    gabarit: "ReferenceError: … is not defined",
    motif: "^ReferenceError: .+ is not defined$",
    cles: ["referenceerror", "is not defined"],
    cause: "Le nom employé n'existe nulle part : il n'a jamais été déclaré, ou il est écrit autrement là où il a été créé. Neuf fois sur dix, c'est une faute de frappe ou une majuscule qui diffère.",
    remede: "Compare le nom lu dans le message avec celui de la déclaration, caractère par caractère. JavaScript distingue les majuscules des minuscules : total et Total sont deux noms différents.",
    exemple: {
      fautif: "const total = 10;\nconsole.log(totl);",
      corrige: "const total = 10;\nconsole.log(total);"
    },
    lecon: { href: "js/lecon-02.html", label: "Variables, types et valeurs" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-undefined-prop",
    langue: "javascript",
    type: "TypeError",
    message: "TypeError: Cannot read properties of undefined (reading 'ville')",
    gabarit: "TypeError: Cannot read properties of undefined (reading '…')",
    motif: "^TypeError: Cannot read propert(?:y|ies) of (?:undefined|null) \\(reading '.+'\\)$",
    cles: ["typeerror", "cannot read properties", "undefined", "reading"],
    cause: "On a demandé une propriété à une valeur qui n'existe pas. Ce n'est pas la propriété citée entre guillemets qui manque : c'est ce qui la précède qui vaut undefined.",
    remede: "Remonte d'un cran dans la chaîne : affiche l'objet AVANT le point fautif. S'il peut légitimement manquer, emploie l'accès optionnel (objet?.champ) ou teste son existence avant de lire.",
    exemple: {
      fautif: "const utilisateur = { nom: \"Ada\" };\nconsole.log(utilisateur.adresse.ville);",
      corrige: "const utilisateur = { nom: \"Ada\" };\nconsole.log(utilisateur.adresse?.ville);"
    },
    lecon: { href: "js/lecon-09.html", label: "Les objets (données nommées)" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-not-a-function",
    langue: "javascript",
    type: "TypeError",
    message: "TypeError: nombres.pusk is not a function",
    gabarit: "TypeError: ….… is not a function",
    motif: "^TypeError: .+ is not a function$",
    cles: ["typeerror", "is not a function"],
    cause: "Le nom appelé existe peut-être, mais ce qu'il désigne n'est pas une fonction — le plus souvent undefined, parce que la méthode est mal orthographiée ou n'existe pas sur ce type de valeur.",
    remede: "Vérifie l'orthographe de la méthode, puis le TYPE de ce sur quoi tu l'appelles : les tableaux ont push, les chaînes ont concat, les objets simples n'ont ni l'un ni l'autre.",
    exemple: {
      fautif: "const nombres = [1, 2, 3];\nnombres.push(4);\nnombres.pusk(5);",
      corrige: "const nombres = [1, 2, 3];\nnombres.push(4);\nnombres.push(5);"
    },
    lecon: { href: "js/lecon-07.html", label: "Les tableaux (listes ordonnées)" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-const",
    langue: "javascript",
    type: "TypeError",
    message: "TypeError: Assignment to constant variable.",
    gabarit: "TypeError: Assignment to constant variable.",
    motif: "^TypeError: Assignment to constant variable\\.$",
    cles: ["typeerror", "assignment to constant"],
    cause: "Une variable déclarée avec const ne peut pas être RÉAFFECTÉE. Attention à la nuance : le contenu d'un tableau ou d'un objet déclaré const, lui, reste modifiable — c'est le lien entre le nom et la valeur qui est figé.",
    remede: "Si la valeur doit changer au fil du programme, déclare-la avec let. Si elle ne doit pas changer, cherche pourquoi une affectation la vise.",
    exemple: {
      fautif: "const total = 10;\ntotal = 20;",
      corrige: "let total = 10;\ntotal = 20;"
    },
    lecon: { href: "js/lecon-02.html", label: "Variables, types et valeurs" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-tdz",
    langue: "javascript",
    type: "ReferenceError",
    message: "ReferenceError: Cannot access 'compteur' before initialization",
    gabarit: "ReferenceError: Cannot access '…' before initialization",
    motif: "^ReferenceError: Cannot access '.+' before initialization$",
    cles: ["referenceerror", "cannot access", "before initialization"],
    cause: "La variable est bien déclarée, mais PLUS BAS. Entre le début du bloc et sa déclaration, un nom déclaré par let ou const existe sans être utilisable : c'est la zone morte temporelle.",
    remede: "Déplace la déclaration avant sa première utilisation. Ce message est plus utile qu'il n'en a l'air : avec var, la même faute aurait donné undefined en silence.",
    exemple: {
      fautif: "console.log(compteur);\nlet compteur = 0;",
      corrige: "let compteur = 0;\nconsole.log(compteur);"
    },
    lecon: { href: "js/lecon-16.html", label: "Portée, hoisting et fermetures (closures)" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-not-iterable",
    langue: "javascript",
    type: "TypeError",
    message: "TypeError: options is not iterable",
    gabarit: "TypeError: … is not iterable",
    motif: "^TypeError: .+ is not iterable$",
    cles: ["typeerror", "is not iterable"],
    cause: "for...of ne fonctionne que sur ce qui sait se parcourir : tableaux, chaînes, Map, Set. Un objet simple ne le sait pas, malgré les apparences.",
    remede: "Pour parcourir un objet, passe par Object.keys, Object.values ou Object.entries — ou emploie for...in, qui parcourt les clés.",
    exemple: {
      fautif: "const options = { a: 1, b: 2 };\nfor (const x of options) console.log(x);",
      corrige: "const options = { a: 1, b: 2 };\nfor (const x of Object.values(options)) console.log(x);"
    },
    lecon: { href: "js/lecon-09.html", label: "Les objets (données nommées)" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-stack",
    langue: "javascript",
    type: "RangeError",
    message: "RangeError: Maximum call stack size exceeded",
    gabarit: "RangeError: Maximum call stack size exceeded",
    motif: "^RangeError: Maximum call stack size exceeded$",
    cles: ["rangeerror", "maximum call stack"],
    cause: "Une fonction s'appelle elle-même sans jamais s'arrêter : chaque appel empile un cadre, et la pile finit par déborder. Le cas classique est une récursion sans cas de base, ou dont le cas de base n'est jamais atteint.",
    remede: "Vérifie que la fonction a bien une condition d'arrêt, ET que ses appels s'en rapprochent. Ici la fonction incrémente son argument : elle s'en éloigne.",
    exemple: {
      fautif: "function compter(n) { return compter(n + 1); }\ncompter(0);",
      corrige: "function compter(n) { if (n >= 3) return n; return compter(n + 1); }\ncompter(0);"
    },
    lecon: { href: "js/lecon-18.html", label: "Fonctions d'ordre supérieur & récursion" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-json-vide",
    langue: "javascript",
    type: "SyntaxError",
    message: "SyntaxError: Unexpected end of JSON input",
    gabarit: "SyntaxError: Unexpected end of JSON input",
    motif: "^SyntaxError: Unexpected end of JSON input$",
    cles: ["syntaxerror", "unexpected end of json"],
    cause: "JSON.parse a reçu une chaîne vide, ou tronquée. Le cas le plus fréquent : une lecture de localStorage qui rend null pour une clé absente, ou une réponse réseau vide.",
    remede: "Teste la chaîne avant de l'analyser, et prévois une valeur par défaut quand elle est vide. Un try/catch autour de JSON.parse est la parade générale.",
    exemple: {
      fautif: "const brut = \"\";\nJSON.parse(brut);",
      corrige: "const brut = \"\";\nconst donnees = brut ? JSON.parse(brut) : {};\nconsole.log(donnees);"
    },
    lecon: { href: "js/lecon-32.html", label: "Le stockage côté navigateur" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-json-simple",
    langue: "javascript",
    type: "SyntaxError",
    message: "SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)",
    gabarit: "SyntaxError: Expected property name or '}' in JSON at position … (line … column …)",
    motif: "^SyntaxError: (?:Expected|Unexpected).* in JSON at position \\d+",
    cles: ["syntaxerror", "in json at position"],
    cause: "Le texte analysé n'est pas du JSON valide. Le piège le plus courant : des apostrophes simples. JSON n'accepte QUE les guillemets doubles, et exige des guillemets autour des noms de propriétés.",
    remede: "Relis le texte à la position indiquée. Si tu écris le JSON toi-même, laisse JSON.stringify le produire plutôt que de le composer à la main.",
    exemple: {
      fautif: "JSON.parse(\"{'nom': 'Ada'}\");",
      corrige: "JSON.parse('{\"nom\": \"Ada\"}');"
    },
    lecon: { href: "js/lecon-32.html", label: "Le stockage côté navigateur" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-null-prop",
    langue: "javascript",
    type: "TypeError",
    message: "TypeError: Cannot set properties of null (setting 'textContent')",
    gabarit: "TypeError: Cannot set properties of null (setting '…')",
    motif: "^TypeError: Cannot set propert(?:y|ies) of (?:null|undefined) \\(setting '.+'\\)$",
    cles: ["typeerror", "cannot set properties", "null", "setting"],
    cause: "On écrit dans un élément qui n'existe pas. En page web, c'est presque toujours un querySelector qui n'a rien trouvé — sélecteur erroné, ou script exécuté AVANT que l'élément existe dans la page.",
    remede: "Vérifie le sélecteur, puis l'ordre : place la balise script à la fin du corps, ou attends l'événement DOMContentLoaded. Teste le résultat de querySelector avant de l'employer.",
    exemple: {
      fautif: "const bouton = null;\nbouton.textContent = \"Envoyer\";",
      corrige: "const bouton = null;\nif (bouton) bouton.textContent = \"Envoyer\";"
    },
    lecon: { href: "js/lecon-10.html", label: "Le DOM : sélectionner et modifier" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-map-objet",
    langue: "javascript",
    type: "TypeError",
    message: "TypeError: scores.map is not a function",
    gabarit: "TypeError: ….map is not a function",
    motif: "^TypeError: .+\\.(?:map|filter|forEach|reduce) is not a function$",
    cles: ["typeerror", "map is not a function"],
    cause: "map, filter, forEach et reduce sont des méthodes de TABLEAU. Les appeler sur un objet simple, sur une NodeList ancienne ou sur undefined échoue.",
    remede: "Transforme d'abord en tableau : Object.entries pour un objet, Array.from pour une collection du DOM. Vérifie aussi que la valeur n'est pas undefined.",
    exemple: {
      fautif: "const scores = { ada: 12 };\nscores.map(function (x) { return x; });",
      corrige: "const scores = { ada: 12 };\nObject.entries(scores).map(function (paire) { return paire[1]; });"
    },
    lecon: { href: "js/lecon-08.html", label: "Transformer les tableaux (map/filter/reduce)" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-deja-declaree",
    langue: "javascript",
    type: "SyntaxError",
    message: "SyntaxError: Identifier 'total' has already been declared",
    gabarit: "SyntaxError: Identifier '…' has already been declared",
    motif: "^SyntaxError: Identifier '.+' has already been declared$",
    cles: ["syntaxerror", "has already been declared"],
    cause: "Le même nom est déclaré deux fois dans le même bloc. Contrairement à var, let et const l'interdisent — et c'est une erreur de SYNTAXE : rien du fichier ne s'exécute.",
    remede: "Pour changer la valeur, n'écris pas une seconde déclaration : affecte simplement le nom déjà déclaré.",
    exemple: {
      fautif: "let total = 1;\nlet total = 2;",
      corrige: "let total = 1;\ntotal = 2;"
    },
    lecon: { href: "js/lecon-02.html", label: "Variables, types et valeurs" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-parenthese",
    langue: "javascript",
    type: "SyntaxError",
    message: "SyntaxError: missing ) after argument list",
    gabarit: "SyntaxError: missing ) after argument list",
    motif: "^SyntaxError: missing \\) after argument list$",
    cles: ["syntaxerror", "missing", "argument list"],
    cause: "Une parenthèse d'appel n'est pas refermée. Le moteur signale l'endroit où il attendait la fermeture, qui n'est pas forcément celui de la faute.",
    remede: "Compte les parenthèses ouvrantes et fermantes de la ligne signalée et de celle d'avant. Un éditeur qui apparie les parenthèses trouve ce genre de faute en un coup d'œil.",
    exemple: {
      fautif: "console.log(\"bonjour\";",
      corrige: "console.log(\"bonjour\");"
    },
    lecon: { href: "js/lecon-01.html", label: "Prendre en main JavaScript" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-tofixed",
    langue: "javascript",
    type: "RangeError",
    message: "RangeError: toFixed() digits argument must be between 0 and 100",
    gabarit: "RangeError: toFixed() digits argument must be between 0 and 100",
    motif: "^RangeError: toFixed\\(\\) digits argument must be between 0 and 100$",
    cles: ["rangeerror", "tofixed", "digits argument"],
    cause: "toFixed accepte un nombre de décimales compris entre 0 et 100. Au-delà, il refuse — souvent parce que l'argument passé n'est pas celui qu'on croit (une variable qui contient autre chose qu'un petit entier).",
    remede: "Affiche l'argument avant l'appel. Pour un arrondi d'affichage courant, deux décimales suffisent.",
    exemple: {
      fautif: "const prix = 12.3456;\nconsole.log(prix.toFixed(105));",
      corrige: "const prix = 12.3456;\nconsole.log(prix.toFixed(2));"
    },
    lecon: { href: "js/lecon-14.html", label: "Les nombres et l'objet Math" },
    moteur: "Node v24.16.0"
  },
  {
    id: "js-await-hors-async",
    langue: "javascript",
    type: "SyntaxError",
    message: "SyntaxError: await is only valid in async functions and the top level bodies of modules",
    gabarit: "SyntaxError: await is only valid in async functions and the top level bodies of modules",
    motif: "^SyntaxError: await is only valid in async functions",
    cles: ["syntaxerror", "await", "async functions"],
    cause: "await ne s'emploie que dans une fonction déclarée async — ou au premier niveau d'un module ES. Dans une fonction ordinaire, c'est une erreur de syntaxe, donc rien ne s'exécute.",
    remede: "Ajoute async devant la fonction qui contient le await. Souviens-toi qu'appeler cette fonction rendra alors une promesse.",
    exemple: {
      fautif: "function charger() {\n  const r = await fetch(\"/x\");\n}",
      corrige: "async function charger() {\n  const r = await Promise.resolve(\"donnees\");\n  return r;\n}\ncharger();"
    },
    lecon: { href: "js/lecon-23.html", label: "Les promesses avancées" },
    moteur: "Node v24.16.0"
  },

  /* =========================== Python =========================== */
  {
    id: "py-name",
    langue: "python",
    type: "NameError",
    message: "NameError: name 'totl' is not defined. Did you mean: 'total'?",
    gabarit: "NameError: name '…' is not defined. Did you mean: '…'?",
    motif: "^NameError: name '.+' is not defined",
    cles: ["nameerror", "is not defined", "did you mean"],
    cause: "Le nom employé n'existe pas. Depuis Python 3.10, l'interpréteur va plus loin : il cherche le nom connu le plus proche et le propose — la suggestion est presque toujours la bonne.",
    remede: "Lis la suggestion : elle donne le nom que tu voulais écrire. S'il n'y en a pas, vérifie que la variable est bien créée AVANT cette ligne.",
    exemple: {
      fautif: "total = 10\nprint(totl)",
      corrige: "total = 10\nprint(total)"
    },
    lecon: { href: "python/lecon-02.html", label: "Variables et types" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-concat",
    langue: "python",
    type: "TypeError",
    message: "TypeError: can only concatenate str (not \"int\") to str",
    gabarit: "TypeError: can only concatenate str (not \"…\") to str",
    motif: "^TypeError: can only concatenate str \\(not \".+\"\\) to str$",
    cles: ["typeerror", "can only concatenate str"],
    cause: "Python ne convertit pas les nombres en texte tout seul. Le + entre une chaîne et un entier n'a pas de sens pour lui : ce serait tantôt une addition, tantôt une concaténation.",
    remede: "Convertis explicitement avec str(), ou — bien mieux — emploie une f-string, qui insère la valeur sans conversion manuelle.",
    exemple: {
      fautif: "age = 30\nprint(\"age : \" + age)",
      corrige: "age = 30\nprint(f\"age : {age}\")"
    },
    lecon: { href: "python/lecon-02.html", label: "Variables et types" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-indent",
    langue: "python",
    type: "IndentationError",
    message: "IndentationError: expected an indented block after 'if' statement on line 1",
    gabarit: "IndentationError: expected an indented block after '…' statement on line …",
    motif: "^IndentationError: expected an indented block after '.+' statement on line \\d+$",
    cles: ["indentationerror", "expected an indented block"],
    cause: "En Python, l'indentation N'EST PAS de la décoration : c'est elle qui délimite les blocs. Après un if, un for, un def ou un while suivis de deux-points, la ligne suivante DOIT être décalée.",
    remede: "Décale la ligne d'un cran (quatre espaces, par convention). N'alterne jamais espaces et tabulations dans un même fichier.",
    exemple: {
      fautif: "if True:\nprint(\"oui\")",
      corrige: "if True:\n    print(\"oui\")"
    },
    lecon: { href: "python/lecon-04.html", label: "Les conditions" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-index",
    langue: "python",
    type: "IndexError",
    message: "IndexError: list index out of range",
    gabarit: "IndexError: list index out of range",
    motif: "^IndexError: list index out of range$",
    cles: ["indexerror", "list index out of range"],
    cause: "L'indice demandé dépasse la liste. Rappel : les indices commencent à 0, donc une liste de trois éléments va de 0 à 2 — l'indice 3 n'existe pas.",
    remede: "Emploie len() pour connaître la taille, et rappelle-toi que le dernier indice vaut len - 1. Pour parcourir, préfère « for element in liste » à un compteur.",
    exemple: {
      fautif: "notes = [12, 15, 9]\nprint(notes[3])",
      corrige: "notes = [12, 15, 9]\nprint(notes[2])"
    },
    lecon: { href: "python/lecon-07.html", label: "Listes et tuples" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-key",
    langue: "python",
    type: "KeyError",
    message: "KeyError: 'age'",
    gabarit: "KeyError: '…'",
    motif: "^KeyError: ",
    cles: ["keyerror"],
    cause: "La clé demandée n'est pas dans le dictionnaire. Le message ne contient QUE la clé fautive, sans phrase — c'est normal.",
    remede: "Emploie .get(cle) pour obtenir None au lieu d'une erreur, ou .get(cle, defaut) pour une valeur de repli. Teste l'appartenance avec « if cle in dictionnaire ».",
    exemple: {
      fautif: "personne = {\"nom\": \"Ada\"}\nprint(personne[\"age\"])",
      corrige: "personne = {\"nom\": \"Ada\"}\nprint(personne.get(\"age\", \"inconnu\"))"
    },
    lecon: { href: "python/lecon-08.html", label: "Dictionnaires et ensembles" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-attribute",
    langue: "python",
    type: "AttributeError",
    message: "AttributeError: 'list' object has no attribute 'push'",
    gabarit: "AttributeError: '…' object has no attribute '…'",
    motif: "^AttributeError: '.+' object has no attribute '.+'",
    cles: ["attributeerror", "object has no attribute"],
    cause: "Le type indiqué n'a pas cette méthode. Ici, la faute vient d'une habitude prise dans un autre langage : en JavaScript on écrit push, en Python c'est append.",
    remede: "Le message donne le TYPE : cherche la bonne méthode pour ce type-là. dir(objet) en liste les noms disponibles.",
    exemple: {
      fautif: "nombres = [1, 2, 3]\nnombres.push(4)",
      corrige: "nombres = [1, 2, 3]\nnombres.append(4)"
    },
    lecon: { href: "python/lecon-07.html", label: "Listes et tuples" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-int",
    langue: "python",
    type: "ValueError",
    message: "ValueError: invalid literal for int() with base 10: 'trente'",
    gabarit: "ValueError: invalid literal for int() with base 10: '…'",
    motif: "^ValueError: invalid literal for int\\(\\) with base 10: ",
    cles: ["valueerror", "invalid literal for int"],
    cause: "int() sait convertir une chaîne de CHIFFRES, pas un mot. Le type est bon (une chaîne), c'est la valeur qui ne convient pas — d'où ValueError et non TypeError.",
    remede: "Vérifie ce que contient vraiment la chaîne, surtout si elle vient d'une saisie. Protège la conversion par un try/except ValueError, ou teste avec .isdigit().",
    exemple: {
      fautif: "age = int(\"trente\")",
      corrige: "texte = \"trente\"\nage = int(texte) if texte.isdigit() else 0\nprint(age)"
    },
    lecon: { href: "python/lecon-02.html", label: "Variables et types" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-zero",
    langue: "python",
    type: "ZeroDivisionError",
    message: "ZeroDivisionError: division by zero",
    gabarit: "ZeroDivisionError: division by zero",
    motif: "^ZeroDivisionError: (?:division by zero|integer division or modulo by zero|float division by zero)$",
    cles: ["zerodivisionerror", "division by zero"],
    cause: "Le diviseur vaut zéro. Le cas le plus fréquent n'est pas une constante mais une moyenne calculée sur une liste VIDE.",
    remede: "Teste le diviseur avant la division, et décide de ce qu'il faut rendre dans ce cas : zéro, None, ou une exception explicite.",
    exemple: {
      fautif: "total, n = 10, 0\nprint(total / n)",
      corrige: "total, n = 10, 0\nprint(total / n if n else 0)"
    },
    lecon: { href: "python/lecon-03.html", label: "Opérateurs et expressions" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-str-item",
    langue: "python",
    type: "TypeError",
    message: "TypeError: 'str' object does not support item assignment",
    gabarit: "TypeError: '…' object does not support item assignment",
    motif: "^TypeError: '.+' object does not support item assignment$",
    cles: ["typeerror", "does not support item assignment"],
    cause: "Les chaînes de Python sont IMMUABLES : on ne peut pas remplacer un caractère en place. Une liste, elle, le permet — d'où la surprise.",
    remede: "Fabrique une NOUVELLE chaîne : par découpage (mot[1:]), par .replace(), ou en passant par une liste puis \"\".join().",
    exemple: {
      fautif: "mot = \"chat\"\nmot[0] = \"r\"",
      corrige: "mot = \"chat\"\nmot = \"r\" + mot[1:]\nprint(mot)"
    },
    lecon: { href: "python/lecon-09.html", label: "Les chaînes de caractères" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-deux-points",
    langue: "python",
    type: "SyntaxError",
    message: "SyntaxError: expected ':'",
    gabarit: "SyntaxError: expected ':'",
    motif: "^SyntaxError: expected ':'$",
    cles: ["syntaxerror", "expected"],
    cause: "Il manque les deux-points qui ouvrent le bloc. Toute ligne qui commence un bloc — if, elif, else, for, while, def, class, try, except — se termine par deux-points.",
    remede: "Ajoute les deux-points en fin de ligne, et indente la ligne suivante.",
    exemple: {
      fautif: "if 3 > 2\n    print(\"oui\")",
      corrige: "if 3 > 2:\n    print(\"oui\")"
    },
    lecon: { href: "python/lecon-04.html", label: "Les conditions" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-parenthese",
    langue: "python",
    type: "SyntaxError",
    message: "SyntaxError: '(' was never closed",
    gabarit: "SyntaxError: '…' was never closed",
    motif: "^SyntaxError: '.' was never closed$",
    cles: ["syntaxerror", "was never closed"],
    cause: "Une parenthèse, un crochet ou une accolade reste ouvert. Python signale la ligne de l'OUVERTURE, pas celle où il s'en est aperçu : c'est beaucoup plus utile.",
    remede: "Va à la ligne indiquée et referme. Attention aux lignes suivantes qui semblent fautives : elles ne le sont pas, elles sont avalées par la parenthèse ouverte.",
    exemple: {
      fautif: "print(\"bonjour\"\nprint(\"fin\")",
      corrige: "print(\"bonjour\")\nprint(\"fin\")"
    },
    lecon: { href: "python/lecon-01.html", label: "Premiers pas en Python" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-module",
    langue: "python",
    type: "ModuleNotFoundError",
    message: "ModuleNotFoundError: No module named 'requetes'",
    gabarit: "ModuleNotFoundError: No module named '…'",
    motif: "^ModuleNotFoundError: No module named '.+'",
    cles: ["modulenotfounderror", "no module named"],
    cause: "Le module importé n'est pas installé, ou son nom est mal orthographié. Attention : le nom d'IMPORT et le nom du paquet à installer diffèrent parfois.",
    remede: "Vérifie d'abord l'orthographe, puis installe le paquet. ⚠️ Sur ce site, Python tourne dans le navigateur avec la bibliothèque standard SEULE : les paquets tiers ne sont pas disponibles, et ce message est alors normal.",
    exemple: {
      fautif: "import requetes",
      corrige: "import math\nprint(math.sqrt(144))"
    },
    lecon: { href: "python/lecon-11.html", label: "Modules et bibliothèque standard" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-argument",
    langue: "python",
    type: "TypeError",
    message: "TypeError: additionner() missing 1 required positional argument: 'b'",
    gabarit: "TypeError: …() missing … required positional argument…: '…'",
    motif: "^TypeError: .+\\(\\) missing \\d+ required positional argument",
    cles: ["typeerror", "missing", "required positional argument"],
    cause: "La fonction attend plus d'arguments qu'elle n'en a reçu. Le message nomme précisément ceux qui manquent.",
    remede: "Passe l'argument manquant, ou donne-lui une valeur par défaut dans la définition. ⚠️ Dans une méthode de classe, cette erreur vient souvent d'un self oublié.",
    exemple: {
      fautif: "def additionner(a, b):\n    return a + b\n\nadditionner(3)",
      corrige: "def additionner(a, b=0):\n    return a + b\n\nprint(additionner(3))"
    },
    lecon: { href: "python/lecon-06.html", label: "Les fonctions" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-unbound",
    langue: "python",
    type: "UnboundLocalError",
    message: "UnboundLocalError: cannot access local variable 'compteur' where it is not associated with a value",
    gabarit: "UnboundLocalError: cannot access local variable '…' where it is not associated with a value",
    motif: "^UnboundLocalError: (?:cannot access local variable|local variable) '.+'",
    cles: ["unboundlocalerror", "local variable"],
    cause: "Dès qu'une fonction AFFECTE un nom, ce nom devient local à la fonction — pour toute la fonction, y compris avant l'affectation. La variable globale du même nom devient alors inaccessible.",
    remede: "Si tu veux vraiment modifier la variable globale, déclare « global compteur ». Le plus souvent, mieux vaut passer la valeur en argument et RENDRE le résultat.",
    exemple: {
      fautif: "compteur = 0\n\ndef incrementer():\n    compteur = compteur + 1\n\nincrementer()",
      corrige: "compteur = 0\n\ndef incrementer(valeur):\n    return valeur + 1\n\ncompteur = incrementer(compteur)\nprint(compteur)"
    },
    lecon: { href: "python/lecon-06.html", label: "Les fonctions" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-recursion",
    langue: "python",
    type: "RecursionError",
    message: "RecursionError: maximum recursion depth exceeded",
    gabarit: "RecursionError: maximum recursion depth exceeded",
    motif: "^RecursionError: maximum recursion depth exceeded",
    cles: ["recursionerror", "maximum recursion depth"],
    cause: "Une fonction s'appelle elle-même sans jamais atteindre son cas d'arrêt. Python coupe à environ mille appels imbriqués plutôt que de laisser la pile déborder.",
    remede: "Assure-toi que la fonction a un cas d'arrêt ET que chaque appel s'en rapproche. Une boucle fait souvent le même travail sans risque.",
    exemple: {
      fautif: "def compter(n):\n    return compter(n + 1)\n\ncompter(0)",
      corrige: "def compter(n):\n    if n >= 3:\n        return n\n    return compter(n + 1)\n\nprint(compter(0))"
    },
    lecon: { href: "python/lecon-06.html", label: "Les fonctions" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },
  {
    id: "py-int-iterable",
    langue: "python",
    type: "TypeError",
    message: "TypeError: 'int' object is not iterable",
    gabarit: "TypeError: '…' object is not iterable",
    motif: "^TypeError: '.+' object is not iterable$",
    cles: ["typeerror", "object is not iterable"],
    cause: "for parcourt une SUITE de valeurs : une liste, une chaîne, un dictionnaire, un range. Un nombre seul n'en est pas une.",
    remede: "Pour répéter un nombre donné de fois, parcours range(n). Vérifie aussi que la variable parcourue contient bien ce que tu crois.",
    exemple: {
      fautif: "for x in 5:\n    print(x)",
      corrige: "for x in range(5):\n    print(x)"
    },
    lecon: { href: "python/lecon-05.html", label: "Les boucles" },
    moteur: "CPython 3.14.5 · identique dans Pyodide 3.12.1"
  },

  /* ============================== SQL ============================== */
  {
    id: "sql-table",
    langue: "sql",
    type: "no such table",
    message: "no such table: clients",
    gabarit: "no such table: …",
    motif: "^no such table: .+",
    cles: ["no such table"],
    cause: "La table nommée n'existe pas dans la base ouverte. Presque toujours : un pluriel de trop ou de moins, une faute de frappe, ou une base qui n'est pas celle qu'on croit.",
    remede: "Vérifie le nom exact, au singulier comme au pluriel. SQLite distingue mal la casse des identifiants mais pas leur orthographe : liste les tables avec « SELECT name FROM sqlite_master WHERE type = 'table' ».",
    exemple: {
      fautif: "SELECT * FROM clients;",
      corrige: "SELECT * FROM client;"
    },
    lecon: { href: "sql/lecon-02.html", label: "Filtrer avec WHERE" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-colonne",
    langue: "sql",
    type: "no such column",
    message: "no such column: nom_complet",
    gabarit: "no such column: …",
    motif: "^no such column: .+",
    cles: ["no such column"],
    cause: "La colonne demandée n'existe pas dans les tables citées. Attention au piège : une chaîne écrite avec des guillemets DOUBLES est prise pour un nom de colonne par SQLite, d'où ce message sur ce qu'on croyait être du texte.",
    remede: "Vérifie le nom de la colonne, et n'emploie que des apostrophes simples pour le texte : 'Paris', jamais \"Paris\".",
    exemple: {
      fautif: "SELECT nom_complet FROM client;",
      corrige: "SELECT nom FROM client;"
    },
    lecon: { href: "sql/lecon-02.html", label: "Filtrer avec WHERE" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-syntaxe",
    langue: "sql",
    type: "syntax error",
    message: "near \"FORM\": syntax error",
    gabarit: "near \"…\": syntax error",
    motif: "^near \".*\": syntax error",
    cles: ["syntax error", "near"],
    cause: "SQLite bute sur un mot. Le mot cité entre guillemets est celui qu'il n'attendait pas — la faute est donc souvent JUSTE AVANT lui.",
    remede: "Relis le mot signalé et celui qui le précède : mot-clé mal orthographié, virgule en trop, parenthèse manquante, apostrophe non fermée.",
    exemple: {
      fautif: "SELECT * FORM client;",
      corrige: "SELECT * FROM client;"
    },
    lecon: { href: "sql/lecon-02.html", label: "Filtrer avec WHERE" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-unique",
    langue: "sql",
    type: "UNIQUE constraint failed",
    message: "UNIQUE constraint failed: client.email",
    gabarit: "UNIQUE constraint failed: ….…",
    motif: "^UNIQUE constraint failed: .+",
    cles: ["unique constraint failed"],
    cause: "La colonne citée porte une contrainte d'unicité, et la valeur insérée y figure déjà. C'est la base qui protège tes données : elle refuse le doublon.",
    remede: "Cherche la ligne existante avant d'insérer, ou emploie « INSERT OR IGNORE », ou « ON CONFLICT DO UPDATE » pour mettre à jour au lieu d'insérer.",
    exemple: {
      fautif: "INSERT INTO client (nom, email) VALUES ('Grace', 'ada@example.com');",
      corrige: "INSERT INTO client (nom, email) VALUES ('Grace', 'grace@example.com');"
    },
    lecon: { href: "sql/lecon-06.html", label: "Modéliser : tables, clés et relations" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-notnull",
    langue: "sql",
    type: "NOT NULL constraint failed",
    message: "NOT NULL constraint failed: client.nom",
    gabarit: "NOT NULL constraint failed: ….…",
    motif: "^NOT NULL constraint failed: .+",
    cles: ["not null constraint failed"],
    cause: "Une colonne déclarée NOT NULL n'a reçu aucune valeur. Elle n'était pas dans la liste des colonnes de l'INSERT, ou la valeur fournie vaut NULL.",
    remede: "Fournis la valeur, ou donne une valeur par défaut à la colonne dans le schéma (DEFAULT).",
    exemple: {
      fautif: "INSERT INTO client (email) VALUES ('bob@example.com');",
      corrige: "INSERT INTO client (nom, email) VALUES ('Bob', 'bob@example.com');"
    },
    lecon: { href: "sql/lecon-06.html", label: "Modéliser : tables, clés et relations" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-ambigu",
    langue: "sql",
    type: "ambiguous column name",
    message: "ambiguous column name: id",
    gabarit: "ambiguous column name: …",
    motif: "^ambiguous column name: .+",
    cles: ["ambiguous column name"],
    cause: "Deux tables jointes portent une colonne du même nom : la base ne peut pas deviner laquelle tu veux. C'est le cas classique de « id ».",
    remede: "Préfixe la colonne par sa table — client.id — ou donne un alias aux tables.",
    exemple: {
      fautif: "SELECT id FROM client JOIN commande ON client.id = commande.client_id;",
      corrige: "SELECT client.id FROM client JOIN commande ON client.id = commande.client_id;"
    },
    lecon: { href: "sql/lecon-05.html", label: "Agréger : COUNT, SUM et GROUP BY" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-nb-valeurs",
    langue: "sql",
    type: "values for",
    message: "1 values for 2 columns",
    gabarit: "… values for … columns",
    motif: "^\\d+ values for \\d+ columns",
    cles: ["values for", "columns"],
    cause: "Le nombre de valeurs ne correspond pas au nombre de colonnes nommées dans l'INSERT.",
    remede: "Compte les colonnes et les valeurs. Nommer explicitement les colonnes — INSERT INTO t (a, b) — rend la faute visible et protège des changements de schéma.",
    exemple: {
      fautif: "INSERT INTO client (nom, email) VALUES ('Bob');",
      corrige: "INSERT INTO client (nom, email) VALUES ('Bob', 'bob@example.com');"
    },
    lecon: { href: "sql/lecon-06.html", label: "Modéliser : tables, clés et relations" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-fonction",
    langue: "sql",
    type: "no such function",
    message: "no such function: NOW",
    gabarit: "no such function: …",
    motif: "^no such function: .+",
    cles: ["no such function"],
    cause: "La fonction n'existe pas dans CE moteur. Le SQL n'est pas le même partout : NOW() est MySQL, GETDATE() est SQL Server, SQLite écrit DATE('now').",
    remede: "Cherche l'équivalent du moteur que tu emploies. En SQLite : DATE('now'), DATETIME('now'), STRFTIME.",
    exemple: {
      fautif: "SELECT NOW() FROM client;",
      corrige: "SELECT DATE('now') FROM client;"
    },
    lecon: { href: "sql/lecon-04.html", label: "Fonctions et expressions" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-agregat",
    langue: "sql",
    type: "misuse of aggregate",
    message: "misuse of aggregate function COUNT()",
    gabarit: "misuse of aggregate function …()",
    motif: "^misuse of aggregate",
    cles: ["misuse of aggregate"],
    cause: "WHERE filtre les lignes AVANT tout regroupement : une fonction d'agrégat n'y a donc pas encore de sens. C'est HAVING qui filtre APRÈS regroupement.",
    remede: "Déplace la condition d'agrégat dans HAVING, après le GROUP BY.",
    exemple: {
      fautif: "SELECT nom FROM client WHERE COUNT(*) > 1;",
      corrige: "SELECT ville FROM client GROUP BY ville HAVING COUNT(*) > 1;"
    },
    lecon: { href: "sql/lecon-04.html", label: "Fonctions et expressions" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-sous-requete",
    langue: "sql",
    type: "sub-select returns",
    message: "sub-select returns 2 columns - expected 1",
    gabarit: "sub-select returns … columns - expected …",
    motif: "^sub-select returns \\d+ columns",
    cles: ["sub-select returns", "expected"],
    cause: "Une sous-requête employée avec IN ou une comparaison doit rendre UNE SEULE colonne. Celle-ci en rend plusieurs.",
    remede: "Ne sélectionne que la colonne comparée dans la sous-requête.",
    exemple: {
      fautif: "SELECT * FROM commande WHERE client_id IN (SELECT id, nom FROM client);",
      corrige: "SELECT * FROM commande WHERE client_id IN (SELECT id FROM client);"
    },
    lecon: { href: "sql/lecon-05.html", label: "Agréger : COUNT, SUM et GROUP BY" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-incomplet",
    langue: "sql",
    type: "incomplete input",
    message: "incomplete input",
    gabarit: "incomplete input",
    motif: "^incomplete input$",
    cles: ["incomplete input"],
    cause: "La requête s'arrête au milieu : il manque la fin. Souvent une comparaison sans valeur, une parenthèse ou une apostrophe jamais refermée — tout ce qui suit est alors avalé.",
    remede: "Relis la fin de la requête et compte les apostrophes et les parenthèses.",
    exemple: {
      fautif: "SELECT * FROM client WHERE nom =",
      corrige: "SELECT * FROM client WHERE nom = 'Ada';"
    },
    lecon: { href: "sql/lecon-02.html", label: "Filtrer avec WHERE" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-order-range",
    langue: "sql",
    type: "ORDER BY term out of range",
    message: "1st ORDER BY term out of range - should be between 1 and 1",
    gabarit: "…st ORDER BY term out of range - should be between … and …",
    motif: "ORDER BY term out of range",
    cles: ["order by term out of range"],
    cause: "Trier par un NUMÉRO de colonne suppose que ce numéro existe dans le résultat. Ici le SELECT rend moins de colonnes que le numéro demandé.",
    remede: "Trie par le NOM de la colonne plutôt que par son rang : c'est lisible, et ça survit à un changement du SELECT.",
    exemple: {
      fautif: "SELECT ville FROM client ORDER BY 9;",
      corrige: "SELECT ville FROM client ORDER BY ville;"
    },
    lecon: { href: "sql/lecon-03.html", label: "Trier et limiter les résultats" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-table-existe",
    langue: "sql",
    type: "already exists",
    message: "table client already exists",
    gabarit: "table … already exists",
    motif: "^table .+ already exists$",
    cles: ["already exists"],
    cause: "La table existe déjà : un CREATE TABLE ne l'écrase pas, il refuse.",
    remede: "Emploie « CREATE TABLE IF NOT EXISTS » pour un script rejouable, ou supprime la table d'abord si tu veux vraiment la refaire.",
    exemple: {
      fautif: "CREATE TABLE client (id INTEGER);",
      corrige: "CREATE TABLE IF NOT EXISTS client (id INTEGER);"
    },
    lecon: { href: "sql/lecon-06.html", label: "Modéliser : tables, clés et relations" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },
  {
    id: "sql-fk",
    langue: "sql",
    type: "FOREIGN KEY constraint failed",
    message: "FOREIGN KEY constraint failed",
    gabarit: "FOREIGN KEY constraint failed",
    motif: "^FOREIGN KEY constraint failed$",
    cles: ["foreign key constraint failed"],
    cause: "La ligne insérée référence une clé qui n'existe pas dans la table pointée — ou l'on supprime une ligne encore référencée ailleurs. La base refuse de laisser une référence dans le vide.",
    remede: "Insère d'abord la ligne référencée, ou corrige l'identifiant. ⚠️ En SQLite, cette vérification n'est active que si « PRAGMA foreign_keys = ON » a été exécuté : sans lui, la faute passe INAPERÇUE.",
    exemple: {
      fautif: "PRAGMA foreign_keys = ON;\nINSERT INTO commande (client_id, montant) VALUES (999, 10);",
      corrige: "PRAGMA foreign_keys = ON;\nINSERT INTO commande (client_id, montant) VALUES (1, 10);"
    },
    lecon: { href: "sql/lecon-06.html", label: "Modéliser : tables, clés et relations" },
    moteur: "SQLite 3.49.1 (sql.js, le moteur embarqué du site)"
  },

  /* ============================= Bash ============================= */
  {
    id: "sh-command-not-found",
    langue: "bash",
    type: "command not found",
    message: "monoutil: command not found",
    gabarit: "…: line …: …: command not found",
    motif: "command not found|commande introuvable",
    cles: ["command not found"],
    cause: "Le shell n'a trouvé aucun programme de ce nom dans le PATH. Faute de frappe, outil non installé, ou script local appelé sans son chemin.",
    remede: "Vérifie l'orthographe, puis que l'outil est installé. Pour un script du dossier courant, écris ./monscript.sh — le répertoire courant n'est pas dans le PATH, et c'est voulu.",
    exemple: {
      fautif: "monoutil --version",
      corrige: "echo \"monoutil --version\""
    },
    lecon: { href: "bash/lecon-01.html", label: "Le terminal et le shell" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-no-such-file",
    langue: "bash",
    type: "No such file or directory",
    message: "cat: /tmp/fichier-qui-nexiste-pas-42.txt: No such file or directory",
    gabarit: "…: …: No such file or directory",
    motif: "No such file or directory|Aucun fichier ou dossier",
    cles: ["no such file or directory"],
    cause: "Le fichier ou le dossier nommé n'existe pas à cet endroit. Chemin relatif parti d'un autre répertoire que celui qu'on croit, ou nom mal orthographié.",
    remede: "Affiche le répertoire courant avec pwd et le contenu avec ls. Dans un script, ne suppose jamais le répertoire de départ : construis les chemins depuis celui du script.",
    exemple: {
      fautif: "cat /tmp/fichier-qui-nexiste-pas-42.txt",
      corrige: "f=/tmp/fichier-qui-nexiste-pas-42.txt\nif [ -f \"$f\" ]; then cat \"$f\"; else echo \"fichier absent\"; fi"
    },
    lecon: { href: "bash/lecon-03.html", label: "Manipuler fichiers et dossiers" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-eof-guillemet",
    langue: "bash",
    type: "unexpected EOF",
    message: "unexpected EOF while looking for matching `\"'",
    gabarit: "unexpected EOF while looking for matching `…'",
    motif: "unexpected EOF while looking for matching",
    cles: ["unexpected eof", "looking for matching"],
    cause: "Un guillemet, une apostrophe ou une parenthèse n'a jamais été refermé : le shell a lu tout le fichier en cherchant sa fermeture.",
    remede: "Le caractère cité entre accents graves est celui qu'il attendait. Cherche son ouverture — un éditeur qui colore les chaînes la montre d'un coup d'œil.",
    exemple: {
      fautif: "echo \"bonjour",
      corrige: "echo \"bonjour\""
    },
    lecon: { href: "bash/lecon-02.html", label: "Naviguer dans le système de fichiers" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-token-inattendu",
    langue: "bash",
    type: "syntax error near unexpected token",
    message: "syntax error near unexpected token `echo'",
    gabarit: "syntax error near unexpected token `…'",
    motif: "syntax error near unexpected token",
    cles: ["syntax error near unexpected token"],
    cause: "Le shell a rencontré un mot là où il attendait autre chose. Le plus souvent, un mot-clé de structure manque : do après for, then après if.",
    remede: "Le mot cité est celui qui a surpris le shell : la faute est juste avant lui.",
    exemple: {
      fautif: "for i in 1 2; echo $i",
      corrige: "for i in 1 2; do echo $i; done"
    },
    lecon: { href: "bash/lecon-04.html", label: "Lire, chercher et filtrer du texte" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-fin-de-fichier",
    langue: "bash",
    type: "unexpected end of file",
    message: "syntax error: unexpected end of file from `if' command on line 1",
    gabarit: "syntax error: unexpected end of file from `…' command on line …",
    motif: "syntax error: unexpected end of file",
    cles: ["unexpected end of file"],
    cause: "Un bloc est resté ouvert : le shell est arrivé à la fin du fichier sans trouver son fi, son done ou son accolade fermante. Le message indique la LIGNE D'OUVERTURE du bloc coupable.",
    remede: "Va à la ligne indiquée et referme le bloc. Indenter les blocs rend ces oublis visibles.",
    exemple: {
      fautif: "if true\nthen\n  echo ok",
      corrige: "if true\nthen\n  echo ok\nfi"
    },
    lecon: { href: "bash/lecon-04.html", label: "Lire, chercher et filtrer du texte" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-test-unaire",
    langue: "bash",
    type: "unary operator expected",
    message: "[: 5: unary operator expected",
    gabarit: "[: …: unary operator expected",
    motif: "unary operator expected|opérateur unaire attendu",
    cles: ["unary operator expected"],
    cause: "Le test manque d'un opérande. Cas très fréquent : une variable VIDE ou non définie disparaît du test avant qu'il ne soit évalué, et il ne reste plus qu'un opérateur solitaire.",
    remede: "Mets toujours les variables entre guillemets dans un test : [ \"$x\" -eq 5 ]. Une variable vide devient alors une chaîne vide, et non rien du tout.",
    exemple: {
      fautif: "x=5\n[ $x -eq ]",
      corrige: "x=5\n[ \"$x\" -eq 5 ]"
    },
    lecon: { href: "bash/lecon-04.html", label: "Lire, chercher et filtrer du texte" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-substitution",
    langue: "bash",
    type: "bad substitution",
    message: "${x!!}: bad substitution",
    gabarit: "${…}: bad substitution",
    motif: "bad substitution",
    cles: ["bad substitution"],
    cause: "La syntaxe d'expansion entre accolades est invalide. Souvent une opération que le shell ne connaît pas, ou un script écrit pour Bash mais exécuté par sh.",
    remede: "Relis la forme employée. Et si le script emploie des expansions de Bash, lance-le avec bash, pas avec sh — le shebang #!/usr/bin/env bash ne suffit pas si l'on écrit « sh script.sh ».",
    exemple: {
      fautif: "x=1\necho ${x!!}",
      corrige: "x=1\necho ${x}"
    },
    lecon: { href: "bash/lecon-02.html", label: "Naviguer dans le système de fichiers" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-unbound",
    langue: "bash",
    type: "unbound variable",
    message: "INEXISTANT: unbound variable",
    gabarit: "…: unbound variable",
    motif: "unbound variable|variable sans liaison",
    cles: ["unbound variable"],
    cause: "La variable n'est pas définie, et le script tourne avec « set -u », qui refuse justement de lire une variable inexistante — au lieu de la remplacer silencieusement par du vide.",
    remede: "Ce message est un cadeau : sans set -u, la faute aurait produit un chemin vide, donc éventuellement une suppression à la racine. Définis la variable, ou donne-lui une valeur par défaut : ${VAR:-valeur}.",
    exemple: {
      fautif: "set -u\necho \"$INEXISTANT\"",
      corrige: "set -u\necho \"${INEXISTANT:-valeur par défaut}\""
    },
    lecon: { href: "bash/lecon-08.html", label: "Fonctions, robustesse et automatisation" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-division",
    langue: "bash",
    type: "division by 0",
    message: "5 / n: division by 0 (error token is \"n\")",
    gabarit: "…: division by 0 (error token is \"…\")",
    motif: "division by 0|division par 0",
    cles: ["division by 0"],
    cause: "Division par zéro dans une expression arithmétique. Attention au piège du shell : une variable VIDE ou non numérique y vaut zéro, sans le moindre avertissement.",
    remede: "Teste le diviseur avant de diviser, et vérifie que la variable contient bien un nombre.",
    exemple: {
      fautif: "n=0\necho $((5 / n))",
      corrige: "n=0\nif [ \"$n\" -ne 0 ]; then echo $((5 / n)); else echo \"division impossible\"; fi"
    },
    lecon: { href: "bash/lecon-02.html", label: "Naviguer dans le système de fichiers" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  },
  {
    id: "sh-readonly",
    langue: "bash",
    type: "readonly variable",
    message: "TAUX: readonly variable",
    gabarit: "…: readonly variable",
    motif: "readonly variable|variable en lecture seule",
    cles: ["readonly variable"],
    cause: "La variable a été déclarée en lecture seule (declare -r ou readonly) : le shell refuse de la modifier.",
    remede: "Si la valeur doit changer, ne la déclare pas en lecture seule. Sinon, cherche pourquoi une affectation la vise — c'est souvent le signe d'un nom réutilisé par mégarde.",
    exemple: {
      fautif: "declare -r TAUX=1\nTAUX=2",
      corrige: "TAUX=1\nTAUX=2\necho \"$TAUX\""
    },
    lecon: { href: "bash/lecon-02.html", label: "Naviguer dans le système de fichiers" },
    moteur: "GNU bash 5.3, LC_ALL=C"
  }
];
