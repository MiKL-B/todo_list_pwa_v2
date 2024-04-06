<template>

  <nav>
    <i class="fa-solid fa-bars is-size-4 p-4 burger" @click="toggleNavBar"></i>
    <div v-if="visibleNavBar" class="navbar">
      <aside class="menu pt-6 px-4">
        <p class="menu-label">
          <span class="icon">
            <i class="fa-solid fa-list"></i>
          </span>
          <span>Todos</span>
        </p>
        <ul class="menu-list">
          <li @click="setFilter('All')">
            <a>
              <span class="icon">
                <i class="fa-regular fa-file"></i>
              </span>
              <span>All</span>
            </a>
          </li>
          <li @click="setFilter('Today')">
            <a>
              <span class="icon">
                <i class="fa-regular fa-file"></i>
              </span>
              <span>Today</span>
            </a>
          </li>
          <!-- <li>
            <a>
              <span class="icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </span>
              <span>Important</span>
            </a>
          </li> -->
          <li @click="setFilter('Completed')">
            <a>
              <span class="icon">
                <i class="fa-solid fa-circle-check"></i>
              </span>
              <span>Completed</span>
            </a>
          </li>
          <li @click="markAllAsCompleted">
            <a>
              <span class="icon">
                <i class="fa-solid fa-circle-check"></i>
              </span>
              <span>Mark all as completed</span>
            </a>
          </li>
          <li @click="deleteAllItems">
            <a>
              <span class="icon">
                <i class="fa-solid fa-broom"></i>
              </span>
              <span>Clear Completed</span>
            </a>
          </li>
        </ul>
        <p class="menu-label">
          <span class="icon">
            <i class="fa-solid fa-tags"></i>
          </span>
          <span>Tags</span>
        </p>
        <ul class="menu-list">
          <li @click="changeTab('Tags')">
            <a>
              <span class="icon">
                <i class="fa-solid fa-tag"></i>
              </span>
              <span>Tag</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>
  </nav>

  <div class="container px-4">
    <div v-if="activeTab === 'Tasks'">
      <InputElement type="todo" @addElement="addItem" v-model="newItem" @handlekey="handleEnterKey" />
      <label class="label">Task(s) to do: {{ remaining }}</label>
      <label class="label">Current filter: {{ currentFilter }}</label>
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
      <!-- name -->
      <Field name="Name" v-model="selectedItem.name" :disabled="readonly" />
      <!-- description -->
      <Field name="Description" type="text" v-model="selectedItem.description" :disabled="readonly" />
      <!-- created date -->
      <Field v-if="readonly" name="Created date" v-model="selectedItem.createdDate" :disabled="readonly" />
      <!-- updated date -->
      <Field v-if="readonly" name="Updated date" v-model="selectedItem.updatedDate" :disabled="readonly" />
     <!-- updated date -->
     <!-- <Field v-if="readonly" name="Priority" v-model="selectedItem.priority" :disabled="readonly" />
       -->
      <!-- tags -->
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
      <!-- priority -->
      <!-- <div class="field">
        <label class="label">Priority</label>
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select disabled>
              <option selected disabled>Priority</option>
              <option>High</option>
              <option>Low</option>
            </select>
          </div>
        </div>
      </div> -->
      <!-- completed -->
      <label class="checkbox">
        <input id="todo-completed" type="checkbox" v-model="selectedItem.completed" :disabled="readonly" />
        Completed
      </label>
      <div class="cta" v-if="readonly == false">
        <button class="button is-success" :disabled="selectedItem.name === ''"
          @click="saveItem(selectedItem.index, selectedItem)">Save</button>
      </div>
    </template>
  </Modal>


</template>


<script>
import InputElement from '@/components/InputElement.vue';
import Card from '@/components/Card.vue';
import Field from '@/components/Field.vue';
import Modal from '@/components/Modal.vue';

export default {
  name: "App",
  components: {
    InputElement, Card, Field, Modal
  },
  data() {
    return {
      newItem: "",
      selectedItem: {},
      readonly: false,
      activeTab: "Tasks",
      visibleModal: false,
      visibleNavBar: false,
      currentFilter: "All",
      priorities: [
        {
          index: 0,
          name: "Normal"
        },
        {
          index: 1,
          name: "Low",
        },
        {
          index: 2,
          name: "High",
        }
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
          return this.todos.filter((todo) => todo.createdDate.includes(currentDay))
        case 'Completed':
          return this.todos.filter((todo) => todo.completed)
      }
    }
  },
  methods: {
    setFilter(type) {
      this.currentFilter = type;
      this.changeTab('Tasks')
      this.visibleNavBar = false;
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
      if (this.newItem == "") {
        return;
      }
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].name === this.newItem) {
          this.newItem = "";
          return;
        }
      }
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
    markAllAsCompleted() {
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].completed = true;
        this.todos[i].updatedDate = this.getDate();
      }
      this.visibleNavBar = false;
      this.saveLocalStorage()
    },
    deleteItem(index) {
      this.todos.splice(index, 1)
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
      this.visibleNavBar = false;
      this.saveLocalStorage();
    },
    saveItem(index, item) {
      this.visibleModal = false;
      this.todos[index] = { ...item };
      this.todos[index].updatedDate = this.getDate()
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
      this.visibleNavBar = false;
    },
    toggleModal() {
      this.visibleModal = !this.visibleModal
    },
    // navbar
    toggleNavBar() {
      this.visibleNavBar = !this.visibleNavBar
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

.navbar {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1;
}
</style>