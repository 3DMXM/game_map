<script lang='ts' setup>
import "ol/ol.css"
import { ref, onMounted, watch } from 'vue'
import { Map, View, Overlay } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { defaults as defaultControls } from 'ol/control'
import { Projection } from 'ol/proj'
import { Point } from 'ol/geom'
import { useMap } from "@/stores/useMap"


const gameMapRef = ref<HTMLDivElement>()
const overlayRef = ref<HTMLDivElement>()

const usemap = useMap()

// const map = ref<Map>()

const imgW = 16384
const imgH = 16384
const riginalOffset = [0, -15]

// Popup相关
const popup = ref<Overlay>()

// 右键菜单相关
const isContextMenuVisible = ref(false)
const contextMenuPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })


// 后端获取标记点
usemap.getSeries('/map/wukong/data/series.json')

// 定义本地坐标系
const localProjection = new Projection({
    code: 'LOCAL',
    units: 'pixels',
    extent: [0, 0, imgW, imgH],
})

// 渲染地图
function reader() {
    usemap.olMap = new Map({
        target: gameMapRef.value,
        view: new View({
            projection: localProjection,
            center: [imgW / 2, imgH / 2],
            zoom: 1,
            minZoom: 0,
            maxZoom: 6,
            extent: [0, 0, imgW, imgH], // 设置视图范围
        }),
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: '/map/testMap/out/{z}/tile_{x}_{y}.webp',
                    projection: localProjection,
                }),
            }),
        ],
        controls: defaultControls({
            zoom: false, // 禁用缩放控件
        }),
    })

    // 创建Overlay
    popup.value = new Overlay({
        element: overlayRef.value,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: riginalOffset,
    })
    usemap.olMap.addOverlay(popup.value)

    // 在 reader() 函数中添加点击事件监听器
    usemap.olMap.on('click', function (evt) {

        // 打印当前点击的坐标
        console.log(`点击坐标: ${evt.coordinate}`)

        if (usemap.olMap) {
            usemap.olMap.forEachFeatureAtPixel(evt.pixel, function (feature) {
                if (feature.getGeometry()?.getType() === 'Point') {
                    const item = feature.get('item')
                    const geometry = feature.getGeometry()
                    if (geometry?.getType() === 'Point') {
                        const position = (geometry as Point).getCoordinates()
                        // 设置Popup内容和位置
                        usemap.markerLayerData = item
                        // popup.value!.setPosition(position)
                        adjustPopupPosition(position)
                    }
                }
            })
        }
    })

    // 右键菜单事件监听器
    usemap.olMap.getViewport().addEventListener('contextmenu', function (evt) {
        evt.preventDefault()
        if (usemap.olMap) {
            const pixel = usemap.olMap.getEventPixel(evt)
            const coordinate = usemap.olMap.getCoordinateFromPixel(pixel)
            contextMenuPosition.value = { x: evt.clientX, y: evt.clientY }
            isContextMenuVisible.value = true
        }

    })

    // 点击其他地方隐藏右键菜单
    document.addEventListener('click', () => {
        isContextMenuVisible.value = false
    })
    // 禁用默认右键菜单
    document.addEventListener('contextmenu', (evt) => {
        evt.preventDefault()
    })
}

// 调整弹出窗口位置
function adjustPopupPosition(coordinates: number[]) {
    if (!popup.value || !usemap.olMap) return

    popup.value.setOffset(riginalOffset)
    // 设置初始位置
    popup.value.setPosition(coordinates)
    console.log("初始位置", coordinates);


    // 等待下一帧以确保元素已渲染
    requestAnimationFrame(() => {
        const popupElement = overlayRef.value
        if (!popupElement) return

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
            if (popup.value) {
                const currentOffset = popup.value.getOffset()
                console.log(`偏移: x:${offsetX}, y:${offsetY}`);
                popup.value.setOffset([currentOffset[0] + offsetX, currentOffset[1] + offsetY])
            }
        }
    })
}


// 添加标记点
function addMaker() {
    usemap.olMap?.removeLayer(usemap.olMap.getLayers().getArray()[1])
    let markerLayer = usemap.CreatingMarker(usemap.series)
    usemap.olMap?.addLayer(markerLayer)
}

watch(() => usemap.series, () => {
    addMaker()
}, { deep: true, immediate: true })

// 处理菜单项点击
function onMenuClick(option: string) {
    console.log(`选择了菜单项: ${option}`)
    // 根据选项执行相应操作
    isContextMenuVisible.value = false
}

onMounted(() => {
    reader()
})
</script>
<template>
    <div class="game-map" ref="gameMapRef">
        <div ref="overlayRef" class="ol-popup">
            <MarkerLayer></MarkerLayer>
        </div>
        <ContextMenu v-if="isContextMenuVisible"
            :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"></ContextMenu>
    </div>
</template>
<style lang='less' scoped>
.game-map {
    height: 100vh;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}

.ol-popup {
    position: absolute;
    bottom: 0;
    transform: translateX(-50%);
    max-width: 500px;
}
</style>