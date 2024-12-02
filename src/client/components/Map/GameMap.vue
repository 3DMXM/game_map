<script lang='ts' setup>
import "ol/ol.css"
import { ref, onMounted, watch } from 'vue'
import { useMap } from '@/stores/useMap'
import Cookies from 'js-cookie'


const gameMapRef = ref<HTMLDivElement>()
const overlayRef = ref<HTMLDivElement>()

const usemap = useMap()
const route = useRoute()
const user = Cookies.get('user')

watch(() => route.params.path, () => {
    reader()
})

// 右键菜单相关
// const isContextMenuVisible = ref(false)
const contextMenuPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

// 渲染地图
async function reader() {
    await usemap.init(route.params.path as string, gameMapRef.value, overlayRef.value)

    if (user) {
        // 右键菜单事件监听器
        usemap.olMap?.getViewport().addEventListener('contextmenu', function (evt) {
            evt.preventDefault()
            if (usemap.olMap) {
                const pixel = usemap.olMap.getEventPixel(evt)
                const coordinate = usemap.olMap.getCoordinateFromPixel(pixel)
                contextMenuPosition.value = { x: evt.clientX, y: evt.clientY }
                usemap.contextMenu.isContextMenuVisible = true
                usemap.contextMenu.map_x = coordinate[0]
                usemap.contextMenu.map_y = coordinate[1]
            }
        })

        // 点击其他地方隐藏右键菜单
        usemap.olMap?.addEventListener('click', () => {
            usemap.contextMenu.isContextMenuVisible = false
            // if (usemap.markerLayerData.mark_name) {
            //     usemap.markerLayerData = {} as any
            // }
        })
        // 禁用默认右键菜单
        document.addEventListener('contextmenu', (evt) => {
            evt.preventDefault()
        })
    }
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
        <ContextMenu v-if="usemap.contextMenu.isContextMenuVisible"
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