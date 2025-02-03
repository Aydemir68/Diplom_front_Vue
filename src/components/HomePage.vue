<template>
  <div>

    <!-- Main Content -->
    <main class="p-8">
      <div class="main-content flex items-center justify-between">
        <!-- Text and Upload Section -->
        <div class="text-upload flex-1 mr-8">
          <h1 class="menu text-3xl font-bold mb-4">Защитите свой сад с помощью ИИ!</h1>
          <p class="text-gray-700 mb-6">
            Отправьте данные об изображении и получите прогнозы и советы по защите своего сада на новом уровне.
          </p>

          <!-- Upload Section -->
          <div class="upload-section border-dashed border-2 border-gray-300 border-round-2xl p-6 text-center">
            <p class="text-gray-500 mb-4 mt-8">Перетащите изображение</p>
            <input
              type="file"
              accept="image/*"
              class="file-input hidden"
              @change="handleFileUpload"
            />
            <button
              class="px-4 py-2 text-white border-round border-none"
              @click="triggerFileInput"
            >
              Загрузить изображение
            </button>
          </div>
        </div>

        <!-- Image Section -->
        <div class="image-section flex-1 flex justify-center">
          <img src="/Main_Image.png" alt="main_image" class="main-image" />
        </div>
      </div>
    </main>
  </div>
</template>


<script>
export default {
  methods: {
    triggerFileInput() {
      this.$el.querySelector(".file-input").click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log("File selected:", file);
        // Add file upload logic here
      }
    },
  },
};
</script>

<style scoped>
header {
  background-color: #ffffff;
  border-bottom: 0.1rem solid #e5e7eb;
}

button {
  background-color: #57cfa7;
}

button:hover {
  background-color: #3d9477;
}


router-link:hover{
  color: #45a887;
  border-bottom: 0.2rem solid #45a887;
}

router-link:active{
  color: #45a887;
  border-bottom: 0.2rem solid #45a887;
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

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.text-upload {
  flex: 1;
}

.image-section {
  flex: 1;
}

.main-image {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
}
.upload-section {
  height: 20rem;
}
</style>
