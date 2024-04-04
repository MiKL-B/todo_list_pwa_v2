<template>

  <section class="section px-4">
    <div class="container">
      <h1 class="title">TodoList PWA</h1>
      <h2 class="subtitle is-3">{{ remaining <= 1 ? remaining + " task" : remaining + ' tasks' }} to do</h2>
          <!-- <InputElement type="todo" @addElement="addItem" v-model="newItem" @handlekey="handleEnterKey" />
          <Card type="todo" v-for="(todo, index) in todos" :key="index" :element="todo" @edit="openModal(index, todo)"
            @delete="deleteItem(index)" @mark="markAsCompleted(index)" />
    -->
          <input type="text" v-model="newItem">
          <button class="button" @click="addItem">submit</button>
          <div v-for="(item, index) in todos" :key="index">
            {{ index }} - {{ item.name }}
            <button class="button" @click="editItem(index, item)">edit</button>
            <button class="button" @click="deleteItem(index)">delete</button>
          </div>
          <button class="button-primary">Button element</button>
    </div>
  </section>
  <Modal v-if="visibleModal" @close="toggleModal">
  <template v-slot:content>
    {{ selectedItem }}
  </template>
  </Modal>
  <button class="border-2">test</button>

  <!-- modal -->
  <div id="modal" class=" px-4">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        {{ selectedItem }}
        <Field name="Name" v-model="selectedItem.name" />
        <!-- <Field name="Date" v-model="selectedTodo.date" disabled readonly/>
        <Field name="Description" type="text" v-model="selectedTodo.description"/> -->

        <!-- <label class="label">Tags</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select v-model="selectedTag">
                <option disabled selected>Select a tag</option>
                <option v-for="(tag, index) in tags" :key="index" :value="tag">{{ tag.name }}</option>
              </select>

            </div>
          </div>
          <div class="control">
            <button class="button is-success" @click="addTagTodo">Assign</button>
          </div>
        </div>
    
        <div class="field">
          <div class="control tags-todolist">
            <span class="tag" v-for="(tag, index) in selectedTodo.tags" :key="tag.id">
              <i class="fa-solid fa-tag"></i>
              <span>{{ tag.name }}</span>
              <a class="tag is-delete" @click="deleteTagTodo(index)"></a>
            </span>
          </div>
        </div>

        <label class="checkbox">
          <input id="todo-completed" type="checkbox" v-model="selectedTodo.completed" />
          Completed
        </label> -->
      </section>
      <!-- <footer class="modal-card-foot">
        <div class="buttons">
          <button id="bt_CloseModal" class="button" @click="closeModal(selectedItem.index, selectedItem)">Close</button>
        </div>
      </footer> -->
    </div>
  </div>
</template>


<script>
import InputElement from '@/components/InputElement.vue';
import Card from '@/components/Card.vue';
import Field from '@/components/Field.vue';
import Modal from '@/components/Modal.vue';

export default {
  name: "App",
  components: {
    InputElement, Card, Field,Modal
  },
  data() {
    return {
      newItem: "",
      visibleModal:false,
      selectedItem: {},
      todos: JSON.parse(localStorage.getItem("todos")) || [],
    }
  },
  computed: {
    remaining() {
      return this.todos.filter((todo) => !todo.completed).length;
    },
  },
  methods: {
    toggleModal(){
      this.visibleModal = !this.visibleModal
    },
    addItem() {
      if (this.newItem == "") {
        return;
      }
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].name == this.newItem) {
          this.clearInputValue()
          return;
        }
      }
      let todo = {
        name: this.newItem,
        date: this.getDate(),
        description: "",
        completed: false,
      }
      this.todos.push(todo)
      this.saveItem()
      this.clearInputValue()
    },
    editItem(index, item) {
      this.visibleModal = true;
      this.selectedItem = { ...item };
      this.selectedItem.index = index;
    
    },
    updateItem(index, item) {
      this.todos[index] = { ...item };
      this.todos[index].date = this.getDate()
      this.saveItem();
    },
    saveItem() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    markAsCompleted(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.updateItem(index, this.todos[index]);
      this.saveItem();
    },
    deleteItem(index) {
      this.todos.splice(index, 1)
      this.saveItem();
    },
    handleEnterKey(event) {
      if (event.key == 'Enter') {
        this.addItem()
      }
    },
    clearInputValue() {
      this.newItem = "";
    },
    getDate() {
      let currentTime = new Date().toLocaleTimeString();
      let currentDay = new Date().toLocaleDateString();
      let date = currentTime + " - " + currentDay;
      return date;
    },
    closeModal(index, item) {
      this.updateItem(index, item)
      document.getElementById('modal').classList.remove('is-active')
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