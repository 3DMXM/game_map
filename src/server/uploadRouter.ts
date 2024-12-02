import express from 'express';
import multer from 'multer';
import fs from 'fs'
import { extname } from 'path'
import { Unzip } from './Unzip'
import sharp from 'sharp';

const router = express.Router();

let basePath = 'public/uploads'
// 如果是生产环境，修改 basePath 为 dist/uploads/
console.log("env:", process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
    basePath = 'dist/uploads'
}


// 递归创建缺少的目录
async function createDirectories(path: string) {
    // 判断路径是否存在，不存在则递归创建
    let pathArr = path.split('/');
    let dir = '';
    pathArr.forEach((item) => {
        dir += item + '/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
}

// 递归获取文件夹下面的所有文件
function getFiles(path: string) {
    let files = fs.readdirSync(path);
    let fileList: string[] = [];
    files.forEach((item) => {
        let stat = fs.statSync(path + item);
        if (stat.isDirectory()) {
            fileList = fileList.concat(getFiles(path + item + '/'));
        } else {
            fileList.push(path + item);
        }
    })
    return fileList;
}

// 配置 multer 存储选项
const upload = multer({ dest: 'files' });


router.post("/images", upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.json({ code: 404, msg: '请上传文件' })
    }

    let path = `${basePath}/images/`
    // 路径后面添加 年/月/日
    let date = new Date();
    path += `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`

    await createDirectories(path)

    const ext = extname(req.file.originalname); // 后缀名
    const randomString = Math.random().toString(36).substring(2, 15);
    const webpFilename = `${randomString}.webp`;
    const isGif = req.file.mimetype === 'image/gif';

    const filename = isGif ? `${randomString}.${ext}` : `${randomString}.webp`;

    if (isGif) {
        fs.renameSync(req.file.path, `${path}${filename}`);
    } else {
        // 将文件转换为 WebP 格式并保存
        await sharp(req.file.path)
            .webp()
            .toFile(`${path}${webpFilename}`);

        // // 删除原始文件
        fs.unlinkSync(req.file.path);
    }


    path = path.replace('public', '')
    path = path.replace('dist', '')
    res.json({ code: 0, data: `${path}${filename}` })
});

router.post("/tiles", upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.json({ code: 404, msg: '请上传文件' })
    }

    // 解压文件
    const zipPath = `files/${req.file.filename}`
    const destPath = `${basePath}/tiles/${req.file.filename.split('.')[0]}`
    await Unzip.unzip(zipPath, destPath)

    let path = `${basePath}/tiles/${req.file.filename.split('.')[0]}/`
    // 递归获取 path 文件夹下的所有文件的列表
    let files = getFiles(path)
    // console.log(files);
    // 获取最小z 和 最大z
    let tile_min_zoom = Infinity;
    let tile_max_zoom = -Infinity;
    files.forEach((item) => {
        let arr = item.split('/');
        let z = parseInt(arr[arr.length - 2]);
        tile_min_zoom = Math.min(tile_min_zoom, z);
        tile_max_zoom = Math.max(tile_max_zoom, z);
    })

    // 删除 zipPath 文件
    fs.unlinkSync(zipPath);

    let data = { tile_path: `/uploads/tiles/${req.file.filename}/{z}/tile_{x}_{y}.webp`, tile_min_zoom, tile_max_zoom }
    console.log(data);

    res.json({
        code: 0, data
    })


})

export default router;