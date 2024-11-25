import express from "express";
import ViteExpress from "vite-express";
import multer from 'multer';

import adminRouter from './adminRoter';



const app = express();
const port = 3000

const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.use('/admin', adminRouter);

ViteExpress.listen(app, port, () =>
    console.log(`服务器已在 http://localhost:${port} 启动`),
);



