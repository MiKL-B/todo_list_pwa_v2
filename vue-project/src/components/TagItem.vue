<template>
    <div class="card mb-2 p-2">
        <div class="card-left">
            <span class="icon mx-1 is-size-5">
                <i class="fa-solid fa-tag"></i>
            </span>

            <div class="card-info ml-2">
                <span class="card-text">{{ tag.name }}</span>
            </div>
        </div>
        <div class="card-right is-size-5">
            <span class="icon mr-1">
                <i class="fa-solid fa-info" @click="readElement(tag.index, tag)"></i>
            </span>
            <span class="icon mx-1">
                <i class="fa-solid fa-pen" @click="editElement(tag.index, tag)"></i>
            </span>
            <span class="icon has-text-danger ml-1">
                <i class="fa-regular fa-trash-can" @click="deleteElement(tag.index)"></i>
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