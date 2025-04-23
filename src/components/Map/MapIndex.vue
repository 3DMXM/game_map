<script lang='ts' setup>

import mapboxgl from '@glossmod/mapbox-gl'
import MarkerLayer from '@/components/Map/MarkerLayer.vue'

const main = useMain()
const gamemapStores = useGamemap()

const LayerRef = ref()
const contextMenuRef = ref()
const mapContainer = ref()

const pointData = ref({} as IGameMapPoint)

let gmap = ref<GameMap>()

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
        tiles: '/uploads/out/{z}/{x}/{y}.webp',
        tileSize: 256,
        minzoom: 0,
        maxzoom: 7,
        center: [0, 0],
        zoom: 3,
        popup: popup,
        LayerRef: LayerRef.value,
        contextMenu: contextMenuRef.value,
        isEdit: true
    })

    window.$gmap = gmap.value;

    gamemapStores.pointsIds = await gmap.value.initGameMap(data, pointData.value, gamemapStores.showName)

}


watch(() => main.drawer, () => {
    setTimeout(() => {
        gmap.value?.mbgl.resize();
        // console.log('地图大小已重新调整');
    }, 200);
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
</style>
