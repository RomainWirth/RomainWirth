# Module 12 — Build & déploiement

## Objectifs

- Comprendre le contenu généré par npm run build
- Gérer les variables d'environnement
- Déployer sur un hébergement mutualisé type o2switch

## Le build

```bash
npm run build
```

Génère un dossier `dist/` contenant uniquement du HTML, CSS et JS statiques, prêts à être servis par n'importe quel serveur web classique (Apache, Nginx), sans besoin de Node.js en production. C'est ce qui rend Astro compatible avec un hébergement mutualisé basique comme o2switch, à la différence d'un site Next.js en mode SSR qui nécessiterait un serveur Node actif.

```
dist/
├── index.html
├── services/index.html
├── contact/index.html
├── blog/
│   ├── index.html
│   └── mon-article/index.html
├── _astro/          → CSS et JS générés, avec hash de cache-busting
├── sitemap-index.xml
└── robots.txt
```

Avant tout déploiement, vérifier le résultat en local avec :

```bash
npm run preview
```

Ça sert exactement le contenu de `dist/`, contrairement à `npm run dev` qui reconstruit à la volée et peut masquer certains problèmes propres au build de production.

## Variables d'environnement

Pour des clés qui ne doivent pas être codées en dur (clé API Web3Forms par exemple, même si elle n'est pas critique en confidentialité pour ce cas précis) :

`.env` à la racine du projet, jamais commité (ajouter à `.gitignore`) :

```
PUBLIC_WEB3FORMS_KEY=cle_ici
```

Le préfixe `PUBLIC_` est obligatoire pour qu'une variable soit accessible côté client (dans le template ou dans un script). Sans ce préfixe, la variable n'est disponible que dans le frontmatter, jamais envoyée au navigateur, ce qui est la bonne pratique pour tout secret réellement sensible.

```astro
---
const cleApi = import.meta.env.PUBLIC_WEB3FORMS_KEY;
---

<input type="hidden" name="access_key" value={cleApi} />
```

## Déploiement sur o2switch

o2switch est un hébergement mutualisé classique, accès FTP/SSH, sans exécution Node.js nécessaire puisque le site final est 100% statique.

Étapes concrètes :

1. Fais `npm run build` en local, ça génère `dist/`.
2. Connecte-toi en FTP (FileZilla par exemple) ou SSH au compte o2switch souscrit au nom du client (conformément à ta règle RGPD sur l'hébergement).
3. Dépose le contenu de `dist/` (pas le dossier lui-même, son contenu) dans le dossier racine du site, généralement `public_html/` ou un sous-dossier si plusieurs sites sont hébergés sur le même compte.
4. Vérifie que le fichier `.htaccess` (si nécessaire pour les redirections ou pour servir correctement la page 404) est bien présent. Astro ne génère pas de `.htaccess` par défaut, il faut le créer manuellement si besoin de règles spécifiques (redirection HTTPS forcée, gestion des routes).

Exemple de `.htaccess` minimal pour forcer HTTPS et gérer le 404 :

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

ErrorDocument 404 /404.html
```

Ce fichier se place directement dans `public/.htaccess`, il sera copié tel quel dans `dist/` au build, puisque tout ce qui est dans `public/` est copié sans transformation.

## Automatisation possible (à connaître, pas indispensable au départ)

Pour éviter le dépôt FTP manuel à chaque mise à jour, une action GitHub (ou GitLab CI) peut automatiser le build et le déploiement via SSH/rsync à chaque push sur la branche principale. Ça devient pertinent si tu gères plusieurs sites clients avec des mises à jour fréquentes, mais reste facultatif pour un premier site vitrine simple.

## Checklist avant mise en ligne

1. `npm run build` sans erreur ni warning bloquant
2. `npm run preview` testé, tous les liens internes fonctionnent
3. Variables d'environnement de production correctement renseignées (pas celles de test)
4. Champ `site` dans `astro.config.mjs` mis à jour avec le vrai nom de domaine du client
5. Sitemap et robots.txt générés et cohérents avec le domaine final
6. Formulaire de contact testé en conditions réelles après déploiement, pas seulement en local

## À tester

1. Fais un build complet et un `npm run preview`, navigue sur toutes les pages.
2. Crée un fichier `.env` avec une variable `PUBLIC_TEST=valeur`, affiche-la dans une page, vérifie qu'elle apparaît bien après rebuild.
3. Si tu as un accès o2switch de test ou un sous-domaine disponible, dépose le contenu de `dist/` et vérifie que le site s'affiche en ligne.
4. Crée un `.htaccess` minimal et vérifie qu'il est bien copié dans `dist/` après build.
5. Teste volontairement une URL inexistante sur le déploiement en ligne pour vérifier que la page 404 personnalisée s'affiche bien, et pas la page d'erreur par défaut du serveur.
