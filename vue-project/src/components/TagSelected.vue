<template>
    <Modal v-if="visible" @close="toggleModalTag">
        <template v-slot:content>
            <Field name="Name" v-model="selectedTag.name" :disabled="readonly" />
            <Field name="Created date" v-if="readonly" v-model="selectedTag.createdDate" :disabled="readonly" />
            <Field name="Updated date" v-if="readonly" v-model="selectedTag.updatedDate" :disabled="readonly" />
            <label class="label" v-if="readonly == false">Color</label>
            <div class="field has-addons" v-if="readonly == false">
                <div class="control is-expanded">
                    <div class="select is-fullwidth">
                        <select v-model="selectedTag.color">
                            <option value="has-text-info">Blue</option>
                            <option value="has-text-success">Green</option>
                            <option value="has-text-warning">Yellow</option>
                            <option value="has-text-danger">Red</option>
                        </select>
                    </div>
                </div>
                <div class="control">
                    <!-- <button class="button is-info" @click="addTagColor">Add</button> -->
                </div>
            </div>
            <div class="cta" v-if="readonly == false">
                <button id="bt_save" class="button is-success" :disabled="selectedTag.name == ''"
                    @click="saveTag(selectedTag.index, selectedTag)">Save</button>
            </div>
            <!-- {{ selectedColor }} -->
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
            // selectedColor: ""
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
        // addTagColor() {
        //     this.$emit('add-tag-color', this.selectedColor)
        // }
    }
}
</script>