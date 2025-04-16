<template>
    <div class="register-container">
      <h2>Регистрация</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Имя пользователя:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">Электронная почта:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Пароль:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Подтвердите пароль:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        <p>
          Уже есть аккаунт? <router-link to="/login">Войти</router-link>
        </p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'; // Импортируем axios
  
  export default {
    name: 'Register',
    data() {
      return {
        username: '',
        email: '', // Добавлено поле email
        password: '',
        confirmPassword: '',
        errorMessage: '',
        successMessage: '',
        isLoading: false,
        // Укажите базовый URL вашего FastAPI сервера
        // Лучше вынести в переменные окружения (.env)
        apiBaseUrl: 'http://localhost:8000' // Замените на ваш URL, если отличается
      };
    },
    methods: {
      async handleRegister() {
        this.errorMessage = '';
        this.successMessage = '';
  
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Пароли не совпадают.';
          return;
        }
  
        this.isLoading = true;
  
        try {
          // Обратите внимание: ваше API /register принимает только username и password.
          // Поле email не отправляется, так как бэкенд его не ожидает.
          // Если бэкенд будет обновлен для приема email, добавьте его в объект ниже.
          const response = await axios.post(`${this.apiBaseUrl}/register`, {
            username: this.username,
            password: this.password
          });
  
          this.successMessage = response.data.message + ' Вы будете перенаправлены на страницу входа.';
          // Очистка формы
          this.username = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
  
          // Перенаправление на страницу входа через 3 секунды
          setTimeout(() => {
            this.$router.push('/login');
          }, 3000);
  
        } catch (error) {
          if (error.response && error.response.data && error.response.data.detail) {
            this.errorMessage = error.response.data.detail;
          } else {
            this.errorMessage = 'Ошибка регистрации. Попробуйте снова.';
          }
          console.error('Ошибка регистрации:', error);
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
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
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Учитывает padding и border в ширине */
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
  
  .success-message {
    color: #38a169;
    background-color: #c6f6d5;
    border: 1px solid #68d391;
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