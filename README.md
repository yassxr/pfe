# Projet PFE

Ce projet est une application web qui permet à deux types d'utilisateurs (Agents de contrôle et EEPs) de se connecter, soumettre et gérer des documents PDF. L'application est développée avec un back-end Spring Boot et un front-end Angular.

## Prérequis

Avant de lancer l'application, assurez-vous d'avoir installé les outils suivants sur votre machine :

- [Java 11+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Maven](https://maven.apache.org/install.html)
- [Node.js](https://nodejs.org/) et [Yarn](https://yarnpkg.com/getting-started/install)
- [MySQL](https://www.mysql.com/downloads/) (ou une autre base de données compatible)

## Installation

### Clonez le projet depuis GitHub

Exécutez la commande suivante pour cloner le dépôt sur votre machine :

```bash
git clone https://github.com/yassxr/pfe.git
```

### Configuration de la base de données

- Créez une base de données MySQL pour l'application.
- Configurez les informations d'accès à la base de données dans le fichier `application.properties` (ou `application.yml`) du back-end.

Exemple de configuration :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/votre_database
spring.datasource.username=votre_nom_utilisateur
spring.datasource.password=votre_mot_de_passe
spring.jpa.hibernate.ddl-auto=update
```

## Lancer l'application

### Back-end

1. Ouvrez un terminal dans le répertoire du projet back-end.
2. Exécutez la commande suivante pour démarrer le serveur Spring Boot :

   ```bash
   mvn spring-boot:run
   ```
   
Le serveur back-end s'exécutera par défaut sur http://localhost:8005.

### Front-end

Ouvrez un autre terminal.

Accédez au répertoire du projet front-end avec la commande suivante :

   ```bash
cd front-end
   ```
Installez les dépendances nécessaires avec Yarn :

   ```bash
yarn install
   ```

Démarrez le serveur de développement Angular :

   ```bash
yarn start
   ```

Le serveur front-end s'exécutera par défaut sur http://localhost:4200.

### Accéder à l'application

Une fois le front-end et le back-end en cours d'exécution, vous pouvez accéder à l'application dans votre navigateur à l'adresse suivante : http://localhost:4200
