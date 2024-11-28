<script lang='ts' setup>
import type { IMap, IGame, IMarksType, IMarks } from '@/ts/Interfaces';
import axios from 'axios';
import { ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox } from 'element-plus';
import { useMap } from '@/stores/useMap';

type formType = IMarks

const shewDialog = ref(false)
const form = ref<formType>({} as formType)

const gameList = ref<IGame[]>([])
const mapList = ref<IMap[]>([])
const markTypesList = ref<IMarksType[]>([])

const usemap = useMap()

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

function show(data?: IMarks) {
    shewDialog.value = true
    form.value.mark_position_x = usemap.contextMenu.map_x
    form.value.mark_position_y = usemap.contextMenu.map_y
    if (data) {
        form.value = data
    }
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

    axios.post('/admin/saveMarks', form.value).then(({ data }) => {
        if (data.code == 0) {
            shewDialog.value = false
            usemap.addMaker()
            clear()
        }
    })
}


function clear() {
    form.value = {} as formType
    usemap.contextMenu.isContextMenuVisible = false
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

getGameList()
getMapList()
getMarkTypesList()

</script>
<template>
    <slot name="operate" @show="show"> </slot>
    <el-dialog v-model="shewDialog" title="添加标记点" width="500" draggable :close-on-click-modal="false" append-to-body
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
</template>
<script lang='ts'>

export default {
    name: 'AddMarker',
}
</script>
<style lang='less' scoped></style>
