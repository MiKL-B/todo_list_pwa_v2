<template>
  <section class="section px-4">
    <div class="container">
      <h1 class="title">TodoList PWA</h1>
      <h2 class="subtitle is-3">{{ remaining <= 1 ? remaining + " task" : remaining + ' tasks' }} to do</h2>

          <div class="tabs">
            <ul>
              <li :class="{ 'is-active': activeTab === 'Tasks' }" @click="changeTab('Tasks')"><a>Tasks</a></li>
              <li :class="{ 'is-active': activeTab === 'Tags' }" @click="changeTab('Tags')"><a>Tags</a></li>
            </ul>
          </div>

          <div v-if="activeTab === 'Tasks'">
            <InputElement type="todo" @addElement="addItem" v-model="newItem" @handlekey="handleEnterKey" />
            <Card type="todo" v-for="(todo, index) in todos" :key="index" :element="todo" @edit="editItem(index, todo)"
              @delete="deleteItem(index)" @mark="markAsCompleted(index)" @read="readItem(index, todo)" />
          </div>

    </div>
  </section>

  <Modal v-if="visibleModal" @close="toggleModal">
    <template v-slot:content>
      <div v-if="readonly">
        <p>{{ selectedItem.name }}</p>
        <p>{{ selectedItem.date }}</p>
        <p>{{ selectedItem.description }}</p>
      </div>
      <div v-else>
        <Field name="Name" v-model="selectedItem.name" />
        <Field name="Description" type="text" v-model="selectedItem.description" />
        <label class="checkbox">
          <input id="todo-completed" type="checkbox" v-model="selectedItem.completed" />
          Completed
        </label>
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
      }
      this.newItem = "";
      this.todos.push(todo)
      this.saveLocalStorage()
    },
    displayItem(index,item){
      this.visibleModal = true;
      this.selectedItem = { ...item };
      this.selectedItem.index = index;
    },
    readItem(index, item) {
      this.readonly = true;
      this.displayItem(index,item);
    },
    editItem(index, item) {
      this.readonly = false;
      this.displayItem(index,item);
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
      let date = currentTime + " - " + currentDay;
      return date;
    },
    changeTab(tab) {
      this.activeTab = tab
    },
    toggleModal() {
      this.visibleModal = !this.visibleModal
    },
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

/* .section {
  padding: 1rem 1rem 0 1rem;
} */

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
</style>