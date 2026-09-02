// inventaire.go — solde d'un stock d'atelier à partir d'un journal de mouvements.
//
// Écrit pour l'étude de cas nº 6 du site Syntaxe. Aucun code tiers : ce programme
// est à nous, on peut donc le publier, le découper et le modifier sans rien devoir
// à personne.

package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

// Mouvement est une ligne du journal, une fois comprise.
// Les noms de champs commencent par une MAJUSCULE : en Go, c'est ce qui rend un nom
// exporté, c'est-à-dire visible depuis un autre paquet. Ce n'est pas une convention de
// style, c'est le compilateur qui l'applique. Ici le fichier est un paquet « main »,
// qu'aucun autre paquet ne peut importer : la majuscule ne change donc rien à
// l'exécution — on l'écrit ainsi pour le jour où ce type déménagerait ailleurs.
type Mouvement struct {
	Article  string
	Quantite int
}

// seuilAlerte : en dessous ou à ce niveau, on recommande.
const seuilAlerte = 5

// analyser transforme une ligne "clou +120" en Mouvement.
// Deux valeurs de retour : le résultat ET l'erreur. C'est la convention de Go — une
// erreur y est une valeur ordinaire que l'appelant doit regarder, et non une exception
// qu'on lancerait. (Go a bien un mécanisme de déroulement de pile, `panic` / `recover`,
// mais il est réservé aux fautes de programmation ; on ne s'en sert pas pour une donnée
// mal formée, qui est un cas prévu.)
func analyser(ligne string) (Mouvement, error) {
	champs := strings.Fields(ligne)
	if len(champs) != 2 {
		return Mouvement{}, fmt.Errorf("ligne mal formée : %q", ligne)
	}
	n, err := strconv.Atoi(champs[1])
	if err != nil {
		return Mouvement{}, fmt.Errorf("quantité illisible dans %q", ligne)
	}
	return Mouvement{Article: champs[0], Quantite: n}, nil
}

// soldes additionne les mouvements par article, et met de côté ce qu'il n'a pas su lire.
func soldes(lignes []string) (map[string]int, []string) {
	stock := make(map[string]int)
	var rejets []string
	for _, ligne := range lignes {
		m, err := analyser(ligne)
		if err != nil {
			rejets = append(rejets, err.Error())
			continue
		}
		// Lire une clé absente d'une map rend la VALEUR ZÉRO du type des VALEURS,
		// ici 0 : aucune entrée n'est à créer avant d'additionner. La map elle-même,
		// en revanche, doit exister — c'est le make ci-dessus qui la crée, et écrire
		// dans une map nulle ferait paniquer le programme.
		stock[m.Article] += m.Quantite
	}
	return stock, rejets
}

func main() {
	// defer : cet appel est mis de côté et exécuté au retour de main, y compris si la
	// fonction panique en cours de route. Une réserve : un os.Exit — donc aussi un
	// log.Fatal — coupe le programme sans exécuter les appels différés.
	defer fmt.Println("-- fin du rapport --")

	journal := []string{
		"clou +120",
		"vis 40",
		"clou -35",
		"boulon 12",
		"vis -38",
		"rondelle",
		"clou -90",
		"boulon -7",
		"ecrou douze",
		"rondelle 8",
		"ecrou 3",
	}

	stock, rejets := soldes(journal)

	// ⚠️ En Go, parcourir une map rend les clés dans un ordre DÉLIBÉRÉMENT aléatoire :
	// le langage brouille l'ordre exprès, pour qu'aucun programme ne puisse en dépendre.
	// Sans le tri qui suit, deux exécutions du même programme, sur les mêmes données,
	// n'afficheraient pas les mêmes lignes dans le même ordre.
	articles := make([]string, 0, len(stock))
	for article := range stock {
		articles = append(articles, article)
	}
	sort.Strings(articles)

	fmt.Printf("%-10s %6s %s\n", "ARTICLE", "SOLDE", "ÉTAT")
	for _, article := range articles {
		etat := "ok"
		if stock[article] < 0 {
			etat = "IMPOSSIBLE"
		} else if stock[article] <= seuilAlerte {
			etat = "à recommander"
		}
		fmt.Printf("%-10s %6d %s\n", article, stock[article], etat)
	}

	for _, r := range rejets {
		fmt.Println("rejeté :", r)
	}

	fmt.Printf("%d articles, %d lignes rejetées sur %d\n", len(articles), len(rejets), len(journal))
}
