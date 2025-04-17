<script lang='ts' setup>
// import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '@glossmod/mapbox-gl';
import MarkerLayer from '@/components/Map/MarkerLayer.vue';

const main = useMain()

const gamemapStores = useGamemap()

const mapContainer = ref();
const LayerRef = ref();
const pointData = ref({} as IGameMapPoint)

let gmap = ref<GameMap>()

async function initMap() {
    const data = await gamemapStores.getMarksData()
    gamemapStores.loading = false

    gmap.value = new GameMap({
        container: mapContainer.value,
        tiles: '/uploads/tiles/91f38eb84ede4ad9809b3fe5906106ce/{z}/tile_{x}_{y}.webp',
        tileSize: 512,
        minzoom: 0,
        maxzoom: 5,
        center: [0, 0],
        zoom: 2
    })

    window.$gmap = gmap.value;

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: '376px',
        className: 'map-popup',
    });
    gamemapStores.pointsIds = await gmap.value.initGameMap(data, popup, LayerRef.value, pointData.value, gamemapStores.showName)
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
    <div ref="mapContainer" class="map-container"></div>
    <div class="layer" ref="LayerRef">
        <MarkerLayer :point="pointData"></MarkerLayer>
    </div>
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
