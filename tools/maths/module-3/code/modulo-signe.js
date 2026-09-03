/* Le piège numéro un du modulo : ce que « % » rend sur un nombre négatif. */

// On range onze horodatages dans 3 seaux, en avançant ET en reculant dans le temps.
const seaux = 3;
console.log('n     n % 3   modulo(n, 3)');
for (let n = -5; n <= 5; n++) {
  const reste = n % seaux;                        // l'opérateur du langage
  const modulo = ((n % seaux) + seaux) % seaux;   // le modulo mathématique
  console.log(String(n).padStart(2) + '     ' + String(reste).padStart(2) + '       ' + modulo);
}

// Combien de valeurs distinctes chaque forme produit-elle sur cet intervalle ?
const restes = new Set(), modulos = new Set();
for (let n = -5; n <= 5; n++) {
  restes.add(n % seaux);
  modulos.add(((n % seaux) + seaux) % seaux);
}
console.log('');
console.log('valeurs prises par n % 3      : ' + [...restes].sort((a, b) => a - b).join(', '));
console.log('valeurs prises par modulo(n,3): ' + [...modulos].sort((a, b) => a - b).join(', '));
console.log('valeurs d index distinctes produites : ' + restes.size + ' contre ' + modulos.size + ' seaux prevus');

// La conséquence concrète : un index de tableau circulaire.
const tampon = ['A', 'B', 'C'];
console.log('');
console.log('tampon[(0 - 1) % 3] = ' + tampon[(0 - 1) % seaux]);
console.log('tampon[modulo(0 - 1, 3)] = ' + tampon[((-1 % seaux) + seaux) % seaux]);
