import express from "express";
import ViteExpress from "vite-express";

const app = express();
const port = 3000

app.get("/hello", (_, res) => {
  res.send("Hello Vite + Vue + TypeScript!");
});

ViteExpress.listen(app, port, () =>
  console.log(`服务器已在 http://localhost:${port} 启动`),
);



