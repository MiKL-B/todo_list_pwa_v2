<template>
    <div class="field has-addons">
        <div class="control is-expanded">
            <input id="input" class="input" type="text"
                placeholder="Add a new task" @keydown="handleEnterKey"
                :value="modelValue" @input="onInput" />
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
        modelValue: {
            type: String,
            required: false,
        }
    },
    methods: {
        addElement() {
            this.$emit('addElement')
        },

        handleEnterKey(event) {
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