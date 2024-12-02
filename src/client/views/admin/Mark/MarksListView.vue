<script lang='ts' setup>
import type { IMap, IGame, IMarksType, IMarks } from '@/ts/Interfaces';
import axios from 'axios';
import { ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox } from 'element-plus';

type formType = IMarks

const tableData = ref<formType[]>([])
const shewDialog = ref(false)
const form = ref<formType>({} as formType)


const gameList = ref<IGame[]>([])
const mapList = ref<IMap[]>([])
const markTypesList = ref<IMarksType[]>([])

const options = computed(() => {
    return gameList.value.map(item => {
        return {
            value: item.id,
            label: item.game_name,
            children:
                [
                    {
                        value: 0,
                        label: "所有地图",
                        disabled: markTypesList.value.filter(mark => mark.map_id[0] == item.id && mark.map_id[1] == 0).length == 0,
                        children: markTypesList.value.filter(mark => mark.map_id[0] == item.id && mark.map_id[1] == 0).map(mark => {
                            return {
                                value: mark.id,
                                label: mark.mark_type_name
                            }
                        })
                    },
                    ...mapList.value.filter(map => map.game_id == item.id).map(map => {
                        return {
                            value: map.id,
                            label: map.map_name,
                            disabled: markTypesList.value.filter(mark => mark.map_id[0] == item.id && mark.map_id[1] == map.id).length == 0,
                            children: markTypesList.value.filter(mark => mark.map_id[0] == item.id && mark.map_id[1] == map.id).map(mark => {
                                return {
                                    value: mark.id,
                                    label: mark.mark_type_name
                                }
                            })
                        }
                    })
                ]
        }
    })
})


const props = {
    expandTrigger: 'hover' as const,
    emitPath: false
}


async function gettableData() {
    let { data } = await axios.post('/admin/getMarksList')
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

function getMarkTypesList() {
    axios.post('/admin/getMarkTypesList').then(({ data }) => {
        markTypesList.value = data.data
    })
}

function save() {
    if (!form.value.mark_name || form.value.mark_name == '') {
        ElMessage.warning("游戏名为空")
        return
    }
    axios.post('/admin/saveMarks', form.value).then(({ data }) => {
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
    axios.post('/admin/delMarks', { id }).then(({ data }) => {
        if (data.code == 0) {
            gettableData()
            ElMessage.success(data.msg)
        } else {
            ElMessage.error(data.msg)
        }
    })
}


function clear() {
    form.value = {} as formType
}


function addLink() {
    let label = ref('')
    let url = ref('')
    ElMessageBox({
        title: '添加链接',
        message: () => h(ElForm, { 'label-width': '100' }, {
            default: () => [
                h(ElFormItem, { label: '文字' }, {
                    default: () => h(ElInput, { modelValue: label.value, 'onUpdate:modelValue': val => label.value = val })
                }),
                h(ElFormItem, { label: '地址' }, {
                    default: () => h(ElInput, { modelValue: url.value, 'onUpdate:modelValue': val => url.value = val })
                })
            ]
        })
    }).then(() => {
        if (!form.value.mark_links) {
            form.value.mark_links = []
        }
        form.value.mark_links.push({ label: label.value, url: url.value })
    }).catch((e) => {
        console.log(e);

    })
}

function uploadImages() {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'; // 只接受图片文件
    input.multiple = true; // 允许多选

    input.addEventListener('change', (event) => {
        let files = (event.target as HTMLInputElement).files as FileList;
        for (let i = 0; i < files.length; i++) {
            let item = files[i];

            const fd = new FormData();
            fd.append('image', item);

            axios.post("/upload/images", fd).then(({ data }) => {
                if (data.code == 0) {
                    if (!form.value.mark_images) {
                        form.value.mark_images = []
                    }
                    form.value.mark_images.push(data.data)
                    ElMessage.success("上传成功")
                } else {
                    ElMessage.error(data.msg)
                }
            })
        }
    })

    input.click()
}

gettableData()
getGameList()
getMapList()
getMarkTypesList()

</script>
<template>
    <el-card>
        <template #header>
            <el-button @click=" shewDialog = true">添加标记点 <el-icon> <el-icon-plus></el-icon-plus> </el-icon>
            </el-button>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="id" width="80" />
            <el-table-column prop="mark_type" label="类型" width="250">
                <template #default="{ row }">
                    <el-cascader v-model="row.mark_type" :options="options" :props="props" filterable
                        :show-all-levels="false" @change="change(row)"></el-cascader>
                </template>
            </el-table-column>
            <el-table-column prop="mark_name" label="名称" width="100" />
            <el-table-column prop="mark_position_x" label="X位置" width="100" />
            <el-table-column prop="mark_position_y" label="Y位置" width="100" />

            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="edit(row)">编辑
                        <el-icon><el-icon-edit /></el-icon>
                    </el-button>
                    <el-popconfirm :title="`是否要删除『${row.mark_name}』?`" @confirm="del(row.id)">
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
        <el-dialog v-model="shewDialog" title="添加标记点" width="500" draggable :close-on-click-modal="false"
            @close="clear">
            <el-form :label-width="100" @submit.prevent>
                <el-form-item label="类型">
                    <el-cascader v-model="form.mark_type" :options="options" :props="props" filterable
                        :show-all-levels="false"></el-cascader>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.mark_name"></el-input>
                </el-form-item>
                <el-form-item label="X坐标">
                    <el-input v-model="form.mark_position_x" type="number"></el-input>
                </el-form-item>
                <el-form-item label="Y坐标">
                    <el-input v-model="form.mark_position_y" type="number"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.mark_des" type="textarea" :autosize="{ minRows: 2 }"></el-input>
                </el-form-item>
                <el-form-item label="链接">
                    <div class="links" v-for="(item, index) in form.mark_links" :key="item.url">
                        <el-link :underline="false" type="primary" :href="item.url" target="_blank">
                            {{ item.label }}
                            <el-icon><el-icon-link></el-icon-link></el-icon>
                        </el-link>
                        <el-popconfirm :title="`是否删除链接『${item.label}』?`" @confirm="form.mark_links.splice(index, 1)">
                            <template #reference>
                                <el-button link type="danger">
                                    <el-icon><el-icon-delete></el-icon-delete></el-icon>
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                    <el-button link @click="addLink">
                        <el-icon><el-icon-plus></el-icon-plus></el-icon>
                    </el-button>
                </el-form-item>
                <el-form-item label="图片">
                    <div class="images" v-for="(item, index) in form.mark_images" :key="item">
                        <el-image :preview-src-list="form.mark_images" :initial-index="index" :src="item"
                            :style="{ width: '100px' }">
                        </el-image>
                        <el-button class="images-btn" link type="danger" @click="form.mark_images.splice(index, 1)">
                            <el-icon><el-icon-delete></el-icon-delete></el-icon>
                        </el-button>
                    </div>
                    <div class="upload-images" @click="uploadImages">
                        <el-icon><el-icon-plus></el-icon-plus></el-icon>
                    </div>
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
    name: 'MarksListView',
}
</script>
<style lang='less' scoped>
.links {
    margin-right: 15px;
}

.upload-images {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        border-color: var(--el-color-primary);
    }
}

.images {
    position: relative;
    width: 120px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    .images-btn {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
