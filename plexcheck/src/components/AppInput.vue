<script setup>
const model = defineModel();
const props = defineProps({
  label: String,
  placeholder: String,
  required: Boolean,
  type: {
    type: String,
    default: "Text",
  },
});
const rules = {
  required: props.required
    ? (value) => !!value || "Este campo es requerido"
    : () => true,
};
</script>
<template>
  <div class="app-input-content">
    <v-text-field
      v-model="model"
      :type="type"
      :label="label"
      :placeholder="placeholder"
      :rules="[rules.required]"
      variant="outlined"
    />
  </div>
</template>
<style scoped>
.app-input-content {
  width: 90%;
  padding: 0.8em;
  margin: auto;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .app-input-content {
    max-width: 100%;
  }
}
</style>
