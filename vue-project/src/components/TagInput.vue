<template>
 <div class="field has-addons">
        <div class="control is-expanded">
            <input id="input" class="input" type="text"
                :placeholder="$t('tag_input_placeholder')" @keydown="handleEnterKeyTag"
                :value="modelValue" @input="onInput" />
        </div>
        <div class="control">
            <button id="button" class="button is-success" @click="addTag">{{$t('submit')}}</button>
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