<template>
    <div class="modal">
        <div class="content">
            <slot name="content"></slot>
            <button @click="close">close</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        close() {
            this.$emit("close");
        },
    },
}
</script>

<style>
.modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.content{
    background:white;
}
</style>