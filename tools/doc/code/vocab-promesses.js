/* Trois mots de documentation, et ce qu'ils promettent VRAIMENT.
   Clique sur « Tester » : c'est ton navigateur qui répond, pas cette page. */

/* 1. « deprecated » — déconseillé, pas retiré.
      escape() est déconseillée depuis 1999. Elle répond encore. */
console.log('escape existe ici ?', typeof escape);
if (typeof escape === 'function') console.log('escape("é") =', escape('é'));
console.log('"abcdef".substr(1, 2) =', 'abcdef'.substr(1, 2));

/* 2. « optional » — omis et undefined ne se voient pas pareil. */
function bonjour(nom = 'monde') {
  return nom + ' (' + arguments.length + ' argument reçu)';
}
console.log(bonjour());
console.log(bonjour(undefined));
console.log(bonjour(null));

/* 3. « throws » — une promesse peut être trop large.
      Une doc qui annonce « throws if s is not a string » se trompe :
      un objet String n'est pas une chaîne primitive, et il passe. */
function initiale(s) {
  if (typeof s !== 'string' && !(s instanceof String)) throw new TypeError('not a string');
  return s.charAt(0);
}
console.log('typeof new String("Ada") =', typeof new String('Ada'));
console.log('initiale(new String("Ada")) =', initiale(new String('Ada')));
try {
  initiale(42);
} catch (e) {
  console.log('initiale(42) lève', e.name + ': ' + e.message);
}
