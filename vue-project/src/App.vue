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
          <li>
            <a>
              <span class="icon">
                <i class="fa-regular fa-file"></i>
              </span>
              <span>Today</span>
            </a>
          </li>
          <li>
            <a>
              <span class="icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </span>
              <span>Important</span>
            </a>
          </li>
          <li>
            <a>
              <span class="icon">
                <i class="fa-regular fa-trash-can"></i>
              </span>
              <span>Trash</span>
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
          <li>
            <a>
              <span class="icon">
                <i class="fa-solid fa-tag"></i>
              </span>
              <span>Tag</span>
            </a>
          </li>
        </ul>
        <p class="menu-label">Actions</p>
        <ul class="menu-list">
          <li>
            <a>
              <span class="icon">
                <i class="fa-solid fa-filter"></i>
              </span>
              <span>Filter</span>
            </a>
            <ul>
              <li><a>Date</a></li>
              <li><a>Completed</a></li>
            </ul>
          </li>
          <li>
            <a>
              <span class="icon">
                <i class="fa-solid fa-circle-check"></i>
              </span>
              <span>Mark all as Completed</span>
            </a>
          </li>
          <li>
            <a>
              <span class="icon">
                <i class="fa-solid fa-broom"></i>
              </span>
              <span>Clear Completed</span>
            </a>
          </li>
        </ul>

      </aside>
    </div>
  </nav>

  <div class="container px-4">

    <!-- <div class="tabs is-centered">
      <ul>
        <li :class="{ 'is-active': activeTab === 'Tasks' }" @click="changeTab('Tasks')"><a>Tasks</a></li>
        <li :class="{ 'is-active': activeTab === 'Tags' }" @click="changeTab('Tags')"><a>Tags</a></li>
      </ul>
    </div> -->

    <div v-if="activeTab === 'Tasks'">
      <InputElement type="todo" @addElement="addItem" v-model="newItem" @handlekey="handleEnterKey" />
      <span class="">{{ remaining <= 1 ? remaining + " task" : remaining + ' tasks' }} to do</span>
          <Card type="todo" v-for="(todo, index) in todos" :key="index" :element="todo" @edit="editItem(index, todo)"
            @delete="deleteItem(index)" @mark="markAsCompleted(index)" @read="readItem(index, todo)" />
    </div>
  </div>

  <Modal v-if="visibleModal" @close="toggleModal">
    <template v-slot:content>
      <!-- name -->
      <Field name="Name" v-model="selectedItem.name" :disabled="readonly" />
      <!-- description -->
      <Field name="Description" type="text" v-model="selectedItem.description" :disabled="readonly" />
      <!-- date -->
      <Field v-if="readonly" name="Date" v-model="selectedItem.date" :disabled="readonly" />
      <!-- tags -->
      <label class="label">Tags</label>
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
      </div>
      <!-- priority -->
      <div class="field">
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
      </div>
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
      // todo
      newItem: "",
      selectedItem: {},
      readonly: false,
      activeTab: "Tasks",
      visibleModal: false,
      visibleNavBar: false,
      todos: JSON.parse(localStorage.getItem("todos")) || [],
    }
  },
  computed: {
    remaining() {
      return this.todos.filter((todo) => !todo.completed).length;
    },
  },
  methods: {
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
        name: this.newItem,
        date: this.getDate(),
        description: "",
        completed: false,
        // tags:[],
        // priority:-1,
        // updatedDate:""
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
    markAsCompleted(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.todos[index].date = this.getDate()
      this.saveLocalStorage();
    },
    deleteItem(index) {
      this.todos.splice(index, 1)
      this.saveLocalStorage();
    },
    saveItem(index, item) {
      this.visibleModal = false;
      this.todos[index] = { ...item };
      this.todos[index].date = this.getDate()
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
      this.activeTab = tab
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
  border: 1px solid red;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1;
}
</style>