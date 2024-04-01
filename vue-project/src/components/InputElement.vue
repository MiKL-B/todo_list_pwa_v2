<template>
    <div class="field has-addons">
        <div class="control is-expanded">
            <input id="input" class="input" type="text"
                :placeholder="type == 'todo' ? 'Add a new task' : 'Add a new tag'" @keydown="handleEnterKey"
                :value="newElement" @input="inputValue($event.target.value)" />
        </div>
        <div class="control">
            <button id="button" class="button is-success" @click="addElement">Submit</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "InputElement",
    props: {
        type: {
            type: String,
            required: true,
        },
        newElement: {
            type: String,
            required: true,
        }
    },
    methods: {
        addElement() {
            this.$emit('addElement')
        },
        inputValue(newValue) {
            this.$emit('update:newElement', newValue)
        },
        handleEnterKey(event) {
            if (event.key == 'Enter') {
                this.$emit('handlekey',event)
            }
        },
    }
}
</script>


<style></style>