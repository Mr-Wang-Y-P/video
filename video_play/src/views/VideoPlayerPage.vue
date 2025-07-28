<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <AppHeader
      class="sticky top-0 z-50"
    />
    <!-- Breadcrumb (Optional, can be integrated with AppHeader if needed) -->

    <main class="container mx-auto p-4 md:p-6 lg:p-8">
      <!-- 根据加载状态显示骨架屏或实际内容 -->
      <template v-if="loading">
        <!-- 视频播放器骨架屏 -->
        <section class="bg-black rounded-lg overflow-hidden shadow-xl mb-8 h-[500px] animate-pulse">
          <div class="relative w-full h-full bg-gray-300"></div>
        </section>

        <!-- 视频标题和控制按钮骨架屏 -->
        <section class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between mb-4"
          >
            <div class="text-2xl font-bold text-gray-900 mb-2 md:mb-0 bg-gray-300 w-2/3 h-8 rounded"></div>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <div class="flex items-center px-6 py-2 rounded-full bg-gray-300 w-24 h-8"></div>
              <div class="flex items-center px-6 py-2 rounded-full bg-gray-300 w-28 h-8"></div>
              <div class="flex items-center px-6 py-2 rounded-full bg-gray-300 w-28 h-8"></div>
            </div>
          </div>
        </section>

        <!-- 剧集列表骨架屏 -->
        <section v-for="i in 2" :key="i" class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <div class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div class="w-6 h-6 bg-blue-600 rounded-full"></div>
            <div class="bg-gray-300 w-24 h-6 rounded ml-2"></div>
          </div>
          <div
            class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div v-for="j in 12" :key="j" class="bg-gray-300 h-8 rounded"></div>
          </div>
        </section>
      </template>
      <template v-else>
        <!-- Video Player Section -->
        <section class="bg-black rounded-lg overflow-hidden shadow-xl mb-8">
          <div class="relative w-full aspect-video">
            <iframe
              v-if="video.type !== 'iframe'"
              :src="video.videoHref"
              frameborder="0"
              allowfullscreen
              class="w-full h-full"
            ></iframe>

            <iframe
              v-else
              :src="`/video-player.html?videoUrl=${encodeURIComponent(
                video.videoHref
              )}`"
              frameborder="0"
              allowfullscreen
              class="video-player-iframe w-full h-full"
            ></iframe>
          </div>
        </section>

        <!-- Video Title and Controls -->
        <section class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between mb-4"
          >
            <h1 class="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
              {{ video.title }}
            </h1>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <button
                @click="refreshData"
                class="flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <RefreshCcwIcon class="w-4 h-4 mr-1" />刷新
              </button>
              <a
                @click="playVideo(video.lastHref)"
                :class="[
                  'flex items-center px-3 py-1 rounded-full transition-colors',
                  video.lastHref
                    ? 'bg-gray-100 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed',
                ]"
              >
                <ChevronLeftIcon class="w-4 h-4 mr-1" />上一集
              </a>
              <a
                @click="playVideo(video.nextHref)"
                :class="[
                  'flex items-center px-3 py-1 rounded-full transition-colors',
                  video.nextHref
                    ? 'bg-gray-100 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed',
                ]"
              >
                下一集<ChevronRightIcon class="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
          <p class="text-gray-700 text-sm">
          {{video.desc}}
        </p>​
        </section>

        <!-- Episode List Sections -->
        <section
          v-for="(source, sourceIndex) in video.data"
          :key="sourceIndex"
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
              v-for="(episode) in source.data"
              :key="episode.name"
              @click="playVideo(episode.href)"
              :class="[
                'flex items-center justify-center text-sm py-2 px-2 rounded-md transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis',
                'bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-800',
              ]"
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
import { useRouter, useRoute } from "vue-router";
import {
  MonitorPlayIcon,
  SettingsIcon,
  RefreshCcwIcon,
  Share2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotIcon,
} from "lucide-vue-next";
import AppHeader from "../components/AppHeader.vue";
import { videoPlayData } from "../api/index.js";

const router = useRouter();
const route = useRoute();
const video = ref({});
const loading = ref(true);
const searchQuery = ref("");

const videoPlayer = ref(null);

const playVideo = (videoId) => {
  if(!videoId) return
  router.push({
    name: "VideoPlayerPage",
    params: {
      videoId: videoId,
    },
  });
};

const refreshData = () => {
  window.location.reload();
};

const fetchVideoDetail = async () => {
  const { videoId } = route.params;
  try {
    loading.value = true;
    const data = await videoPlayData(videoId);
    if (data) {
      video.value = data;
    }
  } catch (error) {
    console.error("获取视频详情失败:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVideoDetail();
});

watch(
  () => route.params,
  () => {
    fetchVideoDetail();
  },
  { deep: true }
);

</script>

<style scoped>
/* Custom scrollbar styles for Webkit browsers (Chrome, Safari) */
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* For Firefox */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f1f1f1;
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
    opacity: 0.5;
  }
}
</style>