import express from 'express';
import {  scrapeType,scrapeTypeData,videoListData,videoPlayData,videoInfoData,searchData } from './cheerio/index.js';
import cors from 'cors';


// 创建 Express 应用
const app = express();
// 解析 JSON 格式的请求体
app.use(express.json());

// 使用 cors 中间件处理跨域请求
app.use(cors());


// 定义端口
const port = 8830;

// 封装路由处理函数，减少代码重复
const createRouteHandler = (scrapeFunction, requireParams = false) => {
  return async (req, res, next) => {
    try {
      const params = req.body?.params;
      if (requireParams && !params) {
        return res.status(400).json({ error: '请求体需要包含 params 参数' });
      }
      const data = requireParams ? await scrapeFunction(params) : await scrapeFunction();
      if (data) {
        res.json(data);
      } else {
        res.status(500).json({ error: '获取数据失败' });
      }
    } catch (error) {
      // 将错误传递给错误处理中间件
      next(error);
    }
  };
};

// 定义 POST 请求路由
app.post('/scrapeType', createRouteHandler(scrapeType, false));
app.post('/scrapeTypeData', createRouteHandler(scrapeTypeData, true));
app.post('/videoListData', createRouteHandler(videoListData, true));
app.post('/videoPlayData', createRouteHandler(videoPlayData, true));
app.post('/videoInfoData', createRouteHandler(videoInfoData, true));
app.post('/searchData', createRouteHandler(searchData, true));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误，请稍后再试' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});