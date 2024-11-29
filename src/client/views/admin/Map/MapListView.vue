<script lang='ts' setup>
import type { IMap, IGame, ITile } from '@/ts/Interfaces';
import axios from 'axios';
import { ElMessage } from 'element-plus';

type formType = IMap

const tableData = ref<formType[]>([])
const shewDialog = ref(false)
const form = ref<formType>({
    map_view_offset: [0, 0, 0, 0]
} as formType)

const gameList = ref<IGame[]>([])
const tileList = ref<ITile[]>([])

async function gettableData() {
    let { data } = await axios.post('/admin/getMapList')
    console.log(data);
    tableData.value = data.data
}

function getGameList() {
    axios.post('/admin/getGameList').then(({ data }) => {
        gameList.value = data.data
    })
}

function getTileList() {
    axios.post('/admin/getTileList').then(({ data }) => {
        tileList.value = data.data
    })
}

function save() {
    if (!form.value.map_name || form.value.map_name == '') {
        ElMessage.warning("游戏名为空")
        return
    }
    axios.post('/admin/saveMap', form.value).then(({ data }) => {
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

function change(row: formType) {
    form.value = JSON.parse(JSON.stringify(row))
    save()
    ElMessage.success('修改完成')
}

function del(id: number) {
    axios.post('/admin/delMap', { id }).then(({ data }) => {
        if (data.code == 0) {
            gettableData()
            ElMessage.success(data.msg)
        } else {
            ElMessage.error(data.msg)
        }
    })
}

function clear() {
    form.value = {
        map_view_offset: [0, 0, 0, 0]
    } as formType
}

gettableData()
getGameList()
getTileList()

</script>
<template>
    <el-card>
        <template #header>
            <el-button @click=" shewDialog = true">添加地图 <el-icon> <el-icon-plus></el-icon-plus> </el-icon> </el-button>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="id" width="80" />
            <el-table-column prop="game_id" label="游戏" width="180">
                <template #default="{ row }">
                    <el-select v-model="row.game_id" filterable @change="change(row)">
                        <el-option v-for="item in gameList" :key="item.id" :value="item.id"
                            :label="item.game_name"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="map_name" label="名称" />
            <el-table-column prop="map_path" label="路径" width="100">
                <template #default="{ row }">
                    <el-link :underline="false" type="primary" :href="`/games/${row.map_path}`" target="_blank">
                        {{ row.map_path }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="edit(row)">编辑
                        <el-icon><el-icon-edit /></el-icon>
                    </el-button>
                    <el-popconfirm :title="`是否要删除『${row.map_name}』?`" @confirm="del(row.id)">
                        <template #reference>
                            <el-button link type="danger">删除
                                <el-icon><el-icon-delete /></el-icon>
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑弹窗 -->
        <el-dialog v-model="shewDialog" title="添加地图" width="600" draggable :close-on-click-modal="false" @close="clear">
            <el-form :label-width="150" @submit.prevent @keyup.enter="save">
                <el-form-item label="地图名称">
                    <el-input v-model="form.map_name"></el-input>
                </el-form-item>
                <el-form-item label="所属游戏">
                    <el-select v-model="form.game_id" filterable>
                        <el-option v-for="item in gameList" :key="item.id" :value="item.id"
                            :label="item.game_name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="瓦片集">
                    <el-select v-model="form.tile_id" filterable>
                        <el-option v-for="item in tileList" :key="item.id" :value="item.id"
                            :label="item.tile_name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视野偏移">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-input v-model.number="form.map_view_offset[0]" placeholder="左" type="number"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model.number="form.map_view_offset[1]" placeholder="下" type="number"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model.number="form.map_view_offset[2]" placeholder="右" type="number"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model.number="form.map_view_offset[3]" placeholder="上" type="number"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="SEO路径">
                    <el-input v-model="form.map_path" placeholder="自定义SEO路径"></el-input>
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
    name: 'MapListView',
}
</script>
<style lang='less' scoped></style>
