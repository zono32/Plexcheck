import { createWebHistory, createRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import HollidaysView from './views/HollidaysView.vue';

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', name: 'home', component: HomeView },  
  { path: '/vacaciones', name: 'vacaciones', component: HollidaysView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (!auth.isTokenValid() && to.name !== "login") {
    next({ name: "login" }); 
  } else if (auth.isTokenValid() && to.name === "login") {
    next({ name: "home" }); 
  } else {
    next(); 
  }
});

export default router;
