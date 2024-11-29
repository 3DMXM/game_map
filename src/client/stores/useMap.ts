import { defineStore } from 'pinia'
import axios from 'axios'
import type { IMap, ITile, IMarks, IGame, IMapMarksType } from '@/ts/Interfaces'

import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import { Icon, Style } from 'ol/style'
import { Map, View, Overlay } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { defaults as defaultControls } from 'ol/control'
import { Projection } from 'ol/proj'
import { Point } from 'ol/geom'


export const useMap = defineStore("Map", {
    state: () => ({
        markTypes: [] as IMapMarksType[],
        markerLayerData: {} as IMarks,
        olMap: null as Map | null,
        map: null as IMap & ITile | null,
        popup: null as Overlay | null,
        riginalOffset: [0, -15],
        contextMenu: {
            map_x: 0,
            map_y: 0,
            isContextMenuVisible: false,
            editMark: {} as IMarks,
        },
        datalist: {
            gameList: [] as IGame[],
            mapList: [] as IMap[],
        }
    }),
    actions: {
        // 初始化地图
        async init(mapPath: string, target?: string | HTMLElement, overlayRef?: HTMLElement) {
            let mapdata = await this.getMapData(mapPath)
            if (mapdata) {
                const localProjection = new Projection({
                    code: 'LOCAL',
                    units: 'pixels',
                    extent: [0, 0, mapdata.tile_width, mapdata.tile_height],
                })
                console.log(mapdata.map_view_offset);

                if (this.olMap) {
                    // 清空旧地图
                    this.olMap.setTarget(undefined)
                    this.olMap = null
                }

                this.olMap = new Map({
                    target: target,
                    view: new View({
                        projection: localProjection,
                        center: [mapdata.tile_width / 2, mapdata.tile_height / 2],
                        zoom: 1,
                        minZoom: mapdata.tile_min_zoom,
                        maxZoom: mapdata.tile_max_zoom,
                        extent: [
                            0 - mapdata.map_view_offset[0],
                            0 - mapdata.map_view_offset[1],
                            mapdata.tile_width + mapdata.map_view_offset[2],
                            mapdata.tile_height + mapdata.map_view_offset[3]
                        ], // 设置视图范围
                    }),
                    layers: [
                        new TileLayer({
                            source: new XYZ({
                                url: mapdata.tile_path,
                                projection: localProjection,
                            }),
                        }),
                    ],
                    controls: defaultControls({
                        zoom: false, // 禁用缩放控件
                    }),
                })
                // 创建Overlay
                this.popup = new Overlay({
                    element: overlayRef,
                    positioning: 'bottom-center',
                    stopEvent: false,
                    offset: this.riginalOffset,
                })
                this.olMap.addOverlay(this.popup as Overlay)
                this.addMaker()

                this.olMap.on('click', (evt) => {

                    // 打印当前点击的坐标
                    console.log(`点击坐标: ${evt.coordinate}`)

                    if (this.olMap) {
                        this.olMap.forEachFeatureAtPixel(evt.pixel, (feature) => {

                            if (feature.getGeometry()?.getType() === 'Point') {
                                const item = feature.get('item')

                                const geometry = feature.getGeometry()
                                if (geometry?.getType() === 'Point') {
                                    const position = (geometry as Point).getCoordinates()
                                    // 设置Popup内容和位置
                                    this.markerLayerData = item
                                    // popup.value!.setPosition(position)
                                    this.adjustPopupPosition(position, overlayRef)
                                }
                            }
                        })
                    }
                })
            }
        },
        // 获取地图数据
        async getMapData(mapPath: string) {
            const { data: map } = await axios.post("/render/getMapByPath", { path: mapPath })
            console.log(map);
            if (map.data.tile_id) {
                const { data: tile } = await axios.post("/render/getTileById", { id: map.data.tile_id })
                console.log(tile);
                this.map = { ...map.data, ...tile.data }
            }

            return this.map
        },
        // 创建 VectorSource 和 VectorLayer
        setMarker(marks: IMapMarksType[]) {
            if (!this.olMap) return
            this.olMap.removeLayer(this.olMap.getLayers().getArray()[1])   // 移除旧的标记图层
            const markerSource = new VectorSource()
            const markerLayer = new VectorLayer({
                source: markerSource,
            })
            marks.forEach(type => {
                // 创建标记点 Feature，并添加 item 属性
                type.marks.forEach(mark => {
                    const marker = new Feature({
                        geometry: new Point([mark.mark_position_x, mark.mark_position_y]), // 设置标记位置
                        item: mark, // 添加 item 属性
                    })
                    // 设置标记样式
                    marker.setStyle(new Style({
                        image: new Icon({
                            src: type.mark_type_icon, // 替换为标记图标的路径
                            anchor: [0.5, 0.5],
                            scale: type.mark_type_scale, // 调整缩放比例以适应大小 0.3
                        }),
                    }))
                    markerSource.addFeature(marker)
                })
            })
            this.olMap.addLayer(markerLayer)   // 添加新的标记图层
            return markerLayer
        },
        async addMaker() {
            let markTypes = await this.getMarks()
            if (markTypes) this.setMarker(markTypes)
        },
        async getMarks() {
            if (this.map) {
                let { data } = await axios.post("/render/getMarksByMapId", { map_id: this.map.id, game_id: this.map.game_id })
                if (data.code == 0) {
                    this.markTypes = data.data
                    return this.markTypes
                }
            }
        },
        adjustPopupPosition(coordinates: number[], overlayRef?: HTMLElement) {
            if (!this.popup || !this.olMap) return
            this.popup.setOffset(this.riginalOffset)
            // 设置初始位置
            this.popup.setPosition(coordinates)
            console.log("初始位置", coordinates);

            // 等待下一帧以确保元素已渲染
            requestAnimationFrame(() => {
                const popupElement = overlayRef
                if (!popupElement) return
                console.log(popupElement);

                const popupRect = popupElement.getBoundingClientRect()
                const viewportWidth = window.innerWidth
                const viewportHeight = window.innerHeight

                let offsetX = 0
                let offsetY = 0
                // 缓冲
                const buffer = 0

                // 检查右边界
                if (popupRect.right > viewportWidth) {
                    offsetX = viewportWidth - popupRect.right - buffer // 10px 缓冲
                }

                // 检查左边界
                if (popupRect.left < 0) {
                    offsetX = -popupRect.left + buffer
                }

                // 检查下边界
                if (popupRect.bottom > viewportHeight) {
                    offsetY = viewportHeight - popupRect.bottom - buffer
                }

                // 检查上边界
                if (popupRect.top < 0) {
                    offsetY = -popupRect.top + buffer
                }

                // 应用偏移
                if (offsetX !== 0 || offsetY !== 0) {
                    if (this.popup) {
                        const currentOffset = this.popup.getOffset()
                        console.log(`偏移: x:${offsetX}, y:${offsetY}`);
                        this.popup.setOffset([currentOffset[0] + offsetX, currentOffset[1] + offsetY])
                    }
                }
            })
        }
    }
})