<script lang='ts' setup>
import type { LngLatLike } from 'mapbox-gl';


const props = defineProps<{
    point: IGameMapPoint
    gmap: GameMap
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
    const { gmap, point } = props

    let coordinates = point.coordinates


    console.log(coordinates);
    gmap.mapboxgl.flyTo({
        center: coordinates,
        zoom: 4,
    })
}

</script>
<template>
    <v-card class="card" width="376px">
        <v-card-title>
            <div class="tooltip-header">
                <h3>{{ point.title }}
                    <el-button link @click="position"><v-icon size="20">mdi-map-marker-outline</v-icon></el-button>
                </h3>
                <el-button link @click="onclose">
                    <v-icon>mdi-close</v-icon>
                </el-button>
            </div>
        </v-card-title>
        <v-card-text>

            <div v-if="point.images && point.images.length > 0">
                <el-carousel height="150px" indicator-position="none">
                    <el-carousel-item v-for="(image, index) in point.images" :key="index">
                        <el-image class="tooltip-img" :src="image" lazy :preview-src-list="point.images"
                            :initial-index="index" preview-teleported :alt="point.title" />
                    </el-carousel-item>
                </el-carousel>
            </div>
            <Markdown class="description" :md="point.description"></Markdown>
            <div v-if="point.links && point.links.length > 0">
                <v-chip variant="text" label color="#1890ff" v-for="link in point.links" :href="link.url"
                    target="_blank" append-icon="mdi-link-variant">{{ link.title }}</v-chip>
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
