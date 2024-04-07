<template>
    <div class="card mb-2 p-2">
        <div class="card-left">
            <span class="icon mx-1 is-size-5" :class="tag.color" >
                <i class="fa-solid fa-tag"></i>
            </span>

            <div class="card-info ml-2">
                <span class="card-text">{{ tag.name }}</span>
            </div>
        </div>
        <div class="card-right is-size-5">
            <span class="icon mr-1">
                <i class="fa-solid fa-info" @click="readTag(tag)"></i>
            </span>
            <span class="icon mx-1">
                <i class="fa-solid fa-pen" @click="editTag(tag)"></i>
            </span>
            <span class="icon has-text-danger ml-1">
                <i class="fa-regular fa-trash-can" @click="deleteTag(tag.index)"></i>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "TagItem",
    props: {
        tag:
        {
            type: Object,
            required: true,
        },
    },
    emits: ['read', 'edit', 'delete'],
    methods: {
        readTag(tag) {
            this.$emit('read',tag)
        },
        editTag(tag) {
            this.$emit('edit',tag)
        },
        deleteTag(index) {
            this.$emit('delete', index)
        }
    }
}
</script>

<style scoped>
.card-left, .card-right {
    display: flex;
    align-items: center;
}
</style>