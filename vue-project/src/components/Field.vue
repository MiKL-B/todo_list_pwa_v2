<template>
    <div class="field">
        <label class="label">{{ name }}</label>
        <div class="control">
            <input class="input" type="text" placeholder="Text input"  />
            <!-- v-model="selectedTodo.name" -->
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
        }
    }
}
</script>