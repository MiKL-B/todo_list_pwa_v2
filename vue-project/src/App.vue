<template>
  <Navbar :tags="tags" @filter="setFilter" @tab="changeTab" @completed="markAllAsCompleted"
    @uncompleted="markAllAsUncompleted" @delete="deleteAllCompleted" @export="exportJSON" @import="openFileInput"
    @language="setLanguage">
  </Navbar>
  <input type="file" ref="fileInput" style="display: none" @change="importJSON" accept=".json">

  <div class="container px-4">
    <!-- todos -->
    <div v-if="activeTab === 'Todos'">
      <Insert @add="addTodo" v-model="newTodo" />
      <div v-if="todos.length > 0">
        <div class="filters">
          <label class="label">{{ $t('todoremaining') }} {{ remaining }}</label>
          <label class="label">{{ $t('filter') }} {{ textFilter }}</label>
        </div>
        <Todo v-for="todo in filteredTodos" :key="todo.index" :todo="todo" :selectedTodo="selectedTodo" :tags="tags"
          @edit="editTodo" @read="readTodo" @delete="deleteTodo" @delete-todo-tag="deleteTodoTag"
          @change-state="changeState" @save="saveTodo" @important="markAsImportant" @completed="markAsCompleted"
          @assign="assignTag" />
      </div>
      <div class="empty-list" v-else>
        <i class="fa-solid fa-mug-saucer"></i>
        <h2 class="subtitle">{{ $t('empty_todos') }}</h2>
      </div>
    </div>
    <!-- tags -->
    <div v-else-if="activeTab === 'Tags'">
      <Insert @add="addTag" v-model="newTag" />
      <div v-if="tags.length > 0">
        <Tag v-for="tag in tags" :key="tag.index" :tag="tag" :selectedTag="selectedTag" @edit="editTag" @read="readTag"
          @delete="deleteTag" @save="saveTag" />
      </div>
      <div class="empty-list" v-else>
        <i class="fa-solid fa-mug-saucer"></i>
        <h2 class="subtitle">{{ $t('empty_tags') }}</h2>
      </div>
    </div>
    <!-- calendar -->
    <div v-else-if="activeTab === 'Calendar'">
      <Calendar :events="events" />
    </div>
  </div>
</template>

<script>
import Calendar from '@/components/Calendar.vue';
import Field from '@/components/Field.vue';
import Modal from '@/components/Modal.vue';
import Navbar from '@/components/Navbar.vue';
import Insert from '@/components/Insert.vue';

// Todos
import Todo from '@/components/Todo.vue';

// Tags
import Tag from '@/components/Tag.vue';

import { createUuid } from '@/uuid.js';
import { getCurrentDate, getDate } from '@/date.js';
import { emptyName, existingName, nameTooLong } from '@/verification.js';
import { notification } from '@/notification.js';
import { getLocalStorage, saveLocalStorage } from '@/localstorage.js';
import { getRandomColor } from '@/random.js';
export default {
  name: "App",
  components: {
    Field, Modal, Navbar, Insert, Todo, Tag, Calendar
  },
  data() {
    return {
      // todos
      newTodo: "",
      selectedTodo: {},
      todos: getLocalStorage("todos", "array"),
      // tags
      newTag: "",
      selectedTag: {},
      tags: getLocalStorage("tags", "array"),
      // filter
      textFilter: this.currentFilter,
      currentFilter: this.FILTER_ALL,
      remaining: "",
      FILTER_ALL: 1,
      FILTER_TODAY: 2,
      FILTER_COMPLETED: 3,
      FILTER_UNCOMPLETED: 4,
      FILTER_IMPORTANT: 5,
      // miscellaneous
      activeTab: "Todos",
      events: getLocalStorage("events", "array")
    }
  },
  mounted() {
    // filter
    this.setFilter(this.FILTER_ALL)
    // miscellaneous
    let localLanguage = localStorage.getItem('language');
    if (localLanguage == null) {
      localLanguage = 'en';
    }
    this.setLanguage(localLanguage)
  },
  computed: {
    filteredTodos() {
      let filteredList = this.todos;
      switch (this.currentFilter) {
        case this.FILTER_ALL:
          this.textFilter = this.$t('all');
          filteredList = this.todos;
          break;
        case this.FILTER_TODAY:
          this.textFilter = this.$t('today');
          let currentDay = new Date().toLocaleDateString();
          filteredList = this.todos.filter(todo => todo.createdDate.includes(currentDay));
          break;
        case this.FILTER_COMPLETED:
          this.textFilter = this.$t('completed');
          filteredList = this.todos.filter(todo => todo.completed);
          break;
        case this.FILTER_UNCOMPLETED:
          this.textFilter = this.$t('uncompleted');
          filteredList = this.todos.filter(todo => !todo.completed);
          break;
        case this.FILTER_IMPORTANT:
          this.textFilter = this.$t('important');
          filteredList = this.todos.filter(todo => todo.priority === true);
          break;
        default:
          this.textFilter = this.currentFilter;
          filteredList = this.todos.filter(todo => {
            return todo.tags.some(tag => tag.name === this.currentFilter);
          });
      }
      this.remaining = filteredList.length;
      return filteredList
    },
  },
  methods: {
    addEvent(name, date, index) {
      let event = {
        title: name,
        color: "blue",
        time: { start: date, end: date }, //{ start: "2024-04-18 12:05", end: "2024-04-18 13:35" },
        isEditable: false,
        id: index,
        description: ""
      };
      this.events.push(event);
    },

    // todos
    addTodo() {
      if (emptyName(this.newTodo)) {
        notification("error", this.$t('empty_todo_name'))
        return;
      }
      if (existingName(this.todos, this.newTodo)) {
        notification("error", this.$t('exist_name'))
        this.newTodo = "";
        return;
      }

      let todo = {
        index: createUuid(),
        name: this.newTodo,
        createdDate: getCurrentDate(),
        updatedDate: getCurrentDate(),
        deadlineDate: getDate(),
        description: "",
        completed: false,
        colorState: "",
        iconState: "fa-circle",
        priority: false,
        tags: [],
      }
      this.todos.push(todo);
      this.addEvent(todo.name, todo.deadlineDate, todo.index);
      saveLocalStorage("todos", this.todos, "array");
      saveLocalStorage("events", this.events, "array");
      notification("success", this.$t('todo_added'))
      this.newTodo = "";
    },

    changeState(todo) {
      if (todo.completed === false) {
        todo.completed = null;
        todo.colorState = "has-text-warning";
        todo.iconState = "fa-hourglass";
      } else if (todo.completed === null) {
        todo.completed = true;
        todo.colorState = "has-text-success";
        todo.iconState = "fa-circle-check";
      } else {
        todo.completed = false;
        todo.colorState = "";
        todo.iconState = "fa-circle";
      }
      todo.updatedDate = getCurrentDate();

      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].id === todo.index) {
          if (todo.completed) {
            this.events[i].color = "green";
          }
          else if (todo.completed === null) {
            this.events[i].color = "yellow";
          }
          else {
            this.events[i].color = "blue";
          }
        }
      }
      saveLocalStorage("todos", this.todos, "array");
      saveLocalStorage("events", this.events, "array")
    },

    assignTag(tag, todo) {
      if (tag.name == undefined) {
        return;
      }
      for (let i = 0; i < todo.tags.length; i++) {
        if (todo.tags[i].name === tag.name) {
          return;
        }
      }
      if (todo.tags.length < 3) {
        todo.tags.push(tag)
        saveLocalStorage("todos", this.todos, "array");
      }
    },

    deleteTodoTag(tag, todo) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === todo.index) {
          for (let j = 0; j < this.todos[i].tags.length; j++) {
            if (this.todos[i].tags[j].index === tag.index) {
              this.todos[i].tags.splice(j, 1);
            }
          }
        }
      }
      saveLocalStorage("todos", this.todos, "array");
    },

    readTodo(todo) {
      this.selectedTodo = { ...todo };
    },

    editTodo(todo) {
      this.selectedTodo = { ...todo };
    },

    markAsImportant(todo) {
      todo.priority = !todo.priority;
      todo.updatedDate = getCurrentDate();
      saveLocalStorage("todos", this.todos, "array");
    },

    markAsCompleted(todo) {
      todo.completed = !todo.completed;
      if (todo.completed) {
        todo.colorState = "has-text-success";
        todo.iconState = "fa-circle-check";
      }
      else {
        todo.colorState = "";
        todo.iconState = "fa-circle";
      }
      saveLocalStorage("events", this.events, "array")
    },
    deleteEvent(index) {
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].id === index) {
          this.events.splice(i, 1)
        }
      }
    },
    deleteTodo(todo) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === todo.index) {
          this.todos.splice(i, 1)
        }
      }
      this.deleteEvent(todo.index)
      notification("success", this.$t('todo_deleted'))
      saveLocalStorage("todos", this.todos, "array");
      saveLocalStorage("events", this.events, "array")
    },

    saveTodo(todo) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === todo.index) {
          this.todos[i] = { ...todo };
          this.todos[i].updatedDate = getCurrentDate()
        }
      }
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].id === todo.index) {
          this.events[i].title = todo.name
          this.events[i].time.start = todo.deadlineDate
          this.events[i].time.end = todo.deadlineDate
          if (todo.completed) {
            this.events[i].color = "green";
          }
          else {
            this.events[i].color = "blue";
          }
          if (todo.priority) {
            this.events[i].description = "<span class='has-text-danger'>[Important]</span><br>"
          }
          else {
            this.events[i].description = ""
          }
          this.events[i].description += todo.description
        }
      }
      saveLocalStorage("todos", this.todos, "array");
      saveLocalStorage("events", this.events, "array")
    },

    // tags
    addTag() {
      if (emptyName(this.newTag)) {
        notification("error", this.$t('empty_tag_name'))
        return;
      }
      if (nameTooLong(this.newTag)) {
        notification("error", this.$t('name_too_long'))
        this.newTag = "";
        return;
      }

      if (existingName(this.tags, this.newTag)) {
        notification("error", this.$t('exist_name'))
        this.newTag = "";
        return;
      }

      let tag = {
        index: createUuid(),
        name: this.newTag,
        createdDate: getCurrentDate(),
        updatedDate: getCurrentDate(),
        color: getRandomColor(),
        icon: "fa-solid fa-tag",
      }
      this.tags.push(tag);
      notification("success", this.$t('tag_added'))
      this.newTag = "";
      saveLocalStorage("tags", this.tags, "array");
    },

    readTag(tag) {
      this.selectedTag = { ...tag };
    },

    editTag(tag) {
      this.selectedTag = { ...tag };
    },

    deleteTag(tag) {
      // delete tag in todo
      for (let i = 0; i < this.todos.length; i++) {
        for (let j = 0; j < this.todos[i].tags.length; j++) {
          if (this.todos[i].tags[j].index === tag.index) {
            this.todos[i].tags.splice(j, 1);
            saveLocalStorage("todos", this.todos, "array");
            break;
          }
        }
      }
      // delete right tag
      const globalTagIndex = this.tags.findIndex(el => el.index === tag.index);
      if (globalTagIndex !== -1) {
        this.tags.splice(globalTagIndex, 1);
        saveLocalStorage("tags", this.tags, "array");
      }
      notification("success", this.$t('tag_deleted'))
    },

    saveTag(tag) {
      // update tag in tag list and in todo
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].index === tag.index) {
          this.tags[i] = { ...tag };
          this.tags[i].icon = tag.icon;
          this.tags[i].color = tag.color;
          this.tags[i].updatedDate = getCurrentDate()

          for (let j = 0; j < this.todos.length; j++) {
            for (let k = 0; k < this.todos[j].tags.length; k++) {
              if (this.todos[j].tags[k].index === this.tags[i].index) {
                this.todos[j].tags[k].icon = tag.icon;
                this.todos[j].tags[k].color = tag.color;
                this.todos[j].tags[k].name = tag.name;
              }
            }
          }
        }
      }
      saveLocalStorage("tags", this.tags, "array");
      saveLocalStorage("todos", this.todos, "array");
    },

    // filter
    setFilter(type) {
      this.currentFilter = type;
      this.changeTab('Todos')
    },

    markAllAsUncompleted() {
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].completed = false;
        this.todos[i].updatedDate = getCurrentDate();
        this.todos[i].colorState = "";
        this.todos[i].iconState = "fa-circle";
      }
      saveLocalStorage("todos", this.todos, "array");
    },

    markAllAsCompleted() {
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].completed = true;
        this.todos[i].updatedDate = getCurrentDate();
        this.todos[i].colorState = "has-text-success";
        this.todos[i].iconState = "fa-circle-check";
      }
      saveLocalStorage("todos", this.todos, "array");
    },

    deleteAllCompleted() {
      var i = 0;
      while (i < this.todos.length) {
        if (this.todos[i].completed === true) {
          this.todos.splice(i, 1);
        } else {
          ++i;
        }
      }
      saveLocalStorage("todos", this.todos, "array");
    },

    // miscellaneous
    changeTab(tab) {
      this.activeTab = tab;
    },

    exportJSON() {
      if (window.confirm('Are you sure you want to export and download your data ?')) {
        let filename = prompt('Enter the name of the export file.', 'todos')
        const jsonData = {
          todos: this.todos,
          tags: this.tags,
          events: this.events,
          language: this.$i18n.locale,
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));
        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", dataStr);
        downloadLink.setAttribute("download", `${filename}.json`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    },

    openFileInput() {
      this.$refs.fileInput.click();
    },

    importJSON() {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          this.todos = jsonData.todos
          this.tags = jsonData.tags
          this.events = jsonData.events
          this.$i18n.locale = jsonData.language
          saveLocalStorage("todos", this.todos, "array");
        } catch (error) {
          console.error("Erreur lors de la lecture du fichier JSON : " + error);
        }
      };
      reader.readAsText(file);
    },

    setLanguage(language) {
      this.$i18n.locale = language;
      saveLocalStorage("language", this.$i18n.locale);
      this.changeTab("Todos");
    }
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');

body {
  height: 100vh;
}

body,
input,
button {
  font-family: 'Space Grotesk';
}


i {
  cursor: pointer;
}

.tag {
  display: flex;
  gap: 4px;
}

.tags-todolist {
  display: flex;
  gap: 6px;
  margin: 6px 0;
}

.cta {
  display: flex;
  justify-content: flex-end
}

.filters {
  display: flex;
  justify-content: space-between;
}

.empty-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
  height: 50vh;
}

.empty-list i {
  font-size: 5rem;
  cursor: default;
}

/* color */
:root {
  --dark: hsl(0, 0%, 24%);
  --success: hsl(160, 82%, 45%);
  --primary: hsl(200, 80%, 60%);
  --danger: hsl(348, 100%, 61%);
  --warning: hsl(50, 80%, 60%);
  --epic: hsl(270, 80%, 60%);
  --pink: hsl(313, 80%, 60%);
  --legendary: hsl(20, 80%, 60%);
}

.primary {
  color: var(--primary);
}

.warning {
  color: var(--warning);
}

.danger {
  color: var(--danger);
}

.success {
  color: var(--success);
}

.legendary {
  color: var(--legendary);
}

.epic {
  color: var(--epic);
}

.pink {
  color: var(--pink);
}

/* overrride toastify class */
.Toastify__toast-theme--colored.Toastify__toast--success {
  background: var(--success);
  color: #3D3D3D;
  font-family: "Space Grotesk";
}

.Toastify__toast-theme--colored.Toastify__toast--error {
  background: var(--danger);
  font-family: "Space Grotesk";
}

/* overrride bulma class */
.is-success {
  background: var(--success);
  color: var(--dark);
}

.is-info {
  background: var(--primary);
}

.has-text-success {
  color: var(--success) !important;
}

.has-text-danger {
  color: var(--danger) !important;
}

.has-text-warning {
  color: var(--warning) !important;
}
.has-text-black{
  color:var(--dark) !important;
}
</style>