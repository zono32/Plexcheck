<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useDisplay } from "vuetify/lib/framework.mjs";

const auth = useAuthStore();
const router = useRouter();
const { mobile } = useDisplay();

const logout = () => {
  auth.clearTokens();
  router.push("/login");
};
</script>

<template>
  <v-app-bar v-if="!mobile">
    <div class="app-bar-content">
      <div class="content_logo_plexus">
        <img
          src="/src/assets/logo_cropped.png"
          class="logo_plexus"
          alt="logo plexus"
        />
      </div>

      <div class="appTitle">Plexcheck</div>

      <div class="content_items_top">
        <v-btn class="item_nav_top">
          <RouterLink to="/">
            <v-icon>mdi-home</v-icon><br />
            <span>Home</span>
          </RouterLink>
        </v-btn>

        <v-btn class="item_nav_top">
          <RouterLink to="/vacaciones">
            <v-icon>mdi-calendar</v-icon><br />
            <span>Horarios</span>
          </RouterLink>
        </v-btn>

        <v-btn class="item_nav_top" @click="logout">
          <div>
            <v-icon>mdi-account</v-icon><br />
            <span>Logout</span>
          </div>
        </v-btn>
      </div>
    </div>
  </v-app-bar>

  <!-- Bottom Navigation para móviles -->
  <v-bottom-navigation v-if="mobile" class="navbar_movile">
    <v-btn class="item_nav">
      <RouterLink to="/">
        <v-icon>mdi-home</v-icon><br />
        <span>Home</span>
      </RouterLink>
    </v-btn>
    <v-btn class="item_nav">
      <RouterLink to="/vacaciones">
        <v-icon>mdi-calendar</v-icon><br />
        <span>Horarios</span>
      </RouterLink>
    </v-btn>
    <v-btn class="item_nav" @click="logout">
      <div>
        <v-icon>mdi-account</v-icon><br />
        <span>Logout</span>
      </div>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}

.app-bar-content {
  display: flex;
  align-items: center; /* Alinear verticalmente */
  width: 100%;
  padding: 0 16px; /* Espaciado horizontal */
  justify-content: space-between;
  position: relative;
}

.content_logo_plexus {
  flex: 0 0 auto;
}

.logo_plexus {
  max-width: 150px;
  height: auto;
}

.appTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #003053;
  font-size: 1.5rem;
}

.content_items_top {
  display: flex;
  gap: 20px;
}


.item_nav_top {
  color: #003053;
  text-align: center;
}

.item_nav_top :hover {
  color: #d3666b;
}

.navbar_movile {
  background-color: #003053;
}

.item_nav {
  color: white;
  font-size: 0.8rem;
  text-align: center;
}

.item_nav :hover {
  color: #d3666b;
}
</style>
