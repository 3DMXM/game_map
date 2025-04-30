<script lang='ts' setup>
import mapboxgl from '@glossmod/mapbox-gl'

const gamemapStores = useGamemap()

const marksData = {
    mark_name: '新建标记点',
    mark_des: '',
    mark_links: [],
    mark_images: []
}

function addPoint(type: "points" | "buffer") {
    if (window.$gmap) {
        const id = Date.now()
        const position: mapboxgl.LngLat = window.$gmap.contextmenuEvent?.lngLat || new mapboxgl.LngLat(0, 0)
        gamemapStores.marks[0].marks_point.push({
            ...marksData,
            id: id,
            mark_position: [position.lng, position.lat],
            mark_type: type,
            mark_radius: 300,
        })
        gamemapStores.pointsIds = window.$gmap.addPoints(gamemapStores.fillterMarks, gamemapStores.showName, gamemapStores.pointsIds, true)
        window.$gmap.contextMenuPopup.remove()
    }
}

</script>
<template>
    <div class="context-menu">
        <div class="menu-list" @click="addPoint('points')">新建标记点</div>
        <div class="menu-list" @click="addPoint('buffer')">新建范围</div>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'contextMenu',
}
</script>
<style lang='less' scoped>
.context-menu {
    background-color: rgb(var(--v-theme-surface));

    .menu-list {
        padding: 5px 10px;
        cursor: pointer;

        &:hover {
            background-color: rgb(var(--v-theme-primary));
            color: rgb(var(--v-theme-on-primary));
        }
    }
}
</style>
