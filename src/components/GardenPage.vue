<template>
  <div class="garden-page p-4">


    <div class="actions flex gap-4 mb-4">
      <button class="add-garden-btn px-4 py-2 text-white border-none border-round" @click="addGarden">
        Добавить сад
      </button>
      <button class="delete-selected-btn px-4 py-2 text-white border-none border-round" @click="deleteSelectedGardens" :disabled="!selectedGardens.length">
        Удалить выбранные
      </button>
    </div>

    <div v-for="garden in gardens" :key="garden.id" class="garden border p-4 mt-4 rounded" :class="{ 'selected': selectedGardens.includes(garden.id) }">
      <div class="garden-header flex justify-between items-center">
        <div>
          <input v-model="garden.name" class="garden-name font-bold text-xl border-none" @input="saveToLocalStorage" :disabled="garden.isAnalyzing"/>
          <input v-model="garden.location" class="garden-location text-gray-600 ml-2 border-none" @input="saveToLocalStorage" :disabled="garden.isAnalyzing"/>
        </div>
        <div class="actions flex gap-2">
          <input type="checkbox" class="ml-1 mr-1" v-model="selectedGardens" :value="garden.id" :disabled="garden.isAnalyzing" />
          <button class="delete-btn text-red-600 border-none ml-2" @click.stop="deleteGarden(garden.id)" :disabled="garden.isAnalyzing">🗑</button>
          <button v-if="!garden.saved" class="save-btn px-4 py-2 text-white border-none border-round" @click="saveGarden(garden.id)" :disabled="garden.isAnalyzing">
            Сохранить
          </button>
          <span v-if="garden.saved" @click="!garden.isAnalyzing && toggleGarden(garden.id)" class="toggle-arrow" :class="{'opacity-50 cursor-not-allowed': garden.isAnalyzing}">{{ garden.expanded ? '▼' : '▶' }}</span>
        </div>
      </div>

      <div v-if="garden.expanded && garden.saved" class="garden-content mt-4 relative"> 

        <div v-if="garden.isAnalyzing" class="loading-overlay absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded z-10">
          <div class="loader"></div>
          <p class="text-gray-700 mt-2 font-semibold">Анализ изображений...</p>
        </div>

        <div class="image-upload border-dashed border-2 border-gray-300 p-4 text-center mb-4">
          <input type="file" accept="image/*" multiple class="hidden" :ref="'fileInput' + garden.id" @change="uploadImages($event, garden.id)" :disabled="garden.isAnalyzing" />
          <button class="load-button px-4 py-2 text-white border-round border-none" @click="!garden.isAnalyzing && triggerFileInput(garden.id)" :disabled="garden.isAnalyzing">
            Загрузить изображение
          </button>
        </div>

        <template v-if="garden.images.length > 0">
          <div class="image-gallery mt-4 flex overflow-x-auto pb-2">
            <div v-for="(image, index) in garden.images" :key="index" class="image-wrapper mr-2 relative flex-shrink-0" :class="{'selected-image': image.selected}">
              <img
                :src="image.src"
                alt="Загруженное изображение"
                class="uploaded-image border-round-xl block"
                @click="!garden.isAnalyzing && toggleSelection(image)"
                :class="{'cursor-pointer': !garden.isAnalyzing, 'cursor-not-allowed opacity-75': garden.isAnalyzing}"
              />
              <div v-if="image.selected" class="checkmark absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">✔</div>
            </div>
          </div>

  
          <div> 
            <div class="actions mt-4">
              <button
                class="analyze-selected-btn px-4 py-2 text-white border-none border-round"
                @click="analyzeSelected(garden.id)"
                :disabled="!garden.images.some(img => img.selected) || garden.isAnalyzing"
              >
                Анализировать выбранное
                <span v-if="garden.isAnalyzing" class="ml-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              </button>
            </div>

            <div class="stats mt-4 p-4 border rounded">
              <p class="font-bold">Общая статистика сада:</p>

              <div v-if="Object.keys(garden.stats).length > 0">
                <p v-for="(count, diagnosis) in garden.stats" :key="diagnosis" class="capitalize">
                  {{ formatDiagnosisName(diagnosis) }}: {{ count }}
                </p>
                <hr class="my-2">
                <p><strong>Итого здоровых: {{ calculateTotalHealthy(garden.stats) }}</strong></p>
                <p><strong>Итого больных: {{ calculateTotalDiseased(garden.stats) }}</strong></p>
              </div>
              <p v-if="Object.keys(garden.stats).length <= 0" class="text-gray-500">Статистика пока отсутствует. Проанализируйте изображения.</p>
            </div>
          </div>
        </template>
        <p v-else class="text-gray-500 mt-4">Загрузите изображения для анализа.</p>

      </div> 
    </div> 
  </div>
</template>

<script>
export default {
  data() {
    return {
      gardens: [],
      selectedGardens: [], // Для выбора самих садов (для удаления)
    };
  },
  computed: {
    // Вычисляемые свойства для подсчета итогов
    calculateTotalHealthy() {
       // Используем точное имя из маппинга бэкенда
      const healthyName = "Здоровое яблоко";
      return (stats) => stats[healthyName] || 0;
    },
    calculateTotalDiseased() {
       // Используем точное имя из маппинга бэкенда
       const healthyName = "Здоровое яблоко";
      return (stats) => {
        return Object.entries(stats).reduce((total, [diagnosis, count]) => {
          // Суммируем все, кроме здоровых и ошибок/ненайденных
          if (diagnosis !== healthyName && diagnosis !== 'Ошибка анализа' && diagnosis !== 'Файл не найден') {
             return total + count;
          }
          return total;
        }, 0);
      };
    }
  },
  created() {
    this.loadFromLocalStorage();
  },
  methods: {
     formatDiagnosisName(diagnosis) {
      // Простая функция для форматирования ключей статистики
      return diagnosis.replace(/_/g, ' ').replace(/ \([\w\s]+\)$/, ''); // Убираем ключ в скобках, если он есть
    },
    addGarden() {
      const newGarden = {
        id: Date.now(),
        name: "Новый сад",
        location: "Местоположение",
        images: [],
        stats: {}, // Статистика остается объектом для детальных данных
        expanded: false,
        saved: false,
        isAnalyzing: false, // Добавлено состояние загрузки для сада
      };
      this.gardens.push(newGarden);
      // Сохранение в LS происходит при нажатии "Сохранить"
    },
    saveGarden(id) {
      const garden = this.gardens.find(g => g.id === id);
      if (garden) {
        garden.saved = true;
        garden.expanded = true;
        this.saveToLocalStorage();
      }
    },
    deleteGarden(id) {
      this.gardens = this.gardens.filter(g => g.id !== id);
      this.selectedGardens = this.selectedGardens.filter(gId => gId !== id);
      this.saveToLocalStorage();
    },
    deleteSelectedGardens() {
      this.gardens = this.gardens.filter(g => !this.selectedGardens.includes(g.id));
      this.selectedGardens = [];
      this.saveToLocalStorage();
    },
    toggleGarden(id) {
      const garden = this.gardens.find(g => g.id === id);
      // Разворачивать/сворачивать можно только сохраненный и не анализируемый сад
      if (garden && garden.saved && !garden.isAnalyzing) {
        garden.expanded = !garden.expanded;
      }
    },
    triggerFileInput(gardenId) {
       const garden = this.gardens.find(g => g.id === gardenId);
       if (garden && garden.isAnalyzing) return; // Не открывать диалог во время анализа

       const fileInputRef = this.$refs['fileInput' + gardenId];
       if (fileInputRef && fileInputRef[0]) {
           fileInputRef[0].click();
       } else {
           console.error("Ref не найден для fileInput" + gardenId);
       }
    },
    async uploadImages(event, gardenId) {
      const files = event.target.files;
      if (!files.length) return;

      const garden = this.gardens.find(g => g.id === gardenId);
      if (!garden || garden.isAnalyzing) return; // Не загружать во время анализа

      const formData = new FormData();
      formData.append("name", garden.name);
      formData.append("location", garden.location);
      for (const file of files) {
        formData.append("images", file, file.name);
      }

       try {
         const response = await fetch("https://unbearably-decorous-airedale.cloudpub.ru/gardens", {
           method: "POST",
           body: formData,
         });

         if (!response.ok) throw new Error(`Ошибка загрузки: ${response.statusText} (${response.status})`);

         const data = await response.json();

         const newImages = data.images.map(filename => ({
           src: `https://unbearably-decorous-airedale.cloudpub.ru/images/${encodeURIComponent(filename)}`,
           selected: false,
         }));

         garden.images = [...garden.images, ...newImages];
         event.target.value = null;
         this.saveToLocalStorage();
       } catch (error) {
         console.error("Ошибка при загрузке изображений:", error);
         alert(`Не удалось загрузить изображения: ${error.message}`);
       }
    },
    toggleSelection(image) {
       const garden = this.gardens.find(g => g.images.some(img => img.src === image.src)); // Найдем сад по изображению
       if (garden && garden.isAnalyzing) {
            return;
       }
       image.selected = !image.selected;
    },
    async analyzeSelected(gardenId) {
      const garden = this.gardens.find(g => g.id === gardenId);
      if (!garden || garden.isAnalyzing) return;

      const selectedImages = garden.images.filter(image => image.selected);
      if (selectedImages.length === 0) {
        alert("Пожалуйста, выберите хотя бы одно изображение для анализа!");
        return;
      }

      garden.isAnalyzing = true;

      const imageUrls = selectedImages.map(img => img.src);

      try {
        const response = await fetch("https://unbearably-decorous-airedale.cloudpub.ru/analyze-selected-images", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: imageUrls }),
        });

        if (!response.ok) {
          // Попробуем получить текст ошибки от сервера
          let errorText = `Ошибка ответа сервера: ${response.statusText} (${response.status})`;
          try {
              const errorData = await response.json();
              if(errorData.detail) errorText += `\n${errorData.detail}`;
          } catch (e) { /* не удалось распарсить json ошибки */ }
          throw new Error(errorText);
        }

        const analysisResult = await response.json();
        console.log("Результат анализа:", analysisResult);

        // --- Обновление статистики сада ---
        for (const [diagnosisKey, count] of Object.entries(analysisResult.stats)) {
            const formattedDiagnosis = this.formatDiagnosisName(diagnosisKey); // Используем форматер
            garden.stats[formattedDiagnosis] = (garden.stats[formattedDiagnosis] || 0) + count;
        }

        this.saveToLocalStorage();

        selectedImages.forEach(img => img.selected = false);

        // --- Формируем детальное сообщение для alert ---
        let alertMessage = `Анализ ${selectedImages.length} изображений завершен:\n\n`;
        if (Object.keys(analysisResult.stats).length > 0) {
            for (const [diagnosisKey, count] of Object.entries(analysisResult.stats)) {
                alertMessage += `- ${this.formatDiagnosisName(diagnosisKey)}: ${count}\n`; // Используем форматер
            }
        } else {
            alertMessage += "Диагнозы не определены.\n";
        }
        alertMessage += "\nСтатистика сада обновлена.";

        alert(alertMessage);

      } catch (error) {
        console.error("Ошибка при анализе выбранных изображений:", error);
        alert(`Ошибка анализа: ${error.message}`);
      } finally {
        garden.isAnalyzing = false;
      }
    },
    saveToLocalStorage() {
      const gardensToSave = this.gardens.map(g => {
           const { isAnalyzing, ...rest } = g;
           return rest;
      });
      localStorage.setItem("gardens", JSON.stringify(gardensToSave));
    },
    loadFromLocalStorage() {
      const savedGardens = localStorage.getItem("gardens");
      if (savedGardens) {
        const parsedGardens = JSON.parse(savedGardens);
        this.gardens = parsedGardens.map(garden => ({
          ...garden,
          images: (garden.images || []).map(img => typeof img === 'string' ? { src: img, selected: false } : { ...img, selected: img.selected || false }),
          stats: typeof garden.stats === 'object' && garden.stats !== null ? garden.stats : {},
          expanded: garden.expanded || false,
          saved: garden.saved || false,
          isAnalyzing: false, // Всегда false при загрузке
        }));
      }
    },
  },
};
</script>

<style scoped>
/* Стили для кнопок и основных элементов остаются */
.add-garden-btn, .delete-selected-btn, .save-btn, .load-button, .analyze-selected-btn {
  background-color: #57cfa7;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.add-garden-btn:hover:not(:disabled),
.delete-selected-btn:hover:not(:disabled),
.save-btn:hover:not(:disabled),
.load-button:hover:not(:disabled),
.analyze-selected-btn:hover:not(:disabled) {
  background-color: #3d9477;
}

/* Стили для неактивных кнопок */
button:disabled, input:disabled, span.cursor-not-allowed {
  opacity: 0.6;
  cursor: not-allowed !important; /* Важно для переопределения */
}
.analyze-selected-btn:disabled {
   background-color: #a0aec0;
}


.delete-btn {
  cursor: pointer;
  background-color: transparent;
  color: #ef4444;
  font-size: 1.2rem;
  transition: color 0.2s ease;
}
.delete-btn:hover:not(:disabled) {
    color: #dc2626;
}
/* Добавляем стиль для неактивной кнопки удаления */
.delete-btn:disabled {
    color: #fca5a5; /* Бледный красный */
}

.header-garden {
   background-color: #57cfa7;
}

.garden.selected {
  border: 2px solid #57cfa7;
  box-shadow: 0 0 5px rgba(87, 207, 167, 0.5);
  border-radius: 0.5rem;
}

.uploaded-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.5rem; /* Используем Tailwind класс border-round-xl */
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.uploaded-image.cursor-pointer:hover {
    transform: scale(1.05);
}

.image-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
  flex-shrink: 0; /* Предотвращает сжатие элементов в flex контейнере */
}

.image-wrapper.selected-image img {
  border: 3px solid #57cfa7;
  box-shadow: 0 0 8px rgba(87, 207, 167, 0.7);
}

.checkmark {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(87, 207, 167, 0.9);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  pointer-events: none; /* Чтобы клик проходил на изображение под ним */
}

.toggle-arrow {
  color: #57cfa7;
  font-size: 1.2rem;
  padding: 0.2rem;
  cursor: pointer;
  background-color: transparent;
   transition: opacity 0.2s ease;
}

.stats p {
    margin-bottom: 0.5rem;
}
.stats strong {
    color: #3d9477;
}
.stats .capitalize {
    text-transform: capitalize;
}


.garden-name, .garden-location {
    background-color: transparent;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease, outline 0.2s ease;
}
.garden-name:focus:not(:disabled), .garden-location:focus:not(:disabled) {
    outline: 1px solid #57cfa7;
    background-color: #f0fdf4;
}

.actions {
    align-items: center;
}

/* Стили для оверлея загрузки */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8); /* Полупрозрачный белый фон */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10; /* Поверх других элементов контента */
  border-radius: 0.375rem; /* Соотв. rounded */
}

.loader {
  border: 5px solid #e5e7eb; /* Серый фон для круга */
  border-top-color: #57cfa7; /* Цвет активной части спиннера */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

/* Анимация вращения для загрузчика */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Маленький спиннер для кнопки (если используется Bootstrap) */
.spinner-border-sm {
    width: 1rem;
    height: 1rem;
    border-width: 0.2em;
    vertical-align: -0.125em; /* Выравнивание по тексту кнопки */
}
.spinner-border {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border .75s linear infinite;
}
@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
</style>