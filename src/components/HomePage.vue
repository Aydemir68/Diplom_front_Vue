<template>
  <div>
   <main class="p-8">
     <div class="main-content flex items-center justify-between">
       <div class="text-upload flex-1 mr-8">
         <h1 class="menu text-3xl font-bold mb-4">Защитите свой сад с помощью ИИ!</h1>
         <p class="text-gray-700 mb-6">
           Отправьте данные об изображении и получите прогнозы и советы по защите своего сада на новом уровне.
         </p>

         <div 
           class="upload-section border-dashed border-2 border-gray-300 border-round-2xl p-6 text-center"
           @drop="handleDrop"
           @dragover="handleDragOver"
           @dragenter="handleDragEnter"
           @dragleave="handleDragLeave"
           :class="{ 'drag-over': isDragOver }"
         >
           <p class="text-gray-500 text-xl mb-4 mt-8">Перетащите изображение</p>
           <input
             type="file"
             accept="image/*"
             class="file-input hidden"
             @change="handleFileUpload"
           />
           <button class="px-4 py-2 text-white border-round border-none" @click="triggerFileInput">
             Загрузить изображение
           </button>
         </div>
       </div>

       <div class="image-section flex-1 flex flex-col items-center">
         <div v-if="imageUrl" class="image-wrapper relative">
           <img :src="imageUrl" alt="uploaded_image" class="upload-image border-round-2xl" />
           <div v-if="loading" class="loading-overlay absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
             <div class="loader"></div>
             <p class="text-gray-700 mt-2">Анализ изображения...</p>
           </div>
         </div>
         <img v-else src="/Main_Image.png" alt="main_image" class="main-image" />
         
         <div v-if="result" class="result mt-4 p-4 border border-gray-300 rounded text-center w-full">
           <p class="font-bold">Результат:</p>
           <p>{{ result }}</p>
         </div>
       </div>
     </div>
   </main>
 </div>
</template>

<script>
export default {
 data() {
   return {
     imageUrl: null,
     result: null,
     loading: false,
     isDragOver: false,
   };
 },
 methods: {
   triggerFileInput() {
     this.$el.querySelector(".file-input").click();
   },
   async handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    this.imageUrl = URL.createObjectURL(file);
    this.result = null;
    this.loading = true;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://unbearably-decorous-airedale.cloudpub.ru/predict", {
        method: "POST",
        body: formData,
      });

      console.log("RAW Response:", await response.clone().text()); // Логируем ответ сервера

      if (!response.ok) {
        throw new Error("Ошибка ответа сервера");
      }

      const data = await response.json();
      console.log("Parsed Response:", data);

      this.result = `${data.diagnosis} с вероятностью ${data.confidence}%. ${data.treatment ? "Возможное лечение: " + data.treatment : "Лечение не требуется."}`;
    } catch (error) {
      console.error("Ошибка при отправке файла:", error);
      this.result = "Ошибка при обработке изображения.";
    } finally {
      this.loading = false;
    }
  }
  },
  handleDrop(event) {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer.files[0];
    if (file) {
      this.handleFileUpload({ target: { files: [file] } });
    }
  },
  handleDragOver(event) {
    event.preventDefault();
    this.isDragOver = true;
  },
  handleDragEnter(event) {
    event.preventDefault();
    this.isDragOver = true;
  },
  handleDragLeave(event) {
    event.preventDefault();
    this.isDragOver = false;
  },
 },
};
</script>

<style scoped>
button {
 background-color: #57cfa7;
 font-size: medium;
}

button:hover {
 background-color: #3d9477;
}

.menu {
 color: #57cfa7;
 font-weight: bold;
}

.main-content {
 display: flex;
 align-items: flex-start;
 gap: 2rem;
}

.image-section {
 flex: 1;
 display: flex;
 flex-direction: column;
 align-items: center;
}

.main-image {
 max-width: 100%;
 height: auto;
 border-radius: 1rem;
}

.upload-section {
 height: 30rem;
}

.upload-section.drag-over {
 border-color: #57cfa7;
 background-color: rgba(87, 207, 167, 0.1);
}

.loading-overlay {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
}

.loader {
 width: 40px;
 height: 40px;
 border: 5px solid #57cfa7;
 border-top-color: transparent;
 border-radius: 50%;
 animation: spin 1s linear infinite;
}

.result {
  font-size: x-large;
  border: 2px solid;
  border-radius: 8px;
  padding: 1rem;
}

.upload-image {
  height: 24rem;
}

@keyframes spin {
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
}
</style>
