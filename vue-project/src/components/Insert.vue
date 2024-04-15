<template>
 <div class="field has-addons">
        <div class="control is-expanded">
            <input id="input" class="input" type="text"
                :placeholder="$t('enter_text_placeholder')" @keydown="handleKey"
                :value="modelValue" @input="onInput" />
        </div>
        <div class="control">
            <button id="button" class="button is-success" @click="add">{{$t('submit')}}</button>
        </div>
    </div>

</template>

<script>
export default {
    name:"Insert",
    props: {
        modelValue: {
            type: String,
            required: false,
        }
    },
    methods: {
        add() {
            this.$emit('add')
        },
        handleKey(event) {
            if (event.key == 'Enter') {
                this.add();
            }
        },
        onInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>