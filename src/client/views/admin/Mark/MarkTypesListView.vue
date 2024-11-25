<script lang='ts' setup>
import type { IMap, IGame, IMarksType } from '@/ts/Interfaces';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const tableData = ref<IMarksType[]>([])
const shewDialog = ref(false)
const form = ref<IMarksType>({} as IMarksType)
const gameList = ref<IGame[]>([])

const mapList = ref<IMap[]>([])
const showCropped = ref(false)

const options = computed(() => {
    return gameList.value.map(item => {
        return {
            value: item.id,
            label: item.game_name,
            children:
                [
                    {
                        value: 0,
                        label: "所有地图"
                    },
                    ...mapList.value.filter(map => map.game_id == item.id).map(map => {
                        return {
                            value: map.id,
                            label: map.map_name
                        }
                    })
                ]
        }
    })
})

const markTypeParentList = computed(() => {
    return tableData.value.map(item => item.mark_type_parent).filter((item, index, self) => self.indexOf(item) === index)
})


const props = {
    expandTrigger: 'hover' as const,
}


async function gettableData() {
    let { data } = await axios.post('/admin/getMarkTypesList')
    console.log(data);
    tableData.value = data.data
}

function getGameList() {
    axios.post('/admin/getGameList').then(({ data }) => {
        gameList.value = data.data
    })
}

function getMapList() {
    axios.post('/admin/getMapList').then(({ data }) => {
        mapList.value = data.data
    })
}

function save() {
    if (!form.value.mark_type_name || form.value.mark_type_name == '') {
        ElMessage.warning("游戏名为空")
        return
    }
    axios.post('/admin/saveMarkTypes', form.value).then(({ data }) => {
        if (data.code == 0) {
            shewDialog.value = false
            gettableData()
            clear()
        }
    })
}

function edit(row: IMarksType) {
    form.value = JSON.parse(JSON.stringify(row))
    shewDialog.value = true
}

function change(row: IMarksType) {
    form.value = JSON.parse(JSON.stringify(row))
    save()
    ElMessage.success('修改完成')
}


function del(id: number) {
    axios.post('/admin/delMarkTypes', { id }).then(({ data }) => {
        if (data.code == 0) {
            gettableData()
            ElMessage.success(data.msg)
        } else {
            ElMessage.error(data.msg)
        }
    })
}


function clear() {
    form.value = {} as IMarksType
}

async function SaveIcon(base64: string) {
    // 将 base64 转换为文件
    const file = await fetch(base64).then(res => res.blob()).then(blob => new File([blob], 'Cropped.png', { type: 'image/png' }))
    let fd = new FormData()
    fd.append('image', file)
    axios.post("/upload/images", fd).then(({ data }) => {
        if (data.code == 0) {
            form.value.mark_type_icon = data.data
            ElMessage.success("上传成功")
        } else {
            ElMessage.error(data.msg)
        }
    })

}

gettableData()
getGameList()
getMapList()

</script>
<template>
    <el-card>
        <template #header>
            <el-button @click=" shewDialog = true">添加类型 <el-icon> <el-icon-plus></el-icon-plus> </el-icon>
            </el-button>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="id" width="80" />
            <el-table-column prop="game_id" label="所属地图" width="250">
                <template #default="{ row }">
                    <el-cascader v-model="row.map_id" :options="options" :props="props" filterable
                        @change="change(row)"></el-cascader>
                </template>
            </el-table-column>
            <el-table-column prop="mark_type_parent" label="父类" width="100" />
            <el-table-column prop="map_path" label="图标" width="100">
                <template #default="{ row }">
                    <el-image :src="row.mark_type_icon" style="width: 50px"
                        :preview-src-list="[row.mark_type_icon]"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="mark_type_name" label="名称" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="edit(row)">编辑
                        <el-icon><el-icon-edit /></el-icon>
                    </el-button>
                    <el-popconfirm :title="`是否要删除${row.game_name}?`" @confirm="del(row.id)">
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
        <el-dialog v-model="shewDialog" title="添加地图" width="500" draggable :close-on-click-modal="false" @close="clear">
            <el-form :label-width="100" @submit.prevent @keyup.enter="save">
                <el-form-item label="所属地图">
                    <el-cascader v-model="form.map_id" :options="options" :props="props" filterable></el-cascader>
                </el-form-item>
                <el-form-item label="父类">
                    <!-- <el-input v-model="form.mark_type_parent"></el-input> -->
                    <el-select v-model="form.mark_type_parent" allow-create filterable>
                        <el-option v-for="item in markTypeParentList" :key="item" :value="item"
                            :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.mark_type_name"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <!-- <el-input v-model="form.mark_type_icon"></el-input> -->
                    <el-row>
                        <el-col>
                            <div class="icon-uploader" @click="showCropped = true">
                                <img class="avatar" v-if="form.mark_type_icon" :src="form.mark_type_icon" />
                                <el-icon v-else>
                                    <el-icon-plus />
                                </el-icon>
                            </div>
                            <Cropped :img="form.mark_type_icon || ''" v-model="showCropped" :max-width="500"
                                :max-height="500" @submit="SaveIcon" :aspectRatio="1 / 1" title="上传图标">
                            </Cropped>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="图标缩放">
                    <el-input v-model="form.mark_type_scale" type="number"></el-input>
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
    name: 'MarkTypesListView',
}
</script>
<style lang='less' scoped></style>
