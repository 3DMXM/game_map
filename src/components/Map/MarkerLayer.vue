<script lang='ts' setup>
// import type { LngLatLike } from '@glossmod/mapbox-gl';


const props = defineProps<{
    point: IGameMapPoint
}>()


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

</script>
<template>
    <v-card class="card" width="376px">
        <v-card-title>
            <div class="tooltip-header">
                <h3>{{ point.mark_name }}
                    <el-button link @click="position"><v-icon size="20">mdi-map-marker-outline</v-icon></el-button>
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
