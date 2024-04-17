<template>
    <!-- todo -->
    <div class="card card-todo mb-2 p-2">
        <div class="card-top">
            <div class="card-top-left">
                <span class="icon mx-1 is-size-5" :class="todo.colorState">
                    <i class="fa-regular fa-circle-check" :class="todo.iconState" @click="changeState"></i>
                </span>

                <div class="card-info ml-2">
                    <span class="priority" v-if="todo.priority == 1">
                        <i class="fa-solid fa-exclamation has-text-danger"></i>
                        <i class="fa-solid fa-exclamation has-text-danger"></i>
                    </span>
                    <span class="card-text">{{ todo.name }}</span>
                </div>
            </div>

            <div class=" is-size-5">
                <span class="icon mr-1">
                    <i class="fa-solid fa-info" @click="read"></i>
                </span>

                <span class="icon mx-1">
                    <i class="fa-solid fa-pen" @click="edit"></i>
                </span>
                <span class="icon has-text-danger ml-1">
                    <i class="fa-regular fa-trash-can" @click="deleteTodo"></i>
                </span>
            </div>
            
        </div>
        <div class="card-bottom" v-if="todo.tags.length > 0">
            <span v-for="tag in todo.tags" :key="tag.index" class="tag mx-1">
                <i :class="[tag.icon, tag.color]" ></i>
                <span>{{ tag.name }}</span>
                <button class="delete is-small" @click="deleteTodoTag(tag)"></button>
            </span>
        </div>
    </div>
    <!-- modal -->
    <Modal v-if="visible" @close="toggleModal">
        <template v-slot:content>
            <Field :name="$t('name')" v-model="selectedTodo.name" :disabled="readonly" />
            <Field :name="$t('description')" type="textarea" v-model="selectedTodo.description" :disabled="readonly" />
            <!-- <Field :name="$t('createddate')" v-if="readonly" v-model="selectedTodo.createdDate" :disabled="readonly" />
            <Field :name="$t('updateddate')" v-if="readonly" v-model="selectedTodo.updatedDate" :disabled="readonly" /> -->
            <!-- <Field :name="$t('deadlinedate')" type="date" v-model="selectedTodo.deadlineDate" @change="" :disabled="readonly" /> -->

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
            <div v-if="tags.length > 0">
                <label class="label" v-if="readonly == false">{{ $t('tags') }}</label>
                <div class="field has-addons" v-if="readonly == false">
                    <div class="control is-expanded has-icons-left">
                        <div class="select is-fullwidth">
                            <select v-model="selectedTag">
                                <option v-for="tag in tags" :key="tag.index" :value="tag">{{ tag.name }}</option>  
                            </select>
                        </div>
                        <div class="icon is-left">
                            <i :class="[selectedTag.icon, selectedTag.color]"></i>
                        </div>
                        <button class="button" @click="assignTag">assign</button>
                    </div>
                </div>
            </div>
            <div class="cta" v-if="readonly == false">
                <button id="bt_save" class="button is-success" :disabled="selectedTodo.name == ''"
                    @click="save">{{ $t('save') }}</button>
            </div>
        </template>
    </Modal>
</template>


<script>
import Modal from '@/components/Modal.vue';
import Field from '@/components/Field.vue';
import { readonly } from 'vue';
export default {
    name: "Todo",
    components: { Modal, Field },
    props: {
        todo: {
            type: Object,
            required: true,
        },
        selectedTodo: {
            type: Object,
            required: true,
        },
        tags:{
            type:Array,
            required:true,
        },
    },
    emits: [ 'read', 'edit', 'delete', 'change-state','delete-todo-tag','save', 'important','completed','assign'],
    data(){
        return{
            selectedTag:{},
            visible:false,
            readonly:false,
            selectedDate:"",
        }
    },
    methods: {
        read() {
            this.$emit('read', this.todo);
            this.visible = true;
            this.readonly = true;
        },
        edit() {
            this.$emit('edit', this.todo);
            this.visible = true;
            this.readonly = false;
        },
        deleteTodoTag(tag){
            this.$emit('delete-todo-tag',tag, this.todo)
        },
        deleteTodo() {
            this.$emit('delete', this.todo)
        },
        changeState() {
            this.$emit('change-state', this.todo)
        },
        toggleModal() {
            this.visible = !this.visible
        },
        markAsImportant() {
            this.$emit('important', this.selectedTodo)
        },
        markAsCompleted(){
            this.$emit('completed',this.selectedTodo)
        },
        save() {
            this.$emit('save', this.selectedTodo);
            this.visible = false;
        },
        assignTag(){
             this.$emit('assign',this.selectedTag,this.selectedTodo)
        },
    }
}
</script>


<style>
.card {
    display: flex;
    justify-content: space-between;

}

.card-todo {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto, 0.5fr);
}


.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.card-top-left {
    display: flex;
    align-items: center;
}

.card-bottom {
    display: flex;
    flex-wrap: wrap;
    gap:4px;
}

.card-info {
    width: 170px;
    padding: 1rem 0;
    display: flex;
    gap: 5px;
    white-space: nowrap;
}

.card-text {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis ;
}

.priority {
    display: flex;
    gap: 2px;
    align-items: center;
}
</style>