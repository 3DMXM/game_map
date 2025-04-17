<script lang='ts' setup>
const gamemapStores = useGamemap()

</script>
<template>
    <!-- <el-skeleton :loading="gamemapStores.loading">
        <template #template>
            <MapLoading></MapLoading>
        </template>
</el-skeleton> -->
    <MapIndex></MapIndex>
</template>
<script lang='ts'>

export default {
    name: 'Index',
}
</script>
<style lang='less' scoped></style>
