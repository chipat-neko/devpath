/* =============================================================================
   sw.js — Service worker de Syntaxe (P10). Met en cache la « coquille » de
   l'app puis, à la volée, les pages et ressources visitées → consultation
   HORS LIGNE une fois installé. Stratégie : cache d'abord, mise à jour réseau
   en arrière-plan.
   ⚠️ Un service worker ne s'enregistre qu'en HTTPS ou http://localhost — JAMAIS
   en file://. L'enregistrement (js/main.js) ne tente donc rien en local.
   ============================================================================= */
var CACHE = "syntaxe-v3"; /* incrémenté quand un fichier de SHELL change (V12-B1 : theme.js ;
                             v3 : manifeste rangé dans assets/, 2026-09-26) */

/* Coquille minimale pré-chargée à l'installation (chemins relatifs à la racine
   où vit ce service worker). */
var SHELL = [
  "./",
  "index.html",
  "assets/manifest.webmanifest",
  "css/fonts.css",
  "assets/fonts/inter-latin.woff2",
  "assets/fonts/inter-latin-ext.woff2",
  "assets/fonts/jetbrains-mono-latin.woff2",
  "assets/fonts/jetbrains-mono-latin-ext.woff2",
  "assets/fonts/space-grotesk-latin.woff2",
  "assets/fonts/space-grotesk-latin-ext.woff2",
  "css/variables.css",
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "css/pages.css",
  "js/theme.js",
  "js/main.js",
  "js/data.js",
  "assets/img/favicon.svg",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (c) {
        return c.addAll(SHELL);
      })
      .then(function () {
        return self.skipWaiting();
      })
      .catch(function () {})
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req)
        .then(function (res) {
          /* On ne met en cache que les réponses « propres » de même origine. */
          if (res && res.status === 200 && res.type === "basic") {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) {
              c.put(req, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return cached;
        });
      return cached || network;
    })
  );
});
