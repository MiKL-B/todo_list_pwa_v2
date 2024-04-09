<template>
    <Modal v-if="visible" @close="toggleModalTag">
        <template v-slot:content>
            <Field :name="$t('name')" v-model="selectedTag.name" :disabled="readonly" />
            <Field :name="$t('createddate')" v-if="readonly" v-model="selectedTag.createdDate" :disabled="readonly" />
            <Field :name="$t('updateddate')" v-if="readonly" v-model="selectedTag.updatedDate" :disabled="readonly" />
            <label class="label" v-if="readonly == false">{{ $t('color') }}</label>
            <div class="field has-addons" v-if="readonly == false">
                <div class="control is-expanded">
                    <div class="select is-fullwidth">
                        <select v-model="selectedTag.color">
                            <option value="primary">{{ $t('blue') }}</option>
                            <option value="success">{{ $t('green') }}</option>
                            <option value="warning">{{ $t('yellow') }}</option>
                            <option value="danger">{{ $t('red') }}</option>
                            <option value="epic">{{ $t('purple') }}</option>
                            <option value="legendary">{{ $t('orange') }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="cta" v-if="readonly == false">
                <button id="bt_save" class="button is-success" :disabled="selectedTag.name == ''"
                    @click="saveTag(selectedTag.index, selectedTag)">{{ $t('save') }}</button>
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
        selectedTag: {
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
    emits: ['toggle', 'save', 'add-tag-color'],
    methods: {
        toggleModalTag() {
            this.$emit('toggle')
        },
        saveTag(index,tag) {
            this.$emit('save',[index,tag])
        },
    }
}
</script>