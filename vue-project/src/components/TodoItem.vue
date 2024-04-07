<template>
    <div class="card card-todo mb-2 p-2">
        <div class="card-top">
            <div class="card-top-left">

                <span class="icon mx-1 is-size-5" :class="todo.completed ? 'has-text-success' : ''">
                    <i class="fa-regular fa-circle-check" :class="todo.completed ? 'fa-circle-check' : 'fa-circle'"
                        @click="markAsCompleted(todo)"></i>
                </span>
    
                <div class="card-info ml-2">
                    <span class="priority" v-if="todo.priority == 1">
                        <i class="fa-solid fa-exclamation has-text-danger"></i>
                        <i class="fa-solid fa-exclamation has-text-danger"></i>
                    </span>
                    <span class="card-text">{{ todo.name }}</span>
                </div>
            </div>

            <div class=" is-size-5">
                <span class="icon mr-1">
                    <i class="fa-solid fa-info" @click="readTodo(todo.index, todo)"></i>
                </span>
                <span class="icon mx-1">
                    <i class="fa-solid fa-pen" @click="editTodo(todo.index, todo)"></i>
                </span>
                <span class="icon has-text-danger ml-1">
                    <i class="fa-regular fa-trash-can" @click="deleteTodo(todo.index)"></i>
                </span>
            </div>
        </div>
        <div class="card-bottom" v-if="todo.tags.length > 0">
            <span v-for="tag in todo.tags" :key="tag.index" class="tag mx-1">
                <i class="fa-solid fa-tag" :class="tag.color"></i>
                <span>{{tag.name}}</span>
            </span>
        </div>      
    </div>
</template>


<script>
export default {
    name: "TodoItem",
    props: {
        todo:
        {
            type: Object,
            required: true,
        },
    },
    emits: ['mark', 'read', 'edit', 'delete'],
    methods: {
        markAsCompleted(todo) {
            this.$emit('mark', todo)
        },
        readTodo(index, todo) {
            this.$emit('read', [index, todo])
        },
        editTodo(index, todo) {
            this.$emit('edit', [index, todo])
        },
        deleteTodo(index) {
            this.$emit('delete', index)
        }
    }
}
</script>


<style>
.card {
    display: flex;
    justify-content: space-between;

}
.card-todo{
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows:repeat(auto,0.5fr);
}


.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:100%;
}
.card-top-left{
    display:flex;
    align-items: center;
}
.card-bottom{
    display:flex;
}
.card-info {
    width: 170px;
    padding: 1rem 0;
    display: flex;
    gap: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-text {
    max-width: 100px;
}

.priority {
    display: flex;
    gap: 2px;
    align-items: center;
}

</style>