<script setup>
import AppNav from './components/AppNav.vue';
import { useDisplay } from "vuetify/lib/framework.mjs";

const { mobile } = useDisplay();
</script>

<template>
  <v-app>
    <AppNav/> 
    <v-main>     
    <div class="app_head" v-if="mobile">      
        <img src="/src/assets/logo_cropped.png" class="logo_plexus" alt="logo plexus">
    </div> 
    <RouterView/>  
  </v-main>
  </v-app> 
</template>

<style scoped>
a{
  text-decoration: none;
  color: inherit;
}
.app_head {
  display: flex;
  padding: 10px;  
  justify-content: space-between;
}
.logo_plexus{
  max-width: 150px; 
  height: auto; 
}
</style>
