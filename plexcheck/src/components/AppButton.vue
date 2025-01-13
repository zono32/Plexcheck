<script setup>
defineProps({
  title: String,
  disabled: Boolean,
  color: String,
  rounded: String, 
  style: Object
});

defineEmits(["click"]);
</script>
<template>
  <div>
    <v-btn :disabled="disabled" @click="disabled || $emit('click')" :text="title" :color="color" :rounded="rounded" :style="style"  />
  </div>
</template>
<style scoped></style>
