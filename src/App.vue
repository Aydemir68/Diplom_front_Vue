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
      <router-link to="/profile" class="ml-8 mr-6">Профиль</router-link>
    </nav>
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
  color: #57cfa7 !important;
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


</style>
