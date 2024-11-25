import express from "express";
import ViteExpress from "vite-express";
import multer from 'multer';

import adminRouter from './adminRouter';
import uploadRoter from './uploadRouter';


const app = express();
const port = 3000

app.use(express.json());

app.use('/admin', adminRouter);
app.use('/upload', uploadRoter);

ViteExpress.listen(app, port, () =>
    console.log(`服务器已在 http://localhost:${port} 启动`),
);



