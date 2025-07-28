import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import TypeHome from '../views/TypeHome.vue';
import TypeList from '../views/TypeList.vue';
import VideoDetailPage from '../views/VideoDetailPage.vue';
import VideoPlayerPage from '../views/VideoPlayerPage.vue';
import SearchPage from '../views/SearchPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      transition: 'fade'
    }
  },
  {
   path: '/type/:category',
    name: 'typeHome',
    component: TypeHome,
    meta: {
      transition: 'fade'
    }
  },
  {
   path: '/list/:category',
    name: 'typeList',
    component: TypeList,
    meta: {
      transition: 'fade'
    }
  },
  {
    path: '/video/:videoId',
    name: 'VideoDetailPage',
    component: VideoDetailPage,
    meta: {
      transition: 'fade'
    }
  },
  {
    path: '/movies/:videoId',
    name: 'VideoPlayerPage',
    component: VideoPlayerPage,
    meta: {
      transition: 'fade'
    }
  },
  {
    path: '/search/:videoId',
    name: 'SearchPage',
    component: SearchPage
  }

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 滚动到顶部
    return { top: 0 };
  }
});

export default router;
