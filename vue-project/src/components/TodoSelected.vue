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
            <label class="label" v-if="readonly == false && tags.length > 0">{{ $t('tags') }}</label>
            <div class="field has-addons" v-if="readonly == false && tags.length > 0">
                <div class="control is-expanded">
                    <div class="select is-fullwidth">

                        <select v-model="selectedTodoTag">
                            <option v-for="tag in tags" :key="tag.index" :value="tag">
                                {{ tag.name }}
                            </option>
                        </select>
                        
                    </div>
                </div>
                <div class="control">
                    <button class="button is-info" @click="addTodoTag">{{$t('add')}}</button>
                </div>
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
    data() {
        return {
            selectedTodoTag: {}
        }
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
        tags: {
            type: Array,
            required: true,
        },
    },
    emits: ['toggle', 'save', 'important', 'add-todo-tag'],
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
        addTodoTag() {
            this.$emit('add-todo-tag', this.selectedTodoTag)
        }
    }
}
</script>