<template>
  <section class="section px-4">
    <div class="container">
      <h1 class="title">TodoList PWA</h1>
      <h2 class="subtitle is-3">{{ remaining <= 1 ? remaining + " task" : remaining + ' tasks' }} to do</h2>
          <div class="tabs is-centered">
            <ul>
              <li :class="tabIsActive ? '' : 'is-active'">
                <a @click="tabIsActive = false">Tasks</a>
              </li>
              <li :class="tabIsActive ? 'is-active' : ''">
                <a @click="tabIsActive = true">Tags</a>
              </li>
            </ul>
          </div>
          <!-- add new task -->
          <div v-if="!tabIsActive">
            <div id="add-task" class="field has-addons">
              <div class="control is-expanded">
                <input id="input" class="input" type="text" placeholder="Add a new task..." v-model="newTodo"
                  @keydown="handleEnterKeyTodo" />
              </div>
              <div class="control">
                <button id="button" class="button is-success" @click="addTodo">Submit</button>
              </div>
            </div>
            <div id="todo-list">
              <!-- card begin -->
              <div v-for="(todo, index) in todos" :key="index" class="card mb-2">
                <div class="card-content py-4">
                  <div class="content">
                    <div>
                      <span class="icon" :class="todo.completed ? 'has-text-success' : ''">
                        <i class="fa-regular fa-circle-check" :class="todo.completed ? 'fa-circle-check' : 'fa-circle'"
                          @click="markAsCompleted(index)"></i>
                      </span>
                      <span class="todo-text">{{ todo.name }}</span>
                      <div class="tags-todolist">
                        <span class="tag" v-for="tag in todo.tags" :key="tag.id">
                          <i class="fa-solid fa-tag"></i>
                          <span>{{ tag }}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <span class="icon">
                        <i class="fa-solid fa-pen" @click="openModal(index, todo)"></i>
                      </span>
                      <span class="icon has-text-danger">
                        <i class="fa-regular fa-trash-can" @click="deleteTodo(index)"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- card end -->

            </div>
          </div>
          <!-- add new tag -->
          <div v-else>
            <div id="add-tag" class="field has-addons">
              <div class="control is-expanded">
                <input class="input" type="text" placeholder="Add a new tag..." v-model="newTag"
                  @keydown="handleEnterKeyTag" />
              </div>
              <div class="control">
                <button id="button" class="button is-success" @click="addTag">Submit</button>
              </div>
            </div>
            <div class="tag-list">
              <div v-for="(tag, index) in tags" :key="index" class="card mb-2">
                <div class="card-content py-4">
                  <div class="content">
                    <div>
                      <span class="icon">
                        <i class="fa-solid fa-tag"></i>
                      </span>
                      <span class="tag-text">{{ tag }}</span>
                    </div>
                    <span class="icon has-text-danger">
                      <i class="fa-regular fa-trash-can" @click="deleteTag(index)"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  </section>
  <!-- modal -->
  <div id="modal" class="modal px-4">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p id="modal-title" class="modal-card-title">{{ selectedTodo.name }}</p>
      </header>
      <section class="modal-card-body">
        <!-- name -->
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input id="todo-name" class="input" type="text" placeholder="Text input" v-model="selectedTodo.name" />
          </div>
        </div>
        <!-- date -->
        <div class="field">
          <label class="label">Date</label>
          <div class="control">
            <input id="todo-date" class="input" type="text" disabled placeholder="Text input" readonly
              v-model="selectedTodo.date" />
          </div>
        </div>
        <!-- description -->
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea id="todo-description" class="textarea has-fixed-size" v-model="selectedTodo.description"
              placeholder="Fixed size textarea"></textarea>
          </div>
        </div>
        <!-- select -->
        <label class="label">Tags</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <div class="select is-fullwidth">
              <select v-model="selectedTag">
                <option disabled selected>Select a tag</option>
                <option v-for="(tag, index) in tags" :key="index" :value="tag">{{ tag }}</option>
              </select>

            </div>
          </div>
          <div class="control">
            <button class="button is-success" @click="addTagTodo">Assign</button>
          </div>
        </div>
        <!-- tags -->
        <div class="field">
          <div class="control tags-todolist">
            <span class="tag" v-for="(tag, index) in selectedTodo.tags" :key="tag.id">
              <i class="fa-solid fa-tag"></i>
              <span>{{ tag }}</span>
              <a class="tag is-delete" @click="deleteTagTodo(index)"></a>
            </span>
          </div>
        </div>
        <!-- completed -->
        <label class="checkbox">
          <input id="todo-completed" type="checkbox" v-model="selectedTodo.completed" />
          Completed
        </label>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button id="bt_SaveChanges" class="button is-success" @click="saveChanges(selectedTodo.index, selectedTodo)">
            Save changes
          </button>
          <button id="bt_CloseModal" class="button" @click="closeModal">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>


<script>
export default {
  name: "App",
  data() {
    return {
      tabIsActive: false,
      selectedTodo: {},
      selectedTag: "",
      newTodo: "",
      newTag: "",
      todos: JSON.parse(localStorage.getItem("todos")) || [],
      tags: JSON.parse(localStorage.getItem('tags')) || []
    }
  },
  computed: {
    remaining() {
      return this.todos.filter((todo) => !todo.completed).length;
    },
  },
  methods: {
    handleEnterKeyTodo(event) {
      if (event.key == 'Enter') {
        this.addTodo()
      }
    },
    addTodo() {
      if (this.newTodo == "") {
        return;
      }
      let todo = {
        name: this.newTodo,
        date: this.getDate(),
        description: "",
        completed: false,
        tags: [],
      }
      console.log(todo)
      this.todos.push(todo)
      this.clearInputValue()
      this.saveTodo()
      console.log(this.todos)
    },
    updateTodo(index, todo) {
      this.todos[index] = { ...todo };
      this.todos[index].date = this.getDate()
      this.saveTodo();
    },
    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.saveTodo();
    },
    saveTodo() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    markAsCompleted(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.updateTodo(index, this.todos[index]);
      this.saveTodo();
    },

    clearInputValue() {
      this.newTodo = "";
      this.newTag = "";
    },
    getDate() {
      let currentTime = new Date().toLocaleTimeString();
      let currentDay = new Date().toLocaleDateString();
      let date = currentTime + " - " + currentDay;
      return date;
    },
    openModal(index, todo) {
      this.selectedTodo = { ...todo }
      this.selectedTodo.index = index

      document.getElementById('modal').classList.add('is-active')
    },
    closeModal() {
      document.getElementById('modal').classList.remove('is-active')
    },
    saveChanges(index, todo) {
      if (this.selectedTodo.name == "") {
        this.selectedTodo.name = "New todo";
      }
      this.selectedTodo = { ...todo };
      this.selectedTodo.index = index;
      this.selectedTodo.completed = todo.completed;
      this.updateTodo(index, this.selectedTodo);
      this.saveTodo();
      this.closeModal();
    },
    addTagTodo() {
      if (this.selectedTag == "") {
        return;
      }
      if (this.selectedTodo.tags.includes(this.selectedTag)) {
        return;
      }
      this.selectedTodo.tags.push(this.selectedTag)
    },
    deleteTagTodo(index) {
      this.selectedTodo.tags.splice(index, 1)
    },
    // tags
    handleEnterKeyTag(event) {
      if (event.key == 'Enter') {
        this.addTag()
      }
    },
    addTag() {
      if (this.newTag == "") {
        return;
      }
      if (this.tags.includes(this.newTag)) {
        return;
      }
      this.tags.push(this.newTag)
      this.clearInputValue()
      this.saveTag()
    },
    saveTag() {
      localStorage.setItem("tags", JSON.stringify(this.tags));
    },
    deleteTag(index) {
      for (let i = 0; i < this.todos.length; i++) {
        for (let j = 0; j < this.todos[i].tags.length; j++) {
          if (this.tags[index] == this.todos[i].tags[j]) {
            this.todos[i].tags.splice(j, 1)
          }
        }
      }
      this.tags.splice(index, 1);
      this.saveTodo();
      this.saveTag();
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');

body {
  height: 100vh;
}

.section {
  padding: 1rem 1rem 0 1rem;
}

.content {
  display: flex;
  justify-content: space-between;
}

.todo-text,
.tag-text {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>