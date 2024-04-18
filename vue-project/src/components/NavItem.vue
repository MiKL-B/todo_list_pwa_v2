<template>
    <li @click="action" >
        <a>
            <span class="icon">
                <i :class="class"></i>
            </span>
            <span>{{ name }}</span>
        </a>
    </li>

</template>

<script>
export default {
    name: "NavItem",
    props:['name','class'],
    emits:['action'],
    methods:{
        action(value){
            this.$emit('action',value)
        }
    }
}
</script>