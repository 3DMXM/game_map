<script lang='ts' setup>

import { useMapCreated } from '@mapbox-vue3/core'

const init = () => {
    const map = getMapInstance()
    const mapbox = getMapboxInstance()
    mapbox.setRenderWorldCopies(false);
    mapbox._antialias = true
    mapbox._preserveDrawingBuffer = true
    mapbox.dragRotate.disable()
}

const { getMapInstance, getMapboxInstance } = useMapCreated(init)

</script>
<template>

</template>
<script lang='ts'>

export default {
    name: 'instance1',
}
</script>
<style lang='less' scoped></style>
