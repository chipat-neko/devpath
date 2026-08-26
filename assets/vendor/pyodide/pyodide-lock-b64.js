/* pyodide-lock-b64.js — index des paquets de Pyodide, VOLONTAIREMENT VIDE.
   Le chargeur réclame ce fichier au démarrage. Le vrai en déclare 310 (numpy,
   pandas, scikit-learn…), tous téléchargeables depuis un CDN — or aucun n'est
   embarqué et le site n'émet aucune requête. Un index vide rend `loadPackage`
   incapable de demander quoi que ce soit : c'est le garde-fou, pas une économie
   (30 Ko). Vérifié le 2026-08-26 : Pyodide démarre normalement avec cet index.
   Contenu : {"info": {…}, "packages": {}}, gzippé puis encodé en base64.
   Régénérable : node tools/build-pyodide.js <dossier-pyodide> */
self.PYODIDE_LOCK_GZ_B64="H4sIAAAAAAACCkXMywpCIRQF0H/ZYxEft4jzM3ISb1fKBypFiP8eNWm8YE3EvBfQBF+je4bWY8kgGGU2pyDAzR8gvLgnayBQHzz20hIIIXXfYh0hO+u0O12+/B7HL7BSG6kh8D+VNGe5YQlU9ne+hQ6aa30AmZopv4MAAAA=";
