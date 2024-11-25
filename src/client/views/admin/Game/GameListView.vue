<script lang='ts' setup>
import type { IGame } from '@/ts/Interfaces';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const tableData = ref<IGame[]>([])
const shewDialog = ref(false)
const form = ref<IGame>({} as IGame)

async function gettableData() {
    let { data } = await axios.post('/admin/getGameList')
    console.log(data);
    tableData.value = data.data
}

function save() {
    if (!form.value.game_name || form.value.game_name == '') {
        ElMessage.warning("游戏名为空")
        return
    }
    axios.post('/admin/saveGame', form.value).then(({ data }) => {
        if (data.code == 0) {
            shewDialog.value = false
            gettableData()
            clear()
        }
    })
}

function edit(row: IGame) {
    form.value = JSON.parse(JSON.stringify(row))
    shewDialog.value = true
}

function del(id: number) {
    axios.post('/admin/delGame', { id }).then(({ data }) => {
        if (data.code == 0) {
            gettableData()
            ElMessage.success(data.msg)
        } else {
            ElMessage.error(data.msg)
        }
    })
}

function clear() {
    form.value = {} as IGame
}

gettableData()

</script>
<template>
    <el-card>
        <template #header>
            <el-button @click=" shewDialog = true">添加游戏 <el-icon> <el-icon-plus></el-icon-plus> </el-icon> </el-button>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="id" width="100" />
            <el-table-column prop="game_name" label="名称" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="edit(row)">编辑
                        <el-icon><el-icon-edit /></el-icon>
                    </el-button>
                    <el-popconfirm :title="`是否要删除『${row.game_name}』?`" @confirm="del(row.id)">
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
                <el-form-item label="游戏名称">
                    <el-input v-model="form.game_name"></el-input>
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
    name: 'AdminGameList',
}
</script>
<style lang='less' scoped></style>
