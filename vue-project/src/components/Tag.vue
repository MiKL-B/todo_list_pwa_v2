<template>
    <!-- tag -->
    <div class="card mb-2 p-2">
        <div class="card-left">
            <span class="icon mx-1 is-size-5" :class="tag.color">
                <i :class="tag.icon"></i>
            </span>

            <div class="card-info ml-2">
                <span class="card-text">{{ tag.name }}</span>
            </div>
        </div>
        <div class="card-right is-size-5">
            <span class="icon mr-1">
                <i class="fa-solid fa-info" @click="read"></i>
            </span>
            <span class="icon mx-1">
                <i class="fa-solid fa-pen" @click="edit"></i>
            </span>
            <span class="icon has-text-danger ml-1">
                <i class="fa-regular fa-trash-can" @click="deleteTag"></i>
            </span>
        </div>
    </div>
    <!-- modal -->
    <Modal v-if="visible" @close="toggleModal">
        <template v-slot:content>
            <Field :name="$t('name')" v-model="selectedTag.name" :disabled="readonly" />
            <Field :name="$t('createddate')" v-if="readonly" v-model="selectedTag.createdDate" :disabled="readonly" />
            <Field :name="$t('updateddate')" v-if="readonly" v-model="selectedTag.updatedDate" :disabled="readonly" />
            <label class="label" v-if="readonly == false">{{ $t('color') }}</label>
            <div class="field has-addons" v-if="readonly == false">
                <div class="control is-expanded has-icons-left">
                    <div class="select is-fullwidth">
                        <select v-model="selectedTag.color">
                            <option value="primary">{{ $t('blue') }}</option>
                            <option value="success">{{ $t('green') }}</option>
                            <option value="warning">{{ $t('yellow') }}</option>
                            <option value="danger">{{ $t('red') }}</option>
                            <option value="epic">{{ $t('purple') }}</option>
                            <option value="legendary">{{ $t('orange') }}</option>
                            <option value="pink">{{ $t('pink') }}</option>
                        </select>
                    </div>
                    <div class="icon is-left">
                        <i class="fa-solid fa-square" :class="selectedTag.color"></i>
                    </div>
                </div>
            </div>
            <label class="label" v-if="readonly == false">{{ $t('icon') }}</label>
            <div class="field has-addons" v-if="readonly == false">
                <div class="control is-expanded has-icons-left">
                    <div class="select is-fullwidth">
                        <select v-model="selectedTag.icon">
                            <option value="fa-solid fa-tag">{{ $t('tag') }}</option>
                            <option value="fa-solid fa-phone">{{ $t('phone') }}</option>
                            <option value="fa-solid fa-mug-saucer">{{ $t('coffee_time') }}</option>
                            <option value="fa-solid fa-users">{{ $t('meeting') }}</option>
                            <option value="fa-solid fa-lock">{{ $t('personal') }}</option>
                            <option value="fa-solid fa-screwdriver-wrench">{{ $t('tools') }}</option>
                            <option value="fa-solid fa-utensils">{{ $t('cook') }}</option>
                            <option value="fa-solid fa-envelope">{{ $t('envelope') }}</option>
                            <option value="fa-solid fa-poo">{{ $t('poo') }}</option>
                            <option value="fa-solid fa-plane">{{ $t('travel') }}</option>
                        </select>
                    </div>
                    <div class="icon is-left">
                        <i :class="selectedTag.icon"></i>
                    </div>
                </div>
            </div>
            <div class="cta" v-if="readonly == false">
                <button id="bt_save" class="button is-success" :disabled="selectedTag.name == ''" @click="save">{{
                    $t('save') }}</button>
            </div>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import Field from '@/components/Field.vue';

export default {
    name: "TagItem",
    components: { Modal, Field },
    props: {
        tag:{
            type: Object,
            required: true,
        },
        selectedTag:{
            type:Object,
            required:true,
        },
    },
    emits: ['read', 'edit', 'delete','save'],
    data(){
        return{
            visible:false,
            readonly:false,
        }
    },
    methods: {
        read() {
            this.$emit('read', this.tag);
            this.visible = true;
            this.readonly = true;
        },
        edit() {
            this.$emit('edit', this.tag)
            this.visible = true;
            this.readonly = false;
        },
        deleteTag() {
            this.$emit('delete', this.tag)
        },
        toggleModal() {
            this.visible = !this.visible
        },
        save() {
            this.$emit('save',this.selectedTag);
            this.visible = false;
        },
    }
}
</script>

<style scoped>
.card-left,
.card-right {
    display: flex;
    align-items: center;
}
</style>