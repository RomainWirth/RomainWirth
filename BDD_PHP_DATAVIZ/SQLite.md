# SQLite

Sources :<br> 
https://www.youtube.com/watch?v=HM8ihP0MzE8&list=PLjwdMgw5TTLXXpRlzDZq7d8iS6YXgnslt&index=3 <br>
https://sqlite.org/index.html <br>

## Qu'est ce que SQLite ?

SQLite est une librairie C-language qui implémente un moteur de base de données SQL (SGBD).<br>
C'est léger, rapide, avec peu de dépendances, une grande fiabilité, très complet et facile à utiliser.<br>
C'est le SGBD le plus utilisé dans le monde. Utilisé dans tous les téléphones mobiles et dans la plupart des ordinateurs.<br>
C'est aussi inclu dans un nombre incalculable d'autres applications utilisées chaque jour.<br>

Le format SQLite est stable, cross-platform, et rétrocompatible (avant d'anciens hardwares et softwares).<br>
Les fichiers de base de données SQLite sont utilisés communéments comme des containers<br> 
pour transférer du contenu riche entre systèmes.<br>

Le code source SQLite est dans le domaine publique et est gratuit pour tout le monde pour n'importer usage.

## Utilisation de l'extension VS-Code SQLite

Source : https://www.youtube.com/watch?v=HM8ihP0MzE8&list=PLjwdMgw5TTLXXpRlzDZq7d8iS6YXgnslt&index=3 <br>

Nom de l'extension : sqlite de alexcvzz

1. Installer cette extension dans VS Code<br>
N.B. : sur Linux (ubuntu), il faudra utiliser la commande ci dessous pour faire fonctionner l'extension<br>
Penser à ajouter aussi l'extension SQLTools de Matheus Teixeira.

```bash
sudo apt install sqlite3
``` 

2. Créer un fichier avec une extension .sqlite : name.sqlite<br>

3. Clic droit sur le fichier et "Open Database" (attention, ne rien écrire dans le fichier).

4. l'outil 'sqlite explorer' va s'ouvrir, à partir de là, cliquer sur 'New Query'.

5. Un nouveau fichier va s'ouvrir, on pourra y écrire nos query SQL.<br> Au moment de sauvegarder, ce fichier aura l'extension .sql<br> C'est dans ce fichier qu'on va écrire toutes les requêtes.