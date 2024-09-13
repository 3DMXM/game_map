import axios from 'axios'
import { defineStore } from 'pinia'
import { util, type ComposeOption, type EChartsType } from 'echarts/core';
import type { TooltipComponentOption, GeoComponentOption, GridComponentOption } from "echarts/components";
import type { ScatterSeriesOption } from 'echarts/charts';
import { h, render } from 'vue'
import Tooltip from '@/components/Map/Tooltip.vue'

type EChartsOption = ComposeOption<
    | TooltipComponentOption
    | GeoComponentOption
    | GridComponentOption
    | ScatterSeriesOption
>;

export const useMap = defineStore('map', {
    state: () => ({
        option: {} as EChartsOption,
        series: [] as any[],
        hidePoints: [] as string[],
        myChart: null as EChartsType | null
    }),
    getters: {
        legendData(state) {
            return state.series.map((item: any) => item.name)
        }
    },
    actions: {
        async getSeries(url: string) {
            let { data: series } = await axios.get(url)
            this.series = series
        },

        setOption(mapname: string) {
            this.option = {
                tooltip: {
                    show: false,
                    triggerOn: "click",
                    trigger: 'item',
                    // alwaysShowContent: true,
                    enterable: true,
                    renderMode: "html",
                    appendTo: ".v-layout",
                    className: "map-tooltip",
                    formatter: (params: any) => {
                        console.log(params);
                        let vnode = h(Tooltip, { params })
                        const container = document.createElement('div');
                        render(vnode, container);
                        return container
                    }
                },
                legend: {
                    show: false,
                    data: this.legendData
                },
                geo: {
                    map: mapname,
                    roam: true,
                    zoom: 1.3,
                    label: {
                        show: true,
                        color: '#fff',
                        position: 'top'
                    },
                    itemStyle: {
                        areaColor: '#323c48',
                        borderColor: '#111'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: '#fff'
                        },
                        itemStyle: {
                            areaColor: '#2a333d'
                        }
                    },
                },
                series: this.series,

            }
        },
    },

})
