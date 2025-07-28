<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <AppHeader class="sticky top-0 z-50" />

    <main class="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        <ListIcon class="inline-block w-6 h-6 mr-2 text-blue-600" />
        {{ searchResults.length > 0 ? searchResults[0].title : "搜索结果" }}
      </h1>

      <div v-if="loading" class="text-center text-gray-600 text-lg py-10">
        加载中...
      </div>
      <div
        v-else-if="searchResults.length === 0"
        class="text-center text-gray-600 text-lg py-10"
      >
        没有找到相关结果。
      </div>
      <div v-else class="space-y-6">
        <div
          v-for="item in searchResults[0].data"
          :key="item.href"
          class="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
        >
          <!-- Image Section -->
          <div
            class="relative w-full sm:w-40 flex-shrink-0 rounded-lg overflow-hidden"
          >
            <img
              :src="item.img"
              :alt="item.text"
              class="w-full h-48 sm:h-full object-cover"
              loading="lazy"
            />
            <!-- Overlay for update status (placeholder as not directly in JSON) -->
            <div
              v-if="item.time.includes('2025')"
              class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full"
            >
              更新至{{ item.time.split("年份：")[1] }}
            </div>
            <div
              v-else
              class="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full"
            >
              已完结
            </div>
          </div>

          <!-- Details Section -->
          <div class="flex-grow">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              {{ item.text }}
            </h2>
            <p class="text-gray-700 text-sm mb-1">
              导演：{{ item.author.split("导演：")[1] || "未知" }}
            </p>
            <p class="text-gray-700 text-sm mb-1">
              主演：{{ item.avators.split("主演：")[1] || "未知" }}
            </p>
            <p class="text-gray-700 text-sm mb-4">
              类型：{{ item.time.split("类型：")[1].split("地区：")[0].trim() }}
              <span class="ml-4"
                >地区：{{
                  item.time.split("地区：")[1].split("年份：")[0].trim()
                }}</span
              >
              <span class="ml-4"
                >年份：{{ item.time.split("年份：")[1].trim() }}</span
              >
            </p>

            <div class="flex gap-3 flex-wrap">
              <a
                @click="playVideo(item.playUrl)"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200 text-sm"
              >
                立即播放
              </a>
              <a
                @click="setVideoInfo(item.detailUrl)"
                class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-full transition-colors duration-200 text-sm"
              >
                查看详情
              </a>
            </div>
          </div>
        </div>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ListIcon } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import { searchData } from "../api/index.js";
const loading = ref(true);
const searchResults = ref([]);

const router = useRouter();
const route = useRoute();
const currentCategory = ref("");
const currentPage = ref(1);
const totalPages = ref(1); // 总页数

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    const newParams = generateSearchUrl(
      currentCategory.value,
      currentPage.value
    );
    try {
      loading.value = true;
      const data = await searchData(newParams);
      if (data) {
        searchResults.value = data;
        totalPages.value = data[0].pageCount;
      }
      loading.value = false;
    } catch (error) {
      console.error("获取视频详情失败:", error);
      loading.value = false;
    } finally {
      loading.value = false;
    }
  }
};
const generateSearchUrl = (keyword, page) => {
  return `/search/${keyword}----------${page}---.html`;
};
// 获取视频详情数据的函数
const fetchVideoDetail = async () => {
  const { videoId } = route.params; // 假设路由参数名为 videoId
  currentCategory.value = videoId;
  const match = videoId?.match(/(\d+)(?!.*\d)/);

  if (match && match[1]) {
    currentPage.value = parseInt(match[1]);
  } else {
    currentPage.value = 1;
  }
  const newParams = generateSearchUrl(currentCategory.value, currentPage.value);
  try {
    loading.value = true;
    const data = await searchData(newParams);
    if (data) {
      searchResults.value = data;
      totalPages.value = data[0].pageCount;
    }
    loading.value = false;
  } catch (error) {
    console.error("获取视频详情失败:", error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
};
// 监听路由参数变化，重新获取数据
watch(
  () => route.params,
  () => {
    fetchVideoDetail();
  },
  { deep: true }
);

onMounted(() => {
  fetchVideoDetail();
});
// watch
const setVideoInfo = (videoId) => {
  router.push({
    name: "VideoDetailPage", // 假设路由配置中 /type 页面的命名为 typeList
    params: {
      videoId: videoId,
    },
  });
};

const playVideo = (videoId) => {
  if (!videoId) return;
  router.push({
    name: "VideoPlayerPage",
    params: {
      videoId: videoId,
    },
  });
};
</script>

<style scoped>
/* No specific styles needed here, Tailwind handles it */
</style>
