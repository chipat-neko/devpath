"use strict";
/* usage : node essai.js props.json [--ecrire] */
var fs = require("fs");
var L = require("./lib.js");
var propsFile = process.argv[2];
var ecrire = process.argv.indexOf("--ecrire") > -1;
var props = JSON.parse(fs.readFileSync(propsFile, "utf8"));

Object.keys(props).forEach(function (f) {
  var src = fs.readFileSync(L.chemin(f), "utf8");
  var qs = L.questionsDe(src);
  var nouveau = src;
  Object.keys(props[f]).forEach(function (qi) {
    var q = qs[parseInt(qi, 10) - 1];
    if (!q) throw new Error("question " + qi + " absente de " + f);
    Object.keys(props[f][qi]).forEach(function (oi) {
      var j = parseInt(oi, 10);
      if (j === q.correct) throw new Error("INTERDIT : " + f + " q" + qi + " option " + j + " est la bonne reponse");
      var vieux = JSON.stringify(q.a[j]);
      var neuf = JSON.stringify(props[f][qi][oi]);
      var n = nouveau.split(vieux).length - 1;
      if (n !== 1) throw new Error("remplacement ambigu (" + n + ") dans " + f + " q" + qi + " opt " + j);
      nouveau = nouveau.replace(vieux, neuf);
    });
  });
  if (ecrire) { fs.writeFileSync(L.chemin(f), nouveau); console.log("  ecrit " + f); }
  else { console.log("  (essai) " + f); }

  /* rapport */
  var refSrc = L.lireRef(f);
  var qr = L.questionsDe(refSrc), vr = L.vocabulaire(refSrc);
  var qd = L.questionsDe(nouveau), vd = L.vocabulaire(nouveau);
  qd.forEach(function (q, i) {
    if (!props[f][String(i + 1)]) return;
    var a = L.signature(qr[i], vr), b = L.signature(q, vd);
    var diff = [];
    ["correct", "rang", "dense", "bavarde", "w", "k", "x"].forEach(function (cle) {
      if (JSON.stringify(a[cle]) !== JSON.stringify(b[cle])) diff.push("    " + cle + " ATTENDU " + JSON.stringify(a[cle]) + "  OBTENU " + JSON.stringify(b[cle]));
    });
    console.log("  q" + (i + 1) + (diff.length ? " ECART" : " OK"));
    if (diff.length) {
      diff.forEach(function (d) { console.log(d); });
      var Lr = qr[i].a.map(function (t) { return t.length; });
      var Ld = q.a.map(function (t) { return t.length; });
      q.a.forEach(function (t, j) {
        var ml = L.motsLongs(t);
        var kk = Array.from(new Set(ml)).filter(function (m) { return !vd.has(m); });
        console.log("     [" + j + "] len " + Lr[j] + "->" + Ld[j] + " nm=" + L.nmots(t) + " dens=" + L.densite(t).toFixed(3) + " w=" + ml.length + "(ref " + L.motsLongs(qr[i].a[j]).length + ") k=" + kk.length + " : " + (kk.join(",") || "-"));
      });
    }
  });
});
