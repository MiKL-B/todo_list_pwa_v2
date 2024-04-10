<template>

  <div class="nav">
    <Navbar :tags="tags" @filter="setFilter" @tab="changeTab" @completed="markAllAsCompleted"
      @uncompleted="markAllAsUncompleted" @delete="deleteAllItems" @export="exportJSON" @import="openFileInput"
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
        <TodoItem v-for="todo in filteredTodos" :key="todo.index" :todo="todo" @edit="editTodo(todo)"
          @delete="deleteTodo(todo.index)" @read="readTodo(todo)" @change-state="changeState(todo)"
          :checkboxColor="checkboxColor(todo)" :checkboxClass="checkboxClass(todo)"
          @edit-todo-tags="editTodoTags(todo)" :tags="tags" />
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
        <TagItem v-for="tag in tags" :key="tag.index" :tag="tag" @edit="editTag(tag)" @read="readTag(tag)"
          @delete="deleteTag(tag.index)" />
      </div>
      <div class="empty-list" v-else>
        <i class="fa-solid fa-mug-saucer"></i>
        <h2 class="subtitle">{{$t('empty_tags')}}</h2>
      </div>
    </div>
  </div>

  <!-- todo modal -->
  <TodoSelected :selectedTodo="selectedTodo" :visible="visibleModal" :readonly="readonly" @toggle="toggleModal"
    @save="saveTodo(selectedTodo.index, selectedTodo)" @important="markAsImportant(selectedTodo)" />
  <!-- todo tags modal -->
  <TodoTagsSelected :selectedTodo="selectedTodo" :visible="visibleModalTodoTags" @toggle="toggleModalTodoTags"
    :tags="tags" @add-todo-tag="addTodoTag" @delete-todo-tag="deleteTodoTag" />

  <!-- tag modal -->
  <TagSelected :selectedTag="selectedTag" :visible="visibleModalTag" :readonly="readonly" @toggle="toggleModalTag"
    @save="saveTag(selectedTag.index, selectedTag)" />



</template>

<script>
import Field from '@/components/Field.vue';
import Modal from '@/components/Modal.vue';
import Navbar from '@/components/Navbar.vue';

// Todos
import TodoInput from '@/components/TodoInput.vue';
import TodoItem from '@/components/TodoItem.vue';
import TodoSelected from '@/components/TodoSelected.vue';
import TodoTagsSelected from '@/components/TodoTagsSelected.vue';

// Tags
import TagInput from '@/components/TagInput.vue';
import TagItem from '@/components/TagItem.vue';
import TagSelected from '@/components/TagSelected.vue';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "App",
  components: {
    Field, Modal, Navbar
    , TodoInput, TodoItem, TodoSelected, TodoTagsSelected
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
      visibleModalTodoTags: false,
      todos: JSON.parse(localStorage.getItem("todos")) || [],
      // tags
      newTag: "",
      selectedTag: {},
      visibleModalTag: false,
      tags: JSON.parse(localStorage.getItem('tags')) || [],
      colors: ['primary', 'success', 'danger', 'warning', 'epic', 'legendary'],
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
    checkboxColor(todo) {
      let color = "";
      if (todo.completed === false) {
        color = "";
      } else if (todo.completed === null) {
        color = "has-text-warning";
      } else {
        color = "has-text-success";
      }
      return color;
    },
    checkboxClass(todo) {
      let category = "";
      if (todo.completed === false) {
        category = "fa-circle";
      } else if (todo.completed === null) {
        category = "fa-hourglass";
      } else {
        category = "fa-circle-check";
      }
      return category;
    },
    changeState(todo) {
      if (todo.completed === false) {
        todo.completed = null;
      } else if (todo.completed === null) {
        todo.completed = true;
      } else {
        todo.completed = false;
      }
      todo.updatedDate = this.getDate();
      this.saveLocalStorage();
    },
    setFilter(type) {
      this.currentFilter = type;
      this.changeTab('Todos')
    },

    // #region TODO
    addTodo() {
      if (this.invalidName(this.newTodo)) return;

      let todo = {
        index: this.uuid(),
        name: this.newTodo,
        createdDate: this.getDate(),
        updatedDate: this.getDate(),
        description: "",
        completed: false,
        priority: false,
        tags: [],
      }
      this.todos.push(todo);
      this.saveLocalStorage()
      toast.success(`Tâche ${this.newTodo} bien ajoutée`, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        theme: "colored",
      });
      this.newTodo = "";
    },
    editTodoTags(todo) {
      this.visibleModalTodoTags = true;
      this.selectedTodo = { ...todo };
    },
    addTodoTag(selectedTodoTag) {
      if (selectedTodoTag.name == undefined) {
        return;
      }
      for (let i = 0; i < this.selectedTodo.tags.length; i++) {
        if (this.selectedTodo.tags[i].name === selectedTodoTag.name) {
          return;
        }
      }
      if (this.selectedTodo.tags.length < 3) {
        this.selectedTodo.tags.push(selectedTodoTag)
        this.visibleModalTodoTags = false;
        this.saveLocalStorage()
      }
    },
    deleteTodoTag(selectedTodoTagDelete) {
      for (let i = 0; i < this.selectedTodo.tags.length; i++){
        if (this.selectedTodo.tags[i].index === selectedTodoTagDelete.index){
          this.selectedTodo.tags.splice(i, 1)
        }
      }
      this.visibleModalTodoTags = false;
      this.saveLocalStorage()
    },

    displayTodo(todo) {
      this.visibleModal = true;
      this.selectedTodo = { ...todo };
    },
    readTodo(todo) {
      this.readonly = true;
      this.displayTodo(todo);
    },
    editTodo(todo) {
      this.readonly = false;
      this.displayTodo(todo);
    },
    markAllAsUncompleted() {
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].completed = false;
        this.todos[i].updatedDate = this.getDate();
      }
      this.saveLocalStorage()
    },
    markAllAsCompleted() {
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].completed = true;
        this.todos[i].updatedDate = this.getDate();
      }
      this.saveLocalStorage()
    },
    markAsImportant(todo) {
      todo.priority = !todo.priority;
      todo.updatedDate = this.getDate();
      this.saveLocalStorage()
    },
    deleteTodo(index) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === index) {
          this.todos.splice(i, 1)
        }
      }
      this.saveLocalStorage();
    },
    deleteAllItems() {
      var i = 0;
      while (i < this.todos.length) {
        if (this.todos[i].completed === true) {
          this.todos.splice(i, 1);
        } else {
          ++i;
        }
      }
      this.saveLocalStorage();
    },
    saveTodo(index, todo) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === index) {
          this.todos[i] = { ...todo };
          this.todos[i].updatedDate = this.getDate()
        }
      }
      this.visibleModal = false;
      this.saveLocalStorage()
    },
    saveLocalStorage() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    handleEnterKeyTodo(event) {
      if (event.key == 'Enter') {
        this.addTodo()
      }
    },
    // #endregion

    // #region TAGS
    addTag() {
      if (this.newTag === "") {
        return;
      }

      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].name === this.newTag) {
          this.newTag = "";
          return;
        }
      }
      let indexRandomColor = Math.floor(Math.random() * this.colors.length)
      let randomColor = this.colors[indexRandomColor]
      let tag = {
        index: this.uuid(),
        name: this.newTag,
        createdDate: this.getDate(),
        updatedDate: this.getDate(),
        color: randomColor,
      }
      this.newTag = "";
      this.tags.push(tag);
      this.saveLocalStorageTag();
    },
    displayTag(tag) {
      this.visibleModalTag = true;
      this.selectedTag = { ...tag };
      this.selectedTag.color = tag.color;
    },
    readTag(tag) {
      this.readonly = true;
      this.displayTag(tag);
    },
    editTag(tag) {
      this.readonly = false;
      this.displayTag(tag)
    },
    deleteTag(index) {
      // delete tag in todo
      for (let i = 0; i < this.todos.length; i++) {
        for (let j = 0; j < this.todos[i].tags.length; j++) {
          if (this.todos[i].tags[j].index === index) {
            this.todos[i].tags.splice(j, 1);
            this.saveLocalStorage()
            break;
          }
        }
      }
      // delete right tag
      const globalTagIndex = this.tags.findIndex(tag => tag.index === index);
      if (globalTagIndex !== -1) {
        this.tags.splice(globalTagIndex, 1);
        this.saveLocalStorageTag();
      }
    },

    saveTag(index, tag) {
      // update date in tag list and in todo
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].index === index) {
          console.log(tag)
          this.tags[i] = { ...tag };
          this.tags[i].color = tag.color;
          this.tags[i].updatedDate = this.getDate()

          for (let j = 0; j < this.todos.length; j++) {
            for (let k = 0; k < this.todos[j].tags.length; k++) {
              if (this.todos[j].tags[k].index === this.tags[i].index) {
                this.todos[j].tags[k].color = tag.color;
                this.todos[j].tags[k].name = tag.name;
              }
            }
          }
        }
      }
      this.visibleModalTag = false;
      this.saveLocalStorageTag()
      this.saveLocalStorage()
    },
    handleEnterKeyTag(event) {
      if (event.key == 'Enter') {
        this.addTag()
      }
    },
    saveLocalStorageTag() {
      localStorage.setItem('tags', JSON.stringify(this.tags));
    },
    // #endregion

    // #region MISCELLANEOUS
    invalidName(name) {
      let isInvalid = false;
      if (name == '') {
        isInvalid = true;
        toast.error("Nom vide", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          theme: "colored",
        });
      }
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].name === name) {
          isInvalid = true;
          toast.error(`${name} déjà existant`, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            theme: "colored",
          });
          this.newTodo = "";
        }
      }
      return isInvalid;
    },

    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    getDate() {
      let currentTime = new Date().toLocaleTimeString();
      let currentDay = new Date().toLocaleDateString();
      let date = currentDay + " - " + currentTime;
      return date;
    },
    changeTab(tab) {
      this.activeTab = tab;
    },
    toggleModal() {
      this.visibleModal = !this.visibleModal
    },
    toggleModalTodoTags() {
      this.visibleModalTodoTags = !this.visibleModalTodoTags
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
          this.saveLocalStorage()
        } catch (error) {
          console.error("Erreur lors de la lecture du fichier JSON : " + error);
        }
      };
      reader.readAsText(file);
    },
    // #endregion
    setLanguage(language) {
      this.$i18n.locale = language;
      localStorage.setItem("language", language);
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
  --legendary: hsl(20, 80%, 60%);
}

.primary {
  color: hsl(200, 80%, 60%);
}

.warning {
  color: hsl(50, 80%, 60%);
}

.danger {
  color: hsl(348, 100%, 61%);
}

.success {
  color: rgb(21, 207, 145);
}

.legendary {
  color: hsl(20, 80%, 60%);
}

.epic {
  color: hsl(270, 80%, 60%);
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