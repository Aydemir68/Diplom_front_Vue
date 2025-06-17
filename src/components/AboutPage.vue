<template>
  <div class="container mx-auto py-2">
    <!-- Main service description container -->
    <div class="about shadow-sm p-4 mb-4">
      <div class="space-y-4 text-gray-700 text-lg">
        <p>
          AiCадовод - это инновационный сервис, который помогает садоводам защищать свои растения с помощью искусственного интеллекта. 
          Мы стремимся сделать уход за садом более эффективным и доступным для каждого.
        </p>
        <p>
          Наш сервис использует передовые технологии машинного обучения для анализа фотографий растений. 
          Достаточно загрузить изображение, и наша система определит наличие заболеваний, поставит диагноз и 
          предложит эффективные методы лечения и профилактики.
        </p>
        <p>
          Для работы в полевых условиях также есть телеграм-бот AiСадовод: 
          <a href="https://t.me/AiSadovod_bot" target="_blank" class="text-[#57cfa7] hover:underline">
            <strong>@AiSadovod_bot</strong>
          </a>. Переходите по ссылке и защите свои растения!
        </p>
      </div>
    </div>

    <!-- Advantages section -->
    <div class="flex flex-row gap-4">
      <!-- Advantage 1 -->
      <div class="about flex-1 shadow-sm p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 flex items-center justify-center rounded-full" style="background-color: #57cfa7;">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h3 class="font-medium" style="color: #57cfa7;">Мгновенный анализ</h3>
        </div>
        <p class="text-gray-600 text-base">Получайте результаты анализа в течение нескольких секунд</p>
      </div>

      <!-- Advantage 2 -->
      <div class="about flex-1 bg-white rounded-2xl shadow-sm p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 flex items-center justify-center rounded-full" style="background-color: #57cfa7;">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="font-medium" style="color: #57cfa7;">Точность диагноза</h3>
        </div>
        <p class="text-gray-600 text-base">Высокая точность определения заболеваний благодаря ИИ</p>
      </div>

      <!-- Advantage 3 -->
      <div class="about flex-1 bg-white rounded-2xl shadow-sm p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 flex items-center justify-center rounded-full" style="background-color: #57cfa7;">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h3 class="font-medium" style="color: #57cfa7;">Экспертные рекомендации</h3>
        </div>
        <p class="text-gray-600 text-base">Профессиональные советы по лечению и профилактике</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.about {
    border: 2px solid #57cfa7;
    border-radius: 10px;
}

@media (max-width: 768px) {
  .flex-row {
    flex-direction: column;
  }
}
</style>