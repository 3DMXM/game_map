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

export default router;