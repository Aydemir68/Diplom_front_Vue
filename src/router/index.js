import HomePage from '../components/HomePage.vue';
import ProfilePage from '../components/ProfilePage.vue';
import GardenPage from '../components/GardenPage.vue';
import Auth from '../components/Auth.vue';
import Register from '@/components/Register.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomePage },
    { path: '/garden', component: GardenPage },
    { path: '/profile', component: ProfilePage },
    { path: '/auth', component: Auth},
    { path: '/register', component: Register},
  ];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;