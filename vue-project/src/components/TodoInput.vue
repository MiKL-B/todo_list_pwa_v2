<template>
    <div class="field has-addons">
        <div class="control is-expanded">
            <input id="input" class="input" type="text"
                placeholder="Add a new todo..." @keydown="handleEnterKeyTodo"
                :value="modelValue" @input="onInput" />
        </div>
        <div class="control">
            <button id="button" class="button is-success" @click="addTodo">Submit</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "TodoInput",
    props: {
        modelValue: {
            type: String,
            required: false,
        }
    },
    methods: {
        addTodo() {
            this.$emit('add')
        },

        handleEnterKeyTodo(event) {
            if (event.key == 'Enter') {
                this.$emit('handlekey', event)
            }
        },
        onInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>


<style></style>