<script lang='ts' setup>
import { useMap } from '@/stores/useMap';


import Markdown from '@/components/Model/Markdown.vue'

const usemap = useMap()

function position() {

    let location = [usemap.markerLayerData.mark_position_x, usemap.markerLayerData.mark_position_y]
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
    <div ref="markerRef" class="layer" v-if="usemap.markerLayerData.mark_name">
        <v-card class="card" width="300px">
            <v-card-title>
                <div class="tooltip-header">
                    <h3>{{ usemap.markerLayerData.mark_name }}
                        <el-button link @click="position"><v-icon size="20">mdi-map-marker-outline</v-icon></el-button>
                    </h3>
                    <el-button link @click="onclose">
                        <v-icon>mdi-close</v-icon>
                    </el-button>
                </div>

            </v-card-title>
            <v-card-text>
                <Markdown class="tooltip-describe" v-if="usemap.markerLayerData.mark_des"
                    :md="usemap.markerLayerData.mark_des">
                </Markdown>
                <div v-if="usemap.markerLayerData.mark_links && usemap.markerLayerData.mark_links.length > 0">
                    <v-chip variant="text" label color="#1890ff" v-for="link in usemap.markerLayerData.mark_links"
                        :href="link.url" target="_blank">{{ link.label }}</v-chip>
                </div>
                <div v-if="usemap.markerLayerData.mark_images && usemap.markerLayerData.mark_images.length > 0">
                    <el-carousel height="150px" indicator-position="none">
                        <el-carousel-item v-for="(image, index) in usemap.markerLayerData.mark_images" :key="index">
                            <el-image class="tooltip-img" :src="image"
                                :preview-src-list="usemap.markerLayerData.mark_images" :initial-index="index"
                                preview-teleported :alt="usemap.markerLayerData.mark_name" />
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </v-card-text>
            <v-card-actions>
                <div class="footer">
                    <div class="left">
                        <!-- <el-button link>
                            <el-badge color="error" value="536">
                                <v-icon>mdi-comment-outline</v-icon>
                            </el-badge>
                        </el-button>
                        <el-button link>
                            <el-badge color="error" value="3.6k">
                                <v-icon>mdi-thumb-up-outline</v-icon>
                            </el-badge>
                        </el-button>
                        <el-button link><v-icon>mdi-link-variant</v-icon></el-button> -->
                    </div>
                    <div class="right">
                        <AddMarker>
                            <template #operate="{ onShow }">
                                <v-btn variant="text" @click="onShow(usemap.markerLayerData)"
                                    append-icon="mdi-square-edit-outline">编辑</v-btn>
                            </template>
                        </AddMarker>
                        <!-- <v-btn variant="text">标记</v-btn> -->
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