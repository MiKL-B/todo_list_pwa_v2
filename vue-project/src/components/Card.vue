<template>
    <div  class="card mb-2">
        <div class="card-content py-4">
            <div class="content">
                <div>
                    <span class="icon" :class="todo.completed ? 'has-text-success' : ''">
                        <i class="fa-regular fa-circle-check" :class="todo.completed ? 'fa-circle-check' : 'fa-circle'"
                            @click="markAsCompleted(index)"></i>
                    </span>
                    <span class="todo-text">{{ todo.name }}</span>
                    <div class="tags-todolist">
                        <span class="tag" v-for="(tag, index) in todo.tags" :key="tag.id">
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


</template>


<script>
export default {
    name: "Card"
}
</script>


<style></style>