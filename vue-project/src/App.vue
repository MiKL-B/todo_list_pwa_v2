<template>

  <div class="nav">
    <Navbar @filter="setFilter" @tab="changeTab" @completed="markAllAsCompleted" @uncompleted="markAllAsUncompleted"
      @delete="deleteAllItems" @export="exportJSON" @import="openFileInput">
      <!-- <template v-slot:tag>
         tag list 
       NavElement set filter ..
        mark all as completed
       mark all as uncompleted 
        delete all items ... 
         export json
      </template> -->
    </Navbar>
    <input type="file" ref="fileInput" style="display: none" @change="importJSON" accept=".json">
    <h2 class="title">TodoList</h2>
  </div>

  <div class="container px-4">
    <div v-if="activeTab === 'Todos'">
      <TodoInput @add="addTodo" v-model="newTodo" @handlekey="handleEnterKeyTodo" />
      <div class="filters">
        <label class="label">Task(s) to do: {{ remaining }} {{ todos.length > 0 ? ' / ' + todos.length : '' }}</label>
        <label class="label">Filter: {{ currentFilter }}</label>
      </div>
      <TodoItem v-for="todo in filteredTodos" :key="todo.index" :todo="todo" @edit="editTodo(todo.index, todo)"
        @delete="deleteTodo(todo.index)" @mark="markAsCompleted(todo)" @read="readTodo(todo.index, todo)" />
    </div>
    <div v-else>
      <p>This section is under development.</p>
    </div>
  </div>

  <!-- todo modal -->
  <TodoSelected :selectedTodo="selectedTodo" :visible="visibleModal" :readonly="readonly" @toggle="toggleModal"
    @save="saveTodo(selectedTodo.index, selectedTodo)" @important="markAsImportant(selectedTodo)" />

  <!-- tag modal -->

</template>

<script>
import TodoInput from '@/components/TodoInput.vue';
import TodoItem from '@/components/TodoItem.vue';
import TodoSelected from '@/components/TodoSelected.vue';
import Field from '@/components/Field.vue';
import Modal from '@/components/Modal.vue';
import Navbar from '@/components/Navbar.vue';

export default {
  name: "App",
  components: {
    TodoInput, TodoItem, TodoSelected, Field, Modal, Navbar
  },
  data() {
    return {
      // todos
      newTodo: "",
      selectedTodo: {},
      readonly: false,
      currentFilter: "All",
      activeTab: "Todos",
      todos: JSON.parse(localStorage.getItem("todos")) || [],

      // tags
      tags: JSON.parse(localStorage.getItem('tags')) || [],

      // miscellaneous
      visibleModal: false,
    }
  },
  computed: {
    remaining() {
      return this.todos.filter((todo) => !todo.completed).length;
    },

    filteredTodos() {
      switch (this.currentFilter) {
        case 'All':
          return this.todos;
        case 'Today':
          let currentDay = new Date().toLocaleDateString();
          return this.todos.filter((todo) => todo.createdDate.includes(currentDay));
        case 'Completed':
          return this.todos.filter((todo) => todo.completed);
        case 'Uncompleted':
          return this.todos.filter((todo) => !todo.completed);
        case 'Important':
          return this.todos.filter((todo) => todo.priority == true);
      }
    }
  },
  methods: {

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
      this.newTodo = "";
      this.todos.push(todo)
      this.saveLocalStorage()
    },
    displayItem(index, todo) {
      this.visibleModal = true;
      this.selectedTodo = { ...todo };
      this.selectedTodo.index = index;
    },
    readTodo(index, todo) {
      this.readonly = true;
      this.displayItem(index, todo);
    },
    editTodo(index, todo) {
      this.readonly = false;
      this.displayItem(index, todo);
    },
    markAsCompleted(todo) {
      todo.completed = !todo.completed
      todo.updatedDate = this.getDate()
      this.saveLocalStorage();
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
    saveLocalStorageTag() {
      localStorage.setItem('tags', JSON.stringify(this.tags));
    },
    // #endregion

    // #region MISCELLANEOUS
    invalidName(name) {
      let isInvalid = false;
      if (name == '') {
        isInvalid = true;
      }
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].name === name) {
          isInvalid = true;
        }
      }
      return isInvalid
    },
    setFilter(type) {
      this.currentFilter = type;
      this.changeTab('Todos')
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
    // #endregion

    // #region EXPORT
    exportJSON() {
      if (window.confirm('Are you sure you want to export and download your data ?')) {
        let filename = prompt('Enter the name of the export file.', 'todos')
        const jsonData = this.todos

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
          this.todos = jsonData
          this.saveLocalStorage()
        } catch (error) {
          console.error("Erreur lors de la lecture du fichier JSON : " + error);
        }
      };
      reader.readAsText(file);
    }
    // #endregion
  }
}
//   for (let i = 0; i < this.todos.length; i++) {
//     for (let j = 0; j < this.todos[i].tags.length; j++) {
//       if (this.tags[index].name == this.todos[i].tags[j].name) {
//         this.todos[i].tags.splice(j, 1)
//       }
//     }
//   }
//   this.tags.splice(index, 1);
// }
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
</style>