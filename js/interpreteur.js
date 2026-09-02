/* =============================================================================
   interpreteur.js — un MINI-INTERPRÉTEUR JavaScript qui exécute un programme
   et enregistre CHAQUE PAS de son exécution (chantier V15, point B1).

   POURQUOI CE FICHIER EXISTE
   Le site explique la pile d'appels dans 50 leçons et ne la montre jamais.
   `js/visualisations.js` prouve que la technique du « rejeu d'une liste
   d'étapes » marche — mais il ne sait faire que cinq tris et la recherche
   binaire, parce que ses étapes sont écrites À LA MAIN, algorithme par
   algorithme. Il ne saura jamais montrer une fermeture ni une microtâche.

   TROIS TECHNIQUES ÉTAIENT POSSIBLES, ET LE CHOIX N'EST PAS UNE PRÉFÉRENCE
   (a) un mini-interpréteur : on réécrit l'exécution, donc on possède la portée,
       la pile, la file des tâches — et on peut les MONTRER ;
   (b) une réécriture du source qui insère des points d'arrêt puis confie le
       tout au vrai moteur : plus court, mais on ne peut PAS lire de l'extérieur
       l'environnement capturé par une fermeture, ni l'ordre réel des
       microtâches — or c'est exactement ce que les points B4 et B5 demandent ;
   (c) des scénarios pré-enregistrés, comme aujourd'hui : c'est une AFFIRMATION
       écrite à la main. Rien ne la distingue, à la lecture, d'une affirmation
       fausse — c'est précisément ce qui a laissé passer cinq exemples faux sous
       quatre vérificateurs verts.
   Le critère qui tranche est la VÉRIFIABILITÉ : (a) est la seule technique dont
   le résultat se confronte à une vérité de terrain — le vrai moteur JavaScript.
   `tools/verif-interpreteur.js` exécute chaque programme DEUX FOIS, ici et dans
   le vrai Node, et compare les sorties. Un interpréteur faux se voit ; un
   scénario faux, non.

   CE QUI EST SIMULÉ EXACTEMENT, ET QUI COMPTE POUR ENSEIGNER
   - la chaîne des portées (globale → fonction → bloc), donc les fermetures ;
   - la zone morte temporelle de `let` / `const` (utiliser avant de déclarer) ;
   - la liaison PAR TOUR de `for (let i …)`, opposée à celle de `for (var i …)` ;
   - `this` : méthode, fonction nue, fonction fléchée (portée lexicale) ;
   - la pile d'appels, qui monte et redescend, avec la ligne de chaque cadre ;
   - la boucle d'événements : file des MACROtâches (`setTimeout`, ordonnées par
     échéance puis par ordre d'inscription) et file des MICROtâches (promesses),
     les microtâches étant toujours vidées AVANT la macrotâche suivante.

   LE MODE : STRICT, TOUJOURS
   `this` vaut `undefined` dans une fonction appelée nue, et écrire dans une
   variable jamais déclarée est une erreur. C'est le mode des classes, des
   modules, et celui que tout cours moderne enseigne. Le programme témoin de
   `verif-interpreteur.js` est lui aussi en mode strict, sans quoi l'écart
   mesuré serait un écart de MODE et non de justesse.

   CE QUI N'EST PAS SUPPORTÉ, ET QUI EST ASSUMÉ
   déstructuration, `...` (reste/étalement), générateurs, `RegExp`, `Map`/`Set`,
   `instanceof`, getters/setters, modules, étiquettes de boucle, `switch`,
   chaînage optionnel, `prototype` / `Object.create`, méthodes et champs
   statiques de classe. Un programme qui en contient est REFUSÉ avec un message
   en français et un numéro de ligne — jamais exécuté de travers en silence.

   ET DEUX LIMITES QUI NE SE VOIENT PAS À L'ANALYSE, DONC REFUSÉES À L'EXÉCUTION
   - une méthode de conversion écrite par l'apprenant (`toString`, `valueOf`) :
     la conversion arrive au milieu d'un opérateur, hors de la machine à pas, et
     on ne peut pas y appeler une fonction interprétée. Le moteur refuse en le
     disant plutôt que d'afficher « [object Object] » en silence ;
   - le texte source exact d'une fonction convertie en chaîne (forme abrégée).
   Ces deux limites sont dans le corpus de preuve, marquées `limite`, et l'outil
   VÉRIFIE qu'elles s'écartent toujours : le jour où l'une cesse de s'écarter,
   c'est qu'elle a disparu et que ce commentaire est périmé.

   CE QUE LA CONTRADICTION A CORRIGÉ (et pourquoi ce fichier est écrit ainsi)
   Le premier corpus, 62 programmes, était vert du premier coup. Quatre
   relectures adversariales chargées de DÉMOLIR ce résultat ont écrit 145 autres
   programmes et trouvé 67 écarts, soit 25 causes racines — dont un `for (var …
   of …)` qui montrait le piège des fermetures À L'ENVERS, et une affectation
   qui écrivait dans la mauvaise case mémoire. Un corpus vert ne prouve rien de
   plus que ce qu'il contient. Voir `tools/preuves/interpreteur-contre-exemples.js`.

   100 % file:// : aucun `eval`, aucun `new Function`, aucun module ES, aucune
   dépendance. Tourne dans le navigateur comme dans Node (pour les outils).
   ============================================================================= */
(function (racine) {
  "use strict";

  /* ======================================================================== */
  /* 1. ANALYSE LEXICALE                                                      */
  /* ======================================================================== */

  var MOTS_CLES = ("var let const function return if else while do for of in break continue " +
    "new typeof this true false null undefined class extends super throw try catch finally " +
    "async await void delete instanceof switch case default yield").split(" ");
  var EST_MOT_CLE = {};
  for (var mi = 0; mi < MOTS_CLES.length; mi++) EST_MOT_CLE[MOTS_CLES[mi]] = true;

  var PONCTS = ["...", "===", "!==", "**=", "&&=", "||=", "??=", "=>", "==", "!=", "<=", ">=",
    "&&", "||", "??", "**", "++", "--", "+=", "-=", "*=", "/=", "%=", "?.",
    "{", "}", "(", ")", "[", "]", ";", ",", "<", ">", "+", "-", "*", "/", "%",
    "!", "?", ":", "=", ".", "&", "|", "^", "~"];
  PONCTS.sort(function (a, b) { return b.length - a.length; });

  function ErreurSyntaxe(message, ligne) {
    this.nom = "ErreurSyntaxe"; this.message = message; this.ligne = ligne || 0;
  }
  ErreurSyntaxe.prototype.toString = function () {
    return "Ligne " + this.ligne + " : " + this.message;
  };

  function lireEchappement(src, i) { /* i pointe APRÈS la barre oblique inverse */
    var c = src.charAt(i);
    if (c === "n") return ["\n", i + 1];
    if (c === "t") return ["\t", i + 1];
    if (c === "r") return ["\r", i + 1];
    if (c === "b") return ["\b", i + 1];
    if (c === "f") return ["\f", i + 1];
    if (c === "v") return ["\v", i + 1];
    if (c === "0") return ["\0", i + 1];
    if (c === "u") {
      if (src.charAt(i + 1) === "{") {
        var f = src.indexOf("}", i);
        return [String.fromCodePoint(parseInt(src.slice(i + 2, f), 16)), f + 1];
      }
      return [String.fromCharCode(parseInt(src.substr(i + 1, 4), 16)), i + 5];
    }
    if (c === "x") return [String.fromCharCode(parseInt(src.substr(i + 1, 2), 16)), i + 3];
    if (c === "\n") return ["", i + 1];
    return [c, i + 1];
  }

  var RE_ID_DEBUT = /[A-Za-z_$À-ɏ]/;
  var RE_ID_SUITE = /[A-Za-z0-9_$À-ɏ]/;

  function lexer(src, ligne0) {
    var i = 0, n = src.length, ligne = ligne0 || 1, toks = [];
    while (i < n) {
      var c = src.charAt(i);
      if (c === "\n") { ligne++; i++; continue; }
      if (c === " " || c === "\t" || c === "\r" || c === "﻿") { i++; continue; }
      if (c === "/" && src.charAt(i + 1) === "/") { while (i < n && src.charAt(i) !== "\n") i++; continue; }
      if (c === "/" && src.charAt(i + 1) === "*") {
        i += 2;
        while (i < n && !(src.charAt(i) === "*" && src.charAt(i + 1) === "/")) { if (src.charAt(i) === "\n") ligne++; i++; }
        i += 2; continue;
      }
      var l0 = ligne;

      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src.charAt(i + 1)))) {
        var d = i;
        if (c === "0" && /[xXbBoO]/.test(src.charAt(i + 1))) {
          i += 2; while (i < n && /[0-9a-fA-F_]/.test(src.charAt(i))) i++;
        } else {
          while (i < n && /[0-9_]/.test(src.charAt(i))) i++;
          if (src.charAt(i) === ".") { i++; while (i < n && /[0-9_]/.test(src.charAt(i))) i++; }
          if (/[eE]/.test(src.charAt(i))) { i++; if (/[+\-]/.test(src.charAt(i))) i++; while (i < n && /[0-9]/.test(src.charAt(i))) i++; }
        }
        toks.push({ type: "nombre", valeur: Number(src.slice(d, i).replace(/_/g, "")), ligne: l0 });
        continue;
      }

      if (c === "'" || c === '"') {
        var q = c; i++; var s = "";
        while (i < n && src.charAt(i) !== q) {
          if (src.charAt(i) === "\\") { var r = lireEchappement(src, i + 1); s += r[0]; i = r[1]; continue; }
          if (src.charAt(i) === "\n") ligne++;
          s += src.charAt(i); i++;
        }
        if (i >= n) throw new ErreurSyntaxe("chaîne de caractères jamais refermée", l0);
        i++;
        toks.push({ type: "chaine", valeur: s, ligne: l0 });
        continue;
      }

      if (c === "`") {
        i++;
        var parties = [], exprs = [], cur = "";
        while (i < n && src.charAt(i) !== "`") {
          var ch = src.charAt(i);
          if (ch === "\\") { var r2 = lireEchappement(src, i + 1); cur += r2[0]; i = r2[1]; continue; }
          if (ch === "$" && src.charAt(i + 1) === "{") {
            parties.push(cur); cur = "";
            var prof = 1, j = i + 2, dl = ligne;
            while (j < n && prof > 0) {
              var cj = src.charAt(j);
              if (cj === "{") prof++;
              else if (cj === "}") prof--;
              else if (cj === "\n") ligne++;
              else if (cj === "'" || cj === '"') {
                var qq = cj; j++;
                while (j < n && src.charAt(j) !== qq) { if (src.charAt(j) === "\\") j++; j++; }
              }
              if (prof > 0) j++;
            }
            if (prof > 0) throw new ErreurSyntaxe("« ${ » jamais refermé dans le gabarit", l0);
            exprs.push({ src: src.slice(i + 2, j), ligne: dl });
            i = j + 1; continue;
          }
          if (ch === "\n") ligne++;
          cur += ch; i++;
        }
        if (i >= n) throw new ErreurSyntaxe("gabarit (accent grave) jamais refermé", l0);
        i++;
        parties.push(cur);
        toks.push({ type: "gabarit", parties: parties, exprs: exprs, ligne: l0 });
        continue;
      }

      if (RE_ID_DEBUT.test(c)) {
        var d2 = i;
        while (i < n && RE_ID_SUITE.test(src.charAt(i))) i++;
        var mot = src.slice(d2, i);
        toks.push({ type: EST_MOT_CLE[mot] ? "motcle" : "nom", valeur: mot, ligne: l0 });
        continue;
      }

      var trouve = null;
      for (var pi = 0; pi < PONCTS.length; pi++) {
        if (src.substr(i, PONCTS[pi].length) === PONCTS[pi]) { trouve = PONCTS[pi]; break; }
      }
      if (!trouve) throw new ErreurSyntaxe("caractère inattendu « " + c + " »", ligne);
      toks.push({ type: "ponct", valeur: trouve, ligne: l0 });
      i += trouve.length;
    }
    toks.push({ type: "fin", valeur: "", ligne: ligne });
    return toks;
  }

  /* ======================================================================== */
  /* 2. ANALYSE SYNTAXIQUE                                                    */
  /* ======================================================================== */

  var PREC = {
    "??": 1, "||": 2, "&&": 3, "|": 4, "^": 5, "&": 6,
    "==": 7, "!=": 7, "===": 7, "!==": 7,
    "<": 8, ">": 8, "<=": 8, ">=": 8,
    "+": 10, "-": 10, "*": 11, "/": 11, "%": 11, "**": 12
  };
  var NON_SUPPORTE = {
    "switch": "l'instruction « switch »",
    "yield": "les générateurs (« yield »)",
    "instanceof": "l'opérateur « instanceof »"
  };

  function Parseur(toks) { this.t = toks; this.p = 0; }
  var P = Parseur.prototype;

  P.regarde = function (k) { return this.t[this.p + (k || 0)] || this.t[this.t.length - 1]; };
  P.est = function (v) { var t = this.t[this.p]; return (t.type === "ponct" || t.type === "motcle") && t.valeur === v; };
  P.mange = function (v) { if (this.est(v)) { this.p++; return true; } return false; };
  P.exige = function (v) { if (!this.mange(v)) this.erreur("« " + v + " » attendu"); };
  P.erreur = function (m) {
    var t = this.t[this.p];
    throw new ErreurSyntaxe(m + " (trouvé : " + (t.type === "fin" ? "la fin du programme" : "« " + t.valeur + " »") + ")", t.ligne);
  };
  P.nom = function () {
    var t = this.t[this.p];
    if (t.type !== "nom" && !(t.type === "motcle" && (t.valeur === "of" || t.valeur === "async"))) this.erreur("un nom était attendu");
    this.p++; return t.valeur;
  };
  P.pointVirgule = function () { this.mange(";"); };

  P.programme = function () {
    var corps = [];
    while (this.t[this.p].type !== "fin") corps.push(this.instruction());
    return { type: "Prog", corps: corps, ligne: 1 };
  };

  P.instruction = function () {
    var t = this.t[this.p], l = t.ligne;
    if (t.type === "ponct" && t.valeur === "{") return this.bloc();
    if (t.type === "ponct" && t.valeur === ";") { this.p++; return { type: "Vide", ligne: l }; }
    if (t.type === "ponct" && t.valeur === "...") throw new ErreurSyntaxe("l'opérateur « ... » n'est pas supporté par ce visualiseur", l);
    if (t.type === "motcle") {
      if (NON_SUPPORTE[t.valeur]) throw new ErreurSyntaxe(NON_SUPPORTE[t.valeur] + " n'est pas supporté par ce visualiseur", l);
      switch (t.valeur) {
        case "var": case "let": case "const": { var dd = this.declaration(); this.pointVirgule(); return dd; }
        case "function": return this.fonction(true, false);
        case "async":
          if (this.regarde(1).valeur === "function") { this.p++; return this.fonction(true, true); }
          break;
        case "class": return this.classe();
        case "if": return this.si();
        case "while": { this.p++; this.exige("("); var tc = this.expression(); this.exige(")"); return { type: "Tant", test: tc, corps: this.instruction(), ligne: l }; }
        case "do": { this.p++; var cf = this.instruction(); this.exige("while"); this.exige("("); var tf = this.expression(); this.exige(")"); this.pointVirgule(); return { type: "Faire", test: tf, corps: cf, ligne: l }; }
        case "for": return this.pour();
        case "return": {
          this.p++;
          var arg = null;
          if (!this.est(";") && !this.est("}") && this.t[this.p].type !== "fin" && this.t[this.p].ligne === l) arg = this.expression();
          this.pointVirgule();
          return { type: "Retour", arg: arg, ligne: l };
        }
        case "break": { this.p++; this.pointVirgule(); return { type: "Rompre", ligne: l }; }
        case "continue": { this.p++; this.pointVirgule(); return { type: "Continuer", ligne: l }; }
        case "throw": { this.p++; var la = this.expression(); this.pointVirgule(); return { type: "Lancer", arg: la, ligne: l }; }
        case "try": return this.essai();
      }
    }
    var e = this.expression(); this.pointVirgule();
    return { type: "Expr", expr: e, ligne: l };
  };

  P.bloc = function () {
    var l = this.t[this.p].ligne;
    this.exige("{");
    var c = [];
    while (!this.est("}") && this.t[this.p].type !== "fin") c.push(this.instruction());
    this.exige("}");
    return { type: "Bloc", corps: c, ligne: l };
  };

  P.declaration = function () {
    var t = this.t[this.p], l = t.ligne, sorte = t.valeur;
    this.p++;
    var decls = [];
    do {
      if (this.est("[") || this.est("{")) throw new ErreurSyntaxe("la déstructuration n'est pas supportée par ce visualiseur", this.t[this.p].ligne);
      var nm = this.nom(), init = null;
      if (this.mange("=")) init = this.expression();
      decls.push({ nom: nm, init: init });
    } while (this.mange(","));
    return { type: "Decl", sorte: sorte, decls: decls, ligne: l };
  };

  P.params = function () {
    this.exige("(");
    var ps = [];
    while (!this.est(")")) {
      if (this.est("...")) throw new ErreurSyntaxe("les paramètres du reste (« ... ») ne sont pas supportés", this.t[this.p].ligne);
      if (this.est("[") || this.est("{")) throw new ErreurSyntaxe("la déstructuration n'est pas supportée par ce visualiseur", this.t[this.p].ligne);
      var nm = this.nom(), def = null;
      if (this.mange("=")) def = this.expression();
      ps.push({ nom: nm, defaut: def });
      if (!this.mange(",")) break;
    }
    this.exige(")");
    return ps;
  };

  P.fonction = function (estDecl, estAsync) {
    var l = this.t[this.p].ligne;
    this.exige("function");
    if (this.est("*")) throw new ErreurSyntaxe("les générateurs (« function* ») ne sont pas supportés", l);
    var nom = null;
    if (this.t[this.p].type === "nom") nom = this.nom();
    var params = this.params(), corps = this.bloc();
    return { type: estDecl ? "Fn" : "FnExpr", nom: nom, params: params, corps: corps, estAsync: !!estAsync, ligne: l };
  };

  P.classe = function () {
    var l = this.t[this.p].ligne;
    this.exige("class");
    var nom = this.nom(), parent = null;
    if (this.mange("extends")) parent = this.appelMembre();
    this.exige("{");
    var methodes = [];
    while (!this.est("}") && this.t[this.p].type !== "fin") {
      if (this.mange(";")) continue;
      var estAsync = false;
      if (this.est("async") && this.regarde(1).valeur !== "(") { this.p++; estAsync = true; }
      var tn = this.t[this.p];
      if (tn.type !== "nom" && tn.type !== "motcle") this.erreur("nom de méthode attendu");
      this.p++;
      var ps = this.params(), cp = this.bloc();
      methodes.push({ nom: tn.valeur, params: ps, corps: cp, estAsync: estAsync, ligne: tn.ligne });
    }
    this.exige("}");
    return { type: "Classe", nom: nom, parent: parent, methodes: methodes, ligne: l };
  };

  P.si = function () {
    var l = this.t[this.p].ligne;
    this.exige("if"); this.exige("(");
    var t = this.expression();
    this.exige(")");
    var alors = this.instruction(), sinon = null;
    if (this.mange("else")) sinon = this.instruction();
    return { type: "Si", test: t, alors: alors, sinon: sinon, ligne: l };
  };

  P.essai = function () {
    var l = this.t[this.p].ligne;
    this.exige("try");
    var b = this.bloc(), attrape = null, nomErr = null, enfin = null;
    if (this.mange("catch")) {
      if (this.mange("(")) { nomErr = this.nom(); this.exige(")"); }
      attrape = this.bloc();
    }
    if (this.mange("finally")) enfin = this.bloc();
    return { type: "Essai", bloc: b, attrape: attrape, nomErr: nomErr, enfin: enfin, ligne: l };
  };

  P.pour = function () {
    var l = this.t[this.p].ligne;
    this.exige("for"); this.exige("(");
    if (this.est("const") || this.est("let") || this.est("var")) {
      var sorte = this.t[this.p].valeur, t1 = this.regarde(1), t2 = this.regarde(2);
      if (t1 && t1.type === "nom" && t2 && (t2.valeur === "of" || t2.valeur === "in")) {
        this.p += 2;
        var genre = this.t[this.p].valeur; this.p++;
        var it = this.expression();
        this.exige(")");
        return { type: genre === "of" ? "PourDe" : "PourDans", sorte: sorte, nom: t1.valeur, iterable: it, corps: this.instruction(), ligne: l };
      }
    }
    var init = null;
    if (this.est("const") || this.est("let") || this.est("var")) init = this.declaration();
    else if (!this.est(";")) init = { type: "Expr", expr: this.expression(), ligne: l };
    this.exige(";");
    var test = this.est(";") ? null : this.expression();
    this.exige(";");
    var maj = this.est(")") ? null : this.expression();
    this.exige(")");
    return { type: "Pour", init: init, test: test, maj: maj, corps: this.instruction(), ligne: l };
  };

  /* ------------------------------------------------------------ expressions */

  P.expression = function () { return this.affectation(); };

  P.affectation = function () {
    var g = this.ternaire(), t = this.t[this.p];
    if (t.type === "ponct" && /^(=|\+=|-=|\*=|\/=|%=|\*\*=|\|\|=|&&=|\?\?=)$/.test(t.valeur)) {
      this.p++;
      var d = this.affectation();
      if (g.type !== "Ident" && g.type !== "Membre") throw new ErreurSyntaxe("cible d'affectation invalide", t.ligne);
      return { type: "Affect", op: t.valeur, cible: g, valeur: d, ligne: t.ligne };
    }
    return g;
  };

  P.ternaire = function () {
    var c = this.binaire(0);
    if (this.est("?")) {
      var l = this.t[this.p].ligne; this.p++;
      var a = this.affectation();
      this.exige(":");
      return { type: "Ternaire", test: c, oui: a, non: this.affectation(), ligne: l };
    }
    return c;
  };

  P.binaire = function (min) {
    var g = this.unaire();
    for (;;) {
      var t = this.t[this.p];
      if (t.type !== "ponct") break;
      var pr = PREC[t.valeur];
      if (pr === undefined || pr < min) break;
      this.p++;
      var d = this.binaire(t.valeur === "**" ? pr : pr + 1);
      var ty = (t.valeur === "&&" || t.valeur === "||" || t.valeur === "??") ? "Logique" : "Binaire";
      g = { type: ty, op: t.valeur, gauche: g, droite: d, ligne: t.ligne };
    }
    return g;
  };

  /* `-2 ** 2` est une ERREUR DE SYNTAXE en JavaScript, et pas un calcul : la
     grammaire refuse d'arbitrer entre `(-2) ** 2` et `-(2 ** 2)` et exige des
     parenthèses. Rendre « 4 » revenait à trancher à la place de la norme. */
  P.refuserPuissanceApresUnaire = function (t) {
    if (this.est("**")) {
      throw new ErreurSyntaxe("« " + t.valeur + " » ne peut pas précéder « ** » sans parenthèses : écrivez « (" +
        t.valeur + "x) ** y » ou « " + t.valeur + "(x ** y) »", t.ligne);
    }
  };

  P.unaire = function () {
    var t = this.t[this.p];
    if (t.type === "ponct" && (t.valeur === "!" || t.valeur === "-" || t.valeur === "+" || t.valeur === "~")) {
      this.p++;
      var u1 = { type: "Unaire", op: t.valeur, arg: this.unaire(), ligne: t.ligne };
      this.refuserPuissanceApresUnaire(t);
      return u1;
    }
    if (t.type === "motcle" && (t.valeur === "typeof" || t.valeur === "void" || t.valeur === "delete")) {
      this.p++;
      var u2 = { type: "Unaire", op: t.valeur, arg: this.unaire(), ligne: t.ligne };
      this.refuserPuissanceApresUnaire(t);
      return u2;
    }
    if (t.type === "motcle" && t.valeur === "await") {
      this.p++; return { type: "Attendre", arg: this.unaire(), ligne: t.ligne };
    }
    if (t.type === "ponct" && (t.valeur === "++" || t.valeur === "--")) {
      this.p++; return { type: "MaJ", op: t.valeur, prefixe: true, cible: this.unaire(), ligne: t.ligne };
    }
    var e = this.appelMembre(), t2 = this.t[this.p];
    if (t2.type === "ponct" && (t2.valeur === "++" || t2.valeur === "--")) {
      this.p++; return { type: "MaJ", op: t2.valeur, prefixe: false, cible: e, ligne: t2.ligne };
    }
    return e;
  };

  P.appelMembre = function () {
    var e;
    if (this.est("new")) {
      var ln = this.t[this.p].ligne; this.p++;
      var ctor = this.suffixes(this.primaire(), true);
      var args = this.est("(") ? this.args() : [];
      e = { type: "Nouveau", ctor: ctor, args: args, ligne: ln };
    } else e = this.primaire();
    return this.suffixes(e, false);
  };

  P.suffixes = function (e, sansAppel) {
    for (;;) {
      var t = this.t[this.p];
      if (t.type === "ponct" && t.valeur === ".") {
        this.p++;
        var tn = this.t[this.p];
        if (tn.type !== "nom" && tn.type !== "motcle") this.erreur("nom de propriété attendu");
        this.p++;
        e = { type: "Membre", obj: e, cle: { type: "Chaine", valeur: tn.valeur, ligne: t.ligne }, calcule: false, ligne: t.ligne };
        continue;
      }
      if (t.type === "ponct" && t.valeur === "[") {
        this.p++; var k = this.expression(); this.exige("]");
        e = { type: "Membre", obj: e, cle: k, calcule: true, ligne: t.ligne };
        continue;
      }
      if (!sansAppel && t.type === "ponct" && t.valeur === "(") {
        e = { type: "Appel", callee: e, args: this.args(), ligne: t.ligne };
        continue;
      }
      break;
    }
    return e;
  };

  P.args = function () {
    this.exige("(");
    var a = [];
    while (!this.est(")")) {
      if (this.est("...")) throw new ErreurSyntaxe("l'étalement (« ... ») n'est pas supporté par ce visualiseur", this.t[this.p].ligne);
      a.push(this.expression());
      if (!this.mange(",")) break;
    }
    this.exige(")");
    return a;
  };

  P.estFleche = function () {
    var k = this.p, prof = 0;
    for (;;) {
      var t = this.t[k];
      if (!t || t.type === "fin") return false;
      if (t.type === "ponct" && (t.valeur === "(" || t.valeur === "[" || t.valeur === "{")) prof++;
      else if (t.type === "ponct" && (t.valeur === ")" || t.valeur === "]" || t.valeur === "}")) {
        prof--;
        if (prof === 0) { var s = this.t[k + 1]; return !!(s && s.type === "ponct" && s.valeur === "=>"); }
      }
      k++;
    }
  };

  P.fleche = function (estAsync) {
    var l = this.t[this.p].ligne, params;
    if (this.est("(")) params = this.params();
    else params = [{ nom: this.nom(), defaut: null }];
    this.exige("=>");
    var corps, expr = false;
    if (this.est("{")) corps = this.bloc();
    else { corps = this.expression(); expr = true; }
    return { type: "Fleche", params: params, corps: corps, exprCorps: expr, estAsync: !!estAsync, ligne: l };
  };

  P.objet = function () {
    var l = this.t[this.p].ligne;
    this.exige("{");
    var props = [];
    while (!this.est("}")) {
      if (this.est("...")) throw new ErreurSyntaxe("l'étalement (« ... ») n'est pas supporté par ce visualiseur", this.t[this.p].ligne);
      var calcule = false, cle, t = this.t[this.p];
      if (t.type === "ponct" && t.valeur === "[") { this.p++; cle = this.expression(); this.exige("]"); calcule = true; }
      else { cle = { type: "Chaine", valeur: String(t.valeur), ligne: t.ligne }; this.p++; }
      if (this.est("(")) {
        var ps = this.params(), cp = this.bloc();
        props.push({ cle: cle, calcule: calcule, valeur: { type: "FnExpr", nom: String(t.valeur), methodeObjet: true, params: ps, corps: cp, estAsync: false, ligne: t.ligne } });
      } else if (this.mange(":")) {
        props.push({ cle: cle, calcule: calcule, valeur: this.expression() });
      } else {
        props.push({ cle: cle, calcule: false, valeur: { type: "Ident", nom: String(t.valeur), ligne: t.ligne } });
      }
      if (!this.mange(",")) break;
    }
    this.exige("}");
    return { type: "Objet", props: props, ligne: l };
  };

  P.primaire = function () {
    var t = this.t[this.p], l = t.ligne;
    if (t.type === "nombre") { this.p++; return { type: "Nombre", valeur: t.valeur, ligne: l }; }
    if (t.type === "chaine") { this.p++; return { type: "Chaine", valeur: t.valeur, ligne: l }; }
    if (t.type === "gabarit") {
      this.p++;
      var sous = [];
      for (var i = 0; i < t.exprs.length; i++) sous.push(analyserExpression(t.exprs[i].src, t.exprs[i].ligne));
      return { type: "Gabarit", parties: t.parties, exprs: sous, ligne: l };
    }
    if (t.type === "motcle") {
      if (NON_SUPPORTE[t.valeur]) throw new ErreurSyntaxe(NON_SUPPORTE[t.valeur] + " n'est pas supporté par ce visualiseur", l);
      if (t.valeur === "true" || t.valeur === "false") { this.p++; return { type: "Litteral", valeur: t.valeur === "true", ligne: l }; }
      if (t.valeur === "null") { this.p++; return { type: "Litteral", valeur: null, ligne: l }; }
      if (t.valeur === "undefined") { this.p++; return { type: "Litteral", valeur: undefined, ligne: l }; }
      if (t.valeur === "this") { this.p++; return { type: "Ceci", ligne: l }; }
      if (t.valeur === "super") { this.p++; return { type: "Super", ligne: l }; }
      if (t.valeur === "function") return this.fonction(false, false);
      if (t.valeur === "class") throw new ErreurSyntaxe("une classe doit être déclarée, pas écrite dans une expression", l);
      if (t.valeur === "async") {
        if (this.regarde(1).valeur === "function") { this.p++; return this.fonction(false, true); }
        this.p++; return this.fleche(true);
      }
      if (t.valeur === "of") { this.p++; return { type: "Ident", nom: "of", ligne: l }; }
    }
    if (t.type === "ponct" && t.valeur === "[") {
      this.p++;
      var els = [];
      while (!this.est("]")) {
        if (this.est("...")) throw new ErreurSyntaxe("l'étalement (« ... ») n'est pas supporté par ce visualiseur", this.t[this.p].ligne);
        els.push(this.expression());
        if (!this.mange(",")) break;
      }
      this.exige("]");
      return { type: "Tableau", elements: els, ligne: l };
    }
    if (t.type === "ponct" && t.valeur === "{") return this.objet();
    if (t.type === "ponct" && t.valeur === "(") {
      if (this.estFleche()) return this.fleche(false);
      this.p++;
      var e = this.expression();
      this.exige(")");
      return e;
    }
    if (t.type === "nom") {
      var s = this.regarde(1);
      if (s && s.type === "ponct" && s.valeur === "=>") return this.fleche(false);
      this.p++;
      return { type: "Ident", nom: t.valeur, ligne: l };
    }
    this.erreur("une expression était attendue");
  };

  function analyser(source) { return new Parseur(lexer(String(source), 1)).programme(); }
  function analyserExpression(src, ligne0) { return new Parseur(lexer(String(src), ligne0)).expression(); }

  /* ======================================================================== */
  /* 3. VALEURS                                                               */
  /* ======================================================================== */

  function FonctionI(nom, params, corps, portee, opts) {
    this.nom = nom || "";
    this.params = params;
    this.corps = corps;
    this.portee = portee;
    opts = opts || {};
    this.estFleche = !!opts.estFleche;
    this.exprCorps = !!opts.exprCorps;
    this.estAsync = !!opts.estAsync;
    this.classe = opts.classe || null;
  }
  function NatifI(nom, appel, gen) { this.nom = nom; this.appel = appel; this.gen = !!gen; }
  function ClasseI(nom, parent) { this.nom = nom; this.parent = parent || null; this.methodes = Object.create(null); }
  function ErreurJS(nom, message) { this.name = nom; this.message = message; }
  function ErreurLancee(valeur, ligne) { this.valeurLancee = valeur; this.ligne = ligne || 0; }

  function lancer(nom, message, ligne) { throw new ErreurLancee(new ErreurJS(nom, message), ligne); }

  function estFonction(v) { return (v instanceof FonctionI) || (v instanceof NatifI) || (v instanceof ClasseI); }

  function cleAffichable(k) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : "'" + String(k).replace(/'/g, "\\'") + "'";
  }

  /* Représentation d'une valeur. `prof` 0 = niveau de `console.log` (les chaînes
     s'affichent nues), au-delà elles sont entre apostrophes, comme dans Node. */
  function representer(v, prof) {
    prof = prof || 0;
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    var t = typeof v;
    if (t === "number") return Object.is(v, -0) ? "-0" : String(v);
    if (t === "boolean") return String(v);
    if (t === "string") return prof === 0 ? v : "'" + v.replace(/'/g, "\\'") + "'";
    if (t === "function") return "[Function: " + (v.name || "anonyme") + "]";
    if (v instanceof FonctionI) return "[Function: " + (v.nom || "anonyme") + "]";
    if (v instanceof NatifI) return "[Function: " + v.nom + "]";
    if (v instanceof ClasseI) return "[class " + v.nom + "]";
    if (v instanceof ErreurJS) return v.name + ": " + v.message;
    if (v instanceof PromesseI) {
      if (v.etat === "tenue") return "Promise { " + representer(v.valeur, prof + 1) + " }";
      if (v.etat === "rompue") return "Promise { <rejetée> }";
      return "Promise { <en attente> }";
    }
    if (typeof Promise !== "undefined" && v instanceof Promise) return "Promise { <en attente> }";
    if (t === "object" && v instanceof Error) return v.name + ": " + v.message;
    if (Array.isArray(v)) {
      if (prof > 4) return "[Array]";
      if (v.length === 0) return "[]";
      var out = [];
      for (var i = 0; i < v.length && i < 120; i++) out.push(representer(v[i], prof + 1));
      if (v.length > 120) out.push("… " + (v.length - 120) + " de plus");
      return "[ " + out.join(", ") + " ]";
    }
    if (t === "object") {
      if (prof > 4) return "[Object]";
      /* Le nom de la classe, des DEUX côtés : celui de nos instances comme celui
         d'une vraie instance Node. Sans la seconde branche, la fonction n'était
         pas symétrique et l'outil de vérification signalait un faux écart. */
      var prefixe = "";
      if (v.__classe && v.__classe.nom) prefixe = v.__classe.nom + " ";
      else if (v.constructor && v.constructor.name && v.constructor.name !== "Object") prefixe = v.constructor.name + " ";
      var ks = Object.keys(v), o = [];
      for (var j = 0; j < ks.length && j < 120; j++) o.push(cleAffichable(ks[j]) + ": " + representer(v[ks[j]], prof + 1));
      return prefixe + (o.length ? "{ " + o.join(", ") + " }" : "{}");
    }
    return String(v);
  }

  /* Une méthode de conversion écrite par l'apprenant (`toString`, `valueOf`) ne
     peut pas être appelée d'ici : la conversion arrive au milieu d'un opérateur,
     hors de la machine à pas. Plutôt que de l'IGNORER en silence — ce qui ferait
     afficher « [object Object] » là où le vrai moteur affiche « 5 » —, on
     REFUSE bruyamment. Une limite annoncée vaut mieux qu'un mensonge discret. */
  function conversionUtilisateur(v) {
    if (!v || typeof v !== "object" || Array.isArray(v)) return null;
    if (v instanceof ErreurJS || v instanceof PromesseI) return null;
    var noms = ["toString", "valueOf"];
    for (var i = 0; i < noms.length; i++) {
      if (Object.prototype.hasOwnProperty.call(v, noms[i]) && estFonction(v[noms[i]])) return noms[i];
      if (v.__classe && estFonction(methodeDeClasse(v.__classe, noms[i]))) return noms[i];
    }
    return null;
  }
  function refuserConversion(v, ligne) {
    var m = conversionUtilisateur(v);
    if (m) {
      lancer("NonSupporte", "ce visualiseur n'appelle pas la méthode « " + m +
        " » que vous avez écrite : il ne sait pas convertir un objet en nombre ou en texte " +
        "par vos propres méthodes. Appelez-la vous-même (par exemple « x." + m + "() »).", ligne || 0);
    }
  }

  function estObjetValeur(v) {
    return v !== null && (typeof v === "object" || estFonction(v));
  }
  /* ToPrimitive : pour un tableau ou un objet ordinaire, c'est sa chaîne. */
  function versPrimitive(v) { refuserConversion(v); return enChaine(v); }

  /* Conversion en chaîne, comme le fait `+` ou un gabarit. */
  function enChaine(v) {
    if (typeof v === "string") return v;
    refuserConversion(v);
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (v instanceof FonctionI) return "function " + (v.nom || "") + "() { … }";
    if (v instanceof NatifI) return "function " + v.nom + "() { [natif] }";
    if (v instanceof ClasseI) return "class " + v.nom + " { … }";
    if (v instanceof ErreurJS) return v.name + ": " + v.message;
    if (Array.isArray(v)) {
      var o = [];
      for (var i = 0; i < v.length; i++) o.push(v[i] === null || v[i] === undefined ? "" : enChaine(v[i]));
      return o.join(",");
    }
    if (typeof v === "object") return "[object Object]";
    return String(v);
  }

  function enNombre(v) {
    if (typeof v === "number") return v;
    if (typeof v === "boolean") return v ? 1 : 0;
    if (v === null) return 0;
    if (v === undefined) return NaN;
    if (typeof v === "string") return v.trim() === "" ? 0 : Number(v);
    /* Un objet passe d'abord par sa forme primitive : `[5] * 2` vaut 10, parce
       que `[5]` devient « 5 ». Rendre NaN ici était faux douze fois sur treize. */
    if (estObjetValeur(v)) {
      refuserConversion(v);
      if (estFonction(v)) return NaN;
      var s = enChaine(v);
      return s.trim() === "" ? 0 : Number(s);
    }
    return NaN;
  }

  /* ======================================================================== */
  /* 4. PORTÉES                                                               */
  /* ======================================================================== */

  function Portee(parent, titre, genre) {
    this.parent = parent; this.vars = Object.create(null); this.titre = titre; this.genre = genre;
  }
  Portee.prototype.trouver = function (nom) {
    var p = this;
    while (p) { if (nom in p.vars) return p; p = p.parent; }
    return null;
  };
  Portee.prototype.declarer = function (nom, valeur, sorte, pret) {
    this.vars[nom] = { valeur: valeur, sorte: sorte, pret: pret !== false };
  };
  Portee.prototype.lire = function (nom, ligne) {
    var p = this.trouver(nom);
    if (!p) lancer("ReferenceError", "« " + nom + " » n'est pas défini", ligne);
    var c = p.vars[nom];
    if (!c.pret) lancer("ReferenceError", "on ne peut pas utiliser « " + nom + " » avant sa déclaration (zone morte temporelle de " + c.sorte + ")", ligne);
    return c.valeur;
  };
  Portee.prototype.ecrire = function (nom, valeur, ligne) {
    var p = this.trouver(nom);
    if (!p) lancer("ReferenceError", "« " + nom + " » n'est pas défini", ligne);
    var c = p.vars[nom];
    /* La zone morte temporelle interdit TOUTE référence, l'écriture comme la
       lecture. Sans ce test, `x = 5` avant `let x` passait en silence — et pire,
       « déverrouillait » la variable, y compris une `const`. */
    if (!c.pret) lancer("ReferenceError", "on ne peut pas affecter « " + nom + " » avant sa déclaration (zone morte temporelle de " + c.sorte + ")", ligne);
    if (c.sorte === "const") lancer("TypeError", "affectation à la constante « " + nom + " »", ligne);
    c.valeur = valeur;
  };
  function porteeFonction(p) { while (p && p.genre === "bloc") p = p.parent; return p; }

  /* ======================================================================== */
  /* 5. CONTEXTE ET TRACE                                                     */
  /* ======================================================================== */

  function Contexte(source, options) {
    options = options || {};
    this.source = source;
    this.lignes = String(source).split("\n");
    this.sortie = [];
    this.trace = [];
    this.pile = [];
    this.micro = [];
    this.macro = [];
    this.seq = 0;
    this.horloge = 0;
    this.pas = 0;
    this.maxPas = options.maxPas || 200000;
    this.maxTrace = options.maxTrace || 3000;
    this.tracer = options.trace !== false;
    this.tronquee = false;
    this.global = null;
    this.rejetsEnAttente = [];
  }

  function court(s, n) { n = n || 72; return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  function porteesInstantanees(p) {
    var out = [], garde = 0;
    while (p && p.genre !== "natif" && garde++ < 12) {
      var noms = Object.keys(p.vars), vs = [];
      for (var i = 0; i < noms.length && i < 40; i++) {
        var c = p.vars[noms[i]];
        vs.push({
          nom: noms[i],
          sorte: c.sorte,
          valeur: c.pret ? court(representer(c.valeur, 1)) : "(non initialisée)"
        });
      }
      out.push({ titre: p.titre, genre: p.genre, vars: vs });
      p = p.parent;
    }
    return out;
  }

  function noter(ctx, portee, ligne, genre, detail) {
    if (!ctx.tracer) return;
    if (ctx.trace.length >= ctx.maxTrace) { ctx.tronquee = true; return; }
    if (ctx.pile.length && ligne) ctx.pile[ctx.pile.length - 1].ligne = ligne;
    var pile = [];
    for (var i = 0; i < ctx.pile.length; i++) pile.push({ nom: ctx.pile[i].nom, ligne: ctx.pile[i].ligne });
    /* L'ÉTAT DES DEUX FILES, à chaque pas. Sans lui, le visualiseur pourrait
       montrer qu'une microtâche s'exécute, mais jamais POURQUOI elle passe avant
       un minuteur inscrit plus tôt — or c'est toute la leçon de la boucle
       d'événements. Les minuteurs sont rendus dans l'ordre où la boucle les
       prendra : échéance croissante, puis ordre d'inscription. */
    var macro = [];
    for (var m = 0; m < ctx.macro.length; m++) {
      if (!ctx.macro[m].annulee) macro.push({ delai: ctx.macro[m].delai, echeance: ctx.macro[m].echeance, ordre: ctx.macro[m].ordre });
    }
    macro.sort(function (a, b) { return (a.echeance - b.echeance) || (a.ordre - b.ordre); });
    ctx.trace.push({
      n: ctx.trace.length,
      ligne: ligne || 0,
      genre: genre,
      detail: detail || "",
      pile: pile,
      portees: porteesInstantanees(portee),
      sortie: ctx.sortie.length,
      micro: ctx.micro.length,
      macro: macro
    });
  }

  /* ======================================================================== */
  /* 6. ÉVALUATION                                                            */
  /* ======================================================================== */

  var RETOUR = { s: "retour" }, ROMPRE = { s: "rompre" }, CONTINUER = { s: "continuer" };

  function compteur(ctx, ligne) {
    ctx.pas++;
    if (ctx.pas > ctx.maxPas) lancer("Limite", "trop d'étapes (" + ctx.maxPas + ") : le programme boucle-t-il sans fin ?", ligne);
  }

  function hisserVar(s, pf) {
    if (!s || typeof s !== "object") return;
    switch (s.type) {
      case "Decl":
        if (s.sorte === "var") for (var i = 0; i < s.decls.length; i++) if (!(s.decls[i].nom in pf.vars)) pf.declarer(s.decls[i].nom, undefined, "var", true);
        return;
      case "Bloc": for (var k = 0; k < s.corps.length; k++) hisserVar(s.corps[k], pf); return;
      case "Si": hisserVar(s.alors, pf); hisserVar(s.sinon, pf); return;
      case "Tant": case "Faire": hisserVar(s.corps, pf); return;
      case "Pour": hisserVar(s.init, pf); hisserVar(s.corps, pf); return;
      case "PourDe": case "PourDans":
        if (s.sorte === "var" && !(s.nom in pf.vars)) pf.declarer(s.nom, undefined, "var", true);
        hisserVar(s.corps, pf); return;
      case "Essai": hisserVar(s.bloc, pf); hisserVar(s.attrape, pf); hisserVar(s.enfin, pf); return;
      default: return;
    }
  }

  function hisser(corps, portee, ctx) {
    var pf = porteeFonction(portee);
    for (var i = 0; i < corps.length; i++) {
      var s = corps[i];
      if (s.type === "Fn") portee.declarer(s.nom, faireFonction(s, portee), "function", true);
      else if (s.type === "Decl" && s.sorte !== "var") {
        for (var j = 0; j < s.decls.length; j++) portee.declarer(s.decls[j].nom, undefined, s.sorte, false);
      } else if (s.type === "Classe") portee.declarer(s.nom, undefined, "class", false);
      if (pf) hisserVar(s, pf);
    }
  }

  function faireFonction(n, portee) {
    return new FonctionI(n.nom, n.params, n.corps, portee, {
      estFleche: n.type === "Fleche",
      exprCorps: !!n.exprCorps,
      estAsync: !!n.estAsync
    });
  }

  function* execBloc(corps, portee, ctx) {
    hisser(corps, portee, ctx);
    for (var i = 0; i < corps.length; i++) {
      var r = yield* execInstr(corps[i], portee, ctx);
      if (r) return r;
    }
    return null;
  }

  function* execInstr(n, portee, ctx) {
    compteur(ctx, n.ligne);
    switch (n.type) {
      case "Vide": case "Fn": return null;

      case "Bloc": {
        var pb = new Portee(portee, "bloc", "bloc");
        return yield* execBloc(n.corps, pb, ctx);
      }

      case "Expr":
        noter(ctx, portee, n.ligne, "instruction", "");
        yield* evaluer(n.expr, portee, ctx);
        return null;

      case "Decl": {
        noter(ctx, portee, n.ligne, "instruction", "");
        for (var i = 0; i < n.decls.length; i++) {
          var d = n.decls[i];
          var v = d.init ? yield* evaluer(d.init, portee, ctx) : undefined;
          if (v instanceof FonctionI && !v.nom) v.nom = d.nom;
          if (n.sorte === "var") {
            /* `var x;` SANS initialiseur ne fait rien si `x` existe déjà : c'est
               ce qui permet à une fonction hissée de survivre à `var f;`. */
            var pf = porteeFonction(portee);
            if (d.init || !(d.nom in pf.vars)) pf.declarer(d.nom, v, "var", true);
          } else portee.declarer(d.nom, v, n.sorte, true);
        }
        return null;
      }

      case "Classe": {
        noter(ctx, portee, n.ligne, "instruction", "");
        var parent = null;
        if (n.parent) {
          parent = yield* evaluer(n.parent, portee, ctx);
          /* `class MonErreur extends Error` est LE motif des erreurs
             personnalisées : un constructeur natif doit pouvoir servir de
             parent, pas seulement une classe écrite par l'apprenant. */
          if (parent instanceof NatifI && parent.estCtor) parent = classeDepuisNatif(parent);
          if (!(parent instanceof ClasseI)) lancer("TypeError", "on ne peut hériter que d'une classe", n.ligne);
        }
        var cl = new ClasseI(n.nom, parent);
        for (var m = 0; m < n.methodes.length; m++) {
          var me = n.methodes[m];
          cl.methodes[me.nom] = new FonctionI(n.nom + "." + me.nom, me.params, me.corps, portee, { estAsync: me.estAsync, classe: cl });
        }
        portee.declarer(n.nom, cl, "class", true);
        return null;
      }

      case "Si": {
        noter(ctx, portee, n.ligne, "condition", "");
        var c = yield* evaluer(n.test, portee, ctx);
        if (c) return yield* execInstr(n.alors, portee, ctx);
        if (n.sinon) return yield* execInstr(n.sinon, portee, ctx);
        return null;
      }

      case "Tant": {
        for (;;) {
          compteur(ctx, n.ligne);
          noter(ctx, portee, n.ligne, "condition", "");
          var t = yield* evaluer(n.test, portee, ctx);
          if (!t) break;
          var r = yield* execInstr(n.corps, portee, ctx);
          if (r) { if (r.sig === ROMPRE) break; if (r.sig === RETOUR) return r; }
        }
        return null;
      }

      case "Faire": {
        for (;;) {
          compteur(ctx, n.ligne);
          var r2 = yield* execInstr(n.corps, portee, ctx);
          if (r2) { if (r2.sig === ROMPRE) break; if (r2.sig === RETOUR) return r2; }
          noter(ctx, portee, n.ligne, "condition", "");
          var t2 = yield* evaluer(n.test, portee, ctx);
          if (!t2) break;
        }
        return null;
      }

      case "Pour": {
        var pp = new Portee(portee, "en-tête de boucle", "bloc");
        var nomsLet = [];
        if (n.init) {
          if (n.init.type === "Decl" && n.init.sorte !== "var") {
            for (var q = 0; q < n.init.decls.length; q++) nomsLet.push(n.init.decls[q].nom);
          }
          hisser([n.init], pp, ctx);
          yield* execInstr(n.init, pp, ctx);
        }
        for (;;) {
          compteur(ctx, n.ligne);
          noter(ctx, pp, n.ligne, "condition", "");
          if (n.test) { var tv = yield* evaluer(n.test, pp, ctx); if (!tv) break; }
          /* Une portée NEUVE par tour quand la variable est `let` : c'est ce qui
             fait qu'une fermeture créée dans le corps capture LA valeur du tour,
             et non la dernière. Avec `var`, il n'y a qu'une seule case. */
          var pi = pp;
          if (nomsLet.length) {
            pi = new Portee(pp, "tour de boucle", "bloc");
            for (var a = 0; a < nomsLet.length; a++) pi.declarer(nomsLet[a], pp.vars[nomsLet[a]].valeur, "let", true);
          }
          var r3 = yield* execInstr(n.corps, pi, ctx);
          if (nomsLet.length) for (var b = 0; b < nomsLet.length; b++) pp.vars[nomsLet[b]].valeur = pi.vars[nomsLet[b]].valeur;
          if (r3) { if (r3.sig === ROMPRE) break; if (r3.sig === RETOUR) return r3; }
          if (n.maj) yield* evaluer(n.maj, pp, ctx);
        }
        return null;
      }

      case "PourDe": {
        var it = yield* evaluer(n.iterable, portee, ctx);
        var liste;
        if (Array.isArray(it)) liste = it.slice();
        else if (typeof it === "string") liste = it.split("");
        else lancer("TypeError", "« for … of » n'accepte qu'un tableau ou une chaîne ici", n.ligne);
        for (var k = 0; k < liste.length; k++) {
          compteur(ctx, n.ligne);
          /* `var` : UNE seule case, dans la portée de fonction — donc toutes les
             fermetures du corps voient la dernière valeur, et la variable survit
             à la boucle. `let`/`const` : une case NEUVE par tour. C'est le piège
             que le cours enseigne : le montrer à l'envers serait pire que rien. */
          var pb2;
          if (n.sorte === "var") { pb2 = portee; porteeFonction(portee).declarer(n.nom, liste[k], "var", true); }
          else { pb2 = new Portee(portee, "tour de boucle", "bloc"); pb2.declarer(n.nom, liste[k], n.sorte, true); }
          noter(ctx, pb2, n.ligne, "instruction", "");
          var r4 = yield* execInstr(n.corps, pb2, ctx);
          if (r4) { if (r4.sig === ROMPRE) break; if (r4.sig === RETOUR) return r4; }
        }
        return null;
      }

      case "PourDans": {
        var o = yield* evaluer(n.iterable, portee, ctx);
        var cles = [];
        /* `for … in` ne visite que les clés qui EXISTENT : un tableau à trous
           (`a = [1]; a[3] = 4`) rend « 0, 3 » et non « 0, 1, 2, 3 ». */
        if (Array.isArray(o)) cles = Object.keys(o);
        else if (o && typeof o === "object") cles = Object.keys(o);
        else if (typeof o === "string") { for (var z2 = 0; z2 < o.length; z2++) cles.push(String(z2)); }
        for (var kk = 0; kk < cles.length; kk++) {
          compteur(ctx, n.ligne);
          var pb3;
          if (n.sorte === "var") { pb3 = portee; porteeFonction(portee).declarer(n.nom, cles[kk], "var", true); }
          else { pb3 = new Portee(portee, "tour de boucle", "bloc"); pb3.declarer(n.nom, cles[kk], n.sorte, true); }
          noter(ctx, pb3, n.ligne, "instruction", "");
          var r5 = yield* execInstr(n.corps, pb3, ctx);
          if (r5) { if (r5.sig === ROMPRE) break; if (r5.sig === RETOUR) return r5; }
        }
        return null;
      }

      case "Retour": {
        noter(ctx, portee, n.ligne, "instruction", "");
        var v2 = n.arg ? yield* evaluer(n.arg, portee, ctx) : undefined;
        return { sig: RETOUR, valeur: v2 };
      }
      case "Rompre": noter(ctx, portee, n.ligne, "instruction", ""); return { sig: ROMPRE };
      case "Continuer": noter(ctx, portee, n.ligne, "instruction", ""); return { sig: CONTINUER };

      case "Lancer": {
        noter(ctx, portee, n.ligne, "instruction", "");
        var vl = yield* evaluer(n.arg, portee, ctx);
        throw new ErreurLancee(vl, n.ligne);
      }

      case "Essai": {
        var res = null, err = null;
        try {
          res = yield* execInstr(n.bloc, portee, ctx);
        } catch (e) {
          if (!(e instanceof ErreurLancee)) throw e;
          if (n.attrape) {
            var pc = new Portee(portee, "catch", "bloc");
            if (n.nomErr) pc.declarer(n.nomErr, e.valeurLancee, "let", true);
            noter(ctx, pc, n.attrape.ligne, "attrape", "erreur interceptée : " + court(representer(e.valeurLancee, 1)));
            try { res = yield* execBloc(n.attrape.corps, pc, ctx); }
            catch (e2) { if (!(e2 instanceof ErreurLancee)) throw e2; err = e2; }
          } else err = e;
        }
        if (n.enfin) { var rf = yield* execInstr(n.enfin, portee, ctx); if (rf) return rf; }
        if (err) throw err;
        return res;
      }

      default:
        lancer("Interne", "instruction inconnue : " + n.type, n.ligne);
    }
  }

  function* evaluer(n, portee, ctx) {
    compteur(ctx, n.ligne);
    switch (n.type) {
      case "Nombre": case "Chaine": case "Litteral": return n.valeur;

      case "Gabarit": {
        var s = n.parties[0];
        for (var i = 0; i < n.exprs.length; i++) {
          s += enChaine(yield* evaluer(n.exprs[i], portee, ctx)) + n.parties[i + 1];
        }
        return s;
      }

      case "Ident": return portee.lire(n.nom, n.ligne);

      case "Ceci": {
        var pt = portee.trouver("this");
        return pt ? pt.vars["this"].valeur : undefined;
      }

      case "Tableau": {
        var t = [];
        for (var a = 0; a < n.elements.length; a++) t.push(yield* evaluer(n.elements[a], portee, ctx));
        return t;
      }

      case "Objet": {
        var o = {};
        for (var p = 0; p < n.props.length; p++) {
          var pr = n.props[p];
          var cle = pr.calcule ? enChaine(yield* evaluer(pr.cle, portee, ctx)) : pr.cle.valeur;
          o[cle] = yield* evaluer(pr.valeur, portee, ctx);
        }
        return o;
      }

      case "FnExpr": {
        /* Le nom d'une expression de fonction nommée est lié dans une portée à
           elle, invisible de l'extérieur : `var f = function moi(n) {… moi(n-1)}`
           peut s'appeler par son nom, et `moi` n'existe pas au-dehors. */
        if (n.nom && !n.methodeObjet) {
          var pn = new Portee(portee, "nom de la fonction", "bloc");
          var fx = faireFonction(n, pn);
          pn.declarer(n.nom, fx, "const", true);
          return fx;
        }
        return faireFonction(n, portee);
      }
      case "Fleche": return faireFonction(n, portee);

      case "Unaire": {
        if (n.op === "typeof" && n.arg.type === "Ident" && !portee.trouver(n.arg.nom)) return "undefined";
        if (n.op === "delete") {
          if (n.arg.type === "Membre") {
            var ob = yield* evaluer(n.arg.obj, portee, ctx);
            var cl2 = n.arg.calcule ? yield* evaluer(n.arg.cle, portee, ctx) : n.arg.cle.valeur;
            if (ob && typeof ob === "object") { delete ob[cl2]; return true; }
          }
          return true;
        }
        var v = yield* evaluer(n.arg, portee, ctx);
        switch (n.op) {
          case "!": return !v;
          case "-": return -enNombre(v);
          case "+": return enNombre(v);
          case "~": return ~enNombre(v);
          case "void": return undefined;
          case "typeof":
            if (estFonction(v)) return "function";
            if (v === null) return "object";
            if (v instanceof PromesseI || v instanceof ErreurJS) return "object";
            return typeof v;
        }
        return undefined;
      }

      case "Logique": {
        var g = yield* evaluer(n.gauche, portee, ctx);
        if (n.op === "&&") return g ? yield* evaluer(n.droite, portee, ctx) : g;
        if (n.op === "||") return g ? g : yield* evaluer(n.droite, portee, ctx);
        return (g === null || g === undefined) ? yield* evaluer(n.droite, portee, ctx) : g;
      }

      case "Binaire": {
        var ga = yield* evaluer(n.gauche, portee, ctx);
        var dr = yield* evaluer(n.droite, portee, ctx);
        return binaire(n.op, ga, dr, n.ligne);
      }

      case "Ternaire":
        return (yield* evaluer(n.test, portee, ctx)) ? yield* evaluer(n.oui, portee, ctx) : yield* evaluer(n.non, portee, ctx);

      case "Membre": {
        var ob2 = yield* evaluer(n.obj, portee, ctx);
        var k2 = n.calcule ? yield* evaluer(n.cle, portee, ctx) : n.cle.valeur;
        return lirePropriete(ob2, k2, n.ligne, ctx, sourceDe(n.obj));
      }

      case "Affect": {
        /* La RÉFÉRENCE d'abord, la valeur ensuite : c'est l'ordre imposé par la
           spécification, et il est observable (`w[cle()] = valeur()`). */
        var ref = yield* evaluerRef(n.cible, portee, ctx);
        var nv;
        if (n.op === "=") nv = yield* evaluer(n.valeur, portee, ctx);
        else if (n.op === "&&=" || n.op === "||=" || n.op === "??=") {
          var actuelle = lireRef(ref, ctx);
          var doit = n.op === "&&=" ? !!actuelle : (n.op === "||=" ? !actuelle : (actuelle === null || actuelle === undefined));
          if (!doit) return actuelle;
          nv = yield* evaluer(n.valeur, portee, ctx);
        } else {
          var av = lireRef(ref, ctx);
          var bv = yield* evaluer(n.valeur, portee, ctx);
          nv = binaire(n.op.slice(0, n.op.length - 1), av, bv, n.ligne);
        }
        ecrireRef(ref, nv);
        return nv;
      }

      case "MaJ": {
        var ref2 = yield* evaluerRef(n.cible, portee, ctx);
        var av2 = enNombre(lireRef(ref2, ctx));
        var ap = n.op === "++" ? av2 + 1 : av2 - 1;
        ecrireRef(ref2, ap);
        return n.prefixe ? ap : av2;
      }

      case "Appel": {
        var fn, ceci = undefined, nomAff = sourceDe(n.callee);
        if (n.callee.type === "Membre") {
          if (n.callee.obj.type === "Super") {
            var cls = classeCourante(portee);
            if (!cls || !cls.parent) lancer("SyntaxError", "« super » hors d'une classe qui hérite", n.ligne);
            fn = cls.parent.methodes[n.callee.cle.valeur];
            if (!fn) lancer("TypeError", "la classe parente n'a pas de méthode « " + n.callee.cle.valeur + " »", n.ligne);
            ceci = (portee.trouver("this") || { vars: {} }).vars["this"];
            ceci = ceci ? ceci.valeur : undefined;
          } else {
            ceci = yield* evaluer(n.callee.obj, portee, ctx);
            var k3 = n.callee.calcule ? yield* evaluer(n.callee.cle, portee, ctx) : n.callee.cle.valeur;
            fn = lirePropriete(ceci, k3, n.ligne, ctx, sourceDe(n.callee.obj));
          }
        } else if (n.callee.type === "Super") {
          var cls2 = classeCourante(portee);
          if (!cls2 || !cls2.parent) lancer("SyntaxError", "« super() » hors d'une classe qui hérite", n.ligne);
          fn = cls2.parent.methodes["constructor"];
          var tc = portee.trouver("this");
          ceci = tc ? tc.vars["this"].valeur : undefined;
          if (!fn) {
            var argsS = [];
            for (var s2 = 0; s2 < n.args.length; s2++) argsS.push(yield* evaluer(n.args[s2], portee, ctx));
            return undefined;
          }
        } else {
          fn = yield* evaluer(n.callee, portee, ctx);
        }
        var args = [];
        for (var ai = 0; ai < n.args.length; ai++) args.push(yield* evaluer(n.args[ai], portee, ctx));
        return yield* appeler(fn, args, ceci, n.ligne, ctx, nomAff, portee);
      }

      case "Nouveau": {
        var C = yield* evaluer(n.ctor, portee, ctx);
        var argsN = [];
        for (var ni = 0; ni < n.args.length; ni++) argsN.push(yield* evaluer(n.args[ni], portee, ctx));
        return yield* construire(C, argsN, n.ligne, ctx, sourceDe(n.ctor), portee);
      }

      case "Attendre": {
        var pv = yield* evaluer(n.arg, portee, ctx);
        noter(ctx, portee, n.ligne, "attente", "await : la fonction se met en pause, la suite du programme continue");
        return yield { attente: pv };
      }

      case "Super": lancer("SyntaxError", "« super » ne s'utilise qu'en appel ou en accès de méthode", n.ligne);
    }
    lancer("Interne", "expression inconnue : " + n.type, n.ligne);
  }

  function classeCourante(portee) {
    var p = portee.trouver("__classe__");
    return p ? p.vars["__classe__"].valeur : null;
  }

  function sourceDe(n) {
    if (!n) return "cette valeur";
    if (n.type === "Ident") return n.nom;
    if (n.type === "Membre" && !n.calcule) return sourceDe(n.obj) + "." + n.cle.valeur;
    if (n.type === "Ceci") return "this";
    return "cette valeur";
  }

  /* UNE référence, évaluée UNE SEULE FOIS. C'est la règle de la spécification et
     ce n'est pas un détail : avec deux évaluations, `b[i++] += 100` lit `b[0]`
     puis écrit dans `b[1]`, et `objet().n++` appelle `objet()` deux fois. Le
     programme n'affiche pas seulement une valeur fausse, il écrit dans la
     mauvaise case mémoire — la pire faute qu'un visualiseur puisse enseigner. */
  function* evaluerRef(cible, portee, ctx) {
    if (cible.type === "Ident") return { genre: "ident", portee: portee, nom: cible.nom, ligne: cible.ligne };
    var o = yield* evaluer(cible.obj, portee, ctx);
    var k = cible.calcule ? yield* evaluer(cible.cle, portee, ctx) : cible.cle.valeur;
    return { genre: "membre", obj: o, cle: k, ligne: cible.ligne, nomObj: sourceDe(cible.obj) };
  }

  function lireRef(r, ctx) {
    if (r.genre === "ident") return r.portee.lire(r.nom, r.ligne);
    return lirePropriete(r.obj, r.cle, r.ligne, ctx, r.nomObj);
  }

  function ecrireRef(r, valeur) {
    if (r.genre === "ident") { r.portee.ecrire(r.nom, valeur, r.ligne); return; }
    var o = r.obj, k = r.cle;
    if (o === null || o === undefined) lancer("TypeError", "impossible d'écrire « " + enChaine(k) + " » sur " + representer(o, 1), r.ligne);
    /* En JavaScript une fonction EST un objet : on peut lui accrocher des
       propriétés (compteur d'appels, cache, drapeau…). Le corpus le prouve. */
    if (estFonction(o)) { if (!o.props) o.props = {}; o.props[enChaine(k)] = valeur; return; }
    if (Array.isArray(o)) { o[estIndice(k) ? Number(k) : enChaine(k)] = valeur; return; }
    if (typeof o === "object") { o[enChaine(k)] = valeur; return; }
    lancer("TypeError", "on ne peut pas ajouter de propriété à " + representer(o, 1), r.ligne);
  }

  /* Un indice de tableau, c'est la forme CANONIQUE d'un entier : « 1 » oui,
     « 01 » et « 1.0 » non — ce sont des propriétés texte ordinaires. */
  function estIndice(k) {
    if (typeof k === "number") return Number.isInteger(k) && k >= 0;
    var s = String(k);
    return /^(0|[1-9][0-9]*)$/.test(s);
  }

  function binaire(op, a, b, ligne) {
    switch (op) {
      case "+":
        if (typeof a === "number" && typeof b === "number") return a + b;
        if (typeof a === "string" || typeof b === "string") return enChaine(a) + enChaine(b);
        if (Array.isArray(a) || Array.isArray(b) || (a && typeof a === "object") || (b && typeof b === "object")) return enChaine(a) + enChaine(b);
        return enNombre(a) + enNombre(b);
      case "-": return enNombre(a) - enNombre(b);
      case "*": return enNombre(a) * enNombre(b);
      case "/": return enNombre(a) / enNombre(b);
      case "%": return enNombre(a) % enNombre(b);
      case "**": return Math.pow(enNombre(a), enNombre(b));
      case "===": return a === b;
      case "!==": return a !== b;
      case "==": return egaliteLache(a, b);
      case "!=": return !egaliteLache(a, b);
      case "<": return comparer(a, b) < 0;
      case ">": return comparer(a, b) > 0;
      case "<=": return comparer(a, b) <= 0;
      case ">=": return comparer(a, b) >= 0;
      case "&": return enNombre(a) & enNombre(b);
      case "|": return enNombre(a) | enNombre(b);
      case "^": return enNombre(a) ^ enNombre(b);
    }
    lancer("Interne", "opérateur inconnu : " + op, ligne);
  }

  function egaliteLache(a, b) {
    if (a === null || a === undefined) return b === null || b === undefined;
    if (b === null || b === undefined) return false;
    /* Objet contre primitif : l'objet passe par sa forme primitive. C'est la
       règle qui rend vrais les deux exemples que tout cours cite pour dénoncer
       « == » : `[] == false` et `[1] == 1`. Sans elle, on enseignait l'inverse. */
    var oa = estObjetValeur(a), ob = estObjetValeur(b);
    if (oa && ob) return a === b;
    if (oa) return egaliteLache(versPrimitive(a), b);
    if (ob) return egaliteLache(a, versPrimitive(b));
    if (typeof a === typeof b) return a === b;
    if (typeof a === "boolean") return egaliteLache(enNombre(a), b);
    if (typeof b === "boolean") return egaliteLache(a, enNombre(b));
    if (typeof a === "number" && typeof b === "string") return a === enNombre(b);
    if (typeof a === "string" && typeof b === "number") return enNombre(a) === b;
    return a === b;
  }

  function comparer(a, b) {
    var pa = estObjetValeur(a) ? versPrimitive(a) : a;
    var pb = estObjetValeur(b) ? versPrimitive(b) : b;
    if (typeof pa === "string" && typeof pb === "string") return pa < pb ? -1 : (pa > pb ? 1 : 0);
    var x = enNombre(pa), y = enNombre(pb);
    if (isNaN(x) || isNaN(y)) return NaN;
    return x < y ? -1 : (x > y ? 1 : 0);
  }

  /* ======================================================================== */
  /* 7. PROPRIÉTÉS ET MÉTHODES DES VALEURS NATIVES                            */
  /* ======================================================================== */

  function nat(nom, f) { var x = new NatifI(nom, f, false); return x; }
  function natG(nom, f) { var x = new NatifI(nom, f, true); return x; }

  function verifFn(v, ligne, quoi) {
    if (!estFonction(v)) lancer("TypeError", quoi + " attend une fonction en argument", ligne);
    return v;
  }

  /* Un rappel de méthode de tableau reçoit (valeur, indice, tableau) et peut se
     voir imposer son `this` par le 2e argument de la méthode (`thisArg`). */
  function* rappel(fn, args, ceciRappel, ligne, ctx) {
    return yield* appeler(fn, args, ceciRappel, ligne, ctx, "rappel");
  }
  /* Un TROU n'est pas une case valant `undefined` : `forEach`, `map` et
     `filter` le sautent sans appeler le rappel. `Object.keys` le prouve. */
  function trou(t, i) { return !Object.prototype.hasOwnProperty.call(t, i); }
  function depuis(a, k, longueur) {
    var d = a.length > k ? Math.trunc(enNombre(a[k])) : 0;
    if (isNaN(d)) d = 0;
    if (d < 0) d = Math.max(0, longueur + d);
    return d;
  }

  var METHODES_TABLEAU = {
    push: nat("push", function (a, ceci) { for (var i = 0; i < a.length; i++) ceci.push(a[i]); return ceci.length; }),
    pop: nat("pop", function (a, ceci) { return ceci.pop(); }),
    shift: nat("shift", function (a, ceci) { return ceci.shift(); }),
    unshift: nat("unshift", function (a, ceci) { for (var i = a.length - 1; i >= 0; i--) ceci.unshift(a[i]); return ceci.length; }),
    slice: nat("slice", function (a, ceci) { return ceci.slice(a[0], a.length > 1 ? a[1] : undefined); }),
    splice: nat("splice", function (a, ceci) { return ceci.splice.apply(ceci, a); }),
    concat: nat("concat", function (a, ceci) { return ceci.concat.apply(ceci, a); }),
    join: nat("join", function (a, ceci) {
      var sep = a.length && a[0] !== undefined ? enChaine(a[0]) : ",", o = [];
      for (var i = 0; i < ceci.length; i++) o.push(ceci[i] === null || ceci[i] === undefined ? "" : enChaine(ceci[i]));
      return o.join(sep);
    }),
    toString: nat("toString", function (a, ceci) {
      var o = [];
      for (var i = 0; i < ceci.length; i++) o.push(ceci[i] === null || ceci[i] === undefined ? "" : enChaine(ceci[i]));
      return o.join(",");
    }),
    indexOf: nat("indexOf", function (a, ceci) { return ceci.indexOf(a[0], depuis(a, 1, ceci.length)); }),
    lastIndexOf: nat("lastIndexOf", function (a, ceci) {
      return a.length > 1 ? ceci.lastIndexOf(a[0], Math.trunc(enNombre(a[1]))) : ceci.lastIndexOf(a[0]);
    }),
    /* `includes` n'est pas `indexOf !== -1` : il compare avec SameValueZero,
       donc il TROUVE NaN. C'est la seule différence observable entre les deux,
       et c'est justement celle que le cours enseigne. */
    includes: nat("includes", function (a, ceci) {
      var d = depuis(a, 1, ceci.length);
      for (var i = d; i < ceci.length; i++) {
        if (ceci[i] === a[0]) return true;
        if (typeof ceci[i] === "number" && typeof a[0] === "number" && isNaN(ceci[i]) && isNaN(a[0])) return true;
      }
      return false;
    }),
    at: nat("at", function (a, ceci) { var i = Math.trunc(enNombre(a[0])) || 0; if (i < 0) i += ceci.length; return (i < 0 || i >= ceci.length) ? undefined : ceci[i]; }),
    reverse: nat("reverse", function (a, ceci) { return ceci.reverse(); }),
    fill: nat("fill", function (a, ceci) { return ceci.fill(a[0], a[1], a[2]); }),
    flat: nat("flat", function (a, ceci) { return ceci.flat(a.length ? enNombre(a[0]) : 1); }),
    forEach: natG("forEach", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "forEach");
      var n = ceci.length; /* la longueur est FIGÉE au départ */
      for (var i = 0; i < n && i < ceci.length; i++) { if (trou(ceci, i)) continue; yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx); }
      return undefined;
    }),
    map: natG("map", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "map");
      var out = [], n = ceci.length;
      for (var i = 0; i < n; i++) {
        if (trou(ceci, i)) { out.length = i + 1; continue; }
        out[i] = yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx);
      }
      out.length = n;
      return out;
    }),
    filter: natG("filter", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "filter");
      var out = [], n = ceci.length;
      for (var i = 0; i < n; i++) {
        if (trou(ceci, i)) continue;
        if (yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx)) out.push(ceci[i]);
      }
      return out;
    }),
    find: natG("find", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "find");
      for (var i = 0; i < ceci.length; i++) if (yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx)) return ceci[i];
      return undefined;
    }),
    findIndex: natG("findIndex", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "findIndex");
      for (var i = 0; i < ceci.length; i++) if (yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx)) return i;
      return -1;
    }),
    findLast: natG("findLast", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "findLast");
      for (var i = ceci.length - 1; i >= 0; i--) if (yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx)) return ceci[i];
      return undefined;
    }),
    findLastIndex: natG("findLastIndex", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "findLastIndex");
      for (var i = ceci.length - 1; i >= 0; i--) if (yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx)) return i;
      return -1;
    }),
    some: natG("some", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "some");
      for (var i = 0; i < ceci.length; i++) { if (trou(ceci, i)) continue; if (yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx)) return true; }
      return false;
    }),
    every: natG("every", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "every");
      for (var i = 0; i < ceci.length; i++) { if (trou(ceci, i)) continue; if (!(yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx))) return false; }
      return true;
    }),
    flatMap: natG("flatMap", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "flatMap");
      var out = [];
      for (var i = 0; i < ceci.length; i++) {
        if (trou(ceci, i)) continue;
        var v = yield* rappel(a[0], [ceci[i], i, ceci], a[1], ligne, ctx);
        if (Array.isArray(v)) { for (var j = 0; j < v.length; j++) out.push(v[j]); } else out.push(v);
      }
      return out;
    }),
    reduce: natG("reduce", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "reduce");
      var i = 0, acc;
      if (a.length > 1) acc = a[1];
      else {
        if (!ceci.length) lancer("TypeError", "reduce sur un tableau vide sans valeur initiale", ligne);
        acc = ceci[0]; i = 1;
      }
      for (; i < ceci.length; i++) acc = yield* rappel(a[0], [acc, ceci[i], i, ceci], undefined, ligne, ctx);
      return acc;
    }),
    reduceRight: natG("reduceRight", function* (a, ceci, ctx, ligne) {
      verifFn(a[0], ligne, "reduceRight");
      var i = ceci.length - 1, acc;
      if (a.length > 1) acc = a[1];
      else {
        if (!ceci.length) lancer("TypeError", "reduceRight sur un tableau vide sans valeur initiale", ligne);
        acc = ceci[i]; i--;
      }
      for (; i >= 0; i--) acc = yield* rappel(a[0], [acc, ceci[i], i, ceci], undefined, ligne, ctx);
      return acc;
    }),
    sort: natG("sort", function* (a, ceci, ctx, ligne) {
      /* Tri par insertion : STABLE, comme celui des moteurs modernes, et il
         appelle le comparateur de l'apprenant — donc il doit être générateur.
         Les `undefined` sont mis de côté et remis À LA FIN sans jamais passer
         par le comparateur : c'est la règle de la spécification. */
      var cmp = a[0], vals = [], nbIndef = 0;
      for (var z = 0; z < ceci.length; z++) { if (ceci[z] === undefined) nbIndef++; else vals.push(ceci[z]); }
      for (var i = 1; i < vals.length; i++) {
        var v = vals[i], j = i - 1;
        while (j >= 0) {
          var c;
          if (cmp) c = enNombre(yield* rappel(cmp, [vals[j], v], undefined, ligne, ctx));
          else c = (enChaine(vals[j]) > enChaine(v)) ? 1 : (enChaine(vals[j]) < enChaine(v) ? -1 : 0);
          if (c > 0) { vals[j + 1] = vals[j]; j--; } else break;
        }
        vals[j + 1] = v;
      }
      for (var k = 0; k < vals.length; k++) ceci[k] = vals[k];
      for (var m = vals.length; m < vals.length + nbIndef; m++) ceci[m] = undefined;
      return ceci;
    })
  };

  var METHODES_CHAINE = {
    toUpperCase: nat("toUpperCase", function (a, ceci) { return ceci.toUpperCase(); }),
    toLowerCase: nat("toLowerCase", function (a, ceci) { return ceci.toLowerCase(); }),
    trim: nat("trim", function (a, ceci) { return ceci.trim(); }),
    trimStart: nat("trimStart", function (a, ceci) { return ceci.trimStart(); }),
    trimEnd: nat("trimEnd", function (a, ceci) { return ceci.trimEnd(); }),
    split: nat("split", function (a, ceci) {
      var sep = a.length && a[0] !== undefined ? enChaine(a[0]) : undefined;
      var lim = a.length > 1 && a[1] !== undefined ? enNombre(a[1]) : undefined;
      return sep === undefined ? (lim === undefined ? [ceci] : ceci.split(undefined, lim)) : ceci.split(sep, lim);
    }),
    slice: nat("slice", function (a, ceci) { return ceci.slice(a[0], a.length > 1 ? a[1] : undefined); }),
    substring: nat("substring", function (a, ceci) { return ceci.substring(a[0], a.length > 1 ? a[1] : undefined); }),
    indexOf: nat("indexOf", function (a, ceci) { return ceci.indexOf(enChaine(a[0]), depuis(a, 1, ceci.length)); }),
    lastIndexOf: nat("lastIndexOf", function (a, ceci) {
      return a.length > 1 ? ceci.lastIndexOf(enChaine(a[0]), enNombre(a[1])) : ceci.lastIndexOf(enChaine(a[0]));
    }),
    includes: nat("includes", function (a, ceci) { return ceci.indexOf(enChaine(a[0]), depuis(a, 1, ceci.length)) !== -1; }),
    startsWith: nat("startsWith", function (a, ceci) { return ceci.startsWith(enChaine(a[0]), depuis(a, 1, ceci.length)); }),
    endsWith: nat("endsWith", function (a, ceci) {
      return a.length > 1 ? ceci.endsWith(enChaine(a[0]), enNombre(a[1])) : ceci.endsWith(enChaine(a[0]));
    }),
    repeat: nat("repeat", function (a, ceci) { return ceci.repeat(enNombre(a[0])); }),
    padStart: nat("padStart", function (a, ceci) { return ceci.padStart(enNombre(a[0]), a.length > 1 ? enChaine(a[1]) : " "); }),
    padEnd: nat("padEnd", function (a, ceci) { return ceci.padEnd(enNombre(a[0]), a.length > 1 ? enChaine(a[1]) : " "); }),
    charAt: nat("charAt", function (a, ceci) { return ceci.charAt(enNombre(a[0])); }),
    charCodeAt: nat("charCodeAt", function (a, ceci) { return ceci.charCodeAt(enNombre(a[0])); }),
    codePointAt: nat("codePointAt", function (a, ceci) { return ceci.codePointAt(enNombre(a[0])); }),
    at: nat("at", function (a, ceci) { return ceci.at(enNombre(a[0])); }),
    concat: nat("concat", function (a, ceci) { var s = ceci; for (var i = 0; i < a.length; i++) s += enChaine(a[i]); return s; }),
    replace: natG("replace", function* (a, ceci, ctx, ligne) {
      var motif = enChaine(a[0]), i = ceci.indexOf(motif);
      if (i === -1) return ceci;
      var remp;
      if (estFonction(a[1])) remp = enChaine(yield* rappel(a[1], [motif, i, ceci], undefined, ligne, ctx));
      else remp = enChaine(a[1]);
      return ceci.slice(0, i) + remp + ceci.slice(i + motif.length);
    }),
    replaceAll: natG("replaceAll", function* (a, ceci, ctx, ligne) {
      var motif = enChaine(a[0]);
      if (motif === "") return ceci;
      var morceaux = ceci.split(motif);
      if (!estFonction(a[1])) return morceaux.join(enChaine(a[1]));
      var res = morceaux[0], pos = morceaux[0].length;
      for (var i = 1; i < morceaux.length; i++) {
        res += enChaine(yield* rappel(a[1], [motif, pos, ceci], undefined, ligne, ctx)) + morceaux[i];
        pos += motif.length + morceaux[i].length;
      }
      return res;
    }),
    toString: nat("toString", function (a, ceci) { return ceci; })
  };

  var METHODES_NOMBRE = {
    toFixed: nat("toFixed", function (a, ceci) { return ceci.toFixed(a.length ? enNombre(a[0]) : 0); }),
    toString: nat("toString", function (a, ceci) { return a.length ? ceci.toString(enNombre(a[0])) : String(ceci); }),
    toPrecision: nat("toPrecision", function (a, ceci) { return a.length ? ceci.toPrecision(enNombre(a[0])) : String(ceci); })
  };

  /* Ce que TOUT objet hérite d'`Object.prototype` et qui sert vraiment. */
  var METHODES_OBJET = {
    hasOwnProperty: nat("hasOwnProperty", function (a, ceci) {
      var k = enChaine(a[0]);
      if (typeof ceci === "string") return k === "length" || (estIndice(k) && Number(k) < ceci.length);
      if (!ceci || typeof ceci !== "object") return false;
      if (Array.isArray(ceci) && k === "length") return true;
      return Object.prototype.hasOwnProperty.call(ceci, k);
    }),
    toString: nat("toString", function (a, ceci) { return enChaine(ceci); })
  };

  /* `call`, `apply`, `bind` : les trois outils par lesquels on APPREND `this`.
     Les omettre dans le visualiseur de `this` n'aurait aucun sens. */
  var METHODES_FONCTION = {
    call: natG("call", function* (a, ceci, ctx, ligne) {
      return yield* appeler(ceci, a.slice(1), a[0], ligne, ctx, "call");
    }),
    apply: natG("apply", function* (a, ceci, ctx, ligne) {
      return yield* appeler(ceci, Array.isArray(a[1]) ? a[1].slice() : [], a[0], ligne, ctx, "apply");
    }),
    bind: nat("bind", function (a, ceci, ctx, ligne) {
      var cible = ceci, lie = a[0], pre = a.slice(1);
      /* Une fonction liée ignore DÉFINITIVEMENT tout `this` ultérieur : c'est
         pour cela que `f.bind(a).call(b)` rend `a` et non `b`. */
      return natG("bound " + (cible.nom || ""), function* (b, c2, ctx2, l2) {
        return yield* appeler(cible, pre.concat(b), lie, l2, ctx2, "fonction liée");
      });
    })
  };
  /* Enveloppe un constructeur natif (`Error`, `TypeError`…) en classe, pour que
     `class MonErreur extends Error { constructor(m) { super(m); … } }` marche :
     `super(m)` construit l'objet natif et recopie ses propriétés sur `this`. */
  function classeDepuisNatif(c) {
    if (c.classeEnveloppe) return c.classeEnveloppe;
    var cl = new ClasseI(c.nom, null);
    cl.methodes["constructor"] = natG("constructor", function* (a, ceci, ctx, ligne) {
      var v = c.appel(a, undefined, ctx, ligne);
      if (v && typeof v === "object" && ceci && typeof ceci === "object") {
        var ks = Object.keys(v);
        for (var i = 0; i < ks.length; i++) ceci[ks[i]] = v[ks[i]];
      }
      return undefined;
    });
    c.classeEnveloppe = cl;
    return cl;
  }

  function methodeDeClasse(cl, k) {
    while (cl) { if (k in cl.methodes) return cl.methodes[k]; cl = cl.parent; }
    return undefined;
  }

  function lirePropriete(o, k, ligne, ctx, nomAff) {
    if (o === null || o === undefined) {
      lancer("TypeError", "impossible de lire « " + enChaine(k) + " » : " + (nomAff || "cette valeur") + " vaut " + representer(o, 1), ligne);
    }
    var cle = (typeof k === "number") ? k : enChaine(k);
    var propre = Object.prototype.hasOwnProperty;
    if (typeof o === "string") {
      if (cle === "length") return o.length;
      if (estIndice(cle)) { var c = o.charAt(Number(cle)); return c === "" ? undefined : c; }
      if (propre.call(METHODES_CHAINE, cle)) return METHODES_CHAINE[cle];
      if (propre.call(METHODES_OBJET, cle)) return METHODES_OBJET[cle];
      return undefined;
    }
    if (Array.isArray(o)) {
      if (cle === "length") return o.length;
      if (estIndice(cle)) return o[Number(cle)];
      if (propre.call(METHODES_TABLEAU, cle)) return METHODES_TABLEAU[cle];
      if (propre.call(METHODES_OBJET, cle)) return METHODES_OBJET[cle];
      /* Un tableau accepte aussi des propriétés texte : `t.x = 1` puis `t.x`. */
      if (propre.call(o, enChaine(cle))) return o[enChaine(cle)];
      return undefined;
    }
    if (typeof o === "number") {
      if (propre.call(METHODES_NOMBRE, cle)) return METHODES_NOMBRE[cle];
      if (propre.call(METHODES_OBJET, cle)) return METHODES_OBJET[cle];
      return undefined;
    }
    if (typeof o === "boolean") return undefined;
    if (o instanceof PromesseI) {
      if (cle === "then") return METHODES_PROMESSE.then;
      if (cle === "catch") return METHODES_PROMESSE["catch"];
      if (cle === "finally") return METHODES_PROMESSE["finally"];
      return undefined;
    }
    if (o instanceof ClasseI) {
      if (o.props && propre.call(o.props, cle)) return o.props[cle];
      if (cle === "name") return o.nom;
      return undefined;
    }
    if (o instanceof FonctionI) {
      if (o.props && propre.call(o.props, cle)) return o.props[cle];
      if (propre.call(METHODES_FONCTION, cle)) return METHODES_FONCTION[cle];
      if (cle === "name") return o.nom;
      if (cle === "length") return o.params.length;
      return undefined;
    }
    if (o instanceof NatifI) {
      if (o.props && propre.call(o.props, cle)) return o.props[cle];
      if (propre.call(METHODES_FONCTION, cle)) return METHODES_FONCTION[cle];
      if (cle === "name") return o.nom;
      return undefined;
    }
    if (typeof o === "object") {
      if (propre.call(o, cle)) return o[cle];
      if (o.__classe) { var m = methodeDeClasse(o.__classe, cle); if (m) return m; }
      if (propre.call(METHODES_OBJET, cle)) return METHODES_OBJET[cle];
      return undefined;
    }
    return undefined;
  }

  /* ======================================================================== */
  /* 8. APPELS DE FONCTION                                                    */
  /* ======================================================================== */

  function nomCadre(fn) { return (fn.nom || "(anonyme)"); }
  function apercuArgs(args) {
    var o = [];
    for (var i = 0; i < args.length && i < 5; i++) o.push(court(representer(args[i], 1), 24));
    if (args.length > 5) o.push("…");
    return o.join(", ");
  }

  function* preparerPortee(fn, args, ceci, ctx) {
    var p = new Portee(fn.portee, "fonction " + nomCadre(fn), "fonction");
    if (!fn.estFleche) p.declarer("this", ceci, "this", true);
    if (fn.classe) p.declarer("__classe__", fn.classe, "interne", true);
    /* La liste des paramètres est SA PROPRE portée : un paramètre est en zone
       morte tant qu'il n'est pas initialisé. D'où l'erreur, correcte, de
       `function f(a = b, b = 1)` — sans ce préambule, `b` allait chercher une
       variable globale du même nom et le programme mentait en silence. */
    for (var j = 0; j < fn.params.length; j++) p.declarer(fn.params[j].nom, undefined, "param", false);
    for (var i = 0; i < fn.params.length; i++) {
      var v = args[i];
      if (v === undefined && fn.params[i].defaut) v = yield* evaluer(fn.params[i].defaut, p, ctx);
      p.vars[fn.params[i].nom].valeur = v;
      p.vars[fn.params[i].nom].pret = true;
    }
    return p;
  }

  function* appeler(fn, args, ceci, ligne, ctx, nomAff, porteeAppelante) {
    if (fn instanceof NatifI) {
      ctx.porteeAppelante = porteeAppelante || ctx.porteeAppelante;
      if (fn.gen) return yield* fn.appel(args, ceci, ctx, ligne);
      return fn.appel(args, ceci, ctx, ligne);
    }
    if (fn instanceof ClasseI) lancer("TypeError", "la classe « " + fn.nom + " » doit être appelée avec « new »", ligne);
    if (!(fn instanceof FonctionI)) {
      lancer("TypeError", (nomAff || "cette valeur") + " n'est pas une fonction (elle vaut " + representer(fn, 1) + ")", ligne);
    }
    if (fn.estAsync) return lancerAsync(fn, args, ceci, ctx, ligne);

    var p = yield* preparerPortee(fn, args, ceci, ctx);
    if (ctx.pile.length > 220) lancer("RangeError", "pile d'appels dépassée — la récursion ne s'arrête jamais", ligne);
    ctx.pile.push({ nom: nomCadre(fn), ligne: fn.corps.ligne });
    noter(ctx, p, fn.corps.ligne, "appel", nomCadre(fn) + "(" + apercuArgs(args) + ")");

    var r = null, jete = null;
    try {
      if (fn.exprCorps) r = { sig: RETOUR, valeur: yield* evaluer(fn.corps, p, ctx) };
      else r = yield* execBloc(fn.corps.corps, p, ctx);
    } catch (e) { jete = e; }

    var val = (r && r.sig === RETOUR) ? r.valeur : undefined;
    if (!jete) noter(ctx, p, ctx.pile[ctx.pile.length - 1].ligne, "retour", nomCadre(fn) + " retourne " + court(representer(val, 1), 40));
    ctx.pile.pop();
    if (jete) throw jete;
    return val;
  }

  function* construire(C, args, ligne, ctx, nomAff, porteeAppelante) {
    if (C instanceof NatifI && C.estCtor) return C.appel(args, undefined, ctx, ligne);
    if (C instanceof ClasseI) {
      var obj = {};
      Object.defineProperty(obj, "__classe", { value: C, enumerable: false, writable: true });
      var ctor = methodeDeClasse(C, "constructor");
      if (ctor) yield* appeler(ctor, args, obj, ligne, ctx, C.nom, porteeAppelante);
      return obj;
    }
    if (C instanceof FonctionI) {
      var obj2 = {};
      var res = yield* appeler(C, args, obj2, ligne, ctx, nomAff, porteeAppelante);
      return (res && typeof res === "object") ? res : obj2;
    }
    lancer("TypeError", (nomAff || "cette valeur") + " n'est pas un constructeur", ligne);
  }

  /* ======================================================================== */
  /* 9. PROMESSES, MICROTÂCHES, BOUCLE D'ÉVÉNEMENTS                           */
  /* ======================================================================== */

  function PromesseI(ctx) { this.ctx = ctx; this.etat = "attente"; this.valeur = undefined; this.abonnes = []; this.traitee = false; }
  /* Un « thenable » est n'importe quel objet doté d'une méthode `then` : le
     moteur le traite comme une promesse. */
  function thenableAlors(v) {
    if (v instanceof PromesseI) return null;
    if (!v || typeof v !== "object") return null;
    var f = Object.prototype.hasOwnProperty.call(v, "then") ? v.then : (v.__classe ? methodeDeClasse(v.__classe, "then") : undefined);
    return estFonction(f) ? f : null;
  }

  PromesseI.prototype.resoudre = function (v) {
    if (this.etat !== "attente" || this.verrouillee) return;
    var self = this, alors = thenableAlors(v);
    if (v instanceof PromesseI || alors) {
      /* DEUX tours de microtâche, pas un. Le moteur inscrit d'abord une tâche
         (« PromiseResolveThenableJob ») qui appellera `then`, laquelle inscrit
         à son tour la reprise. C'est toute l'explication du piège fameux :
         `return Promise.resolve(x)` dans un `.then` coûte deux tours de retard.
         Avec un seul tour, l'ordre affiché était faux. */
      this.verrouillee = true;
      this.ctx.micro.push(function () {
        if (v instanceof PromesseI) v.alors(function (x) { self.tenir(x); }, function (e) { self.rompre(e); });
        else adopterThenable(self, v, alors);
      });
      return;
    }
    this.tenir(v);
  };
  PromesseI.prototype.reprendre = function (v) { this.verrouillee = false; this.resoudre(v); };
  PromesseI.prototype.tenir = function (v) { if (this.etat !== "attente") return; this.etat = "tenue"; this.valeur = v; this.vider(); };
  PromesseI.prototype.rompre = function (e) {
    if (this.etat !== "attente") return;
    this.etat = "rompue"; this.valeur = e;
    /* Un rejet que personne n'attrape fait mourir le vrai Node. L'ignorer
       laissait le programme continuer et afficher des lignes de plus. */
    if (!this.traitee) this.ctx.rejetsEnAttente.push(this);
    this.vider();
  };

  function adopterThenable(pr, v, alors) {
    var ctx = pr.ctx, fait = false;
    var res = nat("resolve", function (b) { if (!fait) { fait = true; pr.reprendre(b[0]); } return undefined; });
    var rej = nat("reject", function (b) { if (!fait) { fait = true; pr.verrouillee = false; pr.rompre(b[0]); } return undefined; });
    executerRappel(alors, [res, rej], ctx, new PromesseI(ctx), 0, v);
  }
  PromesseI.prototype.vider = function () {
    var self = this, ab = this.abonnes;
    this.abonnes = [];
    for (var i = 0; i < ab.length; i++) {
      (function (a) {
        self.ctx.micro.push(function () { (self.etat === "tenue" ? a.ok : a.ko)(self.valeur); });
      })(ab[i]);
    }
  };
  PromesseI.prototype.alors = function (ok, ko) {
    this.traitee = true;
    var self = this;
    if (this.etat === "attente") this.abonnes.push({ ok: ok, ko: ko });
    else this.ctx.micro.push(function () { (self.etat === "tenue" ? ok : ko)(self.valeur); });
  };

  function abonner(v, ctx, ok, ko) {
    if (v instanceof PromesseI) { v.alors(ok, ko); return; }
    if (thenableAlors(v)) { var p = new PromesseI(ctx); p.resoudre(v); p.alors(ok, ko); return; }
    ctx.micro.push(function () { ok(v); });
  }

  /* Conduit un générateur d'exécution jusqu'à son terme, en le suspendant sur
     chaque `await`. La pile d'appels affichée est mise de côté pendant la pause
     et remise en place à la reprise — c'est exactement ce que fait le moteur. */
  function conduire(gen, ctx, base, ok, ko) {
    var sauve = null;
    function pas(entree, estErr) {
      if (sauve) { for (var i = 0; i < sauve.length; i++) ctx.pile.push(sauve[i]); sauve = null; }
      var r;
      try { r = estErr ? gen.throw(entree) : gen.next(entree); }
      catch (e) {
        if (e instanceof ErreurLancee) { ko(e); return; }
        throw e;
      }
      if (r.done) { ok(r.value); return; }
      sauve = ctx.pile.splice(base);
      abonner(r.value.attente, ctx, function (v) { pas(v, false); }, function (e) { pas(new ErreurLancee(e), true); });
    }
    pas(undefined, false);
  }

  function lancerAsync(fn, args, ceci, ctx, ligne) {
    var pr = new PromesseI(ctx);
    var base = ctx.pile.length;
    conduire(corpsAsync(fn, args, ceci, ctx, ligne), ctx, base,
      function (v) { pr.resoudre(v); },
      function (e) { pr.rompre(e.valeurLancee); });
    return pr;
  }

  function* corpsAsync(fn, args, ceci, ctx, ligne) {
    var p = yield* preparerPortee(fn, args, ceci, ctx);
    if (ctx.pile.length > 220) lancer("RangeError", "pile d'appels dépassée", ligne);
    ctx.pile.push({ nom: nomCadre(fn) + " (async)", ligne: fn.corps.ligne });
    noter(ctx, p, fn.corps.ligne, "appel", nomCadre(fn) + "(" + apercuArgs(args) + ") — fonction asynchrone");
    var r = null, jete = null;
    try {
      if (fn.exprCorps) r = { sig: RETOUR, valeur: yield* evaluer(fn.corps, p, ctx) };
      else r = yield* execBloc(fn.corps.corps, p, ctx);
    } catch (e) { jete = e; }
    var val = (r && r.sig === RETOUR) ? r.valeur : undefined;
    if (!jete) noter(ctx, p, ctx.pile[ctx.pile.length - 1].ligne, "retour", nomCadre(fn) + " tient sa promesse avec " + court(representer(val, 1), 40));
    ctx.pile.pop();
    if (jete) throw jete;
    return val;
  }

  function executerRappel(fn, args, ctx, suivante, ligne, ceci) {
    var base = ctx.pile.length;
    conduire(appeler(fn, args, ceci, ligne || 0, ctx, "rappel"), ctx, base,
      function (v) { suivante.resoudre(v); },
      function (e) { suivante.rompre(e.valeurLancee); });
  }

  function promesseAlors(pr, onT, onR, ctx, ligne) {
    var suivante = new PromesseI(ctx);
    pr.alors(
      function (v) { if (estFonction(onT)) executerRappel(onT, [v], ctx, suivante, ligne); else suivante.resoudre(v); },
      function (e) { if (estFonction(onR)) executerRappel(onR, [e], ctx, suivante, ligne); else suivante.rompre(e); }
    );
    return suivante;
  }

  var METHODES_PROMESSE = {
    then: nat("then", function (a, ceci, ctx, ligne) { return promesseAlors(ceci, a[0], a[1], ctx, ligne); }),
    "catch": nat("catch", function (a, ceci, ctx, ligne) { return promesseAlors(ceci, null, a[0], ctx, ligne); }),
    /* `.finally(f)` doit APPELER f, dans les deux issues, puis laisser passer la
       valeur ou relancer l'erreur. L'ancienne version capturait `f` et ne
       l'appelait jamais : la ligne du `finally` manquait purement à la sortie. */
    "finally": nat("finally", function (a, ceci, ctx, ligne) {
      var f = a[0];
      return promesseAlors(ceci,
        natG("(finally)", function* (b, c2, ctx2, l2) {
          if (estFonction(f)) yield* appeler(f, [], undefined, l2, ctx2, "finally");
          return b[0];
        }),
        natG("(finally)", function* (b, c2, ctx2, l2) {
          if (estFonction(f)) yield* appeler(f, [], undefined, l2, ctx2, "finally");
          throw new ErreurLancee(b[0], l2);
        }),
        ctx, ligne);
    })
  };

  /* Une promesse rejetée que personne n'a fini par écouter arrête le programme,
     exactement comme dans Node. Le contrôle a lieu quand les microtâches sont
     épuisées : c'est le moment où le moteur constate qu'aucun `catch` ne
     viendra plus. */
  function verifierRejets(ctx) {
    while (ctx.rejetsEnAttente.length) {
      var p = ctx.rejetsEnAttente.shift();
      if (!p.traitee) throw new ErreurLancee(p.valeur, 0);
    }
  }

  function pompe(ctx) {
    var garde = 0;
    while (garde++ < 500000) {
      if (ctx.micro.length) { var m = ctx.micro.shift(); m(); continue; }
      verifierRejets(ctx);
      if (ctx.macro.length) {
        ctx.macro.sort(function (a, b) { return (a.echeance - b.echeance) || (a.ordre - b.ordre); });
        var t = ctx.macro.shift();
        ctx.horloge = t.echeance;
        if (t.annulee) continue;
        noter(ctx, ctx.global, t.ligne, "tache",
          "la pile est vide : la boucle d'événements dépile le minuteur inscrit pour " + t.delai + " ms");
        var base = ctx.pile.length;
        conduire(appeler(t.fn, t.args, undefined, t.ligne, ctx, "minuteur"), ctx, base,
          function () { },
          function (e) { throw e; });
        continue;
      }
      break;
    }
  }

  /* ======================================================================== */
  /* 10. ENVIRONNEMENT GLOBAL                                                 */
  /* ======================================================================== */

  function stringifier(v, indent, niveau) {
    if (v === null) return "null";
    if (v === undefined || estFonction(v)) return undefined;
    var t = typeof v;
    if (t === "number") return isFinite(v) ? String(v) : "null";
    if (t === "boolean") return String(v);
    if (t === "string") return JSON.stringify(v);
    var pad = indent ? "\n" + new Array(niveau + 2).join(indent) : "";
    var padFin = indent ? "\n" + new Array(niveau + 1).join(indent) : "";
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      var o = [];
      for (var i = 0; i < v.length; i++) { var s = stringifier(v[i], indent, niveau + 1); o.push(s === undefined ? "null" : s); }
      return "[" + pad + o.join("," + (pad || "")) + padFin + "]";
    }
    if (v instanceof ErreurJS) return "{}";
    var ks = Object.keys(v), o2 = [];
    for (var j = 0; j < ks.length; j++) {
      var sv = stringifier(v[ks[j]], indent, niveau + 1);
      if (sv !== undefined) o2.push(JSON.stringify(ks[j]) + (indent ? ": " : ":") + sv);
    }
    if (!o2.length) return "{}";
    return "{" + pad + o2.join("," + (pad || "")) + padFin + "}";
  }

  /* `parseInt` sans base n'est PAS « base 10 » : c'est base 10 SAUF si le texte
     commence par 0x / 0X, auquel cas c'est de l'hexadécimal. Forcer 10 faisait
     rendre 0 pour « 0x1F » là où le vrai moteur rend 31. */
  function parseIntJS(s, base) {
    if (base === undefined || base === 0 || isNaN(base)) return parseInt(s, undefined);
    return parseInt(s, base);
  }

  function installerNatifs(portee, ctx) {
    function d(nom, v) { portee.declarer(nom, v, "natif", true); }

    var log = nat("log", function (a, ceci, ctx2, ligne) {
      var o = [];
      for (var i = 0; i < a.length; i++) o.push(representer(a[i], 0));
      ctx2.sortie.push(o.join(" "));
      noter(ctx2, ctx2.porteeAppelante || ctx2.global, ligne, "sortie", "affiche : " + court(o.join(" "), 60));
      return undefined;
    });
    d("console", { log: log, info: log, warn: log, error: log, debug: log });

    d("Math", {
      PI: Math.PI, E: Math.E,
      floor: nat("floor", function (a) { return Math.floor(enNombre(a[0])); }),
      ceil: nat("ceil", function (a) { return Math.ceil(enNombre(a[0])); }),
      round: nat("round", function (a) { return Math.round(enNombre(a[0])); }),
      trunc: nat("trunc", function (a) { return Math.trunc(enNombre(a[0])); }),
      abs: nat("abs", function (a) { return Math.abs(enNombre(a[0])); }),
      sqrt: nat("sqrt", function (a) { return Math.sqrt(enNombre(a[0])); }),
      cbrt: nat("cbrt", function (a) { return Math.cbrt(enNombre(a[0])); }),
      pow: nat("pow", function (a) { return Math.pow(enNombre(a[0]), enNombre(a[1])); }),
      sign: nat("sign", function (a) { return Math.sign(enNombre(a[0])); }),
      log: nat("log", function (a) { return Math.log(enNombre(a[0])); }),
      log2: nat("log2", function (a) { return Math.log2(enNombre(a[0])); }),
      log10: nat("log10", function (a) { return Math.log10(enNombre(a[0])); }),
      exp: nat("exp", function (a) { return Math.exp(enNombre(a[0])); }),
      sin: nat("sin", function (a) { return Math.sin(enNombre(a[0])); }),
      cos: nat("cos", function (a) { return Math.cos(enNombre(a[0])); }),
      tan: nat("tan", function (a) { return Math.tan(enNombre(a[0])); }),
      hypot: nat("hypot", function (a) { var n = []; for (var i = 0; i < a.length; i++) n.push(enNombre(a[i])); return Math.hypot.apply(Math, n); }),
      max: nat("max", function (a) { var n = []; for (var i = 0; i < a.length; i++) n.push(enNombre(a[i])); return Math.max.apply(Math, n); }),
      min: nat("min", function (a) { var n = []; for (var i = 0; i < a.length; i++) n.push(enNombre(a[i])); return Math.min.apply(Math, n); }),
      /* Générateur pseudo-aléatoire DÉTERMINISTE (xorshift) : sans lui, aucune
         exécution ne serait reproductible, donc rien ne serait vérifiable. */
      random: nat("random", function (a, ceci, ctx2) {
        ctx2.graine ^= ctx2.graine << 13; ctx2.graine ^= ctx2.graine >>> 17; ctx2.graine ^= ctx2.graine << 5;
        ctx2.graine = ctx2.graine | 0;
        return (ctx2.graine >>> 0) / 4294967296;
      })
    });

    var jsonObj = {
      stringify: nat("stringify", function (a) {
        var esp = a.length > 2 ? a[2] : undefined;
        var ind = typeof esp === "number" ? new Array(esp + 1).join(" ") : (typeof esp === "string" ? esp : "");
        var s = stringifier(a[0], ind, 0);
        return s === undefined ? undefined : s;
      }),
      parse: nat("parse", function (a, ceci, ctx2, ligne) {
        try { return JSON.parse(enChaine(a[0])); }
        catch (e) { lancer("SyntaxError", "JSON invalide : " + e.message, ligne); }
      })
    };
    d("JSON", jsonObj);

    /* Une chaîne A des clés : `Object.keys("ab")` rend ['0','1']. */
    function clesDe(o) {
      if (typeof o === "string") { var r = []; for (var i = 0; i < o.length; i++) r.push(String(i)); return r; }
      if (o && typeof o === "object") return Object.keys(o);
      return [];
    }
    function valeurDe(o, k) { return typeof o === "string" ? o.charAt(Number(k)) : o[k]; }
    d("Object", {
      keys: nat("keys", function (a) { return clesDe(a[0]); }),
      values: nat("values", function (a) {
        var o = a[0], ks = clesDe(o), r = [];
        for (var i = 0; i < ks.length; i++) r.push(valeurDe(o, ks[i]));
        return r;
      }),
      entries: nat("entries", function (a) {
        var o = a[0], ks = clesDe(o), r = [];
        for (var i = 0; i < ks.length; i++) r.push([ks[i], valeurDe(o, ks[i])]);
        return r;
      }),
      assign: nat("assign", function (a) {
        var cible = a[0];
        for (var i = 1; i < a.length; i++) {
          var s = a[i], ks = clesDe(s);
          for (var j = 0; j < ks.length; j++) cible[ks[j]] = valeurDe(s, ks[j]);
        }
        return cible;
      }),
      is: nat("is", function (a) { return Object.is(a[0], a[1]); }),
      freeze: nat("freeze", function (a) { return a[0]; }),
      fromEntries: nat("fromEntries", function (a) {
        var o = {}, l = a[0] || [];
        for (var i = 0; i < l.length; i++) o[enChaine(l[i][0])] = l[i][1];
        return o;
      })
    });

    var arrCtor = nat("Array", function (a) {
      if (a.length === 1 && typeof a[0] === "number") { var r = []; for (var i = 0; i < a[0]; i++) r.push(undefined); return r; }
      return a.slice();
    });
    arrCtor.estCtor = true;
    arrCtor.props = {
      isArray: nat("isArray", function (a) { return Array.isArray(a[0]); }),
      from: nat("from", function (a) {
        var s = a[0];
        if (typeof s === "string") return s.split("");
        if (Array.isArray(s)) return s.slice();
        if (s && typeof s === "object" && typeof s.length === "number") { var r = []; for (var i = 0; i < s.length; i++) r.push(s[i]); return r; }
        return [];
      }),
      of: nat("of", function (a) { return a.slice(); })
    };
    d("Array", arrCtor);

    var numCtor = nat("Number", function (a) { return a.length ? enNombre(a[0]) : 0; });
    numCtor.props = {
      isInteger: nat("isInteger", function (a) { return typeof a[0] === "number" && isFinite(a[0]) && Math.floor(a[0]) === a[0]; }),
      isNaN: nat("isNaN", function (a) { return typeof a[0] === "number" && isNaN(a[0]); }),
      isFinite: nat("isFinite", function (a) { return typeof a[0] === "number" && isFinite(a[0]); }),
      parseFloat: nat("parseFloat", function (a) { return parseFloat(enChaine(a[0])); }),
      parseInt: nat("parseInt", function (a) { return parseIntJS(enChaine(a[0]), a.length > 1 ? enNombre(a[1]) : undefined); }),
      MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
      MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
      EPSILON: Number.EPSILON,
      MAX_VALUE: Number.MAX_VALUE
    };
    d("Number", numCtor);

    var strCtor = nat("String", function (a) { return a.length ? enChaine(a[0]) : ""; });
    strCtor.props = {
      fromCharCode: nat("fromCharCode", function (a) { var n = []; for (var i = 0; i < a.length; i++) n.push(enNombre(a[i])); return String.fromCharCode.apply(String, n); })
    };
    d("String", strCtor);
    d("Boolean", nat("Boolean", function (a) { return !!a[0]; }));

    d("parseInt", nat("parseInt", function (a) { return parseIntJS(enChaine(a[0]), a.length > 1 ? enNombre(a[1]) : undefined); }));
    d("parseFloat", nat("parseFloat", function (a) { return parseFloat(enChaine(a[0])); }));
    d("isNaN", nat("isNaN", function (a) { return isNaN(enNombre(a[0])); }));
    d("isFinite", nat("isFinite", function (a) { return isFinite(enNombre(a[0])); }));
    d("NaN", NaN);
    d("Infinity", Infinity);

    function ctorErreur(nom) {
      var c = nat(nom, function (a) { return new ErreurJS(nom, a.length ? enChaine(a[0]) : ""); });
      c.estCtor = true;
      return c;
    }
    d("Error", ctorErreur("Error"));
    d("TypeError", ctorErreur("TypeError"));
    d("RangeError", ctorErreur("RangeError"));
    d("SyntaxError", ctorErreur("SyntaxError"));
    d("ReferenceError", ctorErreur("ReferenceError"));

    var promCtor = nat("Promise", function (a, ceci, ctx2, ligne) {
      var pr = new PromesseI(ctx2);
      var executeur = a[0];
      if (!estFonction(executeur)) lancer("TypeError", "new Promise attend une fonction", ligne);
      var resolveur = nat("resolve", function (b) { pr.resoudre(b[0]); return undefined; });
      var rejeteur = nat("reject", function (b) { pr.rompre(b[0]); return undefined; });
      var bidon = new PromesseI(ctx2);
      executerRappel(executeur, [resolveur, rejeteur], ctx2, bidon, ligne);
      return pr;
    });
    promCtor.estCtor = true;
    promCtor.props = {
      resolve: nat("resolve", function (a, ceci, ctx2) {
        if (a[0] instanceof PromesseI) return a[0];
        var p = new PromesseI(ctx2); p.resoudre(a[0]); return p;
      }),
      reject: nat("reject", function (a, ceci, ctx2) { var p = new PromesseI(ctx2); p.rompre(a[0]); return p; }),
      all: nat("all", function (a, ceci, ctx2) {
        var liste = a[0] || [], res = new PromesseI(ctx2), out = [], reste = liste.length;
        if (!reste) { res.resoudre([]); return res; }
        for (var i = 0; i < liste.length; i++) {
          (function (idx) {
            abonner(liste[idx], ctx2,
              function (v) { out[idx] = v; if (--reste === 0) res.resoudre(out); },
              function (e) { res.rompre(e); });
          })(i);
        }
        return res;
      })
    };
    d("Promise", promCtor);

    d("setTimeout", nat("setTimeout", function (a, ceci, ctx2, ligne) {
      var fn = a[0], delai = a.length > 1 ? enNombre(a[1]) : 0;
      /* Tout délai inférieur à 1 ms — 0, absent, négatif, 0,5 — est ramené à
         1 ms par le moteur. C'est ce qui fait que l'ORDRE D'INSCRIPTION tranche
         entre `setTimeout(f, 0)` et `setTimeout(g, 1)`. */
      if (!isFinite(delai) || delai < 1 || delai > 2147483647) delai = 1;
      delai = Math.trunc(delai);
      if (!estFonction(fn)) lancer("TypeError", "setTimeout attend une fonction", ligne);
      var id = ++ctx2.seq;
      ctx2.macro.push({ id: id, ordre: id, delai: delai, echeance: ctx2.horloge + delai, fn: fn, args: a.slice(2), ligne: ligne, annulee: false });
      return id;
    }));
    d("setInterval", nat("setInterval", function (a, ceci, ctx2, ligne) {
      lancer("Limite", "setInterval n'est pas supporté par ce visualiseur (il ne s'arrêterait jamais)", ligne);
    }));
    d("clearTimeout", nat("clearTimeout", function (a, ceci, ctx2) {
      for (var i = 0; i < ctx2.macro.length; i++) if (ctx2.macro[i].id === a[0]) ctx2.macro[i].annulee = true;
      return undefined;
    }));
    d("queueMicrotask", nat("queueMicrotask", function (a, ceci, ctx2, ligne) {
      var fn = a[0], bidon = new PromesseI(ctx2);
      ctx2.micro.push(function () { executerRappel(fn, [], ctx2, bidon, ligne); });
      return undefined;
    }));
  }

  /* ======================================================================== */
  /* 11. API PUBLIQUE                                                         */
  /* ======================================================================== */

  function decrireErreur(v, ligne) {
    if (v instanceof ErreurJS) return { nom: v.name, message: v.message, ligne: ligne || 0 };
    return { nom: "Valeur lancée", message: representer(v, 1), ligne: ligne || 0 };
  }

  function executer(source, options) {
    options = options || {};
    var res = { ok: true, sortie: [], trace: [], erreur: null, pas: 0, tronquee: false };
    var arbre;
    try { arbre = analyser(source); }
    catch (e) {
      if (e instanceof ErreurSyntaxe) { res.ok = false; res.erreur = { nom: "Erreur de syntaxe", message: e.message, ligne: e.ligne }; return res; }
      throw e;
    }
    var ctx = new Contexte(source, options);
    ctx.graine = (options.graine || 123456789) | 0;
    var natifs = new Portee(null, "(natifs)", "natif");
    installerNatifs(natifs, ctx);
    var glob = new Portee(natifs, "portée globale", "global");
    glob.declarer("this", undefined, "this", true);
    ctx.global = glob;
    ctx.porteeAppelante = glob;
    ctx.pile.push({ nom: "(programme principal)", ligne: 1 });

    try {
      conduire(execBloc(arbre.corps, glob, ctx), ctx, ctx.pile.length,
        function () { }, function (e) { throw e; });
      pompe(ctx);
      noter(ctx, glob, ctx.lignes.length, "fin", "le programme est terminé : pile vide, files vides");
    } catch (e) {
      if (e instanceof ErreurLancee) {
        res.ok = false;
        res.erreur = decrireErreur(e.valeurLancee, e.ligne);
        noter(ctx, glob, e.ligne, "erreur", "erreur non interceptée : " + res.erreur.nom + " — " + res.erreur.message);
      } else {
        res.ok = false;
        res.erreur = { nom: "Erreur interne", message: String((e && e.message) || e), ligne: 0 };
      }
    }

    res.sortie = ctx.sortie;
    res.trace = ctx.trace;
    res.pas = ctx.pas;
    res.tronquee = ctx.tronquee;
    return res;
  }

  var Interpreteur = {
    executer: executer,
    analyser: analyser,
    representer: representer,
    enChaine: enChaine,
    ErreurSyntaxe: ErreurSyntaxe
  };

  if (typeof module !== "undefined" && module.exports) module.exports = Interpreteur;
  if (racine) racine.Interpreteur = Interpreteur;
})(typeof window !== "undefined" ? window : null);
