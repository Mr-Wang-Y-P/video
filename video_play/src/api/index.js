import axios from 'axios';

// 从环境变量中获取基础 URL
const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log('baseURL:', baseURL);
// 创建 axios 实例
const api = axios.create({
  baseURL,
  timeout: 10000, // 请求超时时间，单位毫秒
  headers: {
    'Content-Type': 'application/json'
  }
});

// 定义请求函数
export const scrapeType = async () => {
  try {
    const response = await api.post('/scrapeType');
    return response.data;
  } catch (error) {
    console.error('请求 scrapeType 失败:', error);
    throw error;
  }
};

export const scrapeTypeData = async (params) => {
  try {
    const response = await api.post('/scrapeTypeData', { params });
    return response.data;
  } catch (error) {
    console.error('请求 scrapeTypeData 失败:', error);
    throw error;
  }
};

export const videoListData = async (params) => {
  try {
    const response = await api.post('/videoListData', { params });
    return response.data;
  } catch (error) {
    console.error('请求 videoListData 失败:', error);
    throw error;
  }
};

export const videoPlayData = async (params) => {
  try {
    const response = await api.post('/videoPlayData', { params });
    return response.data;
  } catch (error) {
    console.error('请求 videoPlayData 失败:', error);
    throw error;
  }
};

export const videoInfoData = async (params) => {
  try {
    const response = await api.post('/videoInfoData', { params });
    return response.data;
  } catch (error) {
    console.error('请求 videoInfoData 失败:', error);
    throw error;
  }
};

export const searchData = async (params) => {
  try {
    const response = await api.post('/searchData', { params });
    return response.data;
  } catch (error) {
    console.error('请求 searchData 失败:', error);
    throw error;
  }
};