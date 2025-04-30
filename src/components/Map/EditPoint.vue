<script lang='ts' setup>

const gamemapStores = useGamemap()

const props = {
    expandTrigger: 'hover' as const,
    emitPath: false
}

const parentList = computed(() => {
    let list = [] as [] as { name: string, list: IGameMark[] }[]
    gamemapStores.marks.forEach(item => {
        const type = list.find(type => type.name == item.mark_type_parent)
        if (type) {
            type.list.push(item)
            // 确保总数正确计算
        } else {
            list.push({ name: item.mark_type_parent, list: [item] })
        }
    })
    return list.map(item => {
        return {
            label: item.name,
            children: [
                ...item.list.map(i => ({
                    label: i.mark_type_name,
                    value: i as any,
                }))
            ]

        }
    })
})

const parent = ref<any>()

watch(parentList, () => {
    parent.value = parentList.value[0].children[0].value
})


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
        if (!gamemapStores.editPointData.mark_links) {
            gamemapStores.editPointData.mark_links = []
        }
        gamemapStores.editPointData.mark_links.push({ label: label.value, url: url.value })
    }).catch((e) => {
        console.log(e);

    })
}

function editLink(item: { label: string, url: string }) {
    let label = ref(item.label)
    let url = ref(item.url)
    ElMessageBox({
        title: '编辑链接',
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
        item.label = label.value
        item.url = url.value
    }).catch((e) => {
        console.log(e);

    })
}

function uploadImages() {
    // 等待后端接口

}

function save() {
    // 等待后端接口
}



</script>
<template>
    <el-dialog v-model="gamemapStores.showAddMarker" append-to-body draggable width="400" title="编辑点位"
        :close-on-click-modal="false" :modal="false">
        <el-form v-model="gamemapStores.editPointData" label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="gamemapStores.editPointData.mark_name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="父类">
                <el-cascader v-model="parent" :options="parentList" :props="props" :show-all-levels="false" filterable>
                </el-cascader>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="gamemapStores.editPointData.mark_type">
                    <el-option label="点" value="points"></el-option>
                    <el-option label="范围" value="buffer"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="坐标">
                <el-form label-width="40">
                    <el-form-item label="x">
                        <el-input v-model="gamemapStores.editPointData.mark_position[0]"></el-input>
                    </el-form-item>
                    <el-form-item label="y">
                        <el-input v-model="gamemapStores.editPointData.mark_position[1]"></el-input>
                    </el-form-item>
                    <el-form-item v-if="gamemapStores.editPointData.mark_type == 'buffer'" label="半径">
                        <el-input v-model="gamemapStores.editPointData.mark_radius"></el-input>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="样式">
                <el-form label-width="80" v-if="gamemapStores.editPointData.mark_type == 'points'">
                    <el-form-item label="字体颜色">
                        <el-color-picker v-model="gamemapStores.editPointData.textColor" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item label="字体大小">
                        <el-input type='number' v-model="gamemapStores.editPointData.textSize"></el-input>
                    </el-form-item>
                    <el-form-item label="字体描边">
                        <el-color-picker v-model="gamemapStores.editPointData.textHaloColor"
                            show-alpha></el-color-picker>
                    </el-form-item>
                </el-form>

                <el-form label-width="80" v-if="gamemapStores.editPointData.mark_type == 'buffer'">
                    <el-form-item label="显示颜色">
                        <el-color-picker v-model="gamemapStores.editPointData.fillColor"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="透明度">
                        <el-input type='number' v-model="gamemapStores.editPointData.fillOpacity"></el-input>
                    </el-form-item>
                    <el-form-item label="描边颜色">
                        <el-color-picker v-model="gamemapStores.editPointData.fillOutlineColor"
                            show-alpha></el-color-picker>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="gamemapStores.editPointData.mark_des" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="相关链接">
                <div class="links" v-for="(item, index) in gamemapStores.editPointData.mark_links" :key="item.url">
                    <el-popover width="150px" placement="top">
                        <template #reference>
                            <el-link :underline="false" type="primary" :href="item.url" target="_blank">
                                {{ item.label }}
                                <el-icon><el-icon-link></el-icon-link></el-icon>
                            </el-link>
                        </template>
                        <template #default>
                            <div class="link-actions">
                                <el-button link @click="editLink(item)">编辑
                                    <el-icon><el-icon-edit></el-icon-edit></el-icon> </el-button>
                                <el-popconfirm :title="`是否删除链接『${item.label}』?`"
                                    @confirm="gamemapStores.editPointData.mark_links?.splice(index, 1)">
                                    <template #reference>
                                        <el-button link type="danger">删除
                                            <el-icon><el-icon-delete></el-icon-delete></el-icon> </el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-popover>
                </div>
                <el-button link @click="addLink">
                    <el-icon><el-icon-plus></el-icon-plus></el-icon>
                </el-button>
            </el-form-item>
            <el-form-item label="相关图片">
                <div class="images" v-for="(item, index) in gamemapStores.editPointData.mark_images" :key="item">
                    <el-popover trigger="contextmenu" placement="right">
                        <template #reference>
                            <el-image :preview-src-list="gamemapStores.editPointData.mark_images || []"
                                :initial-index="index" :src="item" :style="{ width: '100px' }">
                            </el-image>
                        </template>
                        <template #default>
                            <el-button class="images-btn" type="danger" link
                                @click="gamemapStores.editPointData.mark_images?.splice(index, 1)">
                                删除 <el-icon><el-icon-delete></el-icon-delete></el-icon>
                            </el-button>
                        </template>
                    </el-popover>
                </div>
                <div class="upload-images" @click="uploadImages">
                    <el-icon><el-icon-plus></el-icon-plus></el-icon>
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="gamemapStores.showAddMarker = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </template>
    </el-dialog>
</template>
<script lang='ts'>

export default {
    name: 'EditPoint',
}
</script>
<style lang='less' scoped>
.links {
    margin-right: 15px;
}

.link-actions {
    display: flex;
    justify-content: center;
    align-items: center;
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
