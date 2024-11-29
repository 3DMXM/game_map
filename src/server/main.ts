import express from "express";
import ViteExpress from "vite-express";

import adminRouter from './adminRouter';
import uploadRoter from './uploadRouter';
import renderRouter from './renderRouter';


const app = express();
const port = 6543

app.use(express.json());

app.use('/admin', adminRouter);
app.use('/upload', uploadRoter);
app.use('/render', renderRouter);

ViteExpress.listen(app, port, () =>
    console.log(`服务器已在 http://localhost:${port} 启动`),
);



