<template>
  <div class="garden-page p-4">
    <h1 class="header-garden text-3xl font-bold mb-5 w-full p-1 border-round text-white">Мои сады</h1>

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
          <input v-model="garden.name" class="garden-name font-bold text-xl border-none" @input="saveToLocalStorage"/>
          <input v-model="garden.location" class="garden-location text-gray-600 ml-2 border-none" @input="saveToLocalStorage"/>
        </div>
        <div class="actions flex gap-2">
          <input type="checkbox" class="ml-1 mr-1" v-model="selectedGardens" :value="garden.id" />
          <button class="delete-btn text-red-600 border-none ml-2" @click.stop="deleteGarden(garden.id)">🗑</button>
          <button v-if="!garden.saved" class="save-btn px-4 py-2 text-white border-none border-round" @click="saveGarden(garden.id)">
            Сохранить
          </button>
          <span v-if="garden.saved" @click="toggleGarden(garden.id)" class="toggle-arrow">{{ garden.expanded ? '▼' : '▶' }}</span>
        </div>
      </div>
      
      <div v-if="garden.expanded" class="garden-content mt-4">
        <div class="image-upload border-dashed border-2 border-gray-300 p-4 text-center">
          <input type="file" accept="image/*" multiple class="hidden" :ref="'fileInput' + garden.id" @change="uploadImages($event, garden.id)" />
          <button class="load-button px-4 py-2 text-white border-round border-none" @click="triggerFileInput(garden.id)">
            Загрузить изображение
          </button>
        </div>
        
        <div v-if="garden.images.length" class="image-gallery mt-4 flex overflow-x-auto">
          <div v-for="(image, index) in garden.images" :key="index" class="image-wrapper mr-2" :class="{'selected-image': image.selected}">
            <img :src="image.src" alt="Загруженное изображение" class="uploaded-image border-round-xl" @click="toggleSelection(image, garden.id)" />
            <div v-if="image.selected" class="checkmark">✔</div>
          </div>
        </div>

        <div class="actions mt-4">
          <button class="analyze-selected-btn px-4 py-2 text-white border-none border-round" @click="analyzeSelected(garden.id)">
            Анализировать выбранное
          </button>
        </div>

        <div class="stats mt-4 p-4 border rounded">
          <p class="font-bold">Статистика:</p>
          <p>Здоровых плодов: {{ garden.stats.healthy }}</p>
          <p>Больных плодов: {{ garden.stats.diseased }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gardens: [],
      selectedGardens: [],
    };
  },
  created() {
    this.loadFromLocalStorage();
  },
  methods: {
    addGarden() {
      const newGarden = {
        id: Date.now(),
        name: "Новый сад",
        location: "Местоположение",
        images: [],
        stats: { healthy: 0, diseased: 0 },
        expanded: false,
        saved: false,
      };
      this.gardens.push(newGarden);
      this.saveToLocalStorage();
    },
    saveGarden(id) {
      const garden = this.gardens.find(g => g.id === id);
      if (garden) {
        garden.saved = true;
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
      if (garden && garden.saved) {
        garden.expanded = !garden.expanded;
        this.saveToLocalStorage();
      }
    },
    triggerFileInput(gardenId) {
      this.$refs['fileInput' + gardenId][0].click();
    },
    async uploadImages(event, gardenId) {
      const files = event.target.files;
      if (!files.length) return;

      const garden = this.gardens.find(g => g.id === gardenId);
      if (!garden) return;

      const formData = new FormData();
      formData.append("name", garden.name);
      formData.append("location", garden.location);
      for (const file of files) {
        formData.append("images", file);
      }

      try {
        const response = await fetch("http://localhost:8000/gardens", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Ошибка загрузки сада");

        const data = await response.json();
        garden.images = [...garden.images, ...data.images.map(imagePath => ({
          src: `http://localhost:8000/images/${encodeURIComponent(imagePath)}`,
          selected: false,
        }))];
        await this.updateGardenStats(gardenId);
        this.saveToLocalStorage();
      } catch (error) {
        console.error("Ошибка загрузки изображений:", error);
      }
    },
    async updateGardenStats(gardenId){
        const garden = this.gardens.find(g => g.id === gardenId);
        if(!garden) return;

        let healthy = 0;
        let diseased = 0;

        for(const image of garden.images){
            try{
                const response = await fetch("http://localhost:8000/predict", {
                    method: "POST",
                    body: JSON.stringify({ image: image.src }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) throw new Error("Ошибка анализа изображения");

                const data = await response.json();
                if (data.diagnosis === "Здоровое яблоко") {
                    healthy++;
                } else {
                    diseased++;
                }
            }
            catch(error){
                console.error("Ошибка анализа изображения:", error);
            }
        }
        garden.stats.healthy = healthy;
        garden.stats.diseased = diseased;
    },
    toggleSelection(image, gardenId) {
      image.selected = !image.selected;
    },
    async analyzeSelected(gardenId) {
      const garden = this.gardens.find(g => g.id === gardenId);
      if (!garden) return;

      const selectedImages = garden.images.filter(image => image.selected);
      if (selectedImages.length === 0) {
        alert("Пожалуйста, выберите изображение!");
        return;
      }

      let healthy = 0;
      let diseased = 0;

      for (const image of selectedImages) {
        try {
          const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            body: JSON.stringify({ image: image.src }),
            headers: {
              'Content-Type': 'application/json'
            },
          });

          if (!response.ok) throw new Error("Ошибка анализа изображения");

          const data = await response.json();
          if (data.diagnosis === "Здоровое яблоко") {
            healthy++;
          } else {
            diseased++;
          }
        } catch (error) {
          console.error("Ошибка анализа изображения:", error);
        }
      }

      garden.stats.healthy += healthy;
      garden.stats.diseased += diseased;

      this.saveToLocalStorage();
      alert(`Анализ завершен: ${healthy} здоровых, ${diseased} больных`);
    },
    saveToLocalStorage() {
      localStorage.setItem("gardens", JSON.stringify(this.gardens));
    },
    loadFromLocalStorage() {
      const savedGardens = localStorage.getItem("gardens");
      if (savedGardens) {
        this.gardens = JSON.parse(savedGardens);
      }
    },
  },
};
</script>

<style scoped>
.add-garden-btn, .delete-selected-btn, .save-btn {
  background-color: #57cfa7;
}

.add-garden-btn:hover, .delete-selected-btn:hover, .save-btn:hover {
  background-color: #3d9477;
}

.load-button {
  background-color: #57cfa7;
}

.header-garden {
   background-color: #57cfa7;
}

.load-button:hover {
  background-color: #3d9477;
}

.delete-btn {
  cursor: pointer;
  background-color: white;
}

.garden.selected {
  border: 2px solid #57cfa7;
  border-radius: 0.5rem;
}

.uploaded-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.toggle-arrow {
  color: #57cfa7;
  font-size: 1.2rem;
  padding: 0.2rem;
  cursor: pointer;
  background-color: transparent;
}
</style>