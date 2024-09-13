<script lang='ts' setup>
import { useTooltip } from '@/stores/useTooltip';
import { onMounted, ref, watch } from "vue";

import { useMouse } from '@vueuse/core'
import { useMap } from '@/stores/useMap';
import Markdown from '@/components/Model/Markdown.vue';

const tooltip = useTooltip()
const map = useMap()
const card = ref<HTMLDivElement>()
const { x, y } = useMouse()


const top = ref(0)

const left = ref(0)

function close() {
    tooltip.show = false
}

function test() {
    console.log(tooltip.params);
}

watch(() => tooltip.params.event.offsetY, () => {
    initLocation()
})

function initLocation() {
    // top.value = `${tooltip.params.event.offsetY + 80}px`
    // left.value = `${tooltip.params.event.offsetX}px`
    let xAxis = tooltip.params.value[0]
    let yAxis = tooltip.params.value[1]

    let pixel: number[] = map.myChart?.convertToPixel({ seriesIndex: 0 }, [xAxis, yAxis]) || []

    console.log(pixel);
    left.value = pixel[0]
    top.value = pixel[1] + 80

}

//#region 拖拽

let offsetX = 0;
let offsetY = 0;
let dragging = false

function mousedown(e: any) {
    offsetX = x.value
    offsetY = y.value
    dragging = true
}

// function mousemove(e: any) {

// }

function mouseup(e: any) {
    offsetX = 0
    offsetY = 0
    dragging = false
}

watch([x, y], () => {
    if (dragging) {
        let dx = x.value - offsetX
        let dy = y.value - offsetY

        left.value += dx
        top.value += dy

        offsetX = x.value
        offsetY = y.value
    }
})

//#endregion


function position() {
    console.log(tooltip.params);
    map.myChart?.setOption({
        geo: {
            center: [tooltip.params.value[0], tooltip.params.value[1]],
            zoom: 10
        }
    })
    // tooltip.show = false
}

onMounted(() => {
    initLocation()
})
</script>
<template>
    <!-- :style="{ top: `${top}px`, left: `${left}px` }"  -->
    <el-dialog v-model="tooltip.show" width="300" draggable :modal="false" :lock-scroll="false" class="tooltip">
        <template #header>
            <div class="tooltip-header">
                <!-- <div class="tooltip-header" @mousedown="startDrag"> -->
                <h3>{{ tooltip.params.data.name }}
                    <el-button link @click="position"><v-icon size="20">mdi-map-marker-outline</v-icon></el-button>
                </h3>
                <!-- <el-button link @click="close"> <v-icon size="15" icon="mdi-close" /> </el-button> -->
            </div>
        </template>
        <div>
        </div>
        <Markdown class="tooltip-describe" v-if="tooltip.params.data.value[2]" :md="tooltip.params.data.value[2]">
        </Markdown>
        <div v-if="tooltip.params.data.value[3]?.length > 0">
            <!-- <a v-for="item in tooltip.params.data.value[3]" class="tooltip-link" :href="item.url"
                target="_blank">{{ item.name }}</a> -->
            <v-chip variant="text" label color="#1890ff" v-for="item in tooltip.params.data.value[3]" :href="item.url"
                target="_blank">{{ item.name }}</v-chip>
        </div>
        <div v-if="tooltip.params.data.value[4]?.length > 0">
            <img class="tooltip-img" v-for="item in tooltip.params.data.value[4]" :src="item"
                :alt="tooltip.params.data.name">
        </div>
        <!-- <div class="debug">
            <v-btn @click="test" variant="text">测试</v-btn>
            top: {{ top }}
            left: {{ left }}
        </div> -->
        <template #footer>
            <div class="footer">
                <div class="left">
                    <el-button link>
                        <el-badge color="error" value="536">
                            <v-icon>mdi-comment-outline</v-icon>
                        </el-badge>
                    </el-button>
                    <el-button link>
                        <el-badge color="error" value="3.6k">
                            <v-icon>mdi-thumb-up-outline</v-icon>
                        </el-badge>
                    </el-button>
                    <el-button link><v-icon>mdi-link-variant</v-icon></el-button>
                </div>
                <div class="right">
                    <v-btn variant="text">编辑</v-btn>
                    <v-btn variant="text">标记</v-btn>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script lang='ts'>

export default {
    name: 'Tooltip',
}
</script>
<style lang='less' scoped>
.virtual-point {
    position: absolute;
    z-index: 100;
    width: 10px;
    height: 10px;
    background-color: #1890ff;
}

.tooltip {
    // position: absolute;
    // z-index: 999;
    // max-width: 300px;
    // 自动换行
    // white-space: normal !important;
    // padding: 0 !important;
    // border-color: #d6d6d6 !important;

    .tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        // 移动手势
        cursor: move;
    }

    .tooltip-link {
        color: #1890ff;
        cursor: pointer;
        // 移除下划线
        text-decoration: none;
        margin-right: 10px;
    }

    .tooltip-img {
        max-width: 100%;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            flex: 1 1 auto;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>