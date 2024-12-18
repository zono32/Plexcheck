<script setup>

import { RouterLink, useRouter } from "vue-router"; // Importa useRouter
//import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
//const user = useUserStore();
const router = useRouter(); 
const visible = ref(true);

const logout = () => {
  //user.tokenData = null; 
  auth.token = null; 
  router.push("/login"); 
};

</script>

<template>
  <v-app-bar v-if="visible">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="visible = false"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Application Bar</v-app-bar-title>
    <div class="appTitle">Plexcheck</div>
    <v-btn class="item_nav_top">
      <RouterLink to="/">
        <v-icon>mdi-home</v-icon><br />
        <span>Home</span>
      </RouterLink>
    </v-btn>
    <v-btn class="item_nav_top">
      <RouterLink to="/vacaciones">
        <v-icon>mdi-calendar</v-icon><br />
        <span> Horarios </span>
      </RouterLink>
    </v-btn>

    <v-btn class="item_nav_top" @click="logout"
      ><p>
        <v-icon>mdi-account</v-icon><br />
        <span> Logout</span>
      </p>
    </v-btn>

  </v-app-bar>

  <v-bottom-navigation v-else class="navbar_movile">
    <v-btn class="item_nav">
      <RouterLink to="/">
        <v-icon>mdi-home</v-icon><br />
        <span>Home</span>
      </RouterLink>
    </v-btn>

    <v-btn class="item_nav" @click="visible = true">
      <v-icon></v-icon>
      <span>nav</span>
    </v-btn>

    <v-btn class="item_nav">
      <RouterLink to="/vacaciones">
        <v-icon>mdi-calendar</v-icon><br />
        <span> Horarios </span>
      </RouterLink>
    </v-btn>

    <v-btn class="item_nav" @click="logout"
      ><p>
        <v-icon>mdi-account</v-icon><br />
        <span> Logout</span>
      </p>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>

.appTitle{
  margin: auto;
  background-color: #003053;
}
a {
  text-decoration: none;
  color: inherit;
}
.navbar_movile {
  margin-top: 20px;
  background-color: #003053;
}
.item_nav {
  color: white;
  padding: 10px;
  width: 30%;
  display: flex;
  justify-content: end;
  font-weight: bold;
}
.item_nav :hover {
  color: #d3666b;
}

.item_nav_top{
  margin-right: 10px;
}
.item_nav_top :hover{
  color: #d3666b;
  font-size: 1.2 rem;
}


</style>    tengo esta codigo que es la cabecera con el navegador 