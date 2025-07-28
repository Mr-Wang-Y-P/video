<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <AppHeader
      class="sticky top-0 z-50"
    />
    <!-- Breadcrumb -->
    <div class="bg-white py-3 px-4 shadow-sm text-sm text-gray-600">
      <div class="container mx-auto">
        <template v-if="loading">
          <div
            class="text-blue-600 bg-gray-300 w-40 h-5 animate-pulse rounded"
          ></div>
        </template>
        <template v-else>
          <span class="text-blue-600">{{
            video.titleText.replace(/^当前位置首页/, "")
          }}</span>
        </template>
      </div>
    </div>

    <main class="container mx-auto p-4 md:p-6 lg:p-8">
      <!-- 根据加载状态显示骨架屏或实际内容 -->
      <template v-if="loading">
        <!-- 骨架屏 - 主视频信息部分 -->
        <section
          class="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-6 mb-8"
        >
          <div
            class="relative w-full md:w-1/3 lg:w-1/4 flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-gray-300 h-64 animate-pulse"
          ></div>
          <div class="flex-grow">
            <div
              class="text-3xl font-bold text-gray-900 mb-2 bg-gray-300 w-3/4 h-8 rounded animate-pulse"
            ></div>
            <div
              class="text-gray-700 text-sm mb-1 bg-gray-300 w-2/3 h-4 rounded animate-pulse"
            ></div>
            <div
              class="text-gray-700 text-sm mb-1 bg-gray-300 w-2/3 h-4 rounded animate-pulse"
            ></div>
            <div
              class="text-gray-700 text-sm mb-1 bg-gray-300 w-2/3 h-4 rounded animate-pulse"
            ></div>
            <div
              class="text-gray-700 text-sm mb-4 bg-gray-300 w-2/3 h-4 rounded animate-pulse"
            ></div>
            <div
              class="text-gray-800 leading-relaxed mb-6 bg-gray-300 w-full h-16 rounded animate-pulse"
            ></div>
            <div class="flex items-center gap-4 flex-wrap">
              <div
                class="bg-orange-500 w-32 h-10 rounded-full animate-pulse"
              ></div>
            </div>
          </div>
        </section>

        <!-- 骨架屏 - 剧集列表部分 -->
        <section
          v-for="i in 2"
          :key="i"
          class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div class="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
            <div class="bg-gray-300 w-24 h-6 rounded ml-2 animate-pulse"></div>
          </h3>
          <div
            class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div
              v-for="j in 12"
              :key="j"
              class="flex items-center justify-center bg-gray-300 text-gray-800 text-sm py-2 px-2 rounded-md animate-pulse"
            ></div>
          </div>
        </section>
      </template>
      <template v-else>
        <!-- Main Video Info Section -->
        <section
          class="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-6 mb-8"
        >
          <!-- Video Poster and Play Button -->
          <div
            class="relative w-full md:w-1/3 lg:w-1/4 flex-shrink-0 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              :src="video.img"
              :alt="video.title"
              class="w-full h-auto object-cover"
              loading="lazy"
            />
            <div
              class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ video.length }}
            </div>
          </div>

          <!-- Video Details -->
          <div class="flex-grow">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ video.title }}
              <span class="text-green-500 text-xl ml-2">{{ video.score }}</span>
            </h1>
            <p class="text-gray-700 text-sm mb-1">
              类型：{{
                video.typeInfo.split("类型：")[1].split("地区：")[0].trim()
              }}
              <span class="ml-4"
                >地区：{{
                  video.typeInfo.split("地区：")[1].split("年份：")[0].trim()
                }}</span
              >
              <span class="ml-4"
                >年份：{{ video.typeInfo.split("年份：")[1].trim() }}</span
              >
            </p>
            <p class="text-gray-700 text-sm mb-1">
              主演：{{ video.avators || "无" }}
            </p>
            <p class="text-gray-700 text-sm mb-1">
              导演：石头熊,冯毅
              <!-- Placeholder as not in JSON -->
            </p>
            <p class="text-gray-700 text-sm mb-4">
              更新：{{ video.time.split("更新：")[1] }}
            </p>

            <p class="text-gray-800 leading-relaxed mb-6">
              <span class="font-semibold">简介：</span>{{ video.desc }}
            </p>

            <div class="flex items-center gap-4 flex-wrap">
              <button
                @click="playVideo(video.imgHref)"
                class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200 shadow-md"
              >
                立即播放
              </button>
            </div>
          </div>
        </section>

        <!-- Episode List Sections -->
        <section
          v-for="(source, index) in video.data"
          :key="index"
          class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <DotIcon class="w-6 h-6 text-blue-600" />
            {{ source.name }}
          </h3>
          <div
            class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <a
              v-for="episode in source.data"
              :key="episode.name"
              @click="playVideo(episode.href)"
              class="flex items-center justify-center bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-800 text-sm py-2 px-2 rounded-md transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ episode.name }}
            </a>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute  } from 'vue-router'; 
import AppHeader from "../components/AppHeader.vue";
import {
  PlayCircleIcon,
  Share2Icon,
  StarIcon,
  MessageSquareIcon,
  LinkIcon,
  PlusIcon,
  DotIcon,
} from "lucide-vue-next";
// 假设这是获取视频详情数据的 API 函数
import { videoInfoData } from "../api/index.js";

const router = useRouter(); // 创建路由实例
const route = useRoute(); // 创建路由实例

const video = ref({});
const loading = ref(true);
const searchQuery = ref("");
// 获取视频详情数据的函数
const fetchVideoDetail = async () => {
  const { videoId } = route.params; // 假设路由参数名为 videoId
  try {
    loading.value = true;
    const data = await videoInfoData(videoId);
    if (data) {
      video.value = data;
    }
    loading.value = false;
  } catch (error) {
    console.error("获取视频详情失败:", error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVideoDetail();
});
const playVideo = (videoId) => {
//   console.log("category:", videoId);
  if(!videoId) return
  router.push({
    name: "VideoPlayerPage", // 假设路由配置中 /type 页面的命名为 typeList
    params: {
      videoId: videoId,
    },
  });
};
// 监听路由参数变化，重新获取数据
watch(
  () => route.params,
  () => {
    fetchVideoDetail();
  },
  { deep: true }
);
</script>

<style scoped>
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
