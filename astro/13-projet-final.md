# Module 13 — Projet final : mini-site vitrine

## Objectif

Construire un mini-site vitrine complet, en réutilisant tout ce qui a été vu dans les modules précédents. Le brief ci-dessous est volontairement proche d'un cas réel (praticien indépendant), pour te permettre de le rejouer facilement sur un futur client.

## Brief fictif

Un coach sportif indépendant souhaite un site vitrine avec :

- Une page d'accueil présentant son activité
- Une page "Services" listant ses prestations (coaching individuel, coaching en groupe, bilan initial)
- Une page "Blog / Conseils" avec quelques articles, alimentés en Markdown
- Une page "Contact" avec un formulaire fonctionnel
- Un bon référencement local (il intervient sur un secteur géographique précis)

## Cahier des charges technique

Reprends dans l'ordre :

1. **Structure** (modules 01-03) : un layout de base avec nav et footer communs, une charte de couleurs et de typographies définie dans un fichier CSS global.
2. **Composants** (module 04) : un composant `Card` pour les services, un composant `SEO` réutilisable sur chaque page.
3. **Interactivité ciblée** (module 05) : un menu mobile en JavaScript simple (ou en React/Vue si tu maîtrises déjà un framework), avec `client:load` dans ce dernier cas. Rien d'autre en JS interactif sauf besoin réel.
4. **Routing** (module 06) : pages statiques + route dynamique pour les articles de blog.
5. **Contenu** (module 07) : Content Collection pour le blog, avec schéma Zod validé.
6. **Images** (module 08) : au moins une photo optimisée via le composant `Image`, avec `alt` descriptifs partout.
7. **Styles** (module 09) : ta charte perso ou une charte fictive, en styles scopés ou Tailwind selon ta préférence, avec vérification du contraste et du focus clavier.
8. **SEO** (module 10) : meta tags dynamiques par page, sitemap, robots.txt, et un bloc JSON-LD LocalBusiness sur la page d'accueil.
9. **Formulaire** (module 11) : formulaire de contact fonctionnel via Web3Forms ou Formspree, avec confirmation en JS sans rechargement de page.
10. **Déploiement** (module 12) : build final vérifié en preview, avec un `.htaccess` minimal prêt pour un hébergement mutualisé.

## Grille d'auto-évaluation

Une fois le projet terminé, vérifie point par point :

- [ ] Le site fonctionne intégralement sans JavaScript, sauf le menu mobile et le formulaire
- [ ] Chaque page a un titre et une meta description différents et pertinents
- [ ] Le score Lighthouse (onglet Lighthouse des devtools Chrome) est correct sur Performance, Accessibilité et SEO (vise 90+ sur chaque, c'est atteignable facilement avec Astro si les bonnes pratiques du cours sont suivies)
- [ ] Le sitemap et le robots.txt sont générés et cohérents
- [ ] Le formulaire de contact envoie réellement un email de test
- [ ] La page 404 personnalisée s'affiche correctement
- [ ] Le contenu du blog vient bien de fichiers Markdown, pas de données codées en dur
- [ ] Le site est utilisable au clavier (navigation Tab, focus visible)

## Pour aller plus loin après ce cours

Une fois ce projet final maîtrisé, tu as la base suffisante pour livrer un vrai site vitrine client en Astro dans des conditions professionnelles. Quelques pistes pour continuer à approfondir, à ton rythme, en dehors de ce cours :

- Les transitions de vue (`astro:transitions`) pour des animations de navigation entre pages, sans SPA
- L'intégration MDX pour des articles de blog avec des composants interactifs intégrés au contenu
- Les endpoints API Astro, si un jour un client a besoin d'un vrai backend léger sans sortir du même projet
- La comparaison plus fine entre Astro et Next.js sur des cas concrets, pour affiner ton discours commercial sur le choix technique face à un client (argument utile dans tes échanges commerciaux et dans tes devis)

## À tester

Construis le site complet à partir du brief ci-dessus, dans un nouveau projet ou en repartant de celui utilisé depuis le module 02. Une fois terminé, passe la grille d'auto-évaluation en revue point par point avant de considérer le projet final terminé.
