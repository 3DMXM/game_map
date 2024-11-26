import express from 'express';
import multer from 'multer';
import fs from 'fs'
import { extname } from 'path'
import sharp from 'sharp'

const router = express.Router();

// 配置 multer 存储选项
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = 'public/uploads/images/';
        // 判断路径是否存在，不存在则递归创建
        let pathArr = path.split('/');
        let dir = '';
        pathArr.forEach((item) => {
            dir += item + '/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        });

        cb(null, path); // 文件上传路径
    },
    filename: (req, file, cb) => {
        const randomString = Math.random().toString(36).substring(2, 8);
        cb(null, `${Date.now()}_${randomString}${extname(file.originalname)}`); // 文件名
    }
});
const upload = multer({ storage: storage });


router.post("/images", upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.json({ code: 404, msg: '请上传文件' })
    }
    res.json({ code: 0, data: `/uploads/images/${req.file.filename}` })
});

export default router;