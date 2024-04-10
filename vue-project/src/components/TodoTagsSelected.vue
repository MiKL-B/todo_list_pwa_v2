<template>
    <Modal v-if="visible" @close="toggleModal">
        <template v-slot:content>
            <label class="label" v-if="tags.length > 0">{{ $t('tags') }}</label>
            <div class="field has-addons" v-if="tags.length > 0">
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
            <!-- delete todo tags -->
            <div class="field has-addons" v-if="selectedTodo.tags.length > 0">
                <div class="control is-expanded">
                    <div class="select is-fullwidth">
                        <select v-model="selectedTodoTagDelete">
                            <option v-for="tag in selectedTodo.tags" :key="tag.index" :value="tag">
                                {{ tag.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="control">
                    <button class="button is-danger" @click="deleteTodoTag">{{$t('delete')}}</button>
                </div>
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
            selectedTodoTag: {},
            selectedTodoTagDelete:{}
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

        tags: {
            type: Array,
            required: true,
        },
    },
    emits: ['toggle', 'add-todo-tag','delete-todo-tag'],
    methods: {
        toggleModal() {
            this.$emit('toggle')
        },
        deleteTodoTag(){
            this.$emit('delete-todo-tag',this.selectedTodoTagDelete)
        },
        addTodoTag() {
            this.$emit('add-todo-tag', this.selectedTodoTag)
        }
    }
}
</script>