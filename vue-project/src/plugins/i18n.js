const messages = {
  locale: "en",
  messages: {
    en: {
      // todos
      todolist: "Todo list",
      todos: "Todos",
      todoremaining: "Task(s):",
      empty_todos: "Empty todos",

      // tags
      taglist: "Tag list",
      tags: "Tags",
      tag: "Tag",
      empty_tags: "Empty tags",

      // filter
      filter: "Filter:",
      all: "All",
      today: "Today",
      completed: "Completed",
      uncompleted: "Uncompleted",
      important: "Important",

      // item
      name: "Name",
      description: "Description",
      state: "State",
      createddate: "Created date",
      updateddate: "Updated date",
      deadlinedate: "Deadline date",
      is_completed: "Completed",
      is_important: "Important",
      enter_text_placeholder: "Enter text here...",
      // colors
      color: "Color",
      blue: "Blue",
      green: "Green",
      yellow: "Yellow",
      red: "Red",
      purple: "Purple",
      orange: "Orange",
      pink: "Pink",
      // icons
      icon: "Icon",
      phone: "Phone",
      coffee_time: "Coffee time",
      meeting: "Meeting",
      personal: "Personal",
      tools: "Tools",
      cook: "Cook",
      envelope: "Envelop",
      poo: "Poo",
      travel: "Travel",
      octopus: "Octopus",
      ghost: "Ghost",

      // actions
      add: "Add",
      delete: "Delete",
      save: "Save",
      submit: "Submit",
      mark_all_as_completed: "Mark all as completed",
      mark_all_as_uncompleted: "Mark all as uncompleted",
      clear_all_completed: "Clear all completed",
      json: "JSON",
      export: "Export",
      import: "Import",
      settings: "Settings",
      language: "Language",
      en: "English",
      fr: "French",

      // notification
      todo_added: "The task is well added",
      todo_deleted: "The task is well deleted",
      tag_added: "The tag is well added",
      tag_deleted: "The tag is well deleted",
      empty_todo_name: "Cannot add todo with empty name",
      empty_tag_name: "Cannot add tag with empty name",
      exist_name: "The name already exists",
      name_too_long: "The name cannot exceed 10 characters",
      lists: "Lists",
      filters: "Filters",
      actions: "Actions",
      view: "View",
      calendar: "Calendar",
      about: "About",
      about_info: `Task Management Application
This application allows you to manage your tasks on a daily basis.

Features
Tasks
- Add, edit, view, delete tasks
- Mark a task as: todo, in progress, completed
- Assign, delete tags to a task
- Mark all tasks as completed or not
- Delete all completed tasks
- Filter tasks by: today's date, importance, status or tag

Tags
- Add, edit, view, delete tags

Display
- View tasks on a calendar

Calendar
On the calendar, you can find the different events corresponding to the previously created tasks
By default, when a task is created, an event is added to the current date on the calendar.

An event consists of a title which corresponds to the task title.
It is possible to view event information by selecting it. You can see the event date and any description.

Event status:
- Not completed
- In progress
- Completed

The color of the event changes based on its status, respectively blue, yellow, green.

The event can also be important or not.
An [Important] mention written in red will be displayed in the event description.

Data Management
- Data is saved in localStorage
- Data can be exported or imported in JSON format

Settings
- The application can be translated into French or English`,
    },
    fr: {
      // todos
      todolist: "Liste de tâches",
      todos: "Tâches",
      todoremaining: "Tâche(s):",
      empty_todos: "Liste de tâches vide",

      // tags
      taglist: "Liste d'étiquettes ",
      tag: "Étiquette",
      tags: "Étiquettes",
      empty_tags: "Liste d'étiquettes vide",

      // filter
      filter: "Filtre:",
      all: "Toutes",
      today: "Aujourd'hui",
      completed: "Complétées",
      uncompleted: "Non complétées",
      important: "Importantes",

      // item
      name: "Nom",
      description: "Description",
      state: "Etat",
      createddate: "Date de création",
      updateddate: "Date mise à jour le",
      deadlinedate: "Date limite",
      is_completed: "Complétée",
      is_important: "Important",
      enter_text_placeholder: "Votre texte ici...",
      // colors
      color: "Couleur",
      blue: "Bleu",
      green: "Vert",
      yellow: "Jaune",
      red: "Rouge",
      purple: "Violet",
      orange: "Orange",
      pink: "Rose",
      // icons
      icon: "Icône",
      phone: "Téléphone",
      coffee_time: "Pause café",
      meeting: "Rencontre",
      personal: "Personnel",
      tools: "Outils",
      cook: "Cuisine",
      envelope: "Courrier",
      poo: "Caca",
      travel: "Voyage",
      octopus: "Poulpe",
      ghost: "Fantôme",

      // actions
      add: "Ajouter",
      delete: "Supprimer",
      save: "Sauvegarder",
      submit: "Envoyer",
      mark_all_as_completed: "Marquer tout comme terminé",
      mark_all_as_uncompleted: "Marquer tout comme non terminé",
      clear_all_completed: "Supprimer toute les tâches terminées",
      json: "JSON",
      export: "Exporter",
      import: "Importer",
      settings: "Paramètres",
      language: "Langue",
      en: "Anglais",
      fr: "Français",

      // notification
      todo_added: "La tâche est bien ajoutée",
      todo_deleted: "La tâche est bien supprimée",
      tag_added: "L'étiquette est bien ajoutée",
      tag_deleted: "L'étiquette est bien supprimée",
      empty_todo_name: "Le nom de la tâche ne peut être vide",
      empty_tag_name: "Le nom de l'étiquette ne peut être vide",
      exist_name: "Le nom existe déjà",
      name_too_long: "Le nom ne peut dépasser 10 caractères",
      lists: "Listes",
      filters: "Filtres",
      actions: "Actions",
      view: "Affichage",
      calendar: "Calendrier",
      about: "A propos",
      about_info: `Application de gestion de tâches
Cette application vous permet de gérer vos tâches au quotidien.

Fonctionnalités
Tâches
- Ajouter, modifier, consulter, supprimer des tâches
- Marquer une tâche comme: à faire, en cours, finie
- Assigner, supprimer des étiquettes à une tâche
- Marquer toute les tâches comme terminées ou non
- Supprimer toute les tâches terminées
- Filtrer les tâches par: date, importance, statut ou étiquette

Etiquettes
- Ajouter, modifier, consulter, supprimer des étiquettes

Affichage
- Consulter les tâches sur un calendrier

Calendrier
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

Gestion des données
- Les données sont sauvegardées dans le stockage local
- Les données peuvent être exportées ou importées au format JSON

Paramètres
- L'application peut être traduite en français ou en anglais`,
    },
  },
};
export default messages;
