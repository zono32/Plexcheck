<script setup>
import { ref, watch} from "vue";
const props = defineProps({
    modelValue: Boolean,
    label: String,  
});
const emit = defineEmits(['update:modelValue']);
const model = ref(props.modelValue);
watch(model, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>

<template>
  <v-switch v-model="model" :label="label"   color="success"></v-switch>
</template>

<style scoped></style>
