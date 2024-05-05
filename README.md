# Application de gestion de tâches

Cette application vous permet de gérer vos tâches au quotidien.
Le projet est disponible à l'adresse suivante:
https://todo-list-pwa-v2.vercel.app

## Fonctionnalités
### Tâches
- Ajouter, modifier, consulter, supprimer des tâches
- Marquer une tâche comme:
    - à faire
    - en cours
    - finie
- Assigner, supprimer des étiquettes à une tâche
- Marquer toute les tâches comme terminées ou non
- Supprimer toute les tâches terminées
- Filtrer les tâches par:
    - Date du jour
    - Importance
    - Statut (complétée ou non)
    - Etiquette

### Etiquettes
- Ajouter, modifier, consulter, supprimer des étiquettes

### Affichage
- Consulter les tâches sur un calendrier

### Calendrier
On peut retrouver sur le calendrier les différents événements correspondant aux tâches précédemment crées
Par défaut lorsqu'une tâche est créée, un événement est ajouté à la date du jour sur le calendrier. 

Un événement se compose d'un titre qui correspond au titre de la tâche.
Il est possible de consulter les informations de l'événement en le sélectionnant. On peut y apercevoir la date de l'événement ainsi qu'une éventuelle description. 

Etat d'un événement:
- Non complété
- En cours
- Complété

La couleur de l'événement change suivant son état, respectivement bleu, jaune, vert.

L'événement peut également être important ou non.
Une mention [Important] écrite en rouge sera affichée dans la description de l'événement.

### Gestion des données
- Les données sont sauvegardées dans le localStorage
- Les données peuvent être exportées ou importées au format JSON

### Paramètres
- L'application peut être traduite en français ou en anglais

## Installation
1. Clonez le dépôt Git: git clone 
2. Installez les dépendances:
    - cd .\vue-project
    - npm install
3. Lancez l'application: npm run dev

## Technologies utilisées
- Vue.js
- Bulma

## Auteur
Ce projet a été réalisé par MiKL-B 😊




















