<template>
 <div class="notification is-success">
    <button class="delete"></button>
    <slot name="content"></slot>
  </div>

</template>

<script>
export default {
    name:"Notification"
}

</script>

<style>
.notification{
    position: absolute;
    bottom:0;
    left:0;
    right:0;
    margin: 0.5rem;
}
</style>