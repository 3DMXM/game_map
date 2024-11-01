<script lang='ts' setup>
import { useMap } from '@/stores/useMap';


import Markdown from '@/components/Model/Markdown.vue'

const usemap = useMap()


function position() {

    let location = [usemap.markerLayerData.value[0], usemap.markerLayerData.value[1]]
    console.log(location);

    // 定位到 marker
    usemap.olMap?.getView().animate({
        center: location,
        zoom: 5,
        duration: 1000,
    })
}

function onclose() {
    usemap.markerLayerData = {} as any
}

</script>
<template>
    <div ref="markerRef" class="layer" v-if="usemap.markerLayerData.name">
        <v-card class="card" width="300px">
            <v-card-title>
                <div class="tooltip-header">
                    <h3>{{ usemap.markerLayerData.name }}
                        <el-button link @click="position"><v-icon size="20">mdi-map-marker-outline</v-icon></el-button>
                    </h3>
                    <el-button link @click="onclose">
                        <v-icon>mdi-close</v-icon>
                    </el-button>
                </div>

            </v-card-title>
            <v-card-text>
                <Markdown class="tooltip-describe" v-if="usemap.markerLayerData.value[2]"
                    :md="usemap.markerLayerData.value[2]">
                </Markdown>
                <div v-if="usemap.markerLayerData.value[3] && usemap.markerLayerData.value[3].length > 0">
                    <v-chip variant="text" label color="#1890ff" v-for="item in usemap.markerLayerData.value[3]"
                        :href="item.url" target="_blank">{{ item.name }}</v-chip>
                </div>
                <div v-if="usemap.markerLayerData.value[4] && usemap.markerLayerData.value[4].length > 0">
                    <v-img class="tooltip-img" v-for="image in usemap.markerLayerData.value[4] " :src="image"
                        :alt="usemap.markerLayerData.name" />
                </div>
            </v-card-text>
            <v-card-actions>
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
            </v-card-actions>
        </v-card>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'MarkerLayer',
}
</script>
<style lang='less' scoped>
.layer {
    &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid rgb(var(--v-theme-surface));
        bottom: -9px;
        left: 50%;
        margin-left: -10px;
    }


    .card {
        text-align: left;

        .tooltip-header {
            flex: 1 1 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .tooltip-img {
            max-width: 100%;
        }

        .footer {
            flex: 1 1 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

    }
}
</style>