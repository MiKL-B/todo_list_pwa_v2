<template>
    <Modal v-if="visible" @close="toggleModal">
        <template v-slot:content>
            <Field :name="$t('name')" v-model="selectedTodo.name" :disabled="readonly" />
            <Field :name="$t('description')" type="textarea" v-model="selectedTodo.description" :disabled="readonly" />
            <Field :name="$t('createddate')" v-if="readonly" v-model="selectedTodo.createdDate" :disabled="readonly" />
            <Field :name="$t('updateddate')" v-if="readonly" v-model="selectedTodo.updatedDate" :disabled="readonly" />
            <label class="label">{{ $t('state') }}</label>
            <div class="field">
                <label class="checkbox">
                    <input type="checkbox" v-model="selectedTodo.completed" :disabled="readonly" />
                    {{ $t('is_completed') }}
                </label>
            </div>
            <div class="field">
                <label class="checkbox">
                    <input type="checkbox" v-model="selectedTodo.priority" :disabled="readonly"
                        @click="markAsImportant(selectedTodo)" />
                    {{ $t('is_important') }}
                </label>
            </div>
            <div class="cta" v-if="readonly == false">
                <button id="bt_save" class="button is-success" :disabled="selectedTodo.name == ''"
                    @click="saveTodo(selectedTodo.index, selectedTodo)">{{ $t('save') }}</button>
            </div>
        </template>
    </Modal>

</template>

<script>
import Modal from '@/components/Modal.vue';
import Field from '@/components/Field.vue';
export default {
    name: "TodoSelected",
    components: {
        Modal, Field
    },
    props: {
        selectedTodo: {
            type: Object,
            required: true,
        },
        visible: {
            type: Boolean,
            required: true,
        },
        readonly: {
            type: Boolean,
            required: true,
        },
    },
    emits: ['toggle', 'save', 'important'],
    methods: {
        toggleModal() {
            this.$emit('toggle')
        },
        markAsImportant(todo) {
            this.$emit('important', todo)
        },
        saveTodo(index, todo) {
            this.$emit('save', [index, todo])
        },
    }
}
</script>