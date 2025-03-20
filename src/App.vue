<script>
import HomePage from './components/HomePage.vue';
import GardenPage from './components/GardenPage.vue';
import ProfilePage from './components/ProfilePage.vue';

export default {
  components: {
   HomePage,
   GardenPage,
   ProfilePage
  },
  data() {
  return {
    activeTab: '/home',
    items: [
      {
        label: 'Главная',
        icon: 'pi pi-home',
        link: '/home'
      },
      {
        label: 'Мой сад',
        icon: 'pi pi-microchip-ai',
        link: '/garden'
      },
      {
        label: 'Профиль',
        icon: 'pi pi-user',
        link: '/profile'
      },
      {
        label: 'Войти',
        icon: 'pi pi-user',
        link: '/auth'
      }
      ]
    };
  },
  methods: {
    updateTab(newTab) {
      console.log("Смена вкладки на:", newTab); 
      this.activeTab = newTab;
    },
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
      <router-link to="/profile" class="ml-8 mr-6">О нас</router-link>
    </nav>
    <button @click="$router.push('/auth')" class="auth bg-white text-xl">Войти</button>
    <button @click="$router.push('/register')" class="reg text-white text-lg p-2 mt-3 mb-3 ml-6 mr-6">Зарегистрироваться</button>
  </header>

  <RouterView />
</template>


<style>
* {
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  padding: 0;
}

header {
  background-color: #ffffff;
  border-bottom: 0.1rem solid #e5e7eb;
}

a {
  text-decoration: none !important;
  color: #656565 !important;
}

.router-link-active, .router-link-exact-active {
  color: #45a887 !important;
  font-weight: bold !important;
  border-bottom: 0.2rem solid #45a887 !important;
  text-decoration: none;
}

.router-link:hover {
  color: #45a887 !important;
  text-decoration: none !important;
}


.logo {
  height: 4.2rem;
}

.menu {
  color: #57cfa7;
  font-weight: bold;
}

.brand {
  color: #57cfa7;
  font-weight: bold;
}

.auth {
  border: none;
  color: #4fc29b;
  cursor: pointer;

}

.auth:hover {
  color: #3f9b7c;
  cursor: pointer;
}

.reg {
  background-color: #4fc29b;
  border-radius: 20px;
  border: none;
}

.reg:hover, .reg:active {
  background-color: #3f9b7c;
  border: none !important;
  cursor: pointer;
}



</style>
