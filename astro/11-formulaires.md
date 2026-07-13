# Module 11 — Formulaires sur site statique

## Objectifs

- Comprendre pourquoi un site Astro statique ne peut pas traiter nativement un formulaire
- Mettre en place un formulaire de contact fonctionnel via un service tiers
- Connaître l'alternative SSR si le besoin évolue

## Le problème

Un site Astro en mode `static` (le mode par défaut, celui que tu utiliseras pour la quasi-totalité de tes sites vitrine) ne génère que du HTML pur, sans serveur actif capable de recevoir et traiter une soumission de formulaire. Un `<form>` classique avec `action="/traiter"` n'a nulle part où aller.

Deux solutions courantes : déléguer à un service tiers, ou passer le site (ou juste la route du formulaire) en mode SSR.

## Solution 1 : service tiers (recommandé pour un site vitrine simple)

Des services comme Formspree ou Web3Forms permettent d'envoyer un formulaire HTML classique directement vers leur API, qui se charge de relayer l'email, sans backend à gérer côté client.

Exemple avec Web3Forms :

```astro
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="CLE_FOURNIE_PAR_LE_SERVICE" />

  <label for="nom">Nom</label>
  <input type="text" id="nom" name="nom" required />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Envoyer</button>
</form>
```

Avantages : zéro backend à maintenir, compatible avec un hébergement mutualisé statique comme o2switch, gratuit ou très bon marché selon le volume.

Limite : dépendance à un service externe, à mentionner clairement au client (dans le devis ou les CGU du site) pour la question RGPD, puisque les données transitent par un tiers.

## Solution 2 : amélioration avec JavaScript (UX plus fluide)

Pour éviter un rechargement de page complet à la soumission, on peut intercepter l'envoi en JavaScript et afficher un message de confirmation sans quitter la page. Ça reste compatible avec le mode statique, puisque c'est juste un fetch côté client vers l'API du service tiers.

```astro
<form id="contact-form" action="https://api.web3forms.com/submit" method="POST">
  <!-- mêmes champs que ci-dessus -->
</form>

<p id="confirmation" style="display: none;">Message envoyé, merci.</p>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const confirmation = document.getElementById('confirmation');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      form.style.display = 'none';
      confirmation!.style.display = 'block';
    }
  });
</script>
```

Ce script est un exemple de mini-île de JavaScript vanilla, sans besoin de React pour un cas aussi simple.

## Solution 3 : SSR pour un besoin plus avancé (à connaître, pas prioritaire)

Si un client a besoin d'une vraie logique serveur (enregistrement en base de données, envoi conditionnel, anti-spam avancé côté serveur), Astro permet de passer en mode SSR :

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'server', // ou 'hybrid' pour ne rendre que certaines routes en SSR
  adapter: node(), // ou l'adapter correspondant à l'hébergeur
});
```

Ça implique un hébergement capable d'exécuter du Node.js (pas un simple mutualisé statique comme o2switch en usage basique), donc un changement d'infrastructure. Pour la majorité de tes clients actuels, ce n'est pas nécessaire : la solution 1 ou 2 suffit largement.

## À tester

1. Crée un compte gratuit sur Web3Forms (ou Formspree) pour obtenir une clé de test.
2. Construis le formulaire HTML de la solution 1, teste l'envoi, vérifie la réception de l'email.
3. Passe à la solution 2 avec l'interception JavaScript, vérifie que la page ne recharge plus et que le message de confirmation s'affiche.
4. Teste le comportement en désactivant JavaScript dans le navigateur (devtools) : vérifie que le formulaire fonctionne quand même en repli sur la solution 1 (soumission classique), ce qui est un bon réflexe de robustesse.
5. Ajoute une validation HTML native (`required`, `type="email"`) et observe les messages d'erreur natifs du navigateur avant tout envoi.
