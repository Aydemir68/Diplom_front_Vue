<template>
    <div class="login-container">
      <h2>Вход</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Имя пользователя:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Пароль:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Вход...' : 'Войти' }}
        </button>
         <p>
          Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
        </p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Login',
    // Принимаем функцию onLoginSuccess от родителя (App.vue)
    props: {
      onLoginSuccess: Function
    },
    data() {
      return {
        username: '',
        password: '',
        errorMessage: '',
        isLoading: false,
        apiBaseUrl: 'https://unbearably-decorous-airedale.cloudpub.ru' // Замените на ваш URL
      };
    },
    methods: {
      async handleLogin() {
        this.errorMessage = '';
        this.isLoading = true;
  
        // FastAPI OAuth2PasswordRequestForm ожидает данные в формате form-data
        const formData = new URLSearchParams();
        formData.append('username', this.username);
        formData.append('password', this.password);
  
        try {
          const response = await axios.post(`${this.apiBaseUrl}/token`, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
  
          const token = response.data.access_token;
          // Сохраняем токен в localStorage
          localStorage.setItem('authToken', token);
  
          // Сообщаем App.vue об успешном входе
          if (this.onLoginSuccess) {
            this.onLoginSuccess();
          }
  
          // Перенаправляем на главную страницу или профиль
          this.$router.push('/home');
  
        } catch (error) {
          if (error.response && error.response.data && error.response.data.detail) {
            this.errorMessage = error.response.data.detail;
          } else {
            this.errorMessage = 'Ошибка входа. Проверьте имя пользователя и пароль.';
          }
          console.error('Ошибка входа:', error);
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Стили те же, что и для Register.vue, можно вынести в общий файл */
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1rem;
  }
  
  input:focus {
    outline: none;
    border-color: #45a887;
    box-shadow: 0 0 0 2px rgba(69, 168, 135, 0.2);
  }
  
  
  button {
    width: 100%;
    padding: 12px;
    background-color: #4fc29b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  button:hover:not(:disabled) {
    background-color: #3f9b7c;
  }
  
  button:disabled {
    background-color: #a0d8c6;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #e53e3e;
    background-color: #fed7d7;
    border: 1px solid #f56565;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    text-align: center;
  }
  
  p {
      margin-top: 15px;
      text-align: center;
      color: #555;
  }
  p a {
      color: #45a887 !important;
      text-decoration: underline !important;
      font-weight: bold;
  }
  p a:hover {
      color: #3f9b7c !important;
  }
  </style>