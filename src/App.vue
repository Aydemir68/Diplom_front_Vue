<script>
import HomePage from './components/HomePage.vue';
import GardenPage from './components/GardenPage.vue';
import ProfilePage from './components/ProfilePage.vue';
import AboutPage from './components/AboutPage.vue';
import axios from 'axios'; // Импортируем axios для запроса /users/me

export default {
  components: {
   HomePage,
   GardenPage,
   ProfilePage
  },
  data() {
    return {
      isLoggedIn: false, // Состояние для отслеживания входа
      username: '',      // Новое состояние для хранения имени пользователя
      apiBaseUrl: 'http://localhost:8000' // Убедитесь, что URL правильный
    };
  },
  methods: {
    // Метод для получения данных пользователя по токену
    async fetchUserData() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.isLoggedIn = false;
        this.username = '';
        return; // Выходим, если токена нет
      }

      try {
        const response = await axios.get(`${this.apiBaseUrl}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}` // Отправляем токен в заголовке
          }
        });
        // Успешно получили данные пользователя
        this.username = response.data.username;
        this.isLoggedIn = true;
        console.log("Имя пользователя получено:", this.username);
      } catch (error) {
        // Ошибка при получении данных (токен невалиден, истек или сервер недоступен)
        console.error('Ошибка при получении данных пользователя:', error);
        // Считаем пользователя неавторизованным, если токен не работает
        this.logout(); // Вызываем logout, чтобы очистить состояние и токен
      }
    },

    // Метод для обновления состояния при успешном входе (вызывается из Login.vue)
    async handleLoginSuccess() {
      // Сразу после логина получаем данные пользователя
      await this.fetchUserData();
    },

    // Метод для выхода пользователя
    logout() {
      localStorage.removeItem('authToken'); // Удаляем токен
      this.isLoggedIn = false; // Обновляем состояние
      this.username = '';      // Сбрасываем имя пользователя
      if (this.$route.meta.requiresAuth || this.$route.path !== '/login') {
          // Перенаправляем на страницу входа, если мы не там или были на защищенной
          this.$router.push('/login');
      }
    },

    // Проверка наличия токена и получение данных пользователя при загрузке приложения
    checkAuthStatus() {
       // Вместо простой проверки наличия токена, сразу пытаемся получить данные
       this.fetchUserData();
    }
  },
  // Вызываем проверку статуса аутентификации при монтировании компонента
  mounted() {
    this.checkAuthStatus();
  },
  watch: {
    // Следим за изменениями маршрута, чтобы обновлять статус, если нужно
    // '$route'(to, from) {
       // Например, если пользователь перешел на страницу, требующую входа,
       // а токен устарел, fetchUserData при проверке это обнаружит.
       // this.checkAuthStatus(); // Можно проверять при каждой смене роута
    // }
  }
};
</script>

<template>
  <header class="flex items-center justify-between bg-white">
    <div class="flex items-center">
      <img src="/Logo1.png" alt="Logo" class="logo ml-4" />
      <div class="brand flex items-center text-2xl ml-2 mt-4">AiCадовод</div>
    </div>

    <nav class="menu flex items-center text-xl ml-auto mt-4">
      <router-link to="/home">Главная</router-link>
      <router-link to="/garden" class="ml-8">Мой сад</router-link>
      <router-link to="/about" class="ml-8 mr-6">О нас</router-link>
    </nav>

    <div class="auth-buttons flex items-center mt-3 mb-3 ml-6 mr-6">
      <template v-if="!isLoggedIn">
        <button @click="$router.push('/login')" class="auth bg-white text-xl mr-4">Войти</button>
        <button @click="$router.push('/register')" class="reg text-white text-lg p-2">Зарегистрироваться</button>
      </template>
      <template v-else>
        <span class="username mr-4 text-gray-700 text-xl mr-6">
          {{ username }}
        </span>
        <button @click="logout" class="logout-btn text-white text-lg p-2">Выйти</button>
      </template>
    </div>
  </header>

  <RouterView v-slot="{ Component }">
      <component :is="Component" :onLoginSuccess="handleLoginSuccess" />
  </RouterView>

</template>


<style>
/* Стили из предыдущего ответа остаются актуальными */
* {
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

header {
  background-color: #ffffff;
  border-bottom: 0.1rem solid #e5e7eb;
  padding: 0.5rem 0;
}

a {
  text-decoration: none !important;
  color: #656565 !important;
  padding-bottom: 5px;
  border-bottom: 0.2rem solid transparent !important;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.router-link-active, .router-link-exact-active {
  color: #45a887 !important;
  font-weight: bold !important;
  border-bottom-color: #45a887 !important;
  text-decoration: none;
}

nav a:hover {
  color: #45a887 !important;
  text-decoration: none !important;
  border-bottom-color: #45a887 !important;
}


.logo {
  height: 4.2rem;
}

.menu {
  font-weight: bold;
}

.brand {
  color: #57cfa7;
  font-weight: bold;
}

.auth-buttons {
    align-items: center; /* Выравниваем элементы по центру вертикально */
}

.auth {
  border: none;
  color: #4fc29b;
  cursor: pointer;
  background: none;
  padding: 0.5rem 0;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.auth:hover {
  color: #3f9b7c;
}

.reg, .logout-btn {
  background-color: #4fc29b;
  border-radius: 20px;
  border: none;
  color: white !important;
  padding: 8px 18px !important;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  line-height: 1.5;
}

.reg:hover, .reg:active,
.logout-btn:hover, .logout-btn:active {
  background-color: #3f9b7c;
  border: none !important;
}

.auth-buttons button {
    margin: 0;
}
.auth-buttons .auth {
    margin-right: 1rem;
}

.username {
  color: #374151; 
}

</style>