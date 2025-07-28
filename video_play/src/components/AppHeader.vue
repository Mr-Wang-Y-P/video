<template>
  <header class="bg-blue-700 text-white p-4 shadow-md w-full">
    <div class="container mx-auto flex items-center justify-between flex-wrap">
      <div class="text-2xl font-bold mr-6">影视大全</div>
      <nav class="flex-grow flex justify-end md:justify-start">
        <ul class="flex space-x-4 text-lg flex-wrap">
          <li>
            <a
              @click="jumpToType('/')"
              class="relative hover:text-blue-200 transition-colors duration-300 group pb-1"
            >
              首页
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </li>
          <li>
            <a
              @click="jumpToType('/type/1.html')"
              class="relative hover:text-blue-200 transition-colors duration-300 group pb-1"
            >
              电影
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </li>
          <li>
            <a
              @click="jumpToType('/type/2.html')"
              class="relative hover:text-blue-200 transition-colors duration-300 group pb-1"
            >
              连续剧
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </li>
          <li>
            <a
              @click="jumpToType('/type/3.html')"
              class="relative hover:text-blue-200 transition-colors duration-300 group pb-1"
            >
              动漫
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </li>
          <li>
            <a
              @click="jumpToType('/type/4.html')"
              class="relative hover:text-blue-200 transition-colors duration-300 group pb-1"
            >
              综艺
              <span
                class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 transition-all duration-300 group-hover:w-full"
              ></span>
            </a>
          </li>
        </ul>
      </nav>
      <!-- Search Box -->
      <div class="relative ml-auto md:ml-6 w-full md:w-auto mt-4 md:mt-0">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="performSearch"
          placeholder="搜索影视..."
          class="w-full md:w-64 pl-10 pr-4 py-2 rounded-full bg-blue-600 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
        />
        <SearchIcon
          @click="performSearch"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { SearchIcon } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const searchQuery = ref("");
const jumpToType = (type) => {
  if (type === "/") {
    router.push({
      path: "/",
    });
  } else {
    router.push({
      name: "typeHome", // 假设路由配置中 /type 页面的命名为 TypePage
      params: {
        category: type,
      },
    });
  }
};

const performSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    router.push({
      name: "SearchPage", // 假设搜索页面的路由名称为 SearchPage
      params: {
        videoId: query,
      },
    });
  }
};
</script>

<style scoped>
/* No specific styles needed here, Tailwind handles it */
</style>
