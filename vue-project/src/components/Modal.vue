<template>
    <div class="modal ">
        <div class="card">
            <div class="card-content">
                <div class="modal-header">
                    <span class="icon">
                        <i class="fa-regular fa-circle-xmark is-size-4" @click="close"></i>
                    </span>
                </div>
                <slot name="content"></slot>
            </div>
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

.modal-header {
    display: flex;
    justify-content: flex-end;
}

</style>