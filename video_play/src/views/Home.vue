<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <!-- Header Component with Sticky Positioning -->
    <AppHeader :search-query="searchQuery" @update:search-query="searchQuery = $event" class="sticky top-0 z-50" />

    <!-- Main Content -->
    <main class="container mx-auto p-4 md:p-6 lg:p-8" >
      <!-- 根据数据加载状态显示骨架屏或实际内容 -->
      <template v-if="!loading">
        <!-- Hot TV Series Section -->
        <section class="mb-8 mt-2" v-for="(tvSeriesData,index) in tvSeriesDataArr" :key="index">
          <h2 class="text-2xl font-bold mb-4 flex items-center">
            <TvIcon class="w-6 h-6 mr-2 text-blue-600" />
            {{ tvSeriesData.title }}
          </h2>
          <div class="flex space-x-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="(category,catIndex) in tvSeriesData.data"
              :key="catIndex"
              :class="['px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                       activeTvCategory === category.name ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white']"
              @click="setTypeData(category?.href)"
            >
              {{ category.name }}
            </button>
            <button
              :class="['px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                   'bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white']"
              @click="setTypeListData(tvSeriesData.url)"
            >
              更多
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div @click="setVideoInfo(series.href)" v-for="series in tvSeriesData.videoList" :key="series.href" class="bg-white rounded-lg shadow-md overflow-hidden
                        transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
              <img
                :src="series.img"
                :alt="series.title"
                class="w-full h-48 object-cover"
                loading="lazy"
              />
              <div class="p-3">
                <h3 class="font-semibold text-base truncate mb-1">{{ series.title }}</h3>
                <p class="text-gray-600 text-sm line-clamp-2">{{ series.avators }}</p>
                <p class="text-blue-600 text-xs mt-1">{{ series.length }}</p>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template v-if="loading">
        <!-- 骨架屏内容 -->
        <section class="mb-8 mt-2" v-for="i in 2" :key="i">
          <div class="text-2xl font-bold mb-4 flex items-center bg-gray-300 h-8 w-48 animate-pulse rounded"></div>
          <div class="flex space-x-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div v-for="j in 5" :key="j" class="px-4 py-2 rounded-full bg-gray-300 w-24 h-8 animate-pulse"></div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div v-for="k in 6" :key="k" class="bg-white rounded-lg shadow-md overflow-hidden h-64 animate-pulse">
              <div class="w-full h-48 bg-gray-300"></div>
              <div class="p-3">
                <div class="bg-gray-300 h-4 w-3/4 mb-1 rounded"></div>
                <div class="bg-gray-300 h-3 w-2/3 rounded"></div>
                <div class="bg-gray-300 h-3 w-1/3 rounded mt-1"></div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
    <!-- <div v-else>加载中...</div> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; 
import { TvIcon, FilmIcon } from 'lucide-vue-next';
import AppHeader from '../components/AppHeader.vue'; 
import { scrapeType, videoPlayData } from '../api/index.js';

const searchQuery = ref(''); 
const activeTvCategory = ref('');
const tvSeriesDataArr = ref([]);

const router = useRouter(); // 创建路由实例
const loading = ref(false);

const setTypeData = (category) => {
  // console.log('category:', category);
  router.push({
    name: 'typeList', // 假设路由配置中 /type 页面的命名为 typeList
    params: {
      category: category
    }
  });
}

const setVideoInfo = (videoId) => {
  // console.log('category:', videoId);
  router.push({
    name: 'VideoDetailPage', // 假设路由配置中 /type 页面的命名为 typeList
    params: {
      videoId: videoId
    }
  });
}

const setTypeListData = (category) => {
  // console.log('category11:', category);
  router.push({
    name: 'typeHome', // 假设路由配置中 /type 页面的命名为 typeHome
    params: {
      category: category
    }
  });
  
}

onMounted(async () => {
  try {
    loading.value = true;
    const res = await scrapeType();
    if (res && res.length > 0) {
      tvSeriesDataArr.value = res;
      loading.value = false;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    loading.value = false;
  }
  await videoPlayData('/play/6027-2-1.html')
});
</script>

<style scoped>
/* Custom scrollbar for better aesthetics, optional */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* 骨架屏动画 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>