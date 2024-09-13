<script lang='ts' setup>
import { use, registerMap, init, util } from 'echarts/core';
import { TooltipComponent, GeoComponent, GridComponent, LegendComponent, TitleComponent, GraphicComponent } from 'echarts/components';
import { ScatterChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import VChart, { THEME_KEY } from 'vue-echarts';
import { provide, ref, onMounted } from 'vue';
import axios from 'axios'
import { useMap } from '@/stores/useMap';
import { useTooltip } from '@/stores/useTooltip';
import Tooltip from '@/components/Map/Tooltip.vue';

use([
    TooltipComponent,
    GeoComponent,
    GridComponent,
    ScatterChart,
    CanvasRenderer,
    UniversalTransition,
    TitleComponent,
    LegendComponent,
    GraphicComponent
]);

provide(THEME_KEY, 'dark');

const map = useMap()
const tooltip = useTooltip()
const mapname = 'wukong'
let myChart = ref()
// const option = ref<EChartsOption>();

async function generateMap() {
    // 读取地图
    let { data: mapdata } = await axios.get('/map/wukong/heifengshan.svg')
    registerMap(mapname, { svg: mapdata });

    await map.getSeries('/map/wukong/data/series.json')
    map.setOption(mapname)
}

generateMap()



onMounted(() => {
    // console.log(chart.value.chart);
    map.myChart = myChart.value.chart
    map.myChart?.getZr().on('dblclick', (params: any) => {
        // chart.value.chart.on('dblclick', (params: any) => {
        // console.log(params);
        const pointInPixel = [params.offsetX, params.offsetY];
        const pointInGrid = map.myChart?.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
        // console.log('Pixel:', pointInPixel, 'Grid:', pointInGrid);
        console.log(`当前坐标位置: ${pointInGrid}`);
    })

    map.myChart?.on("click", (params: any) => {
        // console.log(params);
        if (params.seriesType === 'scatter') {
            // console.log(params);
            tooltip.show = true
            tooltip.params = params
        }

    })
})


</script>
<template>
    <v-chart class="chart" :option="map.option" ref="myChart" autoresize />
    <Tooltip v-if="tooltip.show"></Tooltip>
</template>
<script lang='ts'>

export default {
    name: 'GameMap',
}
</script>
<style lang='less' scoped>
.chart {
    height: calc(100vh - 130px)
}
</style>