# J. CONCURRENCE - faire fonctionner des tâches en parallèle

> Lancer des tâches simultanément, les synchroniser et gérer leurs erreurs avec les goroutines, les channels et `defer`.

---

## [B - Les goroutines](B_Les_goroutines.md)

- Par défaut, Go exécute les instructions **séquentiellement** : chaque appel bloque jusqu'à sa complétion.
- Mot-clé **`go`** : lance une fonction dans une goroutine - l'appelant n'attend pas et reçoit aucune valeur de retour.
- Quand `main()` se termine, **toutes les goroutines sont stoppées**, qu'elles aient terminé ou non.
- Une goroutine n'est pas un thread OS : le runtime Go multiplex des millions de goroutines sur un pool de threads (~2 Ko de stack initiale contre ~1–8 Mo pour un thread).
- **`sync.WaitGroup`** : synchronisation sans échange de données - `wg.Add(n)`, `defer wg.Done()`, `wg.Wait()`.
- Quand les goroutines doivent communiquer des résultats, on utilise des **channels**.

---

## [C - Les channels](C_Les_channels.md)

- **Channel** : mécanisme de communication typé entre goroutines - `make(chan T)`.
- Opérateur `<-` : envoyer `channel <- valeur` ou recevoir `valeur := <-channel`.
- Un channel non-bufferisé **bloque** l'émetteur jusqu'à ce qu'un receveur soit prêt, et vice versa.
- **Patterns d'attente** :
  - `<-done` répété N fois - simple mais fragile à la maintenance.
  - Slice de channels + `for range` - scalable, itère dans l'ordre de la slice.
  - `for range channel` + `close()` - suppose de savoir quelle goroutine termine en dernier.
- **`select`** : attend simultanément plusieurs channels et réagit au premier disponible - pattern idiomatique pour gérer succès et erreurs concurrentes.
- **Channel d'erreur** (`chan error`) : une goroutine ne pouvant pas retourner d'erreur, on lui passe un `chan error` dédié ; elle émet dans l'un ou l'autre channel (done ou error), jamais les deux.
- Deux boucles distinctes : une pour **lancer** toutes les goroutines, une pour les **attendre** - les fusionner annulerait tout bénéfice de la concurrence.

---

## [D - Différer l'exécution avec `defer`](D_Différer_l-exécution_du_code_avec_defer.md)

- **`defer`** : différe l'exécution d'une fonction à la fin de la fonction encapsulante, quelle que soit la cause du retour (succès ou erreur).
- Pattern : ouvrir une ressource → `defer resource.Close()` immédiatement - garantit la fermeture sans duplication.
- Ordre d'exécution **LIFO** : le dernier `defer` déclaré s'exécute en premier.
- Les arguments du `defer` sont évalués **au moment de la déclaration**, pas à l'exécution.
- `defer` ne s'exécute pas si le programme appelle `os.Exit()`.
- Cas d'usage typiques : fichiers, connexions réseau, `sync.Mutex`.


