// BANC D'ESSAI — la transcription JavaScript d'inventaire.go, exécutable ici même.
//
// @@ORIGINE@@
//
// ⚠️ Ce que tu vas exécuter n'est PAS du Go : c'est une réécriture en JavaScript qui
// reproduit, une par une, les règles d'impression et de conversion de Go. Ce qu'elle
// prouve, c'est que la sortie publiée plus bas est bien celle que produisent ces
// règles-là — chacune écrite en commentaire, donc contestable. Elle ne prouve pas que
// le programme Go compile : aucun compilateur Go n'a tourné ici.
//
// Change le journal, appuie sur « Tester », et regarde ce qui bouge.

@@TRANSCRIPTION@@

// --------------------------------------------------------------- exécution
console.log(inventaire(JOURNAL).replace(/\n$/, ''));
