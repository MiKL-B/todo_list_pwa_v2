<template>

  <div class="nav">
    <Navbar :tags="tags" @filter="setFilter" @tab="changeTab" @completed="markAllAsCompleted"
      @uncompleted="markAllAsUncompleted" @delete="deleteAllCompleted" @export="exportJSON" @import="openFileInput"
      @language="setLanguage">
    </Navbar>
    <input type="file" ref="fileInput" style="display: none" @change="importJSON" accept=".json">
    <h2 class="title">{{ activeTab == 'Todos' ? $t('todolist') : $t('taglist') }}</h2>
  </div>

  <div class="container px-4">
    <!-- todos -->
    <div v-if="activeTab === 'Todos'">
      <TodoInput @add="addTodo" v-model="newTodo" @handlekey="handleEnterKeyTodo" />
      <div class="filters">
        <label class="label">{{ $t('todoremaining') }} {{ remaining }} {{ todos.length > 0 ? ' / ' + todos.length : ''
          }}</label>
        <label class="label">{{ $t('filter') }} {{ currentTextFilter }}</label>
      </div>
      <div v-if="todos.length > 0">
        <TodoItem v-for="todo in filteredTodos" :key="todo.index" :todo="todo" @edit="editTodo" @delete="deleteTodo"
          @read="readTodo" @change-state="changeState" @delete-todo-tag="deleteTodoTag" :tags="tags" />
      </div>
      <div class="empty-list" v-else>
        <i class="fa-solid fa-mug-saucer"></i>
        <h2 class="subtitle">{{ $t('empty_todos') }}</h2>
      </div>
    </div>
    <!-- tags -->
    <div v-else>
      <TagInput @add="addTag" v-model="newTag" @handlekey="handleEnterKeyTag" />
      <div v-if="tags.length > 0">
        <TagItem v-for="tag in tags" :key="tag.index" :tag="tag" @edit="editTag" @read="readTag"
          @delete="deleteTag" />
      </div>
      <div class="empty-list" v-else>
        <i class="fa-solid fa-mug-saucer"></i>
        <h2 class="subtitle">{{ $t('empty_tags') }}</h2>
      </div>
    </div>
  </div>

  <!-- todo modal -->
  <TodoSelected :selectedTodo="selectedTodo" :visible="visibleModal" :readonly="readonly" @toggle="toggleModal"
    @save="saveTodo" @important="markAsImportant" @completed="markAsCompleted" @assign="assignTag" :tags="tags" />

  <!-- tag modal -->
  <TagSelected :selectedTag="selectedTag" :visible="visibleModalTag" :readonly="readonly" @toggle="toggleModalTag"
    @save="saveTag" />



</template>

<script>
import Field from '@/components/Field.vue';
import Modal from '@/components/Modal.vue';
import Navbar from '@/components/Navbar.vue';

// Todos
import TodoInput from '@/components/TodoInput.vue';
import TodoItem from '@/components/TodoItem.vue';
import TodoSelected from '@/components/TodoSelected.vue';

// Tags
import TagInput from '@/components/TagInput.vue';
import TagItem from '@/components/TagItem.vue';
import TagSelected from '@/components/TagSelected.vue';

import { createUuid } from '@/uuid.js';
import { getCurrentDate } from '@/date.js';
import { emptyName, existingName } from '@/verification.js';
import { notification } from '@/notification.js';
import { getLocalStorage, saveLocalStorage } from './localstorage';
import { getRandomColor } from './random';
export default {
  name: "App",
  components: {
    Field, Modal, Navbar
    , TodoInput, TodoItem, TodoSelected
    , TagInput, TagItem, TagSelected
  },
  data() {
    return {
      // todos
      newTodo: "",
      selectedTodo: {},
      readonly: false,
      currentFilter: this.FILTER_ALL,
      activeTab: "Todos",
      visibleModal: false,
      todos: getLocalStorage("todos", "array"),
      // tags
      newTag: "",
      visibleModalTag: false,
      tags: getLocalStorage("tags", "array"),
      selectedTag: {},
      // filter
      FILTER_ALL: 1,
      FILTER_TODAY: 2,
      FILTER_COMPLETED: 3,
      FILTER_UNCOMPLETED: 4,
      FILTER_IMPORTANT: 5,
    }
  },
  mounted() {
    this.setFilter(this.FILTER_ALL)
    // language
    let localLanguage = localStorage.getItem('language');
    if (localLanguage == null) {
      localLanguage = 'en';
    }
    this.$i18n.locale = localLanguage;
    localStorage.setItem("language", localLanguage)
  },
  computed: {
    remaining() {
      return this.todos.filter((todo) => !todo.completed).length;
    },
    currentTextFilter() {
      let text = "";
      switch (this.currentFilter) {
        case this.FILTER_ALL:
          text = this.$t('all');
          break;
        case this.FILTER_TODAY:
          text = this.$t('today');
          break;
        case this.FILTER_COMPLETED:
          text = this.$t('completed');
          break;
        case this.FILTER_UNCOMPLETED:
          text = this.$t('uncompleted');
          break;
        case this.FILTER_IMPORTANT:
          text = this.$t('important');
          break;
        default:
          text = this.currentFilter;
      }
      return text;
    },
    filteredTodos() {
      let filteredList = this.todos;
      switch (this.currentFilter) {
        case this.FILTER_ALL:
          filteredList = this.todos;
          break;
        case this.FILTER_TODAY:
          let currentDay = new Date().toLocaleDateString();
          filteredList = this.todos.filter(todo => todo.createdDate.includes(currentDay));
          break;
        case this.FILTER_COMPLETED:
          filteredList = this.todos.filter(todo => todo.completed);
          break;
        case this.FILTER_UNCOMPLETED:
          filteredList = this.todos.filter(todo => !todo.completed);
          break;
        case this.FILTER_IMPORTANT:
          filteredList = this.todos.filter(todo => todo.priority === true);
          break;
        default:
          filteredList = this.todos.filter(todo => {
            return todo.tags.some(tag => tag.name === this.currentFilter);
          });
      }

      return filteredList
    },
  },
  methods: {
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
      saveLocalStorage("todos", this.todos, "array");
    },
    setFilter(type) {
      this.currentFilter = type;
      this.changeTab('Todos')
    },

    // #region TODO
    handleEnterKeyTodo(event) {
      if (event.key == 'Enter') {
        this.addTodo()
      }
    },
    addTodo() {
      console.log("DEBUG_BEGIN", "addTodo");

      if (emptyName(this.newTodo)) {
        return;
      }
      if (existingName(this.todos, this.newTodo)) {
        this.newTodo = "";
        return;
      }

      let todo = {
        index: createUuid(),
        name: this.newTodo,
        createdDate: getCurrentDate(),
        updatedDate: getCurrentDate(),
        description: "",
        completed: false,
        colorState: "",
        iconState: "fa-circle",
        priority: false,
        tags: [],
      }
      this.todos.push(todo);
      saveLocalStorage("todos", this.todos, "array");
      notification("success", `Tâche ${this.newTodo} bien ajoutée`)
      this.newTodo = "";
      console.log("DEBUG_END", "addTodo");
    },

    assignTag(selectedTag, todo) {
      if (selectedTag.name == undefined) {
        return;
      }
      for (let i = 0; i < todo.tags.length; i++) {
        if (todo.tags[i].name === selectedTag.name) {
          return;
        }
      }
      if (todo.tags.length < 3) {
        todo.tags.push(selectedTag)
        saveLocalStorage("todos", this.todos, "array");
      }
    },

    deleteTodoTag(selectedTodoTagDelete) {
      for (let i = 0; i < this.todos.length; i++) {
        for (let j = 0; j < this.todos[i].tags.length; j++) {
          if (this.todos[i].tags[j].index === selectedTodoTagDelete.index) {
            this.todos[i].tags.splice(j, 1)
          }
        }
      }


      saveLocalStorage("todos", this.todos, "array");
    },

    readTodo(todo) {
      this.readonly = true;
      this.visibleModal = true;
      this.selectedTodo = { ...todo };
    },
    editTodo(todo) {
      this.readonly = false;
      this.visibleModal = true;
      this.selectedTodo = { ...todo };
    },
    markAllAsUncompleted() {
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].completed = false;
        this.todos[i].updatedDate = getCurrentDate();
      }
      saveLocalStorage("todos", this.todos, "array");
    },
    markAllAsCompleted() {
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].completed = true;
        this.todos[i].updatedDate = getCurrentDate();
      }
      saveLocalStorage("todos", this.todos, "array");
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
      saveLocalStorage("todos", this.todos, "array");
    },
    deleteTodo(todo) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === todo.index) {
          this.todos.splice(i, 1)
        }
      }
      notification("success", `Tâche ${todo.name} bien supprimée`)
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
    saveTodo(todo) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === todo.index) {
          this.todos[i] = { ...todo };
          this.todos[i].updatedDate = getCurrentDate()
        }
      }
      this.visibleModal = false;
      saveLocalStorage("todos", this.todos, "array");
    },


    // #endregion

    // #region TAGS
    addTag() {
      if (emptyName(this.newTag)) {
        return;
      }

      if (existingName(this.tags, this.newTag)) {
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
      notification("success", `Tag ${this.newTag} bien ajouté`)
      this.newTag = "";
      saveLocalStorage("tags", this.tags, "array");
    },
    readTag(tag) {
      this.readonly = true;
      this.visibleModalTag = true;
      this.selectedTag = { ...tag };
    },
    editTag(tag) {
      this.readonly = false;
      this.visibleModalTag = true;
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
      notification("success", `Tag ${tag.name} bien supprimé`)
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
      this.visibleModalTag = false;
      saveLocalStorage("tags", this.tags, "array");
      saveLocalStorage("todos", this.todos, "array");
    },
    handleEnterKeyTag(event) {
      if (event.key == 'Enter') {
        this.addTag()
      }
    },

    // #endregion

    // #region MISCELLANEOUS

    changeTab(tab) {
      this.activeTab = tab;
    },
    toggleModal() {
      this.visibleModal = !this.visibleModal
    },

    toggleModalTag() {
      this.visibleModalTag = !this.visibleModalTag
    },
    // #endregion

    // #region EXPORT
    exportJSON() {
      if (window.confirm('Are you sure you want to export and download your data ?')) {
        let filename = prompt('Enter the name of the export file.', 'todos')
        const jsonData = {
          todos: this.todos,
          tags: this.tags,
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
          this.$i18n.locale = jsonData.language
          saveLocalStorage("todos", this.todos, "array");
        } catch (error) {
          console.error("Erreur lors de la lecture du fichier JSON : " + error);
        }
      };
      reader.readAsText(file);
    },
    // #endregion
    setLanguage(language) {
      this.$i18n.locale = language;
      saveLocalStorage("language", language);
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



.burger {
  position: relative;
  z-index: 3;

}

.nav {
  display: flex;
  align-items: center;
}

.navbar {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1;
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
  padding: 5rem;
  opacity: 0.3;
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
</style>