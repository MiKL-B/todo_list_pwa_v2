<template>
    <Input @add="addTodo" v-model="newTodo" @handlekey="handleEnterKeyTodo" />
    <Todo v-for="todo in filteredTodos" :key="todo.index" />
    <TodoSelected :selectedTodo="selectedTodo" />
  
</template>

<script>
export default {
    name: "TodoList"
}
</script>