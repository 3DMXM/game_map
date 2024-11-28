<script lang='ts' setup>
import type { IGame, ITile } from '@/ts/Interfaces';
import axios from 'axios';
import { ElMessage } from 'element-plus';

type formType = ITile

const tableData = ref<formType[]>([])
const shewDialog = ref(false)
const form = ref<formType>({} as formType)

const gameList = ref<IGame[]>([])

const loding = ref(false)

async function gettableData() {
    let { data } = await axios.post('/admin/getTileList')
    console.log(data);
    tableData.value = data.data
}

function getGameList() {
    axios.post('/admin/getGameList').then(({ data }) => {
        gameList.value = data.data
    })
}

function save() {
    if (!form.value.tile_name || form.value.tile_name == '') {
        ElMessage.warning("游戏名为空")
        return
    }
    axios.post('/admin/saveTile', form.value).then(({ data }) => {
        if (data.code == 0) {
            shewDialog.value = false
            gettableData()
            clear()
        }
    })
}

function edit(row: formType) {
    form.value = JSON.parse(JSON.stringify(row))
    shewDialog.value = true
}

function del(id: number) {
    axios.post('/admin/delTile', { id }).then(({ data }) => {
        if (data.code == 0) {
            gettableData()
            ElMessage.success(data.msg)
        } else {
            ElMessage.error(data.msg)
        }
    })
}

function uploadTile() {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = '.zip,.rar,.7z'; // 只接受压缩包文件
    input.multiple = false; // 允许多选

    input.addEventListener('change', (event) => {
        let files = (event.target as HTMLInputElement).files as FileList;
        for (let i = 0; i < files.length; i++) {
            let item = files[i];

            const fd = new FormData();
            fd.append('file', item);

            loding.value = true
            axios.post("/upload/tiles", fd).then(({ data }) => {
                if (data.code == 0) {
                    form.value.tile_path = data.data.tile_path
                    form.value.tile_min_zoom = data.data.tile_min_zoom
                    form.value.tile_max_zoom = data.data.tile_max_zoom
                    ElMessage.success("上传成功")
                } else {
                    ElMessage.error(data.msg)
                }
                loding.value = false
            })
        }
    })

    input.click()
}

function change(row: formType) {
    form.value = JSON.parse(JSON.stringify(row))
    save()
    ElMessage.success('修改完成')
}

function clear() {
    form.value = {} as formType
}

gettableData()
getGameList()


</script>
<template>
    <el-card>
        <template #header>
            <el-button @click=" shewDialog = true">添加瓦片集 <el-icon> <el-icon-plus></el-icon-plus> </el-icon> </el-button>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="id" width="100" />
            <el-table-column prop="game_id" label="游戏" width="180">
                <template #default="{ row }">
                    <el-select v-model="row.game_id" filterable @change="change(row)">
                        <el-option v-for="item in gameList" :key="item.id" :value="item.id"
                            :label="item.game_name"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="tile_name" label="名称" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="edit(row)">编辑
                        <el-icon><el-icon-edit /></el-icon>
                    </el-button>
                    <el-popconfirm :title="`是否要删除『${row.tile_name}』?`" @confirm="del(row.id)">
                        <template #reference>
                            <el-button link type="danger">删除
                                <el-icon><el-icon-delete /></el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="shewDialog" title="添加游戏" width="400" draggable :close-on-click-modal="false" @close="clear">
            <el-form :label-width="100" @submit.prevent @keyup.enter="save">
                <el-form-item label="上传瓦片集">
                    <el-button @click="uploadTile" :loading="loding">上传</el-button>
                </el-form-item>
                <el-form-item label="所属游戏">
                    <el-select v-model="form.game_id" filterable>
                        <el-option v-for="item in gameList" :key="item.id" :value="item.id"
                            :label="item.game_name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="瓦片集名称">
                    <el-input v-model="form.tile_name"></el-input>
                </el-form-item>
                <el-form-item label="瓦片集路径">
                    <el-input v-model="form.tile_path"></el-input>
                </el-form-item>
                <el-form-item label="图片宽度">
                    <el-input v-model="form.tile_width" type="number" placeholder="原图宽度, e.g: 16k为 16384"></el-input>
                </el-form-item>
                <el-form-item label="图片高度">
                    <el-input v-model="form.tile_height" type="number" placeholder="原图高度, e.g: 16k为 16384"></el-input>
                </el-form-item>
                <el-form-item label="最小缩放">
                    <el-input v-model="form.tile_min_zoom" type="number" placeholder="最小Z轴, e.g: 0"></el-input>
                </el-form-item>
                <el-form-item label="最大缩放">
                    <el-input v-model="form.tile_max_zoom" type="number" placeholder="最大Z轴, e.g: 6"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="save">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-card>
</template>
<script lang='ts'>

export default {
    name: 'TileListView',
}
</script>
<style lang='less' scoped></style>
