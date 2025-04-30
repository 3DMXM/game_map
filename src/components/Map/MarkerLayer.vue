<script lang='ts' setup>
// import type { LngLatLike } from '@glossmod/mapbox-gl';


const props = defineProps<{
    point: IGameMapPoint
}>()

const gamemapStores = useGamemap()


function onclose() {
    // 获取所有弹出窗口并移除
    const popups = document.getElementsByClassName('mapboxgl-popup');
    if (popups.length) {
        Array.from(popups).forEach(popup => {
            popup.remove();
        });
    }
}

function position() {
    const { point } = props

    let mark_position = point.mark_position

    // console.log(mark_position);

    window.$gmap?.mbgl.flyTo({
        center: mark_position,
        zoom: 4,
    })
}

function copy() {
    const { point } = props
    // 构建包含点位ID的URL
    const url = new URL(window.location.href)

    // 确保移除旧的点位参数，避免重复
    url.searchParams.delete('pointId')

    // 添加点位ID参数
    url.searchParams.set('pointId', `${point.id}`)

    // 复制链接到剪贴板
    navigator.clipboard.writeText(url.toString())
        .then(() => {
            // 提示用户复制成功
            ElMessage({
                message: '链接已复制到剪贴板',
                type: 'success',
                duration: 2000
            })
        })
        .catch(err => {
            console.error('无法复制链接:', err)
            ElMessage({
                message: '复制失败',
                type: 'error',
                duration: 2000
            })
        })
}

function edit() {
    gamemapStores.showAddMarker = true

    gamemapStores.editPointData = JSON.parse(JSON.stringify(props.point))
}

</script>
<template>
    <v-card class="card" width="376px">
        <v-card-title>
            <div class="tooltip-header">
                <h3>{{ point.mark_name }}
                    <el-button link @click="position"><v-icon size="16">mdi-map-marker-outline</v-icon></el-button>
                    <el-button link @click="copy"> <el-icon size="16"><el-icon-copy-document /></el-icon> </el-button>
                </h3>
                <el-button link @click="onclose">
                    <v-icon>mdi-close</v-icon>
                </el-button>
            </div>
        </v-card-title>
        <v-card-text>
            <div v-if="point.mark_images && point.mark_images.length > 0">
                <el-carousel height="150px" indicator-position="none">
                    <el-carousel-item v-for="(image, index) in point.mark_images" :key="index">
                        <el-image class="tooltip-img" :src="image" lazy :preview-src-list="point.mark_images"
                            :initial-index="index" preview-teleported :alt="point.mark_name" />
                    </el-carousel-item>
                </el-carousel>
            </div>
            <Markdown class="description" :md="point.mark_des || ''"></Markdown>
            <div v-if="point.mark_links && point.mark_links.length > 0">
                <v-chip variant="text" label color="#1890ff" v-for="link in point.mark_links" :href="link.url"
                    target="_blank" append-icon="mdi-link-variant">{{ link.label }}</v-chip>
            </div>
        </v-card-text>
        <v-card-actions class="footer">
            <div>
                贡献者: aaa, bbb, ccc
            </div>
            <div>
                <el-button @click="edit">编辑</el-button>
            </div>
        </v-card-actions>
    </v-card>


</template>
<script lang='ts'>

export default {
    name: 'MarkerLayer',
}
</script>
<style lang='less' scoped>
.card {
    text-align: left;

    .tooltip-header {
        flex: 1 1 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tooltip-img {
        max-width: 100%;
    }

    .footer {
        flex: 1 1 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

}
</style>
