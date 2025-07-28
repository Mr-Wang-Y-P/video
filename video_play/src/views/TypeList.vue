<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <!-- Header Component with Sticky Positioning -->
    <AppHeader
      class="sticky top-0 z-50"
    />

    <!-- Main Content -->
    <main class="container mx-auto p-4 md:p-6 lg:p-8">
      <!-- 根据数据加载状态显示骨架屏或实际内容 -->
      <template v-if="!loading">
        <!-- Hot TV Series Section -->
        <section
          class="mb-8 mt-2"
          v-for="(tvSeriesData, index) in tvSeriesDataArr"
          :key="index"
        >
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <div
             @click="setVideoInfo(series.href)"
              v-for="series in tvSeriesData.videoList"
              :key="series.href"
              class="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <img
                :src="series.img"
                :alt="series.title"
                class="w-full h-48 object-cover"
                loading="lazy"
              />
              <div class="p-3">
                <h3 class="font-semibold text-base truncate mb-1">
                  {{ series.title }}
                </h3>
                <p class="text-gray-600 text-sm line-clamp-2">
                  {{ series.avators }}
                </p>
                <p class="text-blue-600 text-xs mt-1">{{ series.length }}</p>
              </div>
            </div>
          </div>
        </section>
        <!-- 分页组件 -->
        <div class="flex justify-center mt-6 space-x-2">
          <button
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 border rounded-md"
          >
            上一页
          </button>
          <span class="px-3 py-1"
            >第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span
          >
          <button
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 border rounded-md"
          >
            下一页
          </button>
        </div>
      </template>
      <template v-if="loading">
        <!-- 骨架屏内容 -->
        <section class="mb-8 mt-2" v-for="i in 2" :key="i">
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <div
              v-for="k in 6"
              :key="k"
              class="bg-white rounded-lg shadow-md overflow-hidden h-64 animate-pulse"
            >
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
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { TvIcon, FilmIcon } from "lucide-vue-next";
import AppHeader from "../components/AppHeader.vue";
import { videoListData } from "../api/index.js";

const searchQuery = ref("");
const activeTvCategory = ref("");
const tvSeriesDataArr = ref([]);

const router = useRouter(); // 创建路由实例
const route = useRoute(); // 创建路由实例
const loading = ref(false);
const currentPage = ref(1); // 当前页码
const totalPages = ref(1); // 总页数

const currentCategory = ref(""); // 当前分类

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    let newParams = currentCategory.value;
    if (!newParams.includes("-")) {
      // 使用正则提取数字部分
      const match = newParams.match(/\/(\d+)\.html/);
      if (match && match[1]) {
        newParams = `/type/${match[1]}-${currentPage.value}.html`;
      }
    }
    try {
      loading.value = true;
      const res = await videoListData(newParams);
      if (res && res.length > 0) {
        tvSeriesDataArr.value = res;
        // 假设返回数据的第一个元素包含 pageCount
        totalPages.value = parseInt(res[0].pageCount, 10);
      }
      loading.value = false;
    } catch (error) {
      console.error("获取数据失败:", error);
      loading.value = false;
    }
  }
};

const setVideoInfo = (videoId) => {
//   console.log('category:', videoId);
  router.push({
    name: 'VideoDetailPage', // 假设路由配置中 /type 页面的命名为 typeList
    params: {
      videoId: videoId
    }
  });
}

// 监听路由参数 category 的变化
watch(
  () => route.params.category,
  async (newCategory) => {
    try {
      loading.value = true;
      currentCategory.value = newCategory;
      let newParams = currentCategory.value;
      if (!newParams.includes("-")) {
        // 使用正则提取数字部分
        currentPage.value = 1;
      } else {
        // 包含 -，提取 - 后面、.html 前面的数字作为页码
        const match = newParams.match(/-(\d+)\.html/);
        if (match && match[1]) {
          const extractedPage = parseInt(match[1], 10);
          // console.log('提取出的页码:', extractedPage);
          currentPage.value = extractedPage;
        }
      }
      const res = await videoListData(newCategory);
      if (res && res.length > 0) {
        tvSeriesDataArr.value = res;
        // 假设返回数据的第一个元素包含 pageCount
        totalPages.value = parseInt(res[0].pageCount, 10);
      }
      loading.value = false;
    } catch (error) {
      console.error("获取数据失败:", error);
      loading.value = false;
    }
  },
  { immediate: true }
); // immediate: true 表示组件挂载时立即执行一次
onMounted(async () => {
  const params = route.params.category;
  currentCategory.value = params;
  let newParams = currentCategory.value;
  if (!newParams.includes("-")) {
    // 使用正则提取数字部分
    currentPage.value = 1;
  } else {
    // 包含 -，提取 - 后面、.html 前面的数字作为页码
    const match = newParams.match(/-(\d+)\.html/);
    if (match && match[1]) {
      const extractedPage = parseInt(match[1], 10);
      // console.log('提取出的页码:', extractedPage);
      currentPage.value = extractedPage;
    }
  }
  try {
    loading.value = true;
    const res = await videoListData(params);
    if (res && res.length > 0) {
      tvSeriesDataArr.value = res;
      // 假设返回数据的第一个元素包含 pageCount
      totalPages.value = parseInt(res[0].pageCount, 10);
    }
    loading.value = false;
  } catch (error) {
    console.error("获取数据失败:", error);
    loading.value = false;
  }
});
</script>

<style scoped>
/* Custom scrollbar for better aesthetics, optional */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* 骨架屏动画 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
