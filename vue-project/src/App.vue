<template>

  <div class="nav">
    <Navbar @filter="setFilter" @tab="changeTab" @completed="markAllAsCompleted" @uncompleted="markAllAsUncompleted"
      @delete="deleteAllItems" @export="exportJSON" @import="openFileInput" />
    <input type="file" ref="fileInput" style="display: none" @change="importJSON" accept=".json">
    <h2 class="title">TodoList</h2>

  </div>
  <div class="container px-4">
    <div v-if="activeTab === 'Tasks'">
      <InputElement type="todo" @addElement="addItem" v-model="newItem" @handlekey="handleEnterKey" />
      <div class="filters">
        <label class="label">Task(s) to do: {{ remaining }} {{ todos.length > 0 ? ' / ' + todos.length : '' }}</label>
        <label class="label">Filter: {{ currentFilter }}</label>
      </div>
      <Card type="todo" v-for="todo in filteredTodos" :key="todo.index" :element="todo"
        @edit="editItem(todo.index, todo)" @delete="deleteItem(todo.index)" @mark="markAsCompleted(todo)"
        @read="readItem(todo.index, todo)" />
    </div>
    <div v-else>
      <p>This section is under development</p>
    </div>
  </div>

  <Modal v-if="visibleModal" @close="toggleModal">
    <template v-slot:content>
      <Field name="Name" v-model="selectedItem.name" :disabled="readonly" />
      <Field name="Description" type="textarea" v-model="selectedItem.description" :disabled="readonly" />
      <Field name="Created date" v-if="readonly" v-model="selectedItem.createdDate" :disabled="readonly" />
      <Field name="Updated date" v-if="readonly" v-model="selectedItem.updatedDate" :disabled="readonly" />
      <div class="field">
        <label class="checkbox">
          <input type="checkbox" v-model="selectedItem.completed" :disabled="readonly" />
          Completed
        </label>
      </div>
      <div class="field">
        <label class="checkbox">
          <input type="checkbox" v-model="selectedItem.priority" :disabled="readonly"
            @click="markAsImportant(selectedItem)" />
          Important
        </label>
      </div>
      <div class="cta" v-if="readonly == false">
        <button id="bt_save" class="button is-success" :disabled="selectedItem.name == ''"
          @click="saveItem(selectedItem.index, selectedItem)">Save</button>
      </div>
      <!-- <label class="label">Tags</label>
      <div class="field has-addons">
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select disabled>
              <option selected disabled>Tags</option>
              <option>Tag 1</option>
              <option>Tag 2</option>
            </select>
          </div>
        </div>
        <div class="control" v-if="readonly == false">
          <button class="button is-success" disabled>
            Add
          </button>
        </div>
      </div> -->
    </template>
  </Modal>
</template>

<script>
import InputElement from '@/components/InputElement.vue';
import Card from '@/components/Card.vue';
import Field from '@/components/Field.vue';
import Modal from '@/components/Modal.vue';
import Navbar from '@/components/Navbar.vue';
export default {
  name: "App",
  components: {
    InputElement, Card, Field, Modal, Navbar
  },
  data() {
    return {
      newItem: "",
      selectedItem: {},
      readonly: false,
      activeTab: "Tasks",
      visibleModal: false,
      currentFilter: "All",
      priorities: [
        {
          index: 0,
          name: "Low"
        },
        {
          index: 1,
          name: "High",
        },
      ],
      todos: JSON.parse(localStorage.getItem("todos")) || [],
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
          return this.todos.filter((todo) => todo.priority == 1);
      }
    }
  },
  methods: {
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
      this.changeTab('Tasks')
    },
    uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // todo
    addItem() {
      if (this.invalidName(this.newItem)) return;

      let todo = {
        index: this.uuid(),
        name: this.newItem,
        createdDate: this.getDate(),
        updatedDate: this.getDate(),
        description: "",
        completed: false,
        priority: this.priorities[0].index,
        // tags:[],
      }
      this.newItem = "";
      this.todos.push(todo)
      this.saveLocalStorage()
    },
    displayItem(index, item) {
      this.visibleModal = true;
      this.selectedItem = { ...item };
      this.selectedItem.index = index;
    },
    readItem(index, item) {
      this.readonly = true;
      this.displayItem(index, item);
    },
    editItem(index, item) {
      this.readonly = false;
      this.displayItem(index, item);
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
    deleteItem(index) {
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
    saveItem(index, item) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].index === index) {
          this.todos[i] = { ...item };
          this.todos[i].updatedDate = this.getDate()
        }
      }
      this.visibleModal = false;
      this.saveLocalStorage()
    },
    saveLocalStorage() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },

    // miscellaneous
    handleEnterKey(event) {
      if (event.key == 'Enter') {
        this.addItem()
      }
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
    exportJSON() {
      if (window.confirm('Are you sure you want to export and download your data ?')) {
        let filename = prompt('Enter the name of the export file.','todos')
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
          // Faites quelque chose avec les données JSON importées, par exemple :
          this.todos = jsonData
          this.saveLocalStorage()
          console.log(jsonData);
        } catch (error) {
          console.error("Erreur lors de la lecture du fichier JSON : " + error);
        }
      };
      reader.readAsText(file);
    }
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