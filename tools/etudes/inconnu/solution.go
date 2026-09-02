// Les trois endroits qui changent. Le reste du fichier est inchangé.

// 1. soldes tient une map de plus et rend une valeur de plus.
func soldes(lignes []string) (map[string]int, map[string]int, []string) {
	stock := make(map[string]int)
	mouvements := make(map[string]int)
	var rejets []string
	for _, ligne := range lignes {
		m, err := analyser(ligne)
		if err != nil {
			rejets = append(rejets, err.Error())
			continue
		}
		stock[m.Article] += m.Quantite
		mouvements[m.Article]++
	}
	return stock, mouvements, rejets
}

// 2. main reçoit la valeur supplémentaire.
	stock, mouvements, rejets := soldes(journal)

// 3. les deux Printf gagnent une colonne.
	fmt.Printf("%-10s %6s %6s %s\n", "ARTICLE", "SOLDE", "MVTS", "ÉTAT")
	...
		fmt.Printf("%-10s %6d %6d %s\n", article, stock[article], mouvements[article], etat)
