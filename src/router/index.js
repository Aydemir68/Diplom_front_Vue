import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import GardenPage from '../components/GardenPage.vue';
import ProfilePage from '../components/ProfilePage.vue';
import AboutPage from '../components/AboutPage.vue';
import Register from '../components/Register.vue'; // Импорт компонента
import Login from '../components/Login.vue';     // Импорт компонента

const routes = [
  {
    path: '/',
    redirect: '/home' // Перенаправление с корневого пути
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/garden',
    name: 'Garden',
    component: GardenPage
    // Можно добавить meta: { requiresAuth: true } для защищенных роутов
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
    // Можно добавить meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    // Включаем передачу props в компонент Login
    // Это позволит передать onLoginSuccess из App.vue, если структура позволяет
    // Однако, прямой передачи props из App.vue в компонент через <RouterView> таким образом нет.
    // Правильнее использовать provide/inject или state management (Pinia/Vuex).
    // В нашем случае Login сам вызовет onLoginSuccess, который был передан в <RouterView>
    // props: true // Эта строка здесь не нужна для передачи функции из App.vue
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  }
  // Другие ваши маршруты...
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // или createWebHashHistory()
  routes
});

// (Опционально) Навигационный страж для защищенных роутов
// router.beforeEach((to, from, next) => {
//   const isLoggedIn = !!localStorage.getItem('authToken');
//   if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
//     // Если роут требует аутентификации и пользователь не вошел, перенаправляем на логин
//     next({ name: 'Login' });
//   } else {
//     next(); // В противном случае продолжаем навигацию
//   }
//
// });

export default router;