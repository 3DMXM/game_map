<script lang='ts' setup>
const gamemapStores = useGamemap()

</script>
<template>
    <!-- <el-skeleton :loading="gamemapStores.loading">
        <template #template>
            <MapLoading></MapLoading>
        </template>
</el-skeleton> -->
    <v-layout>
        <BassDrawer></BassDrawer>
        <v-main>
            <v-container style="padding: 0;" fluid>
                <MapIndex></MapIndex>
            </v-container>
        </v-main>
    </v-layout>
</template>
<script lang='ts'>

export default {
    name: 'Index',
}
</script>
<style lang='less' scoped></style>
