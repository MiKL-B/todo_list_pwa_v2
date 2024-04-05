<template>
    <div class="field">
        <label class="label">{{ name }}</label>
        <div class="control">
            <div v-if="type == 'text'">
                <textarea id="todo-description" class="textarea has-fixed-size" :value="modelValue" @input="onInput"
              placeholder="Fixed size textarea" :disabled="disabled" ></textarea>
            </div>
            <div v-else>
                <input :value="modelValue" @input="onInput" class="input" type="text" :placeholder="'Enter ' + name"
                :disabled="disabled" />
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: "Field",
    props:{
        name:{
            type:String,
            required:true,
        },
        modelValue: {
            type: String,
            required: false,
        },
        disabled:{
            type:Boolean,
            required:false,
            default:false,
        },
        type:{
            type:String,
            required:false,
            default:''
        }
    },
    methods:{
        onInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>