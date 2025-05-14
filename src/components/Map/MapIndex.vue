<script lang='ts' setup>
import { useDisplay } from "vuetify"

import mapboxgl from '@glossmod/mapbox-gl'
import MarkerLayer from '@/components/Map/MarkerLayer.vue'

const main = useMain()
const gamemapStores = useGamemap()

const LayerRef = ref()
const contextMenuRef = ref()
const mapContainer = ref()

const pointData = ref({} as IGameMapPoint)

let gmap = ref<GameMap>()

const display = useDisplay()

const mobile = computed(() => display.mobile.value)


async function initMap() {
    const data = await gamemapStores.getMarksData()
    gamemapStores.loading = false

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: '376px',
        className: 'map-popup',
    });

    gmap.value = new GameMap({
        container: mapContainer.value,
        tiles: 'https://tiles.aoe.top/uploads/out/{z}/{x}/{y}.webp',
        tileSize: 256,
        minzoom: 0,
        maxzoom: 7,
        center: [0, 0],
        zoom: 3,
        popup: popup,
        pointData: pointData.value,
        LayerRef: LayerRef.value,
        contextMenu: contextMenuRef.value,
        isEdit: true,
        mobile: mobile.value,
    })

    window.$gmap = gmap.value;

    gamemapStores.pointsIds = await gmap.value.initGameMap(data, gamemapStores.showName)

}


watch(() => main.drawer, () => {
    setTimeout(() => {
        gmap.value?.mbgl.resize();
        // console.log('地图大小已重新调整');
    }, 200);
})

watch(mobile, () => {
    if (window.$gmap) {
        window.$gmap.options.mobile = mobile.value
    }
})

onMounted(() => {
    initMap()
})


</script>
<template>
    <div class="map-popup-ref" ref="LayerRef">
        <MarkerLayer :point="pointData"></MarkerLayer>
    </div>
    <div class="map-popup-ref" ref="contextMenuRef">
        <contextMenu></contextMenu>
    </div>
    <div ref="mapContainer" class="map-container"></div>
    <EditPoint></EditPoint>

    <!-- 移动端 -->
    <v-navigation-drawer v-if="$vuetify.display.mobile" v-model="main.movileDrawer" location="bottom" :mobile="true"
        :class="{ 'mobile-drawer': main.movileDrawer }">
        <MarkerLayer :point="pointData"></MarkerLayer>
    </v-navigation-drawer>
</template>
<script lang='ts'>

export default {
    name: 'MapIndex',
}
</script>
<style lang='less' scoped>
.map-container {
    flex: 1;
    height: 100vh;
}

.mobile-drawer {
    height: auto !important;
}
</style>
