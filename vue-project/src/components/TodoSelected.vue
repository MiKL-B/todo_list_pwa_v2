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
                    <input type="checkbox" v-model="selectedTodo.completed"  @click="markAsCompleted" :disabled="readonly" />
                    {{ $t('is_completed') }}
                </label>
            </div>
            <div class="field">
                <label class="checkbox">
                    <input type="checkbox" v-model="selectedTodo.priority" :disabled="readonly"
                        @click="markAsImportant" />
                    {{ $t('is_important') }}
                </label>
            </div>
            <label class="label" v-if="readonly == false">{{ $t('tags') }}</label>
            <div class="field has-addons" v-if="readonly == false">
                <div class="control is-expanded">
                    <div class="select is-fullwidth">
                        <select v-model="selectedTag">
                            <option v-for="tag in tags" :key="tag.index" :value="tag">{{ tag.name }}</option>  
                        </select>
                    </div>
                    <button class="button" @click="assignTag(selectedTag)">assign</button>
                </div>
            </div>
            <div class="cta" v-if="readonly == false">
                <button id="bt_save" class="button is-success" :disabled="selectedTodo.name == ''"
                    @click="saveTodo">{{ $t('save') }}</button>
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
    data(){
        return{
            selectedTag:{}
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
        tags:{
            type:Array,
            required:true,
        }
    },
    emits: ['toggle', 'save', 'important','completed','assign'],
    methods: {
        toggleModal() {
            this.$emit('toggle')
        },
        markAsImportant() {
            this.$emit('important', this.selectedTodo)
        },
        markAsCompleted(){
            this.$emit('completed',this.selectedTodo)
        },
        saveTodo() {
            this.$emit('save', this.selectedTodo)
        },
        assignTag(){
             this.$emit('assign',this.selectedTag,this.selectedTodo)
        },
    }
}
</script>