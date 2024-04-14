<template>
    <Modal v-if="visible" @close="toggleModalTag">
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
                <button id="bt_save" class="button is-success" :disabled="selectedTag.name == ''"
                    @click="saveTag">{{ $t('save') }}</button>
            </div>
        </template>
    </Modal>

</template>

<script>
import Modal from '@/components/Modal.vue';
import Field from '@/components/Field.vue';
export default {
    name: "TagSelected",
    components: {
        Modal, Field
    },
    data() {
        return {
        
        }
    },
    props: {
        selectedTag:{
            type:Object,
            required:true,
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
    emits: ['toggle', 'save', 'add-tag-color'],
    methods: {
        toggleModalTag() {
            this.$emit('toggle')
        },
        saveTag() {
            this.$emit('save',this.selectedTag)
        },
    }
}
</script>