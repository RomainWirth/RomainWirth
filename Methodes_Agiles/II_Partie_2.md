# LES METHODES AGILES

## PARTIE II

### A.METHODOLOGIES DE TRAVAIL

* **Test automatisés** : unitaires, fonctionnels, end to end
* Intégration & déploiement **continus**
* Pair-programming : programmation par deux, en binômes sur un seul ordinateur => permet de réaliser du code de meilleure qualité
* Test ou behavior-driven development = on commence par créer les tests avant de coder. Les tests définissent la façon dont on code
* **Refactoring**

### B.PRATIQUES D'INGENIERIE LOGICIELLE

#### La décharge cognitive :
Les tests unitaires permettent de se décharger la tête.

* Maître mot : **HUMILITE**
* Tests unitaires permettent de limiter les erreurs dans le code et donc d'avancer sereinement dans le codage
* Limiter le nombre de tâches en cours

#### Le travail en équipe

* "collective code ownership" = le code appartient à tout le monde
* refactoring
* Definition of Done = définition à l'avance de la réalisation au complet d'une user story
* Pas de refactoring sans tests automatisés = permettent de sécuriser lorsqu'on reprend le code d'un autre développeur

#### Les tests automatisés

* tests unitaires = tests qui testent des petits bouts de code
* Tests fonctionnels
* Test end-to-end (E2E)
* Tests de performance

#### LE TDD = Test-Driven Development

Le test est écrit avant le code :
* Code plus clair
* Mise en place des abstractions
* Particulièrement adapté au refactoring

#### Intégration continue

Les tests s'exécutent à chaque push de code

#### Déploiement continu

Intégration continue + déploiement auto si tout est OK
* Collaboration entre développement (dev) et opérations (ops)
* Démocratisation des technologies de virtualisation / containerisation

#### Métriques et qualité de code

Le correcteur orthographique du code
* **Couverture de code** par les tests unitaires
* Taille 

#### Exemples à grande échelle

Des mises en prod tous les jours, pour des centaines de millions d'utilisateurs
* Laravel
* Vue.js
* react
* Angular
* Ruby on rails
* Google
* Amazon
* Nerflix
* ...
* A peu près tous les géants du web

### EN CONCLUSION

Bonnes pratiques et pistes de réflexion

* **Dévelopment en "solo" ou petite équipe :** combinaison gagnante avec Kanban +tests unitaires
* **Chiffrage ou estimations ?** prendre le temps de la réflexion lorsque c'est possible
* **Algorithmes** : pouvoir (Parcoursup, Diesel gate, Moteur Google, Twitter/X...)

Le code produit prend une place importante dans la vie de tous les jours. Cela a un impact sur beaucoup d'aspects du quotidien.<br> 
Cela donne du pouvoir sur les gens qui ne codent pas.