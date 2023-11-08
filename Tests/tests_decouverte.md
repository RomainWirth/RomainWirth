# LES TESTS

---
## INTRODUCTION

### Qu'est-ce qu'un test ?

Un test est une procédure ou un ensemble de procédures qui vise à valider si le code respecte les spécifications définies en amont.<br>
C'est une vérification de la bonne exécution du code selon des paramètres prédéfinis en amont.

### A quoi servent les tests ?

Ils servent à vérifier que le code fonctionne bien et ne provoquent pas de faille. Cela permet de limiter les erreurs.

### Y a-t-il plusieurs types de tests ? Si oui, quelle est leur différence ?

* Il existe les tests unitaires : on teste un élément (fonction, bloc de code, etc.).
* Les tests fonctionnels : on teste un bloc complet d'exécution de code.
* Les tests E2E (End-2-End) : On teste le bon fonctionnement d'un produit fini (côté interface). 
* Les tests de performance : on teste la vitesse d'exécution.

### Intuitivement, à quelles bonnes pratiques de conception de tests, vous pouvez penser ?



### À l’inverse, et toujours sans vous aider d’internet, qu’est-ce qui pourrait être une mauvaise pratique de conception de test ?

* Mal découper son code.


### Définir ce qu’est le TDD et quels sont les avantages de cette pratique.

TDD = "Test-Driden Development"

C'est une manière de développer en commençant par écrire les tests au préalable.<br>
Cela permet d'orienter la manière de coder et donc de limiter les erreurs.

Documentation :
<a href="https://fr.wikipedia.org/wiki/Test_driven_development#:~:text=Test%2DDriven%20Development%20(TDD),%C3%A0%20r%C3%A9soudre%20sous%20forme%20d">les TDD Wikipédia</a>
<a href="https://2022.stateofjs.com/fr-FR/libraries/">Librairies JavaScript</a>

---
## Le Test-Driven Development



---
## Qu'est-ce qu'un test ent-to-end ?

Un test end-to-end, également appelé test E2E, est un type de test de logiciel<br> 
qui vise à évaluer le fonctionnement complet d'une application ou d'un système,<br> 
en simulant le parcours de l'utilisateur final à travers toutes les parties du système.

L'objectif principal de ce type de test est de s'assurer que toutes les composantes du système<br> 
fonctionnent correctement ensemble et qu'elles interagissent de manière cohérente<br> 
pour fournir la fonctionnalité souhaitée.

### Caractéristiques importantes d'un test end-to-end

1. **Portée globale** :<br> 
Le test end-to-end évalue l'ensemble du système, de l'interface utilisateur aux bases de données,<br> 
en passant par tous les composants logiciels intermédiaires.<br> 
Il vérifie que l'application ou le système fonctionne comme prévu du début à la fin.

2. **Scénarios réalistes** :<br> 
Les tests E2E sont généralement conçus pour simuler des scénarios d'utilisation réels,<br> 
tels que l'inscription d'un utilisateur, la saisie de données, la navigation entre les pages,<br>
la soumission de formulaires, etc.

3. **Interaction utilisateur** :<br> 
Les tests end-to-end simulent souvent les actions de l'utilisateur, telles que le clic sur des boutons,<br> 
la saisie de texte et la navigation dans l'application, pour s'assurer que l'interface utilisateur répond correctement.

4. **Automatisation** :<br> 
Pour garantir l'efficacité, de nombreux tests end-to-end sont automatisés à l'aide d'outils de test automatisé.<br> 
Cela permet d'exécuter les tests de manière répétable et rapide.

5. **Validation des données** :<br> 
Les tests E2E incluent généralement la vérification de la cohérence des données entre les différentes parties du système.<br> 
Par exemple, ils s'assurent que les données saisies par l'utilisateur sont correctement stockées dans la base de données.

6. **Gestion des erreurs** :<br> 
Les tests E2E examinent également la gestion des erreurs,<br> 
en s'assurant que le système réagit de manière appropriée en cas de problèmes ou de situations inattendues.

Les tests end-to-end sont essentiels pour garantir la qualité d'un logiciel ou d'un système,<br> 
en s'assurant que toutes ses parties interagissent harmonieusement.<br> 
Ils font partie intégrante du processus de développement logiciel et sont souvent effectués conjointement avec d'autres types de tests,<br> 
tels que les tests unitaires, les tests d'intégration et les tests de régression,<br> 
pour assurer la fiabilité et la performance du système dans son ensemble.

### Utilisation de Playwright

Playwright est un outil de test E2E : <a href="https://playwright.dev/">PlayWright</a>

On peut suivre ce <a href="https://grafikart.fr/tutoriels/test-end-to-end-playwright-2020">tuto Grafikart</a> pour apprendre l'utiliser.