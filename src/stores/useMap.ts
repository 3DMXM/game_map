import { defineStore } from 'pinia'
import axios from 'axios'
import type { ISeries, ISeriesData } from '@/ts/Interfaces'

import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Icon, Style } from 'ol/style'
import type { Map } from 'ol'

export const useMap = defineStore("Map", {
    state: () => ({
        series: [] as ISeries[],
        markerLayerData: {} as ISeriesData,
        olMap: null as Map | null
    }),
    actions: {
        async getSeries(url: string) {
            let { data: series } = await axios.get(url)
            this.series = series
            return this.series
        },
        CreatingMarker(series: ISeries[]) {
            // 创建 VectorSource 和 VectorLayer
            const markerSource = new VectorSource()
            const markerLayer = new VectorLayer({
                source: markerSource,
            })

            series.forEach(serie => {
                serie.data.forEach(item => {
                    // 创建标记点 Feature，并添加 item 属性
                    const marker = new Feature({
                        geometry: new Point([item.value[0], item.value[1]]), // 设置标记位置
                        item: item, // 添加 item 属性
                    })
                    // 设置标记样式
                    marker.setStyle(new Style({
                        image: new Icon({
                            src: serie.symbol, // 替换为标记图标的路径
                            anchor: [0.5, 0.5],
                            scale: 0.3, // 调整缩放比例以适应大小
                        }),
                    }))
                    markerSource.addFeature(marker)
                })
            })

            return markerLayer
        }
    }
})