# CONNECTER SON PROGRAMME AVEC MYSQL

## I. INSTALLER MYSQL SUR LA MACHINE

N.B. : Linux Ubuntu

Suivre ce <a href="https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04">tuto</a>

### A. INSTALLATION DE MYSQL

#### 1. Update le package index si besoin

```bash
$ sudo apt update
```
#### 2. Installer le package mysql-server

```bash
$ sudo apt install mysql-server
```

#### 3. S'assurer que le serveur fonctionne avec systemctl start

```bash
$ sudo systemctl start mysql.server
```

### B. CONFIGURER MYSQL

Lancer le script de sécurité :
```bash
$ sudo mysql_secure_intallation
```

Ce qui renvoie : 
```bash 
Securing the MySQL server deployment.

Connecting to MySQL using a blank password.

VALIDATE PASSWORD COMPONENT can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD component?

Press y|Y for Yes, any other key for No:
```
=> `Y`

```
There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary file

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG:
```
=> `2`

Il faudra ensuite créer un mot de passe pour l'utilisateur **root** :
```bash
Please set the password for root here.


New password:

Re-enter new password:
```

Cela retournera ceci :
```bash 
Estimated strength of the password: 100
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) :
```
=> `Y`

### C. CREER UN UTILISATEUR MYSQL ET LUI ACCORDER LES PRIVILEGES

```bash
$ sudo mysql

mysql > CREATE USER 'username'@'host' IDENTIFIED WITH authentication_plugin BY 'password';
```
username = nom d'utilisateur désiré
host = localhost
password = mot de passe désiré

Une fois cette étape réalisée :
```bash
mysql > GRANT CREATE, ALTER, DROP, INSERT, UPDATE, INDEX, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'username'@'localhost' WITH GRANT OPTION;
```

### D. CREER UNE BASE DE DONNEES

```bash
CREATE 
```

## II. AJOUTER LA DB AU PROJET AVEC INTELIJ

