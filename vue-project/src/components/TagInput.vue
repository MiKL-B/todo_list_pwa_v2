<template>
 <div class="field has-addons">
        <div class="control is-expanded">
            <input id="input" class="input" type="text"
                placeholder="Add a new tag..." @keydown="handleEnterKeyTag"
                :value="modelValue" @input="onInput" />
        </div>
        <div class="control">
            <button id="button" class="button is-success" @click="addTag">Submit</button>
        </div>
    </div>

</template>

<script>
export default {
    name:"TagInput",
    props: {
        modelValue: {
            type: String,
            required: false,
        }
    },
    methods: {
        addTag() {
            this.$emit('add')
        },

        handleEnterKeyTag(event) {
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