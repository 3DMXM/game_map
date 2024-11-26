import express from 'express';
import md5 from 'md5'

import { SQLite } from './SQLite'


const router = express.Router();

// 登录路由
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let user = await SQLite.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, md5(password)])
    console.log(user);

    if (user) {
        res.json({ code: 0, data: user })
    } else {
        res.json({ code: 401, msg: '用户名或密码错误' })
    }
});

//#region 游戏相关

router.post('/getGameList', async (req, res) => {
    let games = await SQLite.all('SELECT * FROM games')
    res.json({ code: 0, data: games })
})

router.post('/saveGame', async (req, res) => {
    const { id, game_name } = req.body;
    if (id) {
        await SQLite.run('UPDATE games SET game_name = ? WHERE id = ?', [game_name, id])
    } else {
        await SQLite.run('INSERT INTO games (game_name) VALUES (?)', [game_name])
    }
    res.json({ code: 0 })
})

router.post("/delGame", async (req, res) => {
    const { id } = req.body;
    const statement = await SQLite.run('DELETE FROM games WHERE id = ?', [id])
    if (statement.changes && statement.changes > 0) {
        res.json({ code: 0, msg: '删除成功' })
    } else {
        res.json({ code: 401, msg: '删除失败' })
    }
})

//#endregion

//#region 地图相关
router.post('/getMapList', async (req, res) => {
    let maps = await SQLite.all('SELECT * FROM maps')
    res.json({ code: 0, data: maps })
})

router.post('/saveMap', async (req, res) => {
    const { id, game_id, map_name, map_path, map_width, map_height, map_tile_path, map_min_zoom, map_max_zoom } = req.body;
    if (id) {
        await SQLite.run('UPDATE maps SET game_id = ?, map_name = ?, map_path = ?, map_width = ?, map_height = ?, map_tile_path = ?, map_min_zoom = ?, map_max_zoom = ? WHERE id = ?', [game_id, map_name, map_path, map_width, map_height, map_tile_path, map_min_zoom, map_max_zoom, id])
    } else {
        await SQLite.run('INSERT INTO maps (game_id, map_name, map_path, map_width, map_height, map_tile_path, map_min_zoom, map_max_zoom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [game_id, map_name, map_path, map_width, map_height, map_tile_path, map_min_zoom, map_max_zoom])
    }
    res.json({ code: 0 })
})

router.post("/delMap", async (req, res) => {
    const { id } = req.body;
    const statement = await SQLite.run('DELETE FROM maps WHERE id = ?', [id])
    if (statement.changes && statement.changes > 0) {
        res.json({ code: 0, msg: '删除成功' })
    } else {
        res.json({ code: 401, msg: '删除失败' })
    }
})

//#endregion

//#region 标记点相关

router.post("/getMarkTypesList", async (req, res) => {
    let markTypes = await SQLite.all('SELECT * FROM mark_types')

    markTypes = markTypes.map(item => {
        item.map_id = JSON.parse(item.map_id)
        return item
    })

    res.json({ code: 0, data: markTypes })
})

router.post("/getTypeParentList", async (req, res) => {
    // 从 mark_types 表中获取所有 mark_type_parent 并去重
    let markTypes = await SQLite.all('SELECT DISTINCT mark_type_parent FROM mark_types')

    res.json({ code: 0, data: markTypes })

})

router.post("/saveMarkTypes", async (req, res) => {
    let { id, map_id, mark_type_name, mark_type_parent, mark_type_icon, mark_type_scale } = req.body;
    map_id = JSON.stringify(map_id)
    if (id) {
        await SQLite.run('UPDATE mark_types SET map_id = ?, mark_type_name = ?, mark_type_parent = ?, mark_type_icon = ?, mark_type_scale = ? WHERE id = ?', [map_id, mark_type_name, mark_type_parent, mark_type_icon, mark_type_scale, id])
    } else {
        await SQLite.run('INSERT INTO mark_types (map_id, mark_type_name, mark_type_parent, mark_type_icon, mark_type_scale) VALUES (?, ?, ?, ?, ?)', [map_id, mark_type_name, mark_type_parent, mark_type_icon, mark_type_scale])
    }
    res.json({ code: 0 })
})

router.post("/delMarkTypes", async (req, res) => {
    const { id } = req.body;
    const statement = await SQLite.run('DELETE FROM mark_types WHERE id = ?', [id])
    if (statement.changes && statement.changes > 0) {
        res.json({ code: 0, msg: '删除成功' })
    } else {
        res.json({ code: 401, msg: '删除失败' })
    }
})

router.post("/getMarksList", async (req, res) => {
    let marks = await SQLite.all('SELECT * FROM marks')
    marks = marks.map(item => {
        item.mark_links = JSON.parse(item.mark_links)
        item.mark_images = JSON.parse(item.mark_images)
        return item
    })
    res.json({ code: 0, data: marks })
})

router.post("/saveMarks", async (req, res) => {
    let { id, mark_type, mark_name, mark_position_x, mark_position_y, mark_des, mark_links, mark_images } = req.body;
    mark_links = JSON.stringify(mark_links)
    mark_images = JSON.stringify(mark_images)
    if (id) {
        await SQLite.run('UPDATE marks SET mark_type = ?, mark_name = ?, mark_position_x = ?, mark_position_y = ?, mark_des = ?, mark_links = ?, mark_images = ? WHERE id = ?', [mark_type, mark_name, mark_position_x, mark_position_y, mark_des, mark_links, mark_images, id])
    } else {
        await SQLite.run('INSERT INTO marks (mark_type, mark_name, mark_position_x, mark_position_y, mark_des, mark_links, mark_images) VALUES (?, ?, ?, ?, ?, ?, ?)', [mark_type, mark_name, mark_position_x, mark_position_y, mark_des, mark_links, mark_images])
    }
    res.json({ code: 0 })
})

//#endregion


export default router;