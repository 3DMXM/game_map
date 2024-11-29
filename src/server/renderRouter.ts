import express from 'express';

import { SQLite } from './SQLite'


const router = express.Router();


router.post("/getMapByPath", async (req, res) => {
    const { path } = req.body;
    const map = await SQLite.get('SELECT * FROM maps WHERE map_path = ?', [path])
    map.map_view_offset = JSON.parse(map.map_view_offset)
    res.json({ code: 0, data: map });
})

router.post("/getTileById", async (req, res) => {
    const { id } = req.body;
    const tile = await SQLite.get('SELECT * FROM tiles WHERE id = ?', [id])
    res.json({ code: 0, data: tile });
})


router.post("/getMarksByMapId", async (req, res) => {
    // 先从 mark_types 表中获取 map_id = ? 的所有 mark_type
    const { game_id, map_id } = req.body;
    // map_id =  JSON.stringify([game_id, map_id])
    let markTypes = await SQLite.all('SELECT * FROM mark_types WHERE map_id = ? or map_id = ?', [JSON.stringify([game_id, map_id]), JSON.stringify([game_id, 0])])
    markTypes = markTypes.map(item => {
        item.map_id = JSON.parse(item.map_id)
        return item
    })
    // 遍历 markTypes，获取每个 mark_type 的所有 mark
    let marks = []
    for (let markType of markTypes) {
        let mark = await SQLite.all('SELECT * FROM marks WHERE mark_type = ?', [markType.id])
        mark = mark.map(item => {
            item.mark_links = JSON.parse(item.mark_links)
            item.mark_images = JSON.parse(item.mark_images)
            return item
        })
        marks.push({ ...markType, marks: mark })
    }
    res.json({ code: 0, data: marks });

})



export default router;
