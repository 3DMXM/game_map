<script lang='ts' setup>
// import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MarkerLayer from '@/components/Map/MarkerLayer.vue';

const main = useMain()

const mapContainer = ref();
const LayerRef = ref();
const pointData = ref({
    title: "",
    description: "",
} as IGameMapPoint)

let gmap: GameMap



async function initMap() {
    const { data } = await axios.get('/data/points.json')

    gmap = new GameMap({
        container: mapContainer.value,
        tiles: '/uploads/tiles/91f38eb84ede4ad9809b3fe5906106ce/{z}/tile_{x}_{y}.webp',
        tileSize: 512,
        minzoom: 0,
        maxzoom: 5,
        center: [0, 0],
        zoom: 2
    })

    gmap.mapboxgl.loadImage('/images/Point.png', (error, image) => {
        if (error) throw error;
        if (image) {

            // 将图片添加到地图
            gmap.mapboxgl.addImage('custom-icon', image);

            gmap.addPoints(data)
        }
    })

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        maxWidth: '376px',
        className: 'map-popup',
    });

    gmap.mapboxgl.on('click', ['points', 'circles'], async (e) => {
        if (e.features) {
            const properties = e.features[0].properties;

            // 添加安全解析函数
            const safeJsonParse = (jsonStr: string | undefined | null, defaultValue: any = []) => {
                if (!jsonStr) return defaultValue;
                try {
                    return JSON.parse(jsonStr);
                } catch (e) {
                    console.warn('JSON解析错误:', e);
                    return defaultValue;
                }
            };

            // 优化属性赋值
            pointData.value = {
                ...properties,
                images: safeJsonParse(properties?.images),
                links: safeJsonParse(properties?.links),
                coordinates: safeJsonParse(properties?.coordinates, [0, 0])
            } as IGameMapPoint;

            console.log(pointData.value);

            popup
                .setLngLat(pointData.value.coordinates)
                .setDOMContent(LayerRef.value)
                .addTo(gmap.mapboxgl);

        }

    });

    gmap.mapboxgl.on('mouseenter', ['points', 'circles'], () => {
        gmap.mapboxgl.getCanvas().style.cursor = 'pointer';
    });

    gmap.mapboxgl.on('mouseleave', ['points', 'circles'], () => {
        gmap.mapboxgl.getCanvas().style.cursor = '';
    });

}


watch(() => main.drawer, () => {
    setTimeout(() => {
        gmap.mapboxgl.resize();
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
        <MarkerLayer :point="pointData" :gmap="gmap"></MarkerLayer>
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
