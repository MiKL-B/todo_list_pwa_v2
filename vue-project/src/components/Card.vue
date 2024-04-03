<template>
    <div class="card mb-2 px-1">
        <div class="card-left">
            <span class="icon mx-1" :class="element.completed ? 'has-text-success' : ''">
                <i class="fa-regular fa-circle-check" :class="element.completed ? 'fa-circle-check' : 'fa-circle'"
                    @click="markAsCompleted(index)"></i>
            </span>

            <div class="card-info" @click="readElement(index, element)">
                <span class="card-text">{{ element.name }}</span>
            </div>
        </div>
        <div class="card-right is-size-5 ml-2">
            <span class="icon">
                <i class="fa-solid fa-pen" @click="editElement(index, element)"></i>
            </span>
            <span class="icon has-text-danger mx-1">
                <i class="fa-regular fa-trash-can" @click="deleteElement(index)"></i>
            </span>
        </div>
    </div>
</template>


<script>
export default {
    name: "Card",
    props: {
        element:
        {
            type: Object,
            required: true,
        },
    },
    methods: {
        markAsCompleted(index) {
            this.$emit('mark', index)
        },
        readElement(index, element) {
            this.$emit('read', [index, element])
        },
        editElement(index, element) {
            this.$emit('edit', [index, element])
        },
        deleteElement(index) {
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

.card-left,
.card-right {
    display: flex;
    align-items: center;

}

.card-info {

    width: 225px;
    padding: 1rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-text {
    max-width: 100px;
}
</style>