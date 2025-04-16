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
    // const { data } = await axios.get('/data/points.json')

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

    const data = await gamemapStores.getMarksData()

    // let ids = gmap.addPoints(data)


    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: '376px',
        className: 'map-popup',
    });

    gamemapStores.pointsIds = await gmap.value.initGameMap(data, popup, LayerRef.value, pointData.value)

    // gmap.mbgl.on('click', ids, async (e) => {
    //     if (e.features) {
    //         const properties = e.features[0].properties;

    //         // 添加安全解析函数
    //         const safeJsonParse = (jsonStr: string | undefined | null, defaultValue: any = []) => {
    //             if (!jsonStr) return defaultValue;
    //             try {
    //                 return JSON.parse(jsonStr);
    //             } catch (e) {
    //                 console.warn('JSON解析错误:', e);
    //                 return defaultValue;
    //             }
    //         };

    //         // 优化属性赋值
    //         pointData.value = {
    //             ...properties,
    //             mark_images: safeJsonParse(properties?.mark_images),
    //             mark_links: safeJsonParse(properties?.mark_links),
    //             mark_position: safeJsonParse(properties?.mark_position, [0, 0])
    //         } as IGameMapPoint;

    //         console.log(pointData.value);

    //         popup
    //             .setLngLat(pointData.value.mark_position)
    //             .setDOMContent(LayerRef.value)
    //             .addTo(gmap.mbgl);

    //     }

    // });

    // gmap.mbgl.on('mouseenter', ids, () => {
    //     gmap.mbgl.getCanvas().style.cursor = 'pointer';
    // });

    // gmap.mbgl.on('mouseleave', ids, () => {
    //     gmap.mbgl.getCanvas().style.cursor = '';
    // });

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
